const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Inscription d'un nouvel utilisateur
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validation des champs requis
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Champs manquants',
          message: 'Tous les champs sont requis: username, email, password'
        });
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Email invalide',
          message: 'Veuillez fournir une adresse email valide'
        });
      }

      // Vérifier si l'email existe déjà
      if (await User.emailExists(email)) {
        return res.status(409).json({
          error: 'Email déjà utilisé',
          message: 'Un compte avec cet email existe déjà'
        });
      }

      // Vérifier si le username existe déjà
      if (await User.usernameExists(username)) {
        return res.status(409).json({
          error: 'Nom d\'utilisateur déjà pris',
          message: 'Ce nom d\'utilisateur est déjà utilisé'
        });
      }

      // Validation du mot de passe
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Mot de passe trop court',
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }

      // Créer l'utilisateur
      const user = await User.create({ username, email, password });

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        token
      });

    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la création du compte'
      });
    }
  },

  // Connexion d'un utilisateur
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation des champs
      if (!email || !password) {
        return res.status(400).json({
          error: 'Champs manquants',
          message: 'Email et mot de passe sont requis'
        });
      }

      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Identifiants invalides',
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const validPassword = await User.comparePassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Identifiants invalides',
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        token
      });

    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la connexion'
      });
    }
  },

  // Récupérer le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      // req.user est défini par le middleware authenticateToken
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Impossible de récupérer le profil utilisateur'
      });
    }
  },

  // Vérifier si un token est valide
  verifyToken: async (req, res) => {
    try {
      res.json({
        success: true,
        user: req.user,
        message: 'Token valide'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
  }
};

module.exports = authController;