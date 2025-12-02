const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Test de connexion à Neon PostgreSQL');
console.log('='.repeat(50));

// Afficher les variables d'environnement (masquées)
console.log('\n📋 Configuration détectée:');
console.log(`   DB_HOST: ${process.env.DB_HOST ? '✓ Défini' : '✗ Non défini'}`);
console.log(`   DB_USER: ${process.env.DB_USER ? '✓ Défini' : '✗ Non défini'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME ? '✓ Défini' : '✗ Non défini'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✓ Défini' : '✗ Non défini'}`);

if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`   URL masquée: ${maskedUrl}`);
}

async function testConnection() {
    let pool;
    let client;

    try {
        // Configuration du pool
        const config = {
            connectionString: process.env.DATABASE_URL ||
                `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 10000,
            query_timeout: 10000,
            statement_timeout: 10000
        };

        console.log('\n🔄 Tentative de connexion...');
        console.log(`   Hôte: ${process.env.DB_HOST}`);
        console.log(`   Timeout: 10 secondes`);

        pool = new Pool(config);

        // Tester la connexion avec timeout manuel
        const connectionPromise = pool.connect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout après 10 secondes')), 10000)
        );

        client = await Promise.race([connectionPromise, timeoutPromise]);

        console.log('✅ Connexion établie avec succès !');

        // Tester une requête simple
        const result = await client.query('SELECT NOW() as current_time, version() as version');

        console.log('\n📊 Informations de la base:');
        console.log(`   🕒 Heure serveur: ${result.rows[0].current_time}`);
        console.log(`   🗄️  Version PostgreSQL: ${result.rows[0].version.split(',')[0]}`);

        // Vérifier la table users
        try {
            const userCount = await client.query('SELECT COUNT(*) as count FROM users');
            console.log(`   👥 Nombre d'utilisateurs: ${userCount.rows[0].count}`);
        } catch (error) {
            console.log(`   ℹ️  Table 'users' non trouvée (normal si base vierge)`);
        }

        // Vérifier les tables existantes
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log(`   📁 Tables dans la base: ${tables.rows.length}`);
        if (tables.rows.length > 0) {
            console.log(`   📋 Liste: ${tables.rows.map(t => t.table_name).join(', ')}`);
        }

        return true;

    } catch (error) {
        console.error('\n❌ ERREUR DE CONNEXION:');
        console.error(`   Message: ${error.message}`);
        console.error(`   Code: ${error.code || 'N/A'}`);

        if (error.code === '28P01') {
            console.error('\n🔑 Problème d\'authentification:');
            console.error('   - Vérifiez le mot de passe dans Neon.tech');
            console.error('   - Réinitialisez le mot de passe si nécessaire');
        } else if (error.code === 'ENOTFOUND') {
            console.error('\n🌐 Problème réseau:');
            console.error('   - Vérifiez votre connexion Internet');
            console.error('   - L\'hôte peut être incorrect');
            console.error(`   - Hôte essayé: ${process.env.DB_HOST}`);
        } else if (error.code === 'ETIMEDOUT') {
            console.error('\n⏱️  Timeout de connexion:');
            console.error('   - Le serveur ne répond pas');
            console.error('   - Vérifiez le firewall/réseau');
            console.error('   - Essayez depuis un autre réseau');
        }

        return false;

    } finally {
        if (client) {
            client.release();
            console.log('\n🔌 Client libéré');
        }
        if (pool) {
            await pool.end();
            console.log('📭 Pool fermé');
        }
    }
}

// Test de ping de l'hôte (si possible)
async function testHostAvailability() {
    console.log('\n🌐 Test de disponibilité de l\'hôte...');

    return new Promise((resolve) => {
        const dns = require('dns');
        const hostname = process.env.DB_HOST;

        if (!hostname) {
            console.log('   ❌ Aucun hôte défini');
            resolve(false);
            return;
        }

        dns.lookup(hostname, (err, address) => {
            if (err) {
                console.log(`   ❌ Impossible de résoudre ${hostname}`);
                console.log(`   Erreur DNS: ${err.message}`);
                resolve(false);
            } else {
                console.log(`   ✅ Hôte résolu: ${address}`);
                resolve(true);
            }
        });
    });
}

// Exécuter les tests
async function runAllTests() {
    console.log('🚀 Début des tests de connexion\n');

    const hostAvailable = await testHostAvailability();

    if (!hostAvailable) {
        console.log('\n💥 Impossible de continuer - Hôte non disponible');
        console.log('   Vérifiez:');
        console.log('   1. Votre connexion Internet');
        console.log('   2. Le nom d\'hôte dans .env');
        console.log('   3. Les paramètres DNS/réseau');
        process.exit(1);
    }

    const dbConnected = await testConnection();

    console.log('\n' + '='.repeat(50));

    if (dbConnected) {
        console.log('🎉 Tous les tests sont PASSÉS !');
        console.log('✅ Votre base de données est accessible');
        console.log('🚀 Vous pouvez maintenant démarrer le serveur');
        process.exit(0);
    } else {
        console.log('💥 Tests ÉCHOUÉS');
        console.log('\n🔧 Solutions possibles:');
        console.log('   1. Vérifiez vos identifiants Neon.tech');
        console.log('   2. Réinitialisez le mot de passe si nécessaire');
        console.log('   3. Vérifiez votre connexion Internet/firewall');
        console.log('   4. Essayez depuis un autre réseau');
        console.log('   5. Contactez le support Neon si le problème persiste');
        process.exit(1);
    }
}

runAllTests().catch(error => {
    console.error('💥 Erreur inattendue:', error);
    process.exit(1);
});