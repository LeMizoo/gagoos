const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { pool } = require('../config/database');
const { generateToken, auth } = require('../middleware/auth');
const { validateLoginInput, validateRegistration } = require('../middleware/validation');

// Rate limiting amélioré
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8, // 8 tentatives par IP
    message: {
        success: false,
        message: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Appliquer le rate limiting aux routes d'authentification
router.use(authLimiter);

// Route de vérification de token
router.get('/verify', auth, async (req, res) => {
    try {
        console.log('🔍 Vérification token améliorée pour:', req.user.email);

        res.json({
            success: true,
            user: {
                id: req.user.id,
                prenom: req.user.prenom,
                nom: req.user.nom,
                email: req.user.email,
                role: req.user.role,
                departement: req.user.departement
            },
            permissions: getPermissionsByRole(req.user.role)
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
        console.log('🔐 CONNEXION ENHANCED - Email:', email);

        // Validation étendue
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Rechercher l'utilisateur avec plus d'informations
        const result = await pool.query(
            `SELECT id, prenom, nom, email, password, role, departement, phone, 
              is_active, last_login, created_at
       FROM users 
       WHERE email = $1 AND is_active = true`,
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            console.log('❌ Utilisateur non trouvé ou inactif');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('❌ Mot de passe invalide');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Mettre à jour la dernière connexion
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // Générer le token
        const token = generateToken(user.id);

        // Réponse avec les données utilisateur enrichies
        res.json({
            success: true,
            user: {
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
                departement: user.departement,
                phone: user.phone,
                last_login: user.last_login
            },
            token,
            permissions: getPermissionsByRole(user.role),
            message: 'Connexion réussie'
        });

    } catch (error) {
        console.error('Login enhanced error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion'
        });
    }
});

// Route d'inscription améliorée
router.post('/register', validateRegistration, async (req, res) => {
    try {
        console.log('📝 INSCRIPTION ENHANCED - Données:', req.body);

        const { prenom, nom, email, password, role, departement, phone } = req.body;

        // Validation renforcée
        if (!prenom || !nom || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Déterminer les valeurs par défaut
        const userRole = role || 'salarie';
        const userDepartement = departement || 'Production';

        // Insérer le nouvel utilisateur
        const result = await pool.query(
            `INSERT INTO users (prenom, nom, email, password, role, departement, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, prenom, nom, email, role, departement, phone, created_at`,
            [prenom, nom, normalizedEmail, hashedPassword, userRole, userDepartement, phone]
        );

        const user = result.rows[0];

        // Générer le token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
                departement: user.departement,
                phone: user.phone
            },
            permissions: getPermissionsByRole(user.role)
        });

    } catch (error) {
        console.error('Register enhanced error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'utilisateur'
        });
    }
});

// Route de déconnexion
router.post('/logout', auth, (req, res) => {
    console.log('🚪 Déconnexion enhanced pour:', req.user.email);

    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

// Route pour obtenir le profil utilisateur
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, prenom, nom, email, role, departement, phone, 
              created_at, last_login, updated_at
       FROM users 
       WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            user: result.rows[0],
            permissions: getPermissionsByRole(result.rows[0].role)
        });
    } catch (error) {
        console.error('Get profile enhanced error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil'
        });
    }
});

// Fonction helper pour les permissions
function getPermissionsByRole(role) {
    const permissions = {
        'gerante': ['dashboard', 'production', 'stocks', 'rh', 'comptabilite', 'analytics', 'admin'],
        'contremaitre': ['dashboard', 'production', 'stocks', 'equipe', 'rapports'],
        'salarie': ['dashboard', 'mes-tâches', 'progression', 'pointage'],
        'admin': ['dashboard', 'admin', 'utilisateurs', 'system', 'analytics']
    };

    return permissions[role] || [];
}

// Route de santé
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Auth Enhanced opérationnelle',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;