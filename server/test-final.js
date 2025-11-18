require('dotenv').config();
const db = require('./config/database');

console.log('🔧 Configuration chargée :');
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_PORT:', process.env.DB_PORT);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Défini' : '✗ Manquant');
console.log('- PORT:', process.env.PORT);

async function testDB() {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('✅ Base de données accessible - Heure:', result.rows[0].current_time);
  } catch (error) {
    console.log('❌ Erreur base de données:', error.message);
  }
}

testDB();