const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Token d\'accès requis',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    // Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support multiple claim names
    const tokenUserId = decoded && (decoded.id || decoded.userId || decoded.user_id || decoded.sub);
    
    if (!tokenUserId) {
      return res.status(401).json({ 
        message: 'Token invalide: identifiant utilisateur manquant',
        code: 'INVALID_TOKEN'
      });
    }

    // Vérifier que l'utilisateur existe toujours
    const userResult = await pool.query(
      'SELECT id, username, email, role, is_active FROM users WHERE id = $1',
      [tokenUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ 
        message: 'Compte utilisateur désactivé',
        code: 'USER_INACTIVE'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
    
  } catch (error) {
    console.error('🔐 Erreur vérification token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Token invalide',
        code: 'TOKEN_INVALID'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({ 
      message: 'Erreur d\'authentification',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = authenticateToken;