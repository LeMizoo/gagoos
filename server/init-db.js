const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // On se connecte d'abord à la DB par défaut
  password: process.env.DB_PASSWORD || 'votre_mot_de_passe',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(config);

async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connecté à PostgreSQL');

    // Créer la base de données
    await client.query('CREATE DATABASE bygagoos');
    console.log('✅ Base de données "bygagoos" créée');

  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️  La base de données "bygagoos" existe déjà');
    } else {
      console.error('❌ Erreur création DB:', error.message);
    }
  } finally {
    if (client) client.release();
  }

  // Maintenant se connecter à la nouvelle base
  const dbConfig = {
    ...config,
    database: 'bygagoos'
  };
  
  const dbPool = new Pool(dbConfig);
  const dbClient = await dbPool.connect();

  try {
    // Créer la table users
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "users" créée');

    // Créer les index
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
    console.log('✅ Index créés');

    console.log('🎉 Base de données initialisée avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    dbClient.release();
    await dbPool.end();
    await pool.end();
  }
}

initializeDatabase();