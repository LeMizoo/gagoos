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

// 🔹 STATISTIQUES DU DASHBOARD
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Stats dashboard appelées');

    // Récupérer les stats réelles depuis la base
    const commandesStats = await pool.query(`
      SELECT 
        COUNT(*) as total_commandes,
        COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
        COUNT(CASE WHEN statut = 'validée' THEN 1 END) as validees,
        COUNT(CASE WHEN statut = 'en_production' THEN 1 END) as en_production,
        COUNT(CASE WHEN statut = 'terminée' THEN 1 END) as terminees,
        COALESCE(SUM(prix_total_ariary), 0) as chiffre_affaires,
        COALESCE(SUM(quantite), 0) as total_produit
      FROM commandes
    `);

    const personnelStats = await pool.query(`
      SELECT COUNT(*) as personnel_actif 
      FROM personnel 
      WHERE statut = 'actif'
    `);

    const stats = {
      total_commandes: parseInt(commandesStats.rows[0].total_commandes) || 0,
      en_attente: parseInt(commandesStats.rows[0].en_attente) || 0,
      validees: parseInt(commandesStats.rows[0].validees) || 0,
      en_production: parseInt(commandesStats.rows[0].en_production) || 0,
      terminees: parseInt(commandesStats.rows[0].terminees) || 0,
      chiffre_affaires: parseFloat(commandesStats.rows[0].chiffre_affaires) || 0,
      total_produit: parseInt(commandesStats.rows[0].total_produit) || 0,
      personnel_actif: parseInt(personnelStats.rows[0].personnel_actif) || 0,
      taux_remplissage: 82, // À calculer selon la capacité de production
      commandes_recentes: [
        {
          id: 1,
          client: "Boutique Élégance",
          produit: "T-shirt Barkoay Premium",
          quantite: 75,
          prix_total_ariary: 187500,
          statut: "en_production",
          date_creation: new Date().toISOString()
        }
      ],
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔹 COMMANDES POUR LE DASHBOARD
router.get('/commandes', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Commandes dashboard appelées');

    const result = await pool.query(`
      SELECT id, client, produit, quantite, couleur_tissus, 
             prix_total_ariary, statut, date_creation, equipe_assigned
      FROM commandes 
      ORDER BY date_creation DESC 
      LIMIT 50
    `);

    console.log(`✅ ${result.rows.length} commandes récupérées pour dashboard`);
    res.json(result.rows);

  } catch (error) {
    console.error('Erreur commandes dashboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== GESTION COMPLÈTE DES ÉQUIPES ====================

// 🔹 GET - Récupérer toutes les équipes
router.get('/equipes', authenticateToken, async (req, res) => {
  try {
    console.log('🏭 Récupération de toutes les équipes...');

    const result = await pool.query(`
      SELECT 
        id,
        nom_equipe,
        poste,
        nombre_membres,
        responsable,
        statut,
        created_at,
        updated_at
      FROM equipe_production 
      ORDER BY nom_equipe
    `);

    console.log(`✅ ${result.rows.length} équipes trouvées`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error('❌ Erreur récupération équipes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des équipes'
    });
  }
});

// 🔹 GET - Récupérer une équipe spécifique
router.get('/equipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Récupération équipe ID: ${id}`);

    const result = await pool.query(`
      SELECT * FROM equipe_production WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Équipe non trouvée'
      });
    }

    console.log('✅ Équipe trouvée:', result.rows[0].nom_equipe);
    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur récupération équipe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// 🔹 POST - Créer une nouvelle équipe
router.post('/equipes', authenticateToken, async (req, res) => {
  try {
    const { nom_equipe, poste, nombre_membres, responsable, statut } = req.body;

    console.log('➕ Création nouvelle équipe:', { nom_equipe, poste, nombre_membres, responsable, statut });

    if (!nom_equipe || !poste) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de l\'équipe et le poste sont obligatoires'
      });
    }

    const result = await pool.query(`
      INSERT INTO equipe_production 
        (nom_equipe, poste, nombre_membres, responsable, statut) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, [nom_equipe, poste, nombre_membres || 1, responsable, statut || 'active']);

    console.log('✅ Nouvelle équipe créée:', result.rows[0].nom_equipe);

    res.status(201).json({
      success: true,
      message: 'Équipe créée avec succès',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur création équipe:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Une équipe avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création'
    });
  }
});

// 🔹 PUT - Modifier une équipe existante
router.put('/equipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_equipe, poste, nombre_membres, responsable, statut } = req.body;

    console.log(`✏️  Modification équipe ID: ${id}`, req.body);

    const existingEquipe = await pool.query(
      'SELECT * FROM equipe_production WHERE id = $1',
      [id]
    );

    if (existingEquipe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Équipe non trouvée'
      });
    }

    const result = await pool.query(`
      UPDATE equipe_production 
      SET 
        nom_equipe = $1,
        poste = $2,
        nombre_membres = $3,
        responsable = $4,
        statut = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [nom_equipe, poste, nombre_membres, responsable, statut, id]);

    console.log('✅ Équipe modifiée:', result.rows[0].nom_equipe);

    res.json({
      success: true,
      message: 'Équipe modifiée avec succès',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur modification équipe:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Une équipe avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la modification'
    });
  }
});

// 🔹 PATCH - Mettre à jour partiellement une équipe
router.patch('/equipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`🔧 Mise à jour partielle équipe ID: ${id}`, updates);

    const existingEquipe = await pool.query(
      'SELECT * FROM equipe_production WHERE id = $1',
      [id]
    );

    if (existingEquipe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Équipe non trouvée'
      });
    }

    const allowedFields = ['nom_equipe', 'poste', 'nombre_membres', 'responsable', 'statut'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucun champ valide à mettre à jour'
      });
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE equipe_production 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Équipe mise à jour:', result.rows[0].nom_equipe);

    res.json({
      success: true,
      message: 'Équipe mise à jour avec succès',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour équipe:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Une équipe avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour'
    });
  }
});

// 🔹 DELETE - Supprimer une équipe
router.delete('/equipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️  Suppression équipe ID: ${id}`);

    const existingEquipe = await pool.query(
      'SELECT * FROM equipe_production WHERE id = $1',
      [id]
    );

    if (existingEquipe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Équipe non trouvée'
      });
    }

    const commandesUsingEquipe = await pool.query(
      'SELECT COUNT(*) FROM commandes WHERE equipe_assigned = $1',
      [existingEquipe.rows[0].nom_equipe]
    );

    const count = parseInt(commandesUsingEquipe.rows[0].count);
    if (count > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette équipe. Elle est utilisée dans ${count} commande(s).`
      });
    }

    await pool.query('DELETE FROM equipe_production WHERE id = $1', [id]);

    console.log('✅ Équipe supprimée');

    res.json({
      success: true,
      message: 'Équipe supprimée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur suppression équipe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression'
    });
  }
});

// ==================== GESTION COMPLÈTE DU PERSONNEL ====================

// 🔹 GET - Récupérer tout le personnel
router.get('/personnel', authenticateToken, async (req, res) => {
  try {
    console.log('👥 Récupération de tout le personnel...');

    const result = await pool.query(`
      SELECT 
        p.*,
        tp.nom_type as type_personnel,
        tp.taux_vaccation_jour,
        tp.taux_vaccation_nuit
      FROM personnel p
      LEFT JOIN types_personnel tp ON p.type_personnel_id = tp.id
      ORDER BY p.nom, p.prenom
    `);

    console.log(`✅ ${result.rows.length} employés trouvés`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error('❌ Erreur récupération personnel:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération du personnel'
    });
  }
});

// 🔹 GET - Récupérer un employé spécifique
router.get('/personnel/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Récupération employé ID: ${id}`);

    const result = await pool.query(`
      SELECT 
        p.*,
        tp.nom_type as type_personnel,
        tp.taux_vaccation_jour,
        tp.taux_vaccation_nuit,
        tp.prime_risque
      FROM personnel p
      LEFT JOIN types_personnel tp ON p.type_personnel_id = tp.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur récupération employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// 🔹 POST - Ajouter un nouvel employé
router.post('/personnel', authenticateToken, async (req, res) => {
  try {
    const {
      matricule, nom, prenom, date_naissance, date_embauche, type_personnel_id,
      adresse, telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_lien,
      poste, departement, statut_emploi, qualification, salaire_base, taux_horaire, statut
    } = req.body;

    console.log('➕ Ajout nouvel employé:', { matricule, nom, prenom });

    if (!matricule || !nom || !prenom || !date_embauche) {
      return res.status(400).json({
        success: false,
        error: 'Matricule, nom, prénom et date d\'embauche sont obligatoires'
      });
    }

    const result = await pool.query(`
      INSERT INTO personnel 
        (matricule, nom, prenom, date_naissance, date_embauche, type_personnel_id,
         adresse, telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_lien,
         poste, departement, statut_emploi, qualification, salaire_base, taux_horaire, statut) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      matricule, nom, prenom, date_naissance, date_embauche, type_personnel_id,
      adresse, telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_lien,
      poste, departement, statut_emploi, qualification, salaire_base, taux_horaire, statut || 'actif'
    ]);

    console.log('✅ Nouvel employé ajouté:', result.rows[0].matricule);

    res.status(201).json({
      success: true,
      message: 'Employé ajouté avec succès',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur ajout employé:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Un employé avec ce matricule existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'ajout'
    });
  }
});

// 🔹 PUT - Modifier un employé
router.put('/personnel/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`✏️  Modification employé ID: ${id}`, updates);

    const existing = await pool.query('SELECT * FROM personnel WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    const allowedFields = [
      'matricule', 'nom', 'prenom', 'date_naissance', 'date_embauche', 'type_personnel_id',
      'adresse', 'telephone', 'email', 'contact_urgence_nom', 'contact_urgence_telephone', 'contact_urgence_lien',
      'poste', 'departement', 'statut_emploi', 'qualification', 'salaire_base', 'taux_horaire', 'statut',
      'date_depart', 'raison_depart'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucun champ valide à mettre à jour'
      });
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE personnel 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Employé modifié:', result.rows[0].matricule);

    res.json({
      success: true,
      message: 'Employé modifié avec succès',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur modification employé:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Un employé avec ce matricule existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la modification'
    });
  }
});

// 🔹 GET - Récupérer les types de personnel
router.get('/personnel/types', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Récupération des types de personnel...');

    const result = await pool.query(`
      SELECT * FROM types_personnel 
      WHERE is_active = true
      ORDER BY nom_type
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('❌ Erreur récupération types:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// 🔹 GET - Statistiques du personnel
router.get('/personnel/stats', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Statistiques personnel...');

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_employes,
        COUNT(CASE WHEN statut = 'actif' THEN 1 END) as actifs,
        COUNT(CASE WHEN statut = 'inactif' THEN 1 END) as inactifs,
        COUNT(CASE WHEN statut_emploi = 'CDI' THEN 1 END) as cdi,
        COUNT(CASE WHEN statut_emploi = 'CDD' THEN 1 END) as cdd,
        COUNT(CASE WHEN statut_emploi = 'Interim' THEN 1 END) as interim,
        AVG(salaire_base) as salaire_moyen
      FROM personnel
    `);

    const departements = await pool.query(`
      SELECT departement, COUNT(*) as count
      FROM personnel 
      WHERE statut = 'actif'
      GROUP BY departement
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        ...stats.rows[0],
        departements: departements.rows
      }
    });

  } catch (error) {
    console.error('❌ Erreur statistiques personnel:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// 🔹 METTRE À JOUR UNE COMMANDE
router.put('/commandes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`🔄 Dashboard: Updating commande ${id}:`, updates);

    const allowedFields = ['statut', 'equipe_assigned', 'prix_total_ariary', 'quantite', 'client', 'produit', 'couleur_tissus'];
    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour' });
    }

    const setClause = Object.keys(filteredUpdates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(filteredUpdates);
    values.push(id);

    const query = `
      UPDATE commandes 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    console.log('✅ Commande mise à jour via dashboard:', result.rows[0].id);
    res.json({
      message: 'Commande mise à jour avec succès',
      commande: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error updating commande via dashboard:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la commande',
      error: error.message
    });
  }
});

// 🔹 ACTIVITÉ RÉCENTE
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        type: 'commande',
        description: 'Nouvelle commande #456 créée',
        user: 'Pierre Durand',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'production',
        description: 'Commande #123 terminée',
        user: 'Équipe Beta',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;