const { pool, queryWithTimeout } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  /**
   * Créer un nouvel utilisateur (SIMPLIFIÉ POUR SQLITE)
   */
  static async create(userData) {
    const {
      prenom,
      nom,
      email,
      password,
      role = 'salarie',
      departement = 'Production',
      phone = null,
      is_active = true
    } = userData;

    console.log('📝 Tentative création utilisateur:', { prenom, nom, email, role });

    // Vérifier si l'utilisateur existe déjà
    const existing = await pool.query(
      'SELECT id FROM utilisateurs WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO utilisateurs (
        prenom, nom, email, password, role, departement, 
        phone, is_active, created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING 
        id, prenom, nom, email, role, departement, 
        phone, is_active, created_at
    `;

    try {
      const result = await queryWithTimeout(query, [
        prenom.trim(),
        nom.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        departement,
        phone,
        is_active
      ], 5000);

      console.log('✅ Utilisateur créé:', result.rows[0].id);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur création utilisateur:', error);
      throw error;
    }
  }

  /**
   * Trouver par email
   */
  static async findByEmail(email, includePassword = false) {
    console.log('🔍 Recherche utilisateur:', email);

    const fields = includePassword
      ? '*'
      : 'id, prenom, nom, email, role, departement, phone, is_active, last_login, created_at';

    const queryText = `
      SELECT ${fields} 
      FROM utilisateurs 
      WHERE email = ?
    `;

    try {
      const result = await queryWithTimeout(queryText, [email.toLowerCase()], 3000);
      const user = result.rows[0] || null;
      console.log('🔍 Utilisateur trouvé:', user ? 'oui' : 'non');
      return user;
    } catch (error) {
      console.error('❌ Erreur recherche par email:', error);
      throw error;
    }
  }

  /**
   * Trouver par ID
   */
  static async findById(id, includePassword = false) {
    const fields = includePassword
      ? '*'
      : 'id, prenom, nom, email, role, departement, phone, is_active, last_login, created_at';

    const queryText = `
      SELECT ${fields}
      FROM utilisateurs
      WHERE id = ?
    `;

    try {
      const result = await queryWithTimeout(queryText, [id], 3000);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Erreur recherche par ID:', error);
      throw error;
    }
  }

  /**
   * Vérifier si email existe
   */
  static async emailExists(email) {
    try {
      const result = await queryWithTimeout(
        'SELECT 1 FROM utilisateurs WHERE email = ? LIMIT 1',
        [email.toLowerCase()],
        2000
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('❌ Erreur vérification email:', error);
      return false;
    }
  }

  /**
   * Comparer mot de passe
   */
  static async comparePassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) return false;

    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('❌ Erreur comparaison mot de passe:', error);
      return false;
    }
  }

  /**
   * Mettre à jour dernière connexion (ADAPTÉ POUR SQLITE)
   */
  static async updateLastLogin(userId) {
    const queryText = `
      UPDATE utilisateurs 
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
      RETURNING id, last_login
    `;

    try {
      const result = await queryWithTimeout(queryText, [userId], 3000);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur mise à jour last_login:', error.message);
      throw error;
    }
  }

  /**
   * Changer mot de passe (SIMPLIFIÉ)
   */
  static async changePassword(userId, oldPassword, newPassword) {
    // Récupérer l'utilisateur avec mot de passe
    const user = await this.findById(userId, true);
    if (!user) throw new Error('Utilisateur non trouvé');

    // Vérifier l'ancien mot de passe
    const isValid = await this.comparePassword(oldPassword, user.password);
    if (!isValid) throw new Error('Ancien mot de passe incorrect');

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour
    const queryText = `
      UPDATE utilisateurs 
      SET password = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
      RETURNING id, email
    `;

    try {
      const result = await queryWithTimeout(queryText, [hashedPassword, userId], 3000);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour profil
   */
  static async updateProfile(userId, updates) {
    const allowedFields = ['prenom', 'nom', 'phone', 'departement'];
    const updateFields = [];
    const values = [];

    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field) && value !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const queryText = `
      UPDATE utilisateurs 
      SET ${updateFields.join(', ')}
      WHERE id = ?
      RETURNING id, prenom, nom, email, phone, role, departement, created_at, updated_at
    `;

    try {
      const result = await queryWithTimeout(queryText, values, 3000);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      throw error;
    }
  }

  /**
   * Formater les données utilisateur
   */
  static format(user) {
    if (!user) return null;

    const { password, reset_token, reset_token_expiry, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;