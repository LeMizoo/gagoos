const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Créer un nouvel utilisateur
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, created_at
    `;
    
    const result = await db.query(query, [username, email, hashedPassword]);
    return result.rows[0];
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Vérifier si un email existe déjà
  static async emailExists(email) {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows.length > 0;
  }

  // Vérifier si un username existe déjà
  static async usernameExists(username) {
    const query = 'SELECT 1 FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows.length > 0;
  }

  // Comparer les mots de passe
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;