require('dotenv').config();

console.log('🚀 Démarrage de ByGagoos Server...');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('📊 Database:', process.env.DB_NAME);
console.log('🌐 Port:', process.env.PORT);

// Vérifier les variables d'environnement critiques
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars);
  process.exit(1);
}

// Démarrer le serveur
require('./server');