const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔧 Chargement module database SQLite...');

// Chemin de la base de données
const dbPath = path.join(__dirname, '..', 'bygagoos.db');
console.log('📁 Chemin base de données:', dbPath);

// Créer le dossier s'il n'existe pas
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Créer la connexion SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion SQLite:', err.message);
  } else {
    console.log('✅ Connecté à SQLite');

    // Activer les clés étrangères
    db.run('PRAGMA foreign_keys = ON');

    // Activer le WAL pour de meilleures performances
    db.run('PRAGMA journal_mode = WAL');
  }
});

// Fonction pour adapter SQL pour SQLite
const adaptSQLForSQLite = (sql) => {
  // Remplacer NOW() par CURRENT_TIMESTAMP
  let adaptedSql = sql.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');

  // Remplacer to_timestamp par datetime pour SQLite
  adaptedSql = adaptedSql.replace(/to_timestamp\(([^)]+)\)/gi, 'datetime($1, \'unixepoch\')');

  // Remplacer $1, $2, etc. par ? pour SQLite
  adaptedSql = adaptedSql.replace(/\$(\d+)/g, '?');

  return adaptedSql;
};

// Wrapper pour les requêtes SQL
const query = (sql, params = []) => {
  const adaptedSql = adaptSQLForSQLite(sql);

  return new Promise((resolve, reject) => {
    console.log('📝 SQL adapté:', adaptedSql.substring(0, 100) + (adaptedSql.length > 100 ? '...' : ''));
    console.log('📋 Params:', params);

    db.all(adaptedSql, params, (err, rows) => {
      if (err) {
        console.error('❌ Erreur SQL:', err.message);
        reject(err);
      } else {
        resolve({ rows });
      }
    });
  });
};

// Version avec timeout (compatible avec le code existant)
const queryWithTimeout = async (sql, params, timeout = 5000) => {
  return query(sql, params);
};

// Fonction d'initialisation
const initializeDatabase = async () => {
  try {
    console.log('🗄️  Initialisation de la base de données SQLite...');

    // Créer la table utilisateurs
    await query(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prenom TEXT NOT NULL,
        nom TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'salarie',
        departement TEXT DEFAULT 'Production',
        phone TEXT,
        is_active BOOLEAN DEFAULT 1,
        last_login TIMESTAMP,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table utilisateurs créée/vérifiée');

    // Vérifier si l'admin existe
    const adminCheck = await query(
      "SELECT id FROM utilisateurs WHERE email = 'admin@gagoos.com'"
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);

      await query(`
        INSERT INTO utilisateurs (prenom, nom, email, password, role, departement)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Admin', 'Gagoos', 'admin@gagoos.com', hashedPassword, 'admin', 'Administration']);

      console.log('✅ Utilisateur admin créé: admin@gagoos.com / password');
    } else {
      console.log('✅ Utilisateur admin existe déjà');
    }

    console.log('🎉 Base de données initialisée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur initialisation base de données:', error);
    return false;
  }
};

// Export pour compatibilité avec le code existant
const pool = {
  query: query,
  end: (callback) => {
    db.close(callback);
  }
};

// Exports
module.exports = {
  pool,
  query,
  queryWithTimeout,
  initializeDatabase
};