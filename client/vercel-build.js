const { execSync } = require('child_process');

console.log('🔨 Installation des dépendances de build...');

try {
    // Installer Vite et les plugins nécessaires
    execSync('npm install vite@^5.0.0 @vitejs/plugin-react@^4.2.0 --no-save', { stdio: 'inherit' });

    console.log('📦 Construction de l\'application...');
    execSync('npx vite build', { stdio: 'inherit' });

    console.log('✅ Build réussi !');
} catch (error) {
    console.error('❌ Erreur lors du build:', error);
    process.exit(1);
}