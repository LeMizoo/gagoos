import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

// GET /api/dashboard/stats - Statistiques du tableau de bord
router.get('/', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');
    
    // Statistiques des commandes par statut
    const statsQuery = `
      SELECT 
        COUNT(*) as total_commandes,
        COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
        COUNT(CASE WHEN statut = 'validée' THEN 1 END) as validees,
        COUNT(CASE WHEN statut = 'en_production' THEN 1 END) as en_production,
        COUNT(CASE WHEN statut = 'terminée' THEN 1 END) as terminees,
        COALESCE(SUM(CASE WHEN statut = 'terminée' THEN quantite ELSE 0 END), 0) as total_produit,
        COALESCE(AVG(CASE WHEN statut = 'terminée' THEN quantite ELSE NULL END), 0) as moyenne_par_commande
      FROM commandes
      WHERE statut IS NOT NULL
    `;

    const [statsResult] = await pool.execute(statsQuery);
    
    // Commandes récentes pour le timeline
    const recentOrdersQuery = `
      SELECT id, client, produit, quantite, statut, date_creation 
      FROM commandes 
      ORDER BY date_creation DESC 
      LIMIT 5
    `;

    const [recentOrders] = await pool.execute(recentOrdersQuery);

    const stats = {
      ...statsResult[0],
      commandes_recentes: recentOrders,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Stats fetched successfully:', stats);
    res.json(stats);

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    
    // Mode démo avec données fictives en cas d'erreur
    const demoStats = {
      total_commandes: 12,
      en_attente: 3,
      validees: 2,
      en_production: 4,
      terminees: 3,
      total_produit: 150,
      moyenne_par_commande: 12.5,
      commandes_recentes: [
        {
          id: 1,
          client: "Client Demo",
          produit: "T-shirt Premium",
          quantite: 50,
          statut: "en_production",
          date_creation: new Date().toISOString()
        }
      ],
      demo_mode: true,
      timestamp: new Date().toISOString()
    };
    
    res.json(demoStats);
  }
});

export default router;