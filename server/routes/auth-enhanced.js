const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, auth } = require('../middleware/auth');
const { validateLoginInput, rateLimit } = require('../middleware/validation');

// Appliquer le rate limiting aux routes d'authentification
router.use(rateLimit(15 * 60 * 1000, 5)); // 5 tentatives par 15 minutes

// Route de vérification de token
router.get('/verify', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: User.toSafeObject(req.user)
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du token'
        });
    }
});

// Route de connexion améliorée
router.post('/login', validateLoginInput, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Mettre à jour la dernière connexion
        await User.updateLastLogin(user.id);

        // Générer le token
        const token = generateToken(user.id);

        // Réponse avec les données utilisateur
        res.json({
            success: true,
            user: User.toSafeObject(user),
            token,
            message: 'Connexion réussie'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion'
        });
    }
});

// Route de déconnexion
router.post('/logout', auth, (req, res) => {
    // Avec JWT, la déconnexion est gérée côté client
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

// Route pour obtenir le profil utilisateur
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: User.toSafeObject(req.user)
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil'
        });
    }
});

module.exports = router;