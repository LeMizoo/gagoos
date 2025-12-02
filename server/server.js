const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// ==== CHARGEMENT INTELLIGENT DES VARIABLES D'ENVIRONNEMENT ====
// Déterminer l'environnement
const env = process.env.NODE_ENV || 'development';
console.log(`🌍 Environnement détecté: ${env}`);

// Liste des fichiers .env à essayer
const envFiles = [
  `.env.${env}.local`,
  `.env.${env}`,
  '.env.local',
  '.env'
];

// Charger le premier fichier .env qui existe
let envLoaded = false;
for (const envFile of envFiles) {
  const envPath = path.resolve(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✅ Fichier .env chargé: ${envFile}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️  Aucun fichier .env trouvé, utilisation des variables système');
}

// ==== CONFIGURATION DE L'APPLICATION ====
const app = express();
const PORT = process.env.PORT || 3001;

// ==================== CONFIGURATION CORS POUR PRODUCTION ====================
// Liste complète des origines autorisées
const allowedOrigins = [
  'https://gagoos.vercel.app',
  'https://www.gagoos.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://bygagoos-backend.onrender.com' // Votre propre backend
];

// Configuration CORS avancée
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 CORS Request - Origin: ${origin}, Environment: ${env}`);

    // En développement, accepter toutes les origines pour faciliter le debug
    if (env === 'development') {
      console.log(`🔓 Mode développement - Autorisation de: ${origin}`);
      return callback(null, true);
    }

    // En production :
    // 1. Autoriser les requêtes sans origine (comme curl, postman)
    if (!origin) {
      console.log('🔓 Requête sans origine autorisée (curl, postman, etc.)');
      return callback(null, true);
    }

    // 2. Vérifier si l'origine est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origine autorisée: ${origin}`);
      callback(null, true);
    } else {
      // 3. Vérifier les sous-domaines de Vercel
      if (origin.endsWith('.vercel.app')) {
        console.log(`✅ Sous-domaine Vercel autorisé: ${origin}`);
        return callback(null, true);
      }

      console.warn(`🚫 Origine NON autorisée: ${origin}`);
      console.warn(`📋 Origines autorisées: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  maxAge: 86400 // 24 heures de cache pour les pré-vols
};

// Appliquer CORS
app.use(cors(corsOptions));

// Gérer spécifiquement les requêtes OPTIONS (pré-vol)
app.options('*', cors(corsOptions));

/**
 * Configuration de sécurité Helmet
 */
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

/**
 * Middleware globaux
 */

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Trop de requêtes depuis cette IP. Veuillez réessayer plus tard.'
  }
});

app.use(globalLimiter);

// Logging
app.use(morgan(env === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Désactiver x-powered-by
app.disable('x-powered-by');

// ===== MIDDLEWARE DE LOGGING POUR DÉBOGAGE =====
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl}`);

  // Log des headers CORS pour débogage
  if (env === 'development' || env === 'production') {
    console.log('📋 Headers CORS:', {
      origin: req.headers.origin,
      'access-control-request-method': req.headers['access-control-request-method'],
      'access-control-request-headers': req.headers['access-control-request-headers']
    });
  }

  // Log du body pour POST/PUT mais masquer les mots de passe
  if (['POST', 'PUT'].includes(req.method) && req.body) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    if (logBody.oldPassword) logBody.oldPassword = '***';
    if (logBody.newPassword) logBody.newPassword = '***';
    if (logBody.confirmPassword) logBody.confirmPassword = '***';
    console.log('📦 Body:', logBody);
  }

  // Ajouter les headers CORS à chaque réponse
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');

  next();
});

/**
 * Routes de base
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'ByGagoos API',
    version: '2.1.0',
    status: 'operational',
    environment: env,
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: req.headers.origin || 'none'
    },
    endpoints: {
      health: '/api/health',
      testDb: '/api/test-db',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        verify: 'GET /api/auth/verify'
      }
    }
  });
});

// Route de test CORS spécifique
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful!',
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: req.headers.origin || 'none',
      environment: env,
      headers: req.headers
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy'
    },
    version: '2.1.0',
    environment: env,
    cors: {
      origin: req.headers.origin || 'none',
      allowed: allowedOrigins.includes(req.headers.origin || '') ? 'yes' : 'no'
    }
  });
});

app.get('/api/health', async (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    message: 'API is running!',
    timestamp: new Date().toISOString(),
    environment: env,
    cors: {
      origin: req.headers.origin,
      method: req.method
    }
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    const result = await db.query('SELECT CURRENT_TIMESTAMP as time');

    res.json({
      database: 'Connected ✅',
      time: result.rows[0].time,
      environment: env
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      details: env === 'development' ? error.message : 'Internal error'
    });
  }
});

// ===== ROUTE DE TEST TEMPORAIRE =====
app.post('/api/auth/register-test', async (req, res) => {
  console.log('🔧 Route test /register-test appelée');
  console.log('📝 Données reçues:', req.body);

  // Réponse simple pour tester la connexion
  res.json({
    success: true,
    message: 'Route test fonctionnelle ✅',
    receivedData: {
      ...req.body,
      password: req.body.password ? '***' : undefined
    },
    cors: {
      origin: req.headers.origin,
      allowed: allowedOrigins.includes(req.headers.origin || '') ? 'yes' : 'no'
    },
    timestamp: new Date().toISOString()
  });
});

// ===== ROUTE DE TEST LOGIN SIMULÉ =====
app.post('/api/auth/login-test', async (req, res) => {
  console.log('🔧 Route test /login-test appelée');
  console.log('📝 Login attempt:', req.body.email);

  // Simulation d'un succès pour admin@gagoos.com
  if (req.body.email === 'admin@gagoos.com' && req.body.password === 'password') {
    return res.json({
      success: true,
      message: 'Connexion test réussie',
      token: 'test-jwt-token-for-development',
      user: {
        id: 1,
        prenom: 'Admin',
        nom: 'Gagoos',
        email: 'admin@gagoos.com',
        role: 'admin',
        departement: 'Administration'
      },
      cors: {
        origin: req.headers.origin,
        status: 'allowed'
      }
    });
  }

  res.status(401).json({
    success: false,
    error: 'INVALID_CREDENTIALS',
    message: 'Email ou mot de passe incorrect'
  });
});

// Import des routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Routes auth chargées');
} catch (error) {
  console.warn('⚠️  Routes auth non chargées:', error.message);
}

try {
  const productionRoutes = require('./routes/production');
  app.use('/api/production', productionRoutes);
  console.log('✅ Routes production chargées');
} catch (error) {
  console.warn('⚠️  Routes production non chargées:', error.message);
}

try {
  const stockRoutes = require('./routes/stock');
  app.use('/api/stock', stockRoutes);
  console.log('✅ Routes stock chargées');
} catch (error) {
  console.warn('⚠️  Routes stock non chargées:', error.message);
}

try {
  const dashboardRoutes = require('./routes/dashboard');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✅ Routes dashboard chargées');
} catch (error) {
  console.warn('⚠️  Routes dashboard non chargées:', error.message);
}

// Route pour la documentation
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile',
        verify: 'GET /api/auth/verify'
      },
      production: {
        commandes: 'GET /api/production/commandes',
        etapes: 'GET /api/production/etapes'
      },
      stock: {
        overview: 'GET /api/stock/overview',
        alertes: 'GET /api/stock/alertes'
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats',
        activities: 'GET /api/dashboard/activities'
      }
    },
    cors: {
      allowedOrigins: allowedOrigins,
      documentation: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'
    }
  });
});

/**
 * Middleware spécial pour les erreurs CORS
 */
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Not allowed by CORS')) {
    console.error('❌ Erreur CORS:', {
      origin: req.headers.origin,
      method: req.method,
      url: req.originalUrl,
      allowedOrigins: allowedOrigins
    });

    return res.status(403).json({
      success: false,
      error: 'CORS_POLICY_VIOLATION',
      message: 'Accès interdit par la politique CORS',
      details: {
        requestedOrigin: req.headers.origin,
        allowedOrigins: allowedOrigins,
        environment: env
      },
      suggestion: `Ajoutez "${req.headers.origin}" à la liste des origines autorisées dans server.js`
    });
  }
  next(err);
});

/**
 * Gestion des erreurs 404
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
    environment: env
  });
});

/**
 * Middleware de gestion d'erreurs global
 */
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', {
    message: err.message,
    stack: env === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    origin: req.headers.origin
  });

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.name || 'INTERNAL_ERROR',
    message: env === 'production' && statusCode === 500
      ? 'Une erreur interne est survenue'
      : err.message,
    ...(env === 'development' ? { stack: err.stack } : {})
  });
});

/**
 * Démarrage du serveur
 */
const startServer = async () => {
  try {
    // Initialiser la base de données
    try {
      const { initializeDatabase } = require('./config/database');
      const dbConnected = await initializeDatabase();

      if (!dbConnected) {
        console.warn('⚠️  Base de données non initialisée - fonctionnement limité');
      } else {
        console.log('✅ Base de données initialisée');
      }
    } catch (dbError) {
      console.warn('⚠️  Échec initialisation base de données:', dbError.message);
    }

    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 SERVEUR BYGAGOOS DÉMARRÉ AVEC SUCCÈS');
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environnement: ${env}`);
      console.log(`⏰ Date: ${new Date().toLocaleString()}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`🔗 Render URL: https://bygagoos-backend.onrender.com`);
      console.log('='.repeat(60));
      console.log('📋 ORIGINES CORS AUTORISÉES:');
      allowedOrigins.forEach(origin => {
        console.log(`   ✅ ${origin}`);
      });
      console.log('='.repeat(60));
      console.log('📋 ENDPOINTS DISPONIBLES:');
      console.log(`   🏠  GET  http://localhost:${PORT}/`);
      console.log(`   🌐 GET  http://localhost:${PORT}/api/cors-test`);
      console.log(`   ❤️  GET  http://localhost:${PORT}/health`);
      console.log(`   🗄️  GET  http://localhost:${PORT}/api/test-db`);
      console.log(`   📝 POST  http://localhost:${PORT}/api/auth/register`);
      console.log(`   🔑 POST  http://localhost:${PORT}/api/auth/login`);
      console.log(`   🧪 POST  http://localhost:${PORT}/api/auth/register-test (test)`);
      console.log(`   🧪 POST  http://localhost:${PORT}/api/auth/login-test (test)`);
      console.log('='.repeat(60) + '\n');
    });

    // Gestion propre de l'arrêt
    process.on('SIGTERM', () => {
      console.log('🔻 Signal SIGTERM reçu, arrêt du serveur...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🔻 Signal SIGINT reçu (Ctrl+C), arrêt du serveur...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('💥 Erreur critique au démarrage:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
if (require.main === module) {
  startServer();
}

module.exports = app;