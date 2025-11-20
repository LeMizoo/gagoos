const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Créer un nouvel utilisateur avec rôle étendu
  static async create({ prenom, nom, email, password, role = 'salarie', departement = 'Production' }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO users (prenom, nom, email, password, role, departement) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, prenom, nom, email, role, departement, created_at
    `;

    const result = await pool.query(query, [prenom, nom, email, hashedPassword, role, departement]);
    return result.rows[0];
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const query = 'SELECT id, prenom, nom, email, role, departement, created_at FROM users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Vérifier si un email existe déjà
  static async emailExists(email) {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }

  // Comparer les mots de passe
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Mettre à jour la dernière connexion
  static async updateLastLogin(userId) {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
    await pool.query(query, [userId]);
  }

  // Obtenir les données utilisateur sécurisées (sans mot de passe)
  static toSafeObject(user) {
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Trouver tous les utilisateurs par rôle
  static async findByRole(role) {
    const query = 'SELECT id, prenom, nom, email, role, departement FROM users WHERE role = $1 AND is_active = true';
    const result = await pool.query(query, [role]);
    return result.rows;
  }
}

module.exports = User;