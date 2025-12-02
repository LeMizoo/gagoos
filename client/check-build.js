const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des fichiers de build...');

// Vérifier si le dossier dist existe
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    console.log('✅ Dossier dist trouvé');

    // Lister les fichiers
    const files = fs.readdirSync(distDir);
    console.log('📁 Fichiers dans dist/:');
    files.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
} else {
    console.log('❌ Dossier dist manquant - Lancez: npm run build');
}

// Vérifier les dépendances
console.log('\n📦 Vérification des dépendances...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('✅ package.json valide');
    console.log('📋 Scripts disponibles:', Object.keys(packageJson.scripts));
} catch (error) {
    console.log('❌ Erreur package.json:', error.message);
}