const { pool } = require('./config/database');

async function createPersonnelTables() {
    try {
        console.log('🏗️  Création des tables de gestion du personnel...');

        // Table des types de personnel
        await pool.query(`
      CREATE TABLE IF NOT EXISTS types_personnel (
        id SERIAL PRIMARY KEY,
        nom_type VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        taux_vaccation_jour DECIMAL(10,2) NOT NULL,
        taux_vaccation_nuit DECIMAL(10,2) NOT NULL,
        prime_risque DECIMAL(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Table principale du personnel
        await pool.query(`
      CREATE TABLE IF NOT EXISTS personnel (
        id SERIAL PRIMARY KEY,
        matricule VARCHAR(50) UNIQUE NOT NULL,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        date_naissance DATE,
        date_embauche DATE NOT NULL,
        type_personnel_id INTEGER REFERENCES types_personnel(id),
        
        -- Coordonnées
        adresse TEXT,
        telephone VARCHAR(20),
        email VARCHAR(255),
        
        -- Personne à contacter en cas d'urgence
        contact_urgence_nom VARCHAR(100),
        contact_urgence_telephone VARCHAR(20),
        contact_urgence_lien VARCHAR(100),
        
        -- Informations professionnelles
        poste VARCHAR(100),
        departement VARCHAR(100),
        statut_emploi VARCHAR(50) DEFAULT 'CDD', -- CDD, CDI, Interim, etc.
        qualification VARCHAR(100),
        
        -- Rémunération
        salaire_base DECIMAL(12,2),
        taux_horaire DECIMAL(10,2),
        
        -- Statut
        statut VARCHAR(50) DEFAULT 'actif', -- actif, inactif, congé, suspendu
        date_depart DATE,
        raison_depart TEXT,
        
        -- Métadonnées
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);

        // Table des affectations du personnel aux équipes
        await pool.query(`
      CREATE TABLE IF NOT EXISTS affectations_personnel (
        id SERIAL PRIMARY KEY,
        personnel_id INTEGER REFERENCES personnel(id),
        equipe_id INTEGER REFERENCES equipe_production(id),
        date_debut DATE NOT NULL,
        date_fin DATE,
        role_equipe VARCHAR(100),
        statut VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Table des présences/pointages
        await pool.query(`
      CREATE TABLE IF NOT EXISTS pointages_personnel (
        id SERIAL PRIMARY KEY,
        personnel_id INTEGER REFERENCES personnel(id),
        date_pointage DATE NOT NULL,
        heure_arrivee TIME,
        heure_depart TIME,
        heures_travaillees DECIMAL(4,2),
        heures_supp DECIMAL(4,2) DEFAULT 0,
        heures_nuit DECIMAL(4,2) DEFAULT 0,
        type_journee VARCHAR(20) DEFAULT 'normal', -- normal, nuit, férié
        statut VARCHAR(50) DEFAULT 'present', -- present, absent, congé, maladie
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Table des congés
        await pool.query(`
      CREATE TABLE IF NOT EXISTS conges_personnel (
        id SERIAL PRIMARY KEY,
        personnel_id INTEGER REFERENCES personnel(id),
        type_conge VARCHAR(50) NOT NULL, -- annuel, maladie, maternité, exceptionnel
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        jours_ouvrables INTEGER,
        statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, approuve, refuse
        motif TEXT,
        date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approuve_par INTEGER REFERENCES users(id),
        date_approbation TIMESTAMP
      )
    `);

        console.log('✅ Tables de personnel créées');

        // Insertion des types de personnel par défaut
        await pool.query(`
      INSERT INTO types_personnel 
        (nom_type, description, taux_vaccation_jour, taux_vaccation_nuit, prime_risque) 
      VALUES 
        ('Ouvrier Production', 'Ouvrier spécialisé en production', 15000, 18750, 2000),
        ('Technicien', 'Technicien maintenance et réglage', 20000, 25000, 3000),
        ('Superviseur', 'Superviseur d équipe', 25000, 31250, 4000),
        ('Magasinier', 'Gestionnaire de stock', 12000, 15000, 1000),
        ('Qualiticien', 'Contrôleur qualité', 18000, 22500, 2500)
      ON CONFLICT (nom_type) DO NOTHING
    `);

        console.log('✅ Types de personnel par défaut insérés');

        // Insertion d'exemples de personnel
        await pool.query(`
      INSERT INTO personnel 
        (matricule, nom, prenom, date_naissance, date_embauche, type_personnel_id, 
         adresse, telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_lien,
         poste, departement, statut_emploi, qualification, salaire_base, taux_horaire, statut) 
      VALUES 
        ('EMP001', 'Rakoto', 'Jean', '1990-05-15', '2023-01-15', 1, 
         'Lot 123 Antananarivo', '+261 34 12 345 67', 'jean.rakoto@bygagoos.mg', 'Marie Rakoto', '+261 33 12 345 67', 'Épouse',
         'Ouvrier Sérigraphie', 'Production', 'CDI', 'CAP Sérigraphie', 450000, 15000, 'actif'),
         
        ('EMP002', 'Rabe', 'Marie', '1988-08-22', '2023-02-01', 2,
         'Lot 456 Antananarivo', '+261 34 23 456 78', 'marie.rabe@bygagoos.mg', 'Pierre Rabe', '+261 33 23 456 78', 'Mari',
         'Technicien Maintenance', 'Production', 'CDI', 'BTS Maintenance', 600000, 20000, 'actif'),
         
        ('EMP003', 'Randria', 'Pierre', '1985-12-10', '2022-11-01', 3,
         'Lot 789 Antananarivo', '+261 34 34 567 89', 'pierre.randria@bygagoos.mg', 'Sophie Randria', '+261 33 34 567 89', 'Épouse', 
         'Superviseur Production', 'Production', 'CDI', 'Licence Management', 750000, 25000, 'actif')
      ON CONFLICT (matricule) DO NOTHING
    `);

        console.log('✅ Exemples de personnel insérés');

        // Vérification
        const personnelCount = await pool.query('SELECT COUNT(*) FROM personnel');
        const typesCount = await pool.query('SELECT COUNT(*) FROM types_personnel');

        console.log(`📊 ${personnelCount.rows[0].count} employés dans la base`);
        console.log(`📊 ${typesCount.rows[0].count} types de personnel`);

    } catch (error) {
        console.error('❌ Erreur création tables personnel:', error);
    } finally {
        pool.end();
    }
}

// Exécuter seulement si appelé directement
if (require.main === module) {
    createPersonnelTables();
}

module.exports = { createPersonnelTables };