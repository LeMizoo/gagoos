const db = require('./config/database');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Connexion DB réussie:', result.rows[0].now);
    
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Tables disponibles:', tables.rows);
  } catch (error) {
    console.error('❌ Erreur connexion DB:', error.message);
  }
}

testConnection();