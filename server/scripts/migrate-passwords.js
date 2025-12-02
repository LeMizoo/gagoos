#!/usr/bin/env node

const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
require('dotenv').config();

console.log('🚨 MIGRATION DES MOTS DE PASSE - URGENCE\n');

async function migrate() {
    let client;

    try {
        client = await pool.connect();

        console.log('📊 Récupération des utilisateurs...');
        const { rows: users } = await client.query('SELECT id, email, password FROM users');

        console.log(`🔍 ${users.length} utilisateurs trouvés`);

        const results = {
            migrated: 0,
            alreadySecure: 0,
            errors: 0,
            details: []
        };

        for (const user of users) {
            try {
                // Vérifier si le mot de passe est déjà haché avec bcrypt
                const isAlreadyHashed = user.password && user.password.length === 60 && user.password.startsWith('$2');

                if (isAlreadyHashed) {
                    console.log(`✓ ${user.email}: déjà sécurisé`);
                    results.alreadySecure++;
                    results.details.push({
                        email: user.email,
                        status: 'already_secure',
                        message: 'Mot de passe déjà haché'
                    });
                } else {
                    // Mot de passe en clair ou hash faible
                    console.log(`⚠️  ${user.email}: mot de passe non sécurisé (${user.password?.length || 0} chars)`);

                    // Générer un nouveau mot de passe temporaire
                    const tempPassword = `Temp${crypto.randomBytes(4).toString('hex')}!`;
                    const hashedPassword = await bcrypt.hash(tempPassword, 13);

                    // Mettre à jour
                    await client.query(
                        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
                        [hashedPassword, user.id]
                    );

                    console.log(`✅ ${user.email}: migré avec mot de passe temporaire`);
                    results.migrated++;
                    results.details.push({
                        email: user.email,
                        status: 'migrated',
                        tempPassword: tempPassword,
                        message: 'Mot de passe réinitialisé, nécessite changement'
                    });
                }
            } catch (error) {
                console.error(`❌ ${user.email}: erreur - ${error.message}`);
                results.errors++;
                results.details.push({
                    email: user.email,
                    status: 'error',
                    message: error.message
                });
            }
        }

        console.log('\n📊 RÉCAPITULATIF:');
        console.log(`✅ ${results.migrated} utilisateurs migrés`);
        console.log(`✓ ${results.alreadySecure} déjà sécurisés`);
        console.log(`❌ ${results.errors} erreurs`);

        // Générer un rapport
        const reportPath = `migration-report-${Date.now()}.json`;
        require('fs').writeFileSync(
            reportPath,
            JSON.stringify(results, null, 2)
        );

        console.log(`📄 Rapport sauvegardé dans: ${reportPath}`);

        // Avertissements
        if (results.migrated > 0) {
            console.log('\n⚠️  IMPORTANT:');
            console.log('Les utilisateurs migrés doivent réinitialiser leur mot de passe.');
            console.log('Envoyez-leur un email avec le lien de réinitialisation.');
        }

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        process.exit(1);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

// Confirmation
console.log('⚠️  ATTENTION: Cette opération va modifier les mots de passe.');
console.log('Appuyez sur Ctrl+C dans les 5 secondes pour annuler...');

setTimeout(async () => {
    await migrate();
    process.exit(0);
}, 5000);