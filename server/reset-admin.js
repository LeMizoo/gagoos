// server/reset-admin.js
const { pool } = require('./config/database');
const bcrypt = require('bcrypt');

async function resetAdmin() {
    try {
        console.log('🔄 Réinitialisation du compte admin...');

        // Supprimer l'admin existant
        await pool.query("DELETE FROM utilisateurs WHERE email = 'admin@gagoos.com'");
        console.log('✅ Ancien admin supprimé');

        // Recréer l'admin
        const hashedPassword = await bcrypt.hash('password', 10);

        await pool.query(`
      INSERT INTO utilisateurs (prenom, nom, email, password, role, departement)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['Admin', 'Gagoos', 'admin@gagoos.com', hashedPassword, 'admin', 'Administration']);

        console.log('✅ Nouvel admin créé');
        console.log('🔑 Email: admin@gagoos.com');
        console.log('🔑 Mot de passe: password');

        // Vérifier
        const check = await pool.query("SELECT * FROM utilisateurs WHERE email = 'admin@gagoos.com'");
        console.log('✅ Admin vérifié:', check.rows[0].email);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur réinitialisation:', error);
        process.exit(1);
    }
}

resetAdmin();