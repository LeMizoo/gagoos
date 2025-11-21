const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Configuration Helmet pour le développement
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ByGagoos API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
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

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ByGagoos Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Route de test de la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    const result = await db.query('SELECT NOW() as time, version() as version');

    res.json({
      database: 'Connected ✅',
      time: result.rows[0].time,
      version: result.rows[0].version
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ✅ Import des routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/test-db',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/auth/verify'
    ]
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n✨ ======================================');
  console.log('🚀 ByGagoos Server started successfully!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log('✨ ======================================\n');

  console.log('📋 Available routes:');
  console.log(`   🌐 http://localhost:${PORT}/`);
  console.log(`   ❤️  http://localhost:${PORT}/api/health`);
  console.log(`   🗄️  http://localhost:${PORT}/api/test-db`);
  console.log('\n🔐 Authentication routes:');
  console.log(`   📝 POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   🔑 POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   👤 GET  http://localhost:${PORT}/api/auth/profile`);
  console.log(`   ✅ GET  http://localhost:${PORT}/api/auth/verify`);
});