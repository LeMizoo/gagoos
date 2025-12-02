const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Utiliser un secret temporaire pour le développement
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRES_IN = '24h';

/**
 * Middleware d'authentification simplifié
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_REQUIRED',
      message: 'Token d\'authentification requis'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM]
    });

    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Token invalide'
      });
    }

    const result = await pool.query(
      `SELECT 
        id, prenom, nom, email, role, departement, 
        phone, is_active, last_login, created_at
       FROM utilisateurs 
       WHERE id = ? AND is_active = 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    req.user = result.rows[0];
    req.token = token;
    next();
  } catch (error) {
    console.error('❌ Erreur authentification:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'Token expiré'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token invalide'
    });
  }
};

/**
 * Middleware de vérification de rôle
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Accès interdit pour le rôle: ${req.user.role}`
      });
    }

    next();
  };
};

/**
 * Générer un token JWT
 */
const generateToken = (userId, userData = {}) => {
  const payload = {
    userId,
    role: userData.role,
    email: userData.email,
    iss: 'bygagoos-api',
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM
  });
};

/**
 * Générer un token de rafraîchissement
 */
const generateRefreshToken = (userId) => {
  const payload = {
    userId,
    type: 'refresh',
    iss: 'bygagoos-api',
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    algorithm: JWT_ALGORITHM
  });
};

module.exports = {
  authenticate,
  requireRole,
  generateToken,
  generateRefreshToken,
  JWT_SECRET,
  JWT_ALGORITHM
};