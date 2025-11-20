// Utilitaires de validation côté serveur
const Joi = require('joi');

const emailSchema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr', 'org', 'mg'] } })
    .lowercase()
    .trim()
    .required()
    .messages({
        'string.email': 'Format d\'email invalide',
        'any.required': 'L\'email est requis'
    });

const passwordSchema = Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .message('Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre')
    .required();

const userSchema = Joi.object({
    prenom: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
        .message('Le prénom ne doit contenir que des lettres')
        .required(),

    nom: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
        .message('Le nom ne doit contenir que des lettres')
        .required(),

    email: emailSchema,
    password: passwordSchema,

    role: Joi.string()
        .valid('gerante', 'contremaitre', 'salarie', 'admin')
        .default('salarie'),

    departement: Joi.string()
        .valid('Production', 'Design', 'Administration', 'Commercial', 'Direction')
        .default('Production'),

    isActive: Joi.boolean().default(true)
});

const loginSchema = Joi.object({
    email: emailSchema,
    password: Joi.string().required().messages({
        'any.required': 'Le mot de passe est requis'
    })
});

const validateUser = (userData) => {
    return userSchema.validate(userData, { abortEarly: false });
};

const validateLogin = (loginData) => {
    return loginSchema.validate(loginData, { abortEarly: false });
};

// Sanitization des données
const sanitizeUserInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/[<>]/g, '') // Supprimer les balises HTML
        .trim()
        .substring(0, 255); // Limiter la longueur
};

// Validation des IDs
const isValidId = (id) => {
    return /^\d+$/.test(id);
};

// Middleware de validation pour l'inscription
const validateRegistration = (req, res, next) => {
    // Sanitizer les données d'abord
    req.body = Object.keys(req.body).reduce((acc, key) => {
        acc[key] = typeof req.body[key] === 'string'
            ? sanitizeUserInput(req.body[key])
            : req.body[key];
        return acc;
    }, {});

    const { error, value } = validateUser(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: error.details.map(detail => detail.message)
        });
    }

    req.body = value;
    next();
};

// Middleware de validation pour la connexion
const validateLoginInput = (req, res, next) => {
    // Sanitizer les données
    if (req.body.email) {
        req.body.email = sanitizeUserInput(req.body.email);
    }

    const { error, value } = validateLogin(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Données de connexion invalides',
            errors: error.details.map(detail => detail.message)
        });
    }

    req.body = value;
    next();
};

// Middleware de rate limiting simple
const requestCounts = new Map();

const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;

        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, []);
        }

        const requests = requestCounts.get(ip);

        // Nettoyer les vieilles requêtes
        while (requests.length > 0 && requests[0] < windowStart) {
            requests.shift();
        }

        // Vérifier la limite
        if (requests.length >= max) {
            return res.status(429).json({
                success: false,
                message: 'Trop de requêtes, veuillez réessayer plus tard'
            });
        }

        // Ajouter la requête actuelle
        requests.push(now);
        requestCounts.set(ip, requests);

        next();
    };
};

module.exports = {
    validateRegistration,
    validateLoginInput,
    rateLimit,
    sanitizeUserInput,
    isValidId
};