const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await db.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Token invalide.' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = auth;