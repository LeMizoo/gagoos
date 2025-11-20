const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { pool } = require('../config/database');
const { validateLoginInput, validateRegistration } = require('../middleware/validation');
const { generateToken, auth } = require('../middleware/auth');

const router = express.Router();

// Limiteur spécifique pour les routes d'auth (protéger contre le brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // maximum 10 requêtes par IP par fenêtre
  message: {
    success: false,
    message: 'Trop de tentatives. Veuillez réessayer plus tard.'
  }
});

// Route d'inscription améliorée
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    console.log('📝 Tentative d\'inscription:', req.body.email);

    const { prenom, nom, email, password, role, departement } = req.body;

    // Vérifier que la clé JWT existe
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET non défini');
      return res.status(500).json({
        success: false,
        message: 'Configuration serveur manquante'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      console.log('❌ Utilisateur existe déjà:', normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔑 Mot de passe hashé');

    // Insérer le nouvel utilisateur
    const result = await pool.query(
      `INSERT INTO users (prenom, nom, email, password, role, departement) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, prenom, nom, email, role, departement, created_at`,
      [prenom, nom, normalizedEmail, hashedPassword, role || 'salarie', departement || 'Production']
    );

    const user = result.rows[0];
    console.log('✅ Utilisateur créé:', user.email);

    // Générer le token JWT
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
        departement: user.departement
      }
    });
  } catch (error) {
    console.error('💥 Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Pour la compatibilité, on peut aussi renvoyer le token en cookie HttpOnly
const setAuthCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24h
  };
  res.cookie('token', token, cookieOptions);
};

// Route de connexion améliorée
router.post('/login', authLimiter, validateLoginInput, async (req, res) => {
  console.log('🔐 TENTATIVE DE CONNEXION - Données reçues:', req.body);

  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET non défini');
      return res.status(500).json({
        success: false,
        message: 'Configuration serveur manquante'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    console.log('📧 Recherche utilisateur:', normalizedEmail);

    // Trouver l'utilisateur
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [normalizedEmail]);
    console.log('👤 Résultat recherche:', result.rows.length, 'utilisateur(s) trouvé(s)');

    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = result.rows[0];
    console.log('🔑 Comparaison mot de passe...');

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Mot de passe valide:', validPassword);

    if (!validPassword) {
      console.log('❌ Mot de passe invalide');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Générer le token JWT
    const token = generateToken(user.id);

    // Définir cookie HttpOnly pour les clients compatibles
    try {
      setAuthCookie(res, token);
      console.log('🍪 Cookie auth défini');
    } catch (e) {
      console.log('⚠️  Cookie non défini:', e.message);
    }

    console.log('🎉 Connexion réussie pour:', user.email);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
        departement: user.departement,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour vérifier le token
router.get('/verify', auth, (req, res) => {
  console.log('🔍 Vérification token pour:', req.user.email);
  res.json({
    success: true,
    valid: true,
    user: {
      id: req.user.id,
      prenom: req.user.prenom,
      nom: req.user.nom,
      email: req.user.email,
      role: req.user.role,
      departement: req.user.departement
    }
  });
});

// Route pour récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('👤 Récupération profil pour:', req.user.id);

    const result = await pool.query(
      'SELECT id, prenom, nom, email, role, departement, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log('✅ Profil récupéré:', result.rows[0].email);
    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('💥 Erreur profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour mettre à jour le profil
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('✏️  Mise à jour profil pour:', req.user.id, req.body);

    const { prenom, nom, phone } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE users SET prenom = $1, nom = $2, phone = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, email, prenom, nom, phone, role, departement`,
      [prenom, nom, phone, userId]
    );

    console.log('✅ Profil mis à jour:', result.rows[0].email);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('💥 Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route de déconnexion
router.post('/logout', auth, (req, res) => {
  console.log('🚪 Déconnexion pour:', req.user.email);

  // Effacer le cookie
  res.clearCookie('token');

  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

module.exports = router;