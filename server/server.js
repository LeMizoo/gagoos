const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE AVEC LOGGING DÉTAILLÉ ====================

// Logging des requêtes entrantes
app.use((req, res, next) => {
  console.log('📍', new Date().toISOString(), req.method, req.url);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', req.body);
  }
  next();
});

// CORS étendu
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://bygagoos.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});
app.use('/api/', limiter);

// Middlewares standards
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ROUTES DE TEST IMMÉDIATES ====================

// Route santé
app.get('/api/health', (req, res) => {
  console.log('✅ Health check appelé');
  res.json({
    status: 'OK',
    message: 'Backend opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Route test simple
app.get('/api/test', (req, res) => {
  console.log('🧪 Test route appelée');
  res.json({
    message: 'Test réussi - Backend fonctionne',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== AUTHENTIFICATION SIMPLIFIÉE ====================

const demoUsers = {
  'gerante@bygagoos.com': {
    id: 1,
    email: 'gerante@bygagoos.com',
    nom: 'Gérante',
    prenom: 'ByGagoos',
    role: 'gerante',
    password: 'demo123'
  },
  'contremaitre@bygagoos.com': {
    id: 2,
    email: 'contremaitre@bygagoos.com',
    nom: 'Contremaître',
    prenom: 'Equipe',
    role: 'contremaitre',
    password: 'demo123'
  },
  'salarie@bygagoos.com': {
    id: 3,
    email: 'salarie@bygagoos.com',
    nom: 'Salarié',
    prenom: 'Production',
    role: 'salarie',
    password: 'demo123'
  },
  'admin@gagoos.com': {
    id: 4,
    email: 'admin@gagoos.com',
    nom: 'Admin',
    prenom: 'Système',
    role: 'admin',
    password: 'password'
  }
};

// LOGIN - Version ultra simple
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 LOGIN ATTEMPT:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    const user = demoUsers[email];

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    if (password !== user.password) {
      console.log('❌ Wrong password for:', email);
      return res.status(401).json({
        success: false,
        error: 'Mot de passe incorrect'
      });
    }

    console.log('✅ Login successful for:', email);

    // Réponse de succès
    res.json({
      success: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZ2VyYW50ZUBieWdhZ29vcy5jb20iLCJyb2xlIjoiZ2VyYW50ZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzMxNTM2MDAwfQ.demo-token-local',
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      },
      message: `Connexion réussie - ${user.prenom} ${user.nom}`
    });

  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de vérification de token
app.get('/api/auth/verify', (req, res) => {
  console.log('🔍 Token verification');
  res.json({
    valid: true,
    message: 'Token valide'
  });
});

// Route de déconnexion
app.post('/api/auth/logout', (req, res) => {
  console.log('🚪 Logout request');
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// ==================== ROUTES MÉTIER COMPLÈTES ====================

// Stock
app.get('/api/stock/dashboard', (req, res) => {
  console.log('📊 Stock dashboard appelé');
  res.json({
    totalItems: 156,
    lowStockItems: 12,
    outOfStockItems: 3,
    totalValue: 45800000,
    recentMovements: 24,
    criticalAlerts: 5
  });
});

app.get('/api/stock/categories', (req, res) => {
  console.log('📦 Stock categories appelé');
  const categories = [
    { id: 1, name: 'Tissus Coton', itemCount: 45, lowStockCount: 3 },
    { id: 2, name: 'Tissus Lin', itemCount: 28, lowStockCount: 2 },
    { id: 3, name: 'Tissus Soie', itemCount: 15, lowStockCount: 1 }
  ];
  res.json(categories);
});

app.get('/api/stock/suppliers', (req, res) => {
  console.log('🏭 Stock suppliers appelé');
  const suppliers = [
    { id: 1, name: 'Textile Madagascar', contact: '034 12 345 67', itemCount: 45 },
    { id: 2, name: 'Soie Naturelle', contact: '032 98 765 43', itemCount: 28 }
  ];
  res.json(suppliers);
});

app.get('/api/stock/items', (req, res) => {
  console.log('📋 Stock items appelé');
  const items = [
    { id: 1, name: 'Tissu Coton Blanc', category: 'Tissus Coton', currentStock: 45, minStock: 20, status: 'normal' },
    { id: 2, name: 'Tissu Soie Naturelle', category: 'Tissus Soie', currentStock: 8, minStock: 10, status: 'low' }
  ];
  res.json(items);
});

app.get('/api/stock/movements', (req, res) => {
  console.log('🔄 Stock movements appelé');
  const movements = [
    { id: 1, itemName: 'Tissu Coton Blanc', type: 'entrée', quantity: 25, date: '2024-01-15T08:30:00Z' },
    { id: 2, itemName: 'Tissu Soie Naturelle', type: 'sortie', quantity: 5, date: '2024-01-15T10:15:00Z' }
  ];
  res.json(movements);
});

app.get('/api/stock/alerts', (req, res) => {
  console.log('🚨 Stock alerts appelé');
  const alerts = [
    { id: 1, itemName: 'Fils Polyester Noir', type: 'critical', message: 'Stock critique - 3 unités restantes', currentStock: 3 }
  ];
  res.json(alerts);
});

// Production
app.get('/api/production/orders', (req, res) => {
  console.log('🏭 Production orders appelé');
  const orders = [
    { id: 1, orderNumber: 'CMD-2024-045', client: 'Boutique Soleil', status: 'en production' },
    { id: 2, orderNumber: 'CMD-2024-044', client: 'Magasin Luna', status: 'en attente' }
  ];
  res.json(orders);
});

app.get('/api/production/teams', (req, res) => {
  console.log('👥 Production teams appelé');
  const teams = [
    { id: 1, name: 'Équipe A', supervisor: 'Jean Rakoto', members: 4, activeOrders: 2 },
    { id: 2, name: 'Équipe B', supervisor: 'Marie Ravao', members: 5, activeOrders: 3 }
  ];
  res.json(teams);
});

// RH
app.get('/api/rh/employees', (req, res) => {
  console.log('👨‍💼 RH employees appelé');
  const employees = [
    { id: 1, name: 'Jean Rakoto', position: 'Contremaître', department: 'Production', status: 'actif' },
    { id: 2, name: 'Marie Ravao', position: 'Ouvrière', department: 'Production', status: 'actif' }
  ];
  res.json(employees);
});

// Comptabilité
app.get('/api/comptabilite/transactions', (req, res) => {
  console.log('💰 Comptabilité transactions appelé');
  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Vente commande #CMD-2024-043', amount: 4500000, type: 'recette' },
    { id: 2, date: '2024-01-14', description: 'Achat tissus', amount: -1250000, type: 'dépense' }
  ];
  res.json(transactions);
});

// Dashboard général
app.get('/api/dashboard/overview', (req, res) => {
  console.log('📈 Dashboard overview appelé');
  res.json({
    stats: {
      totalOrders: 156,
      pendingOrders: 23,
      completedOrders: 133,
      totalRevenue: 125800000,
      activeTeams: 6,
      productionToday: 189
    }
  });
});

// ==================== GESTION DES ERREURS ====================

// Route 404
app.use('/api/*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    available_endpoints: [
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/login',
      'GET /api/stock/dashboard',
      'GET /api/production/orders',
      'GET /api/rh/employees',
      'GET /api/comptabilite/transactions'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Server error:', error);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: error.message
  });
});

// ==================== DÉMARRAGE DU SERVEUR ====================

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(70));
  console.log('🚀 BYGAGOOS SERVER - DÉMARRÉ AVEC SUCCÈS');
  console.log('='.repeat(70));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(70));
  console.log('📋 Endpoints disponibles:');
  console.log(`   ✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`   🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`   🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log('='.repeat(70));
  console.log('👤 Comptes de test:');
  console.log('   gerante@bygagoos.com / demo123');
  console.log('   contremaitre@bygagoos.com / demo123');
  console.log('   salarie@bygagoos.com / demo123');
  console.log('   admin@gagoos.com / password');
  console.log('='.repeat(70));
});

module.exports = app;