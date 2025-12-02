#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

console.log('🔍 VÉRIFICATION DE SÉCURITÉ BYGAGOOS\n');

const checks = {
    passed: 0,
    warnings: 0,
    critical: 0
};

function check(condition, message, level = 'info') {
    if (condition) {
        console.log(`✅ ${message}`);
        checks.passed++;
    } else {
        if (level === 'critical') {
            console.log(`❌ ${message}`);
            checks.critical++;
        } else {
            console.log(`⚠️  ${message}`);
            checks.warnings++;
        }
    }
}

async function main() {
    console.log('📋 Variables d\'environnement:');

    // Vérification des variables critiques
    const requiredVars = ['DB_PASSWORD', 'JWT_SECRET', 'NODE_ENV'];
    requiredVars.forEach(varName => {
        check(process.env[varName], `${varName} est défini`, 'critical');
    });

    // Vérification des valeurs sensibles
    check(
        process.env.DB_PASSWORD &&
        !process.env.DB_PASSWORD.includes('ByGagoos2025') &&
        !process.env.DB_PASSWORD.includes('postgres') &&
        !process.env.DB_PASSWORD.includes('password') &&
        process.env.DB_PASSWORD.length >= 12,
        'Mot de passe DB est sécurisé',
        'critical'
    );

    check(
        process.env.JWT_SECRET &&
        process.env.JWT_SECRET.length >= 32 &&
        !process.env.JWT_SECRET.includes('secret') &&
        !process.env.JWT_SECRET.includes('bygagoos'),
        'JWT_SECRET est sécurisé',
        'critical'
    );

    console.log('\n📁 Fichiers sensibles:');

    // Vérifier les fichiers avec des mots de passe en clair
    const filesToCheck = [
        'server.js',
        'config/database.js',
        'models/User.js',
        'routes/auth.js',
        'middleware/auth.js'
    ];

    const sensitivePatterns = [
        'ByGagoos2025',
        'postgres',
        'password',
        'secretkey',
        'jwtsecret'
    ];

    filesToCheck.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
            let hasSensitiveData = false;

            sensitivePatterns.forEach(pattern => {
                if (content.includes(pattern.toLowerCase())) {
                    hasSensitiveData = true;
                }
            });

            check(!hasSensitiveData, `${file} ne contient pas de données sensibles`, 'critical');
        }
    });

    console.log('\n📦 Dépendances:');

    // Vérifier package.json
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const deps = Object.keys(packageJson.dependencies || {});

        check(deps.includes('bcrypt'), 'bcrypt est installé');
        check(!deps.includes('bcryptjs'), 'bcryptjs n\'est pas installé (bon)');
        check(deps.includes('helmet'), 'helmet est installé pour la sécurité HTTP');
        check(deps.includes('express-rate-limit'), 'rate limiting est configuré');
        check(deps.includes('joi') || deps.includes('express-validator'), 'Validation est configurée');
    }

    console.log('\n🔐 Configuration SSL:');

    if (process.env.NODE_ENV === 'production') {
        check(process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            'SSL rejectUnauthorized est activé en production', 'critical');
    }

    console.log('\n🔧 Configuration application:');

    check(process.env.BCRYPT_SALT_ROUNDS >= 12,
        `Salt rounds suffisant (${process.env.BCRYPT_SALT_ROUNDS || 'non défini'})`);

    check(process.env.JWT_EXPIRES_IN && parseInt(process.env.JWT_EXPIRES_IN) <= 86400,
        `JWT expiration raisonnable (${process.env.JWT_EXPIRES_IN || 'non défini'})`);

    // Vérifier la présence de .env.example sans valeurs réelles
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    if (fs.existsSync(envExamplePath)) {
        const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
        const hasRealPasswords = exampleContent.includes('REPLACE') &&
            !exampleContent.includes('ByGagoos2025') &&
            !exampleContent.includes('postgres');
        check(hasRealPasswords, '.env.example ne contient pas de vrais mots de passe');
    }

    console.log('\n📊 RÉCAPITULATIF:');
    console.log(`✅ ${checks.passed} vérifications passées`);
    console.log(`⚠️  ${checks.warnings} avertissements`);
    console.log(`❌ ${checks.critical} erreurs critiques`);

    if (checks.critical > 0) {
        console.log('\n🚨 CORRECTIONS REQUISES IMMÉDIATEMENT:');
        console.log('1. Changez les mots de passe par défaut dans .env');
        console.log('2. Régénérez un JWT_SECRET sécurisé');
        console.log('3. Assurez-vous que bcrypt (et non bcryptjs) est installé');
        console.log('4. Vérifiez la configuration SSL en production');
        process.exit(1);
    } else if (checks.warnings > 0) {
        console.log('\n⚠️  AMÉLIORATIONS RECOMMANDÉES');
        console.log('1. Configurez des logs de sécurité');
        console.log('2. Activez le monitoring');
        console.log('3. Mettez en place un backup automatique');
        process.exit(0);
    } else {
        console.log('\n🎉 Toutes les vérifications de sécurité sont passées !');
        console.log('✅ Votre application est correctement sécurisée.');
        process.exit(0);
    }
}

// Exécuter
main().catch(error => {
    console.error('💥 Erreur lors de la vérification:', error);
    process.exit(1);
});