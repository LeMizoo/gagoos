const fs = require('fs');
const path = require('path');

console.log('🔧 DÉBUT DE LA RÉPARATION BYGAGOOS...\n');

// 1. CORRECTION DU FICHIER VITE CONFIG
const viteConfigPath = path.join(__dirname, 'client', 'vite.config.js');
console.log('📁 Correction de Vite config...');

const viteConfigContent = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
`;

fs.writeFileSync(viteConfigPath, viteConfigContent.trim());
console.log('✅ Vite config corrigé');

// 2. CORRECTION DU SERVEUR PRINCIPAL
const serverPath = path.join(__dirname, 'server', 'server.js');
console.log('📁 Correction du serveur principal...');

const serverContent = `
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS COMPLET
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur ByGagoos opérationnel',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    const result = await pool.query('SELECT NOW() as time');
    res.json({ 
      database: 'Connecté', 
      time: result.rows[0].time 
    });
  } catch (error) {
    res.status(500).json({ 
      database: 'Erreur', 
      error: error.message 
    });
  }
});

// Import des routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/production', require('./routes/production'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/upload', require('./routes/upload'));

// Route fallback
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Route API non trouvée',
    path: req.originalUrl 
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('🚀 Serveur ByGagoos démarré !');
  console.log('📍 Port:', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('📊 Base de données:', process.env.DB_NAME + '@' + process.env.DB_HOST);
  console.log('\\\\n📡 Endpoints API:');
  console.log('   ✅ Authentification: http://localhost:' + PORT + '/api/auth');
  console.log('   ✅ Tableau de bord: http://localhost:' + PORT + '/api/dashboard');
  console.log('   ✅ Commandes: http://localhost:' + PORT + '/api/commandes');
  console.log('   ✅ Production: http://localhost:' + PORT + '/api/production');
  console.log('\\\\n⚠️  Frontend: http://localhost:5173');
  console.log('🔍 Tests:');
  console.log('   📍 API Health: http://localhost:' + PORT + '/api/health');
  console.log('   📍 Test DB: http://localhost:' + PORT + '/api/test-db');
});
`;

fs.writeFileSync(serverPath, serverContent.trim());
console.log('✅ Serveur principal corrigé');

// 3. CRÉATION D'UNE ROUTE DASHBOARD SIMPLIFIÉE
const dashboardPath = path.join(__dirname, 'server', 'routes', 'dashboard.js');
console.log('📁 Création route dashboard simplifiée...');

const dashboardContent = `
const express = require('express');
const router = express.Router();

// 🔹 STATISTIQUES SIMPLIFIÉES
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Stats dashboard appelées');
    
    // Données de démonstration
    const stats = {
      total_commandes: 24,
      en_attente: 6,
      validees: 8,
      en_production: 7,
      terminees: 3,
      chiffre_affaires: 3425000,
      total_produit: 890,
      personnel_actif: 12,
      taux_remplissage: 82,
      commandes_recentes: [
        {
          id: 1,
          client: "Boutique Élégance",
          produit: "T-shirt Barkoay Premium",
          quantite: 75,
          prix_total_ariary: 187500,
          statut: "en_production",
          date_creation: new Date().toISOString()
        },
        {
          id: 2,
          client: "Magasin Urban",
          produit: "Sac Fosa Cuir",
          quantite: 30,
          prix_total_ariary: 450000,
          statut: "validée", 
          date_creation: new Date(Date.now() - 86400000).toISOString()
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

// 🔹 COMMANDES SIMPLIFIÉES
router.get('/commandes', async (req, res) => {
  try {
    console.log('📋 Commandes dashboard appelées');
    
    const commandes = [
      {
        id: 1,
        client: "Boutique Élégance",
        produit: "T-shirt Barkoay Premium",
        quantite: 75,
        couleur_tissus: "Bleu marine",
        prix_total_ariary: 187500,
        statut: "en_production",
        date_creation: "2025-01-16T08:00:00Z",
        equipe_assigned: "Équipe Alpha",
        validateur: "Jean Dupont"
      },
      {
        id: 2,
        client: "Magasin Urban",
        produit: "Sac Fosa Cuir",
        quantite: 30,
        couleur_tissus: "Noir",
        prix_total_ariary: 450000,
        statut: "validée",
        date_creation: "2025-01-15T10:30:00Z",
        equipe_assigned: null,
        validateur: "Marie Martin"
      },
      {
        id: 3,
        client: "Style Madagascar",
        produit: "Chemise Traditionnelle",
        quantite: 45,
        couleur_tissus: "Rouge",
        prix_total_ariary: 337500,
        statut: "en_attente",
        date_creation: "2025-01-14T14:15:00Z",
        equipe_assigned: null,
        validateur: null
      }
    ];
    
    res.json(commandes);
  } catch (error) {
    console.error('Erreur commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔹 ACTIVITÉ RÉCENTE
router.get('/activity', async (req, res) => {
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
      },
      {
        id: 3,
        type: 'validation',
        description: 'Commande #789 validée',
        user: 'Sophie Lambert',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
`;

fs.writeFileSync(dashboardPath, dashboardContent.trim());
console.log('✅ Route dashboard créée');

// 4. CRÉATION D'UN FICHIER ENVIRONNEMENT DE SECOURS
const envPath = path.join(__dirname, 'server', '.env');
console.log('📁 Vérification fichier .env...');

if (!fs.existsSync(envPath)) {
  const envContent = `
# Configuration Serveur
PORT=5000
NODE_ENV=development
JWT_SECRET=bygagoos_super_secret_key_2025_change_in_production

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bygagoos
DB_USER=postgres
DB_PASSWORD=password

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
`;

  fs.writeFileSync(envPath, envContent.trim());
  console.log('✅ Fichier .env créé');
} else {
  console.log('✅ Fichier .env existe déjà');
}

// 5. CRÉATION D'UN SCRIPT DE TEST
const testScriptPath = path.join(__dirname, 'TEST_REPARATION.js');
console.log('📁 Création script de test...');

const testScriptContent = `
const http = require('http');

console.log('🧪 TEST DE RÉPARATION BYGAGOOS...\\\\n');

// Test des endpoints
const endpoints = [
  'http://localhost:5000/api/health',
  'http://localhost:5000/api/dashboard/stats',
  'http://localhost:5000/api/dashboard/commandes',
  'http://localhost:5000/api/test-db'
];

function testEndpoint(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(url, (res) => {
      const duration = Date.now() - start;
      if (res.statusCode === 200) {
        console.log(\`✅ \${url} - \${res.statusCode} (\${duration}ms)\`);
      } else {
        console.log(\`❌ \${url} - \${res.statusCode} (\${duration}ms)\`);
      }
      resolve();
    }).on('error', (err) => {
      console.log(\`❌ \${url} - ERREUR: \${err.message}\`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🔍 Test des endpoints...\\\\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\\\\n🎯 INSTRUCTIONS:');
  console.log('1. Backend: cd server && npm run dev');
  console.log('2. Frontend: cd client && npm run dev');
  console.log('3. Ouvrez: http://localhost:5173');
  console.log('\\\\n📞 Si problèmes:');
  console.log('- Vérifiez que PostgreSQL tourne');
  console.log('- Vérifiez les ports 5000 et 5173');
  console.log('- Consultez les logs des consoles');
}

runTests();
`;

fs.writeFileSync(testScriptPath, testScriptContent.trim());
console.log('✅ Script de test créé');

console.log('\\\\n🎉 RÉPARATION TERMINÉE !');
console.log('\\\\n📋 PROCÉDURE DE LANCEMENT:');
console.log('1. 📂 Ouvrez deux terminaux');
console.log('2. 🖥️  Terminal 1 - Backend:');
console.log('   cd server && npm install && npm run dev');
console.log('3. 🎨 Terminal 2 - Frontend:');
console.log('   cd client && npm install && npm run dev');
console.log('4. 🌐 Ouvrez: http://localhost:5173');
console.log('\\\\n🔍 Pour tester:');
console.log('   node TEST_REPARATION.js');
console.log('\\\\n🚨 VÉRIFIEZ:');
console.log('- PostgreSQL doit être démarré');
console.log('- Les ports 5000 et 5173 doivent être libres');