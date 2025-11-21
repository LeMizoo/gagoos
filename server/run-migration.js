const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🚀 Début de la migration...');

        // Lire et exécuter le fichier SQL
        const fs = require('fs');
        const sql = fs.readFileSync('./server/migration_schema_optimise.sql', 'utf8');

        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');

        console.log('✅ Migration terminée avec succès !');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de la migration:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();