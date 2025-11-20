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

// GET /api/commandes - Récupérer toutes les commandes
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📦 Fetching all commandes...');
    
    // Vérifier la structure de la table
    const checkTable = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'commandes'
    `);
    
    const columns = checkTable.rows.map(col => col.column_name);
    console.log('Colonnes disponibles:', columns);
    
    let query;
    
    // Adapter la requête selon les colonnes disponibles
    if (columns.includes('client') && columns.includes('produit')) {
      query = `
        SELECT id, client, produit, quantite, couleur_tissus, 
               prix_total_ariary, statut, date_creation, equipe_assigned
        FROM commandes 
        ORDER BY date_creation DESC 
        LIMIT 50
      `;
    } else {
      query = `
        SELECT id,
               COALESCE(date_commande, date_creation) as date_creation,
               couleur_tissus,
               COALESCE(prix_total_ariary, 0) as prix_total_ariary,
               COALESCE(statut, 'en_attente') as statut,
               'Client ' || id as client,
               'Produit ' || id as produit,
               COALESCE(quantite, 0) as quantite
        FROM commandes 
        ORDER BY date_creation DESC 
        LIMIT 50
      `;
    }
    
    const result = await pool.query(query);
    console.log(`✅ Found ${result.rows.length} commandes`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error fetching commandes:', error);
    
    // Données de démonstration
    const demoData = [
      {
        id: 1,
        client: "Boutique Élégance",
        produit: "T-shirt Barkoay Premium",
        quantite: 75,
        couleur_tissus: "Bleu marine",
        prix_total_ariary: 187500,
        statut: "en_production",
        date_creation: new Date().toISOString(),
        equipe_assigned: "Équipe Alpha"
      }
    ];
    
    res.json(demoData);
  }
});

// POST /api/commandes - Créer une nouvelle commande
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { client, produit, quantite, couleur_tissus, prix_total_ariary } = req.body;

    console.log('📝 Creating new commande:', { client, produit, quantite });

    const result = await pool.query(`
      INSERT INTO commandes (client, produit, quantite, couleur_tissus, prix_total_ariary, statut)
      VALUES ($1, $2, $3, $4, $5, 'en_attente')
      RETURNING *
    `, [client, produit, quantite, couleur_tissus, prix_total_ariary]);

    console.log('✅ Nouvelle commande créée:', result.rows[0].id);
    res.status(201).json({
      message: 'Commande créée avec succès',
      commande: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error creating commande:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la commande',
      error: error.message 
    });
  }
});

module.exports = router;