const { pool } = require('./config/database');

async function createEquipesTable() {
    try {
        console.log('🏗️  Vérification/création table equipe_production...');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS equipe_production (
        id SERIAL PRIMARY KEY,
        nom_equipe VARCHAR(100) NOT NULL UNIQUE,
        poste VARCHAR(100) NOT NULL,
        nombre_membres INTEGER DEFAULT 1,
        responsable VARCHAR(100),
        statut VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✅ Table equipe_production prête');

        // Vérifier si des données existent
        const countResult = await pool.query('SELECT COUNT(*) FROM equipe_production');
        const count = parseInt(countResult.rows[0].count);

        if (count === 0) {
            console.log('📝 Insertion données par défaut...');

            await pool.query(`
        INSERT INTO equipe_production (nom_equipe, poste, nombre_membres, responsable, statut) 
        VALUES 
          ('Équipe Alpha', 'Sérigraphie', 4, 'Jean Dupont', 'active'),
          ('Équipe Beta', 'Confection', 3, 'Marie Martin', 'active'), 
          ('Équipe Gamma', 'Qualité', 2, 'Pierre Durand', 'active'),
          ('Équipe Delta', 'Emballage', 2, 'Sophie Lambert', 'active')
      `);

            console.log('✅ 4 équipes par défaut créées');
        } else {
            console.log(`📊 ${count} équipes existent déjà`);
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        pool.end();
    }
}

// Exécuter seulement si appelé directement
if (require.main === module) {
    createEquipesTable();
}

module.exports = { createEquipesTable };