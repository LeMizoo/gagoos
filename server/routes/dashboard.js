const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/dashboard/stats - Récupérer les statistiques du dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Ici vous récupéreriez les vraies données depuis la base de données
    const stats = {
      totalActivity: 1234,
      completedTasks: 89,
      timeSpent: '34h',
      collaborators: 12,
      weeklyActivity: [40, 60, 75, 55, 80, 65, 90]
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/dashboard/activity - Récupérer l'activité récente
router.get('/activity', auth, async (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        type: 'success',
        title: 'Tâche complétée',
        description: 'Vous avez terminé "Design du dashboard"',
        time: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'update',
        title: 'Mise à jour',
        description: 'Profil mis à jour avec succès',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Erreur dashboard activity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/dashboard/profile - Mettre à jour le profil utilisateur
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, location, bio } = req.body;
    const userId = req.user.id;

    // Ici vous mettriez à jour l'utilisateur dans la base de données
    // Exemple avec PostgreSQL :
    // const result = await db.query(
    //   'UPDATE users SET name = $1, email = $2, location = $3, bio = $4 WHERE id = $5 RETURNING *',
    //   [name, email, location, bio, userId]
    // );

    const updatedUser = {
      id: userId,
      name,
      email,
      location,
      bio,
      updatedAt: new Date().toISOString()
    };

    res.json({ 
      message: 'Profil mis à jour avec succès',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;