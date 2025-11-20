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

// Middleware admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  next();
};

router.use(authenticateToken);
router.use(requireAdmin);

// === VUE D'ENSEMBLE ===
router.get('/overview', async (req, res) => {
  try {
    // Statistiques générales
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalCommandes = await pool.query('SELECT COUNT(*) as count FROM commandes');
    const totalTypes = await pool.query('SELECT COUNT(*) as count FROM type_commandes');
    const totalSalaires = await pool.query('SELECT COUNT(*) as count FROM salaires_horaires');

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalCommandes: parseInt(totalCommandes.rows[0].count),
      totalTypes: parseInt(totalTypes.rows[0].count),
      totalSalaires: parseInt(totalSalaires.rows[0].count),
      systemStatus: 'Actif',
      lastBackup: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur overview paramètres:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

// === STATISTIQUES ===
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      commandesMois: 45,
      revenuMois: 1250000,
      utilisateursActifs: 8,
      tauxRemplissage: 78
    };
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats paramètres:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// === TYPES DE COMMANDE ===
router.get('/command-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM type_commandes ORDER BY nom_type');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur types commande:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types de commande' });
  }
});

// Créer un type de commande
router.post('/command-types', async (req, res) => {
  try {
    const { nom_type, description, prix_unitaire_ariary } = req.body;
    
    const result = await pool.query(
      'INSERT INTO type_commandes (nom_type, description, prix_unitaire_ariary) VALUES ($1, $2, $3) RETURNING *',
      [nom_type, description, prix_unitaire_ariary]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création type commande:', error);
    res.status(500).json({ message: 'Erreur lors de la création du type de commande' });
  }
});

// Modifier un type de commande
router.put('/command-types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_type, description, prix_unitaire_ariary } = req.body;
    
    const result = await pool.query(
      'UPDATE type_commandes SET nom_type = $1, description = $2, prix_unitaire_ariary = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [nom_type, description, prix_unitaire_ariary, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Type de commande non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur modification type commande:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du type de commande' });
  }
});

// === SALAIRES HORAIRES ===
router.get('/salary-settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM salaires_horaires ORDER BY type_personnel');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur salaires horaires:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des salaires horaires' });
  }
});

// Modifier les salaires
router.put('/salary-settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { salaire_horaire_ariary, majoration_nuit } = req.body;
    
    const result = await pool.query(
      'UPDATE salaires_horaires SET salaire_horaire_ariary = $1, majoration_nuit = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [salaire_horaire_ariary, majoration_nuit, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Salaire horaire non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur modification salaire:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du salaire horaire' });
  }
});

// === UTILISATEURS ===
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Créer un utilisateur
router.post('/users', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role, phone',
      [email, hashedPassword, first_name, last_name, phone, role || 'user']
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Modifier un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, phone, role, is_active } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET email = $1, first_name = $2, last_name = $3, phone = $4, role = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, email, first_name, last_name, role, phone, is_active',
      [email, first_name, last_name, phone, role, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      message: 'Utilisateur modifié avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de l\'utilisateur' });
  }
});

// === MATÉRIAUX (STOCK) ===
router.get('/materials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stock_materiaux ORDER BY nom_materiau');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur matériaux:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des matériaux' });
  }
});

// Créer un matériau
router.post('/materials', async (req, res) => {
  try {
    const { nom_materiau, description, quantite_stock, unite_mesure, seuil_alerte, prix_unitaire, fournisseur } = req.body;
    
    const result = await pool.query(
      'INSERT INTO stock_materiaux (nom_materiau, description, quantite_stock, unite_mesure, seuil_alerte, prix_unitaire, fournisseur) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nom_materiau, description, quantite_stock, unite_mesure, seuil_alerte, prix_unitaire, fournisseur]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création matériau:', error);
    res.status(500).json({ message: 'Erreur lors de la création du matériau' });
  }
});

// Modifier un matériau
router.put('/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_materiau, description, quantite_stock, unite_mesure, seuil_alerte, prix_unitaire, fournisseur } = req.body;
    
    const result = await pool.query(
      'UPDATE stock_materiaux SET nom_materiau = $1, description = $2, quantite_stock = $3, unite_mesure = $4, seuil_alerte = $5, prix_unitaire = $6, fournisseur = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [nom_materiau, description, quantite_stock, unite_mesure, seuil_alerte, prix_unitaire, fournisseur, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur modification matériau:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du matériau' });
  }
});

module.exports = router;