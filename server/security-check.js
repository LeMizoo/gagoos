// server/security-check.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🔍 VÉRIFICATION DE SÉCURITÉ BYGAGOOS\n');

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function check(condition, message, level = 'error') {
    if (condition) {
        console.log(`✅ ${message}`);
        checks.passed++;
    } else {
        if (level === 'error') {
            console.log(`❌ ${message}`);
            checks.failed++;
        } else {
            console.log(`⚠️  ${message}`);
            checks.warnings++;
        }
    }
}

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement:');
check(process.env.DB_PASSWORD !== 'ByGagoos2025!',
    'Mot de passe DB n\'est pas la valeur par défaut');
check(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
    'JWT_SECRET est défini et suffisamment long (>= 32 chars)');
check(!process.env.JWT_SECRET?.includes('bygagoos_super_secret'),
    'JWT_SECRET ne contient pas de mots clés évidents');

// Vérifier les fichiers sensibles
console.log('\n📁 Fichiers sensibles:');
const sensitiveFiles = [
    '.env',
    '.env.production',
    'server/config/database.js'
];

sensitiveFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        check(!content.includes('ByGagoos2025!'),
            `${file} ne contient pas le mot de passe par défaut`);
        check(!content.includes('postgres'),
            `${file} ne contient pas le mot de passe "postgres"`, 'warning');
    }
});

// Vérifier les dépendances
console.log('\n📦 Dépendances:');
const packageJson = require('./package.json');
const dependencies = Object.keys(packageJson.dependencies || {});
check(dependencies.includes('bcrypt'), 'bcrypt est installé');
check(!dependencies.includes('bcryptjs'), 'bcryptjs n\'est PAS installé (utilisez bcrypt)');
check(dependencies.includes('helmet'), 'helmet est installé pour la sécurité HTTP');

// Vérifier la configuration SSL
console.log('\n🔒 Configuration SSL:');
check(process.env.NODE_ENV === 'production' ?
    process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' : true,
    'SSL rejectUnauthorized est activé en production');

// Résumé
console.log('\n📊 RÉCAPITULATIF:');
console.log(`✅ ${checks.passed} vérifications passées`);
console.log(`⚠️  ${checks.warnings} avertissements`);
console.log(`❌ ${checks.failed} erreurs`);

if (checks.failed > 0) {
    console.log('\n🚨 CORRECTIONS REQUISES:');
    console.log('1. Changez immédiatement le mot de passe PostgreSQL');
    console.log('2. Régénérez le JWT_SECRET');
    console.log('3. Supprimez bcryptjs et utilisez bcrypt');
    process.exit(1);
} else if (checks.warnings > 0) {
    console.log('\n⚠️  AMÉLIORATIONS RECOMMANDÉES');
    process.exit(0);
} else {
    console.log('\n🎉 Toutes les vérifications de sécurité sont passées !');
    process.exit(0);
}