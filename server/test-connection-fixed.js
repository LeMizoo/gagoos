const { Pool } = require('pg');

// Charger le .env manuellement si nécessaire
require('dotenv').config({ path: '.env.production' });

console.log('🔍 Test de connexion à la base de données...');

// Afficher partiellement l'URL pour vérification (sans le mot de passe)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:(.*)@/, ':****@');
    console.log('📋 DATABASE_URL:', maskedUrl);
} else {
    console.log('❌ DATABASE_URL: Non trouvé');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Nécessaire pour Neon
});

async function testConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Connexion à la base de données réussie!');

        // Test des tables existantes
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('📊 Tables existantes:');
        tables.rows.forEach(row => console.log('   - ' + row.table_name));

        client.release();
        await pool.end();
        console.log('🎉 Test terminé avec succès!');

    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
        if (client) client.release();
        await pool.end();
        process.exit(1);
    }
}

testConnection();