const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function createTestUser() {
  try {
    const password = 'ByGagoos2025!';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, role`,
      ['tovoniaina.rahendrison@gmail.com', hashedPassword, 'Tovoniaina', 'Rahendrison', 'admin']
    );

    console.log('✅ Utilisateur de test créé:', result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error);
  }
}

createTestUser();