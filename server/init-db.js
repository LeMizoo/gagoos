// server/init-db.js
const { pool } = require('./config/database');

async function initializeDatabase() {
  try {
    console.log('🗄️  Initialisation de la base de données...');

    // Créer la table utilisateurs si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id SERIAL PRIMARY KEY,
        prenom VARCHAR(50) NOT NULL,
        nom VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'salarie',
        departement VARCHAR(50) DEFAULT 'Production',
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        reset_token VARCHAR(100),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table utilisateurs créée/verifiée');

    // Créer un utilisateur admin par défaut si aucun n'existe
    const adminCheck = await pool.query(
      "SELECT id FROM utilisateurs WHERE email = 'admin@gagoos.com'"
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);

      await pool.query(`
        INSERT INTO utilisateurs (
          prenom, nom, email, password, role, departement, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
      `, ['Admin', 'Gagoos', 'admin@gagoos.com', hashedPassword, 'admin', 'Administration', true]);

      console.log('✅ Utilisateur admin créé: admin@gagoos.com / password');
    }

    console.log('🎉 Base de données initialisée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur initialisation base de données:', error);
    process.exit(1);
  }
}

initializeDatabase();