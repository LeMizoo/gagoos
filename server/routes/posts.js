const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

// GET /api/posts - Récupérer tous les posts
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT posts.*, users.name as author_name 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       ORDER BY posts.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération posts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/posts/my-posts - Récupérer mes posts
router.get('/my-posts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération mes posts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/posts - Créer un nouveau post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/posts/:id - Mettre à jour un post
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, content, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur mise à jour post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/posts/:id - Supprimer un post
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;