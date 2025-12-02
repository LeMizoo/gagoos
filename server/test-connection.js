// server/test-connection.js
const { Pool } = require('pg');

console.log('🔍 Test de connexion PostgreSQL...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'défini' : 'non défini');

// Test avec une configuration simple
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bygagoos',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
    try {
        console.log('Tentative de connexion...');
        const client = await pool.connect();
        console.log('✅ Connecté à PostgreSQL!');

        // Tester une requête simple
        const result = await client.query('SELECT NOW()');
        console.log('🕒 Heure serveur:', result.rows[0].now);

        // Lister les tables
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('📋 Tables disponibles:', tables.rows.map(t => t.table_name));

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur connexion:', error.message);
        console.log('\n💡 Solutions possibles:');
        console.log('1. Vérifiez que PostgreSQL est installé et démarré');
        console.log('2. Pour Windows, téléchargez PostgreSQL depuis: https://www.postgresql.org/download/windows/');
        console.log('3. Ou utilisez Docker: docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres');
        console.log('4. Créez la base: createdb bygagoos');
        process.exit(1);
    }
}

testConnection();