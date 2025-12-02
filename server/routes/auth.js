const express = require('express');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const {
  authenticate,
  generateToken,
  generateRefreshToken,
  refreshToken,
  requireRole,
  rateLimitMiddleware
} = require('../middleware/auth');

const router = express.Router();

/**
 * Rate limiting spécifique pour l'authentification
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // 8 tentatives par IP
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Validation des entrées SIMPLIFIÉE (pour déboguer)
 */
const validateRegistration = (req, res, next) => {
  console.log('📝 Données d\'inscription reçues:', req.body);

  const { prenom, nom, email, password } = req.body;
  const errors = [];

  if (!prenom || prenom.trim().length < 2) {
    errors.push('Le prénom doit contenir au moins 2 caractères');
  }

  if (!nom || nom.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Email invalide');
  }

  // SIMPLIFIÉ pour le développement - supprimez la regex complexe
  if (!password || password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (errors.length > 0) {
    console.log('❌ Erreurs de validation:', errors);
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Erreurs de validation',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  console.log('🔑 Données de connexion reçues:', req.body);

  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email requis');
  if (!password) errors.push('Mot de passe requis');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Champs manquants',
      errors
    });
  }

  next();
};

/**
 * Routes d'authentification
 */

// Route de santé
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'authentication',
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Inscription (SIMPLIFIÉE pour le débogage)
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    console.log('🚀 Début de l\'inscription...');
    const { prenom, nom, email, password, role, departement, phone } = req.body;

    // Validation du rôle
    const allowedRoles = ['salarie', 'contremaitre', 'gerante', 'admin'];
    const userRole = role || 'salarie';

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ROLE',
        message: 'Rôle non autorisé',
        allowedRoles
      });
    }

    console.log('📝 Création de l\'utilisateur avec:', { prenom, nom, email, userRole });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('⚠️  Utilisateur existe déjà:', email);
      return res.status(409).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur (SIMPLIFIÉ - avec gestion d'erreur)
    let user;
    try {
      user = await User.create({
        prenom,
        nom,
        email,
        password,
        role: userRole,
        departement: departement || 'Production',
        phone
      });
      console.log('✅ Utilisateur créé avec succès:', user.id);
    } catch (dbError) {
      console.error('❌ Erreur création utilisateur:', dbError);
      return res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Erreur lors de la création de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    // Générer les tokens
    const accessToken = generateToken(user.id, { role: user.role, email: user.email });
    const refreshToken = generateRefreshToken(user.id);

    // Mettre à jour la dernière connexion
    try {
      await User.updateLastLogin(user.id);
    } catch (updateError) {
      console.warn('⚠️  Erreur mise à jour dernière connexion:', updateError);
      // On continue malgré cette erreur
    }

    // Réponse
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      user: User.format(user),
      token: accessToken,  // IMPORTANT: le frontend attend "token" (pas "tokens.accessToken")
      refreshToken: refreshToken
    });

  } catch (error) {
    console.error('❌ Erreur inscription globale:', error.message, error.stack);

    const status = error.message.includes('existe déjà') ? 409 : 500;

    res.status(status).json({
      success: false,
      error: 'REGISTRATION_FAILED',
      message: error.message || 'Erreur lors de l\'inscription',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Connexion (SIMPLIFIÉE pour le débogage)
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    console.log('🔑 Tentative de connexion pour:', req.body.email);
    const { email, password } = req.body;

    // Récupérer l'utilisateur avec mot de passe
    let user;
    try {
      user = await User.findByEmail(email, true);
    } catch (dbError) {
      console.error('❌ Erreur recherche utilisateur:', dbError);
      return res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Erreur lors de la recherche de l\'utilisateur'
      });
    }

    if (!user) {
      console.log('⚠️  Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) {
      console.log('⚠️  Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_DISABLED',
        message: 'Ce compte a été désactivé'
      });
    }

    // Générer les tokens
    const accessToken = generateToken(user.id, { role: user.role, email: user.email });
    const refreshToken = generateRefreshToken(user.id);

    // Mettre à jour la dernière connexion
    try {
      await User.updateLastLogin(user.id);
    } catch (updateError) {
      console.warn('⚠️  Erreur mise à jour dernière connexion:', updateError);
    }

    // Réponse
    console.log('✅ Connexion réussie pour:', email);
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: User.format(user),
      token: accessToken,  // IMPORTANT: le frontend attend "token" (pas "tokens.accessToken")
      refreshToken: refreshToken
    });

  } catch (error) {
    console.error('❌ Erreur connexion globale:', error);

    res.status(500).json({
      success: false,
      error: 'LOGIN_FAILED',
      message: 'Erreur lors de la connexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rafraîchir token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({
        success: false,
        error: 'REFRESH_TOKEN_REQUIRED',
        message: 'Token de rafraîchissement requis'
      });
    }

    const tokens = await refreshToken(oldRefreshToken);

    res.json({
      success: true,
      ...tokens
    });

  } catch (error) {
    console.error('❌ Erreur rafraîchissement:', error);

    res.status(401).json({
      success: false,
      error: 'REFRESH_FAILED',
      message: 'Impossible de rafraîchir le token'
    });
  }
});

// Vérifier token
router.get('/verify', authenticate, (req, res) => {
  res.json({
    success: true,
    user: User.format(req.user),
    valid: true,
    timestamp: new Date().toISOString()
  });
});

// Profil utilisateur
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: User.format(user)
    });

  } catch (error) {
    console.error('❌ Erreur profil:', error);

    res.status(500).json({
      success: false,
      error: 'PROFILE_ERROR',
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Mettre à jour le profil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;

    // Empêcher la modification de certains champs
    delete updates.email;
    delete updates.password;
    delete updates.role;
    delete updates.is_active;

    const updatedUser = await User.updateProfile(req.user.id, updates);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: User.format(updatedUser)
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour profil:', error);

    res.status(400).json({
      success: false,
      error: 'UPDATE_FAILED',
      message: error.message
    });
  }
});

// Changer mot de passe
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Ancien et nouveau mot de passe requis'
      });
    }

    const result = await User.changePassword(req.user.id, oldPassword, newPassword);

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès',
      user: {
        id: result.id,
        email: result.email
      }
    });

  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);

    const status = error.message.includes('incorrect') ? 401 : 400;

    res.status(status).json({
      success: false,
      error: 'PASSWORD_CHANGE_FAILED',
      message: error.message
    });
  }
});

// Déconnexion
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Route admin: Lister les utilisateurs
router.get('/users', authenticate, requireRole('admin', 'gerante'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, departement, is_active } = req.query;

    const result = await User.list(page, limit, {
      role,
      departement,
      is_active: is_active !== undefined ? is_active === 'true' : undefined
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Erreur listing utilisateurs:', error);

    res.status(500).json({
      success: false,
      error: 'LISTING_FAILED',
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// Route admin: Désactiver un utilisateur
router.put('/users/:id/deactivate', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.updateProfile(id, { is_active: false });

    res.json({
      success: true,
      message: 'Utilisateur désactivé avec succès',
      user: User.format(result)
    });

  } catch (error) {
    console.error('❌ Erreur désactivation:', error);

    res.status(500).json({
      success: false,
      error: 'DEACTIVATION_FAILED',
      message: 'Erreur lors de la désactivation'
    });
  }
});

// Route admin: Réinitialiser mot de passe
router.post('/users/:id/reset-password', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PASSWORD',
        message: 'Nouveau mot de passe requis'
      });
    }

    const result = await User.resetPassword(id, newPassword);

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      user: {
        id: result.id,
        email: result.email
      }
    });

  } catch (error) {
    console.error('❌ Erreur réinitialisation:', error);

    res.status(400).json({
      success: false,
      error: 'RESET_FAILED',
      message: error.message
    });
  }
});

module.exports = router;