const { Pool } = require('pg');

// Charger la configuration
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🚀 Début de la migration sécurisée...');

        // SCRIPT SQL COMPLET ET SÉCURISÉ
        const migrationSQL = `
      -- === MIGRATION SÉCURISÉE BYGAGOOS ===
      
      -- 1. SAUVEGARDE (au cas où)
      CREATE TABLE IF NOT EXISTS _backup_users AS SELECT * FROM users;
      CREATE TABLE IF NOT EXISTS _backup_demands AS SELECT * FROM demands;
      
      -- 2. AJOUT DES COLONNES MANQUANTES À USERS
      DO $$ 
      BEGIN
        -- Colonne first_name
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='first_name') THEN
            ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
        END IF;
        
        -- Colonne last_name  
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='last_name') THEN
            ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
        END IF;
        
        -- Colonne role
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='role') THEN
            ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        END IF;
        
        -- Colonne is_approved
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='is_approved') THEN
            ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;

      -- 3. METTRE À JOUR LES VALEURS PAR DÉFAUT
      UPDATE users SET 
        first_name = COALESCE(first_name, 'Prénom'),
        last_name = COALESCE(last_name, 'Nom'),
        role = COALESCE(role, 'user'),
        is_approved = COALESCE(is_approved, TRUE)
      WHERE first_name IS NULL OR last_name IS NULL;

      -- 4. RENDRE LES COLONNES OBLIGATOIRES
      ALTER TABLE users 
      ALTER COLUMN first_name SET NOT NULL,
      ALTER COLUMN last_name SET NOT NULL;

      -- 5. SUPPRIMER ET RECRÉER LA CONTRAINTE DE ROLE
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'gerante', 'user'));

      -- 6. AJOUTER LES COLONNES MANQUANTES À DEMANDS
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='demands' AND column_name='status') THEN
            ALTER TABLE demands ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='demands' AND column_name='priority') THEN
            ALTER TABLE demands ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='demands' AND column_name='category_id') THEN
            ALTER TABLE demands ADD COLUMN category_id INTEGER;
        END IF;
      END $$;

      -- 7. CONTRAINTES POUR DEMANDS
      ALTER TABLE demands DROP CONSTRAINT IF EXISTS demands_status_check;
      ALTER TABLE demands DROP CONSTRAINT IF EXISTS demands_priority_check;
      
      ALTER TABLE demands
      ADD CONSTRAINT demands_status_check 
      CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      ADD CONSTRAINT demands_priority_check 
      CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

      -- 8. CRÉATION TABLE CATEGORIES
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- 9. INSERTION DES CATÉGORIES
      INSERT INTO categories (name, description) VALUES
      ('Plomberie', 'Réparations et installations de plomberie'),
      ('Électricité', 'Travaux électriques et dépannage'),
      ('Maçonnerie', 'Travaux de maçonnerie et rénovation'),
      ('Menuiserie', 'Travaux de bois et menuiserie'),
      ('Peinture', 'Peinture intérieure et extérieure'),
      ('Nettoyage', 'Services de nettoyage professionnel'),
      ('Jardinage', 'Entretien de jardins et espaces verts')
      ON CONFLICT (name) DO NOTHING;

      -- 10. CRÉATION D'UN ADMIN SI NÉCESSAIRE
      INSERT INTO users (email, password, first_name, last_name, role, is_approved)
      SELECT 'admin@bygagoos.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', 'admin', TRUE
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@bygagoos.com');

      -- 11. METTRE À JOUR LES STATUTS EXISTANTS
      UPDATE demands SET 
        status = COALESCE(status, 'pending'),
        priority = COALESCE(priority, 'medium')
      WHERE status IS NULL OR priority IS NULL;
    `;

        console.log('📝 Exécution des requêtes SQL...');
        await client.query('BEGIN');
        await client.query(migrationSQL);
        await client.query('COMMIT');

        console.log('✅ Migration terminée avec succès !');

        // VÉRIFICATION FINALE
        console.log('🔍 Vérification finale...');

        const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

        console.log('👥 Colonnes de la table users:');
        usersColumns.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();