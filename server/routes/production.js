const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware d'authentification simplifié
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token requis' });
  }
  
  next();
};

// GET /api/production - Récupérer les commandes en production
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('🏭 Fetching production data...');
    
    const result = await pool.query(`
      SELECT id, client, produit, quantite, statut, equipe_assigned, date_creation
      FROM commandes 
      WHERE statut IN ('en_production', 'validée')
      ORDER BY date_creation DESC
      LIMIT 50
    `);
    
    console.log(`✅ Found ${result.rows.length} production items`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error fetching production data:', error);
    
    // Données de démonstration
    const demoData = [
      {
        id: 1,
        client: "Boutique Élégance",
        produit: "T-shirt Barkoay Premium", 
        quantite: 75,
        statut: "en_production",
        equipe_assigned: "Équipe Alpha",
        date_creation: new Date().toISOString()
      }
    ];
    
    res.json(demoData);
  }
});

module.exports = router;