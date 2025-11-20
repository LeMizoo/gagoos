const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bygagoos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'ByGagoos2025!',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL:', err);
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Test connexion DB réussie');
    console.log('   📅 Heure serveur:', result.rows[0].current_time);
    console.log('   🗄️  Version PostgreSQL:', result.rows[0].postgres_version.split(',')[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Test connexion DB échoué:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };