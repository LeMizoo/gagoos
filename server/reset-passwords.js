const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function resetPasswords() {
    try {
        console.log('🔄 Réinitialisation des mots de passe...');

        const hashedPassword = await bcrypt.hash('password', 10);
        console.log('🔑 Hash généré:', hashedPassword);

        const users = [
            'admin@bygagoos.mg',
            'commercial@bygagoos.mg',
            'production@bygagoos.mg',
            'magasinier@bygagoos.mg'
        ];

        for (const email of users) {
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE email = $2 RETURNING username, email',
                [hashedPassword, email]
            );
            console.log(`✅ ${email} -> password: password`);
        }

        console.log('\n🎉 Tous les mots de passe ont été réinitialisés!');
        console.log('🔑 Utilisez "password" pour tous les comptes');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        pool.end();
    }
}

resetPasswords();