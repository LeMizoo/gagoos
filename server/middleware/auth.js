const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'bygagoos_super_secret_key_change_in_production';

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'accès requis'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Support multiple claim names
    const tokenUserId = decoded && (decoded.id || decoded.userId || decoded.user_id || decoded.sub);

    if (!tokenUserId) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide: ID utilisateur manquant'
      });
    }

    // Vérifier que l'utilisateur existe toujours
    const userResult = await pool.query(
      `SELECT id, prenom, nom, email, role, departement, is_active 
       FROM users WHERE id = $1`,
      [tokenUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

// Middleware de vérification de rôle
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé pour votre rôle'
      });
    }

    next();
  };
};

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  auth,
  requireRole,
  generateToken,
  JWT_SECRET
};