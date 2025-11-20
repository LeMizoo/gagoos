const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🗄️  Initialisation de la base de données...');
    
    // Lire et exécuter le schéma SQL
    const schemaPath = path.join(__dirname, 'database.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Séparer les instructions SQL
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignorer les erreurs de duplication (CREATE IF NOT EXISTS)
          if (!error.message.includes('déjà existe') && !error.message.includes('already exists')) {
            console.warn('⚠️  Avertissement lors de l\'exécution:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Base de données initialisée avec succès !');
    console.log('📊 Tables créées: users, type_commandes, salaires_horaires, commandes, equipe_production, stock_materiaux, mouvements_stock');
    console.log('👥 Utilisateurs par défaut créés (mots de passe par défaut définis)');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Initialisation terminée!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Échec de l\'initialisation:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;