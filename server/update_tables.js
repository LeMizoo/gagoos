const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function updateTables() {
    const client = await pool.connect();
    try {
        console.log('🚀 Mise à jour de la structure de la base de données...');
        await client.query('BEGIN');

        // Ajouter les colonnes manquantes pour la synchronisation Commandes ↔ Production
        const alterTables = [
            `ALTER TABLE commandes 
             ADD COLUMN IF NOT EXISTS statut_production VARCHAR(50) DEFAULT 'en_attente',
             ADD COLUMN IF NOT EXISTS date_validation_production TIMESTAMP,
             ADD COLUMN IF NOT EXISTS equipe_assignee_id INTEGER REFERENCES equipe_production(id)`,

            `ALTER TABLE equipe_production 
             ADD COLUMN IF NOT EXISTS statut_production VARCHAR(50) DEFAULT 'en_attente',
             ADD COLUMN IF NOT EXISTS type_personnel_id INTEGER REFERENCES salaires_horaires(id),
             ADD COLUMN IF NOT EXISTS salaire_total_ariary DECIMAL(12,2) DEFAULT 0`
        ];

        for (const alterSql of alterTables) {
            await client.query(alterSql);
            console.log('✅ Colonnes ajoutées aux tables');
        }

        // Créer les index pour les performances
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_commandes_statut_production ON commandes(statut_production)',
            'CREATE INDEX IF NOT EXISTS idx_commandes_date_commande ON commandes(date_commande)',
            'CREATE INDEX IF NOT EXISTS idx_equipe_commande_id ON equipe_production(commande_id)',
            'CREATE INDEX IF NOT EXISTS idx_equipe_statut_production ON equipe_production(statut_production)'
        ];

        for (const indexSql of indexes) {
            await client.query(indexSql);
            console.log('✅ Index créé');
        }

        await client.query('COMMIT');
        console.log('🎉 Mise à jour des tables terminée avec succès!');
        console.log('🔄 Synchronisation Commandes ↔ Production activée!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
        client.release();
        await pool.end();
        process.exit();
    }
}

updateTables();