const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requis' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded && (decoded.id || decoded.userId || decoded.user_id || decoded.sub);

    const userResult = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1 AND is_active = true',
      [tokenUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware magasinier ou admin
const requireStorekeeper = (req, res, next) => {
  if (!['magasinier', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès magasinier requis' });
  }
  next();
};

router.use(authenticateToken);
router.use(requireStorekeeper);

// === INVENTAIRE ===
router.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stock_materiaux ORDER BY nom_materiau');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur inventaire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'inventaire' });
  }
});

// === STOCK FAIBLE ===
router.get('/low-stock', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM stock_materiaux 
      WHERE quantite_stock <= seuil_alerte 
      ORDER BY quantite_stock ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur stock faible:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du stock faible' });
  }
});

// === MOUVEMENTS DE STOCK ===
router.get('/movements', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, s.nom_materiau 
      FROM mouvements_stock m 
      LEFT JOIN stock_materiaux s ON m.materiau_id = s.id 
      ORDER BY m.created_at DESC 
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur mouvements stock:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des mouvements' });
  }
});

// === METTRE À JOUR LE STOCK ===
router.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite_stock } = req.body;
    
    const result = await pool.query(
      'UPDATE stock_materiaux SET quantite_stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantite_stock, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur mise à jour stock:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du stock' });
  }
});

// === AJOUTER UN MOUVEMENT DE STOCK ===
router.post('/movements', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { materiau_id, type_mouvement, quantite, motif } = req.body;
    
    // Vérifier que le matériau existe
    const materiauCheck = await client.query('SELECT * FROM stock_materiaux WHERE id = $1', [materiau_id]);
    if (materiauCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }

    // Créer le mouvement
    const result = await client.query(
      'INSERT INTO mouvements_stock (materiau_id, type_mouvement, quantite, motif, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [materiau_id, type_mouvement, quantite, motif, req.user.id]
    );

    // Mettre à jour le stock
    if (type_mouvement === 'entree') {
      await client.query(
        'UPDATE stock_materiaux SET quantite_stock = quantite_stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantite, materiau_id]
      );
    } else if (type_mouvement === 'sortie') {
      // Vérifier que le stock est suffisant
      const currentStock = materiauCheck.rows[0].quantite_stock;
      if (currentStock < quantite) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      
      await client.query(
        'UPDATE stock_materiaux SET quantite_stock = quantite_stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantite, materiau_id]
      );
    }

    await client.query('COMMIT');
    
    // Récupérer les données complètes du mouvement
    const finalResult = await pool.query(`
      SELECT m.*, s.nom_materiau 
      FROM mouvements_stock m 
      LEFT JOIN stock_materiaux s ON m.materiau_id = s.id 
      WHERE m.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(finalResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur ajout mouvement:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du mouvement de stock' });
  } finally {
    client.release();
  }
});

// === DASHBOARD MAGASINIER ===
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalItems,
      lowStockItems,
      recentMovements,
      monthlyStats
    ] = await Promise.all([
      // Total des articles
      pool.query('SELECT COUNT(*) as total FROM stock_materiaux'),
      // Articles en stock faible
      pool.query(`
        SELECT COUNT(*) as low_stock 
        FROM stock_materiaux 
        WHERE quantite_stock <= seuil_alerte
      `),
      // Mouvements récents
      pool.query(`
        SELECT m.*, s.nom_materiau 
        FROM mouvements_stock m 
        LEFT JOIN stock_materiaux s ON m.materiau_id = s.id 
        ORDER BY m.created_at DESC 
        LIMIT 10
      `),
      // Statistiques mensuelles
      pool.query(`
        SELECT 
          COUNT(*) as total_movements,
          SUM(CASE WHEN type_mouvement = 'entree' THEN quantite ELSE 0 END) as total_entrees,
          SUM(CASE WHEN type_mouvement = 'sortie' THEN quantite ELSE 0 END) as total_sorties
        FROM mouvements_stock 
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `)
    ]);

    res.json({
      total_items: parseInt(totalItems.rows[0].total),
      low_stock_count: parseInt(lowStockItems.rows[0].low_stock),
      recent_movements: recentMovements.rows,
      monthly_stats: {
        total_movements: parseInt(monthlyStats.rows[0].total_movements),
        total_entrees: parseFloat(monthlyStats.rows[0].total_entrees || 0),
        total_sorties: parseFloat(monthlyStats.rows[0].total_sorties || 0)
      }
    });
  } catch (error) {
    console.error('Erreur dashboard magasinier:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du dashboard' });
  }
});

module.exports = router;