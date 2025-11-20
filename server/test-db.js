const { testConnection } = require('./config/database');

async function runTests() {
  console.log('🧪 TEST COMPLET BYGAGOOS DATABASE\n');
  
  try {
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Échec de la connexion à la base de données');
    }
    
    // Test des tables
    const { pool } = require('./config/database');
    
    console.log('📊 Vérification des tables...');
    const tables = ['users', 'commandes', 'type_commandes', 'salaires_horaires', 'stock_materiaux'];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ✅ ${table}: ${result.rows[0].count} enregistrements`);
      } catch (error) {
        console.log(`   ❌ ${table}: Table non trouvée`);
      }
    }
    
    // Test des données utilisateur
    console.log('\n👥 Vérification des utilisateurs...');
    const users = await pool.query('SELECT username, email, role FROM users WHERE is_active = true');
    console.log(`   📋 ${users.rows.length} utilisateurs actifs trouvés:`);
    users.rows.forEach(user => {
      console.log(`      👤 ${user.username} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS!');
    console.log('🚀 Le serveur est prêt à être démarré avec: npm run dev');
    
  } catch (error) {
    console.error('\n💥 TESTS ÉCHOUÉS:', error.message);
    console.log('\n🔍 SOLUTIONS:');
    console.log('   1. Vérifiez que PostgreSQL est démarré');
    console.log('   2. Vérifiez le mot de passe dans .env');
    console.log('   3. Exécutez: npm run init-db');
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runTests();