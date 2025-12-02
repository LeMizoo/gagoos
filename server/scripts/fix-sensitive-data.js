#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔧 CORRECTION DES DONNÉES SENSIBLES DANS LES FICHIERS\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fichiers à vérifier et corriger
const filesToFix = [
    {
        path: path.join(__dirname, '..', 'config', 'database.js'),
        patterns: [
            { search: /password: ['"].*?['"]/g, replace: "password: process.env.DB_PASSWORD" },
            { search: /user: ['"]postgres['"]/g, replace: "user: process.env.DB_USER" },
            { search: /'ByGagoos2025!'/g, replace: "process.env.DB_PASSWORD" }
        ]
    },
    {
        path: path.join(__dirname, '..', 'models', 'User.js'),
        patterns: [
            { search: /password: ['"].*?['"]/g, replace: "password: process.env.DB_PASSWORD" }
        ]
    },
    {
        path: path.join(__dirname, '..', 'routes', 'auth.js'),
        patterns: [
            { search: /['"]ByGagoos2025!['"]/g, replace: "process.env.DB_PASSWORD" }
        ]
    }
];

async function fixFiles() {
    console.log('🔍 Recherche de données sensibles...\n');

    let fixedFiles = 0;

    for (const fileInfo of filesToFix) {
        if (fs.existsSync(fileInfo.path)) {
            console.log(`📄 Vérification de: ${path.relative(process.cwd(), fileInfo.path)}`);

            let content = fs.readFileSync(fileInfo.path, 'utf8');
            let originalContent = content;
            let changes = 0;

            for (const pattern of fileInfo.patterns) {
                const matches = content.match(pattern.search);
                if (matches) {
                    console.log(`   ⚠️  Trouvé: ${matches[0].substring(0, 50)}...`);
                    content = content.replace(pattern.search, pattern.replace);
                    changes++;
                }
            }

            if (changes > 0) {
                fs.writeFileSync(fileInfo.path, content, 'utf8');
                console.log(`   ✅ ${changes} correction(s) appliquée(s)`);
                fixedFiles++;

                // Sauvegarder l'original
                const backupPath = fileInfo.path + '.backup-' + Date.now();
                fs.writeFileSync(backupPath, originalContent, 'utf8');
                console.log(`   💾 Backup sauvegardé: ${backupPath}`);
            } else {
                console.log('   ✓ Aucune donnée sensible trouvée');
            }

            console.log();
        }
    }

    console.log(`📊 Résumé: ${fixedFiles} fichier(s) corrigé(s)`);

    if (fixedFiles > 0) {
        console.log('\n🎉 Correction terminée !');
        console.log('⚠️  Assurez-vous de :');
        console.log('   1. Redémarrer le serveur');
        console.log('   2. Tester les fonctionnalités d\'authentification');
        console.log('   3. Exécuter à nouveau: node scripts/security-check.js');
    }

    rl.close();
}

// Confirmation
rl.question('⚠️  Cette opération va modifier vos fichiers. Continuer ? (o/N) ', (answer) => {
    if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'oui') {
        fixFiles();
    } else {
        console.log('❌ Opération annulée.');
        rl.close();
    }
});