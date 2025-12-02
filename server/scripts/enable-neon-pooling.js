const axios = require('axios');

const API_KEY = 'napi_wm0wj0ll5enwtvu5aslq64ooxp17hcd4eod1ggf85kplf8wo6oe3w9r13boca6l1';
const PROJECT_ID = 'ancient-frog-80904941';

async function enablePooling() {
    console.log('🔧 Activation du Connection Pooling...');
    console.log('Project ID:', PROJECT_ID);

    try {
        // Étape 1: Récupérer les détails du projet pour obtenir le branch ID
        console.log('\n1. Récupération des informations du projet...');
        const projectResponse = await axios.get(
            `https://api.neon.tech/v2/projects/${PROJECT_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            }
        );

        const project = projectResponse.data.project;
        console.log('✅ Projet:', project.name);
        console.log('   Host:', project.host);
        console.log('   Region:', project.region_id);

        // Étape 2: Créer un connection pooler
        console.log('\n2. Création du Connection Pooler...');

        // La branche par défaut est généralement "main" ou "master"
        // Nous devons d'abord récupérer les branches pour obtenir l'ID
        const branchesResponse = await axios.get(
            `https://api.neon.tech/v2/projects/${PROJECT_ID}/branches`,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            }
        );

        const branches = branchesResponse.data.branches;
        const primaryBranch = branches.find(b => b.primary) || branches[0];
        console.log('✅ Branche primaire:', primaryBranch.name);
        console.log('   Branch ID:', primaryBranch.id);

        // Étape 3: Créer le pooler pour cette branche
        const poolerResponse = await axios.post(
            `https://api.neon.tech/v2/projects/${PROJECT_ID}/connection_poolers`,
            {
                connection_pooler: {
                    branch_id: primaryBranch.id,
                    pool_mode: 'transaction',
                    database_name: 'neondb',
                    user_name: 'neondb_owner'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Connection Pooler créé !');
        console.log('   Status:', poolerResponse.data.connection_pooler.status);
        console.log('   Pool mode:', poolerResponse.data.connection_pooler.pool_mode);

        // Étape 4: Générer l'URL avec pooling
        const poolerHost = poolerResponse.data.connection_pooler.host;
        console.log('\n3. Génération de l\'URL avec pooling...');
        console.log('   Pooler host:', poolerHost);

        const databaseUrl = `postgresql://neondb_owner:npg_y1iPFnCI5UKM@${poolerHost}:5432/neondb?sslmode=require`;

        console.log('\n🎉 POOLING ACTIVÉ AVEC SUCCÈS !');
        console.log('\n📝 Ajoutez cette ligne à votre fichier .env :');
        console.log('='.repeat(70));
        console.log(`DATABASE_URL=${databaseUrl}`);
        console.log('='.repeat(70));

        // Sauvegarder dans un fichier
        const fs = require('fs');
        fs.writeFileSync('pooling-activated.txt',
            `# Connection Pooling activé le ${new Date().toISOString()}\n` +
            `DATABASE_URL=${databaseUrl}\n\n` +
            `# Pour votre fichier .env\n`
        );

        console.log('\n💾 URL sauvegardée dans: pooling-activated.txt');
        console.log('\n🚀 Prochaines étapes:');
        console.log('   1. Copiez la ligne DATABASE_URL ci-dessus');
        console.log('   2. Ajoutez-la à votre fichier server/.env');
        console.log('   3. Testez: node test-connection-fixed.js');
        console.log('   4. Démarrez: npm start');

    } catch (error) {
        console.error('\n❌ Erreur:', error.response ? error.response.data : error.message);

        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }

        // Vérifier si le pooler existe déjà
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('\n💡 Le Connection Pooler existe peut-être déjà.');
            console.log('Essayez cette URL:');
            console.log('DATABASE_URL=postgresql://neondb_owner:npg_y1iPFnCI5UKM@ep-wispy-hello-123456-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require');
        }
    }
}

// Exécuter
enablePooling().catch(console.error);