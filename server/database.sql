-- Création de la base de données
CREATE DATABASE bygagoos;

\c bygagoos;

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table type_commandes
CREATE TABLE IF NOT EXISTS type_commandes (
    id SERIAL PRIMARY KEY,
    nom_type VARCHAR(100) NOT NULL,
    description TEXT,
    prix_unitaire_ariary DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table salaires_horaires
CREATE TABLE IF NOT EXISTS salaires_horaires (
    id SERIAL PRIMARY KEY,
    type_personnel VARCHAR(100) NOT NULL,
    salaire_horaire_ariary DECIMAL(10,2) NOT NULL,
    majoration_nuit DECIMAL(4,2) DEFAULT 1.25,
    majoration_heures_supp DECIMAL(4,2) DEFAULT 1.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table commandes PRINCIPALE (structure ByGagoos)
CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    
    -- Informations client et produit
    client VARCHAR(255) NOT NULL,
    produit VARCHAR(255) NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 0,
    couleur_tissus VARCHAR(100),
    
    -- Prix et statut
    prix_total_ariary DECIMAL(12,2) DEFAULT 0,
    statut VARCHAR(50) DEFAULT 'en_attente',
    
    -- Dates importantes
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP NULL,
    date_production TIMESTAMP NULL,
    date_finalisation TIMESTAMP NULL,
    
    -- Équipe assignée
    equipe_assigned VARCHAR(100),
    
    -- Anciens champs pour compatibilité
    date_commande DATE,
    type_commande_id INTEGER REFERENCES type_commandes(id),
    heure_debut TIME,
    heure_fin TIME,
    
    -- Tailles (pour compatibilité)
    taille_2_ans INTEGER DEFAULT 0,
    taille_4_ans INTEGER DEFAULT 0,
    taille_6_ans INTEGER DEFAULT 0,
    taille_8_ans INTEGER DEFAULT 0,
    taille_10_ans INTEGER DEFAULT 0,
    taille_12_ans INTEGER DEFAULT 0,
    taille_S INTEGER DEFAULT 0,
    taille_M INTEGER DEFAULT 0,
    taille_L INTEGER DEFAULT 0,
    
    -- Prix unitaires par taille
    prix_unitaire_2_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_4_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_6_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_8_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_10_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_12_ans DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_S DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_M DECIMAL(10,2) DEFAULT 0,
    prix_unitaire_L DECIMAL(10,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table equipe_production
CREATE TABLE IF NOT EXISTS equipe_production (
    id SERIAL PRIMARY KEY,
    commande_id INTEGER REFERENCES commandes(id),
    nom_validateur VARCHAR(100),
    prenom_validateur VARCHAR(100),
    nombre_personnels INTEGER DEFAULT 1,
    heure_entree TIME,
    heure_sortie TIME,
    total_heures_travail DECIMAL(4,2),
    majoration_nuit DECIMAL(10,2) DEFAULT 0,
    statut_production VARCHAR(50) DEFAULT 'en_cours',
    type_personnel_id INTEGER REFERENCES salaires_horaires(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== TABLES STOCK ET MATÉRIAUX ====================
CREATE TABLE IF NOT EXISTS stock_materiaux (
    id SERIAL PRIMARY KEY,
    nom_materiau VARCHAR(200) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    type_materiau VARCHAR(100),
    prix_unitaire_ariary DECIMAL(10,2) NOT NULL,
    unite VARCHAR(50) NOT NULL,
    fournisseur VARCHAR(200),
    stock_actuel DECIMAL(10,2) DEFAULT 0,
    stock_minimum DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mouvements_stock (
    id SERIAL PRIMARY KEY,
    materiau_id INTEGER REFERENCES stock_materiaux(id),
    type_mouvement VARCHAR(20) NOT NULL CHECK (type_mouvement IN ('entree', 'sortie', 'ajustement')),
    quantite DECIMAL(10,2) NOT NULL,
    cout_unitaire_ariary DECIMAL(10,2),
    cout_total_ariary DECIMAL(10,2),
    beneficiaire VARCHAR(200),
    raison TEXT,
    date_mouvement DATE NOT NULL,
    created_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== DONNÉES INITIALES ====================

-- Types de commandes
INSERT INTO type_commandes (nom_type, description, prix_unitaire_ariary) VALUES 
('T-shirt Basic', 'T-shirt coton basic', 15000.00),
('T-shirt Premium', 'T-shirt coton premium', 25000.00),
('Polo', 'Polo col officier', 30000.00),
('Sweat-shirt', 'Sweat-shirt capuche', 45000.00),
('Casquette', 'Casquette brodée', 12000.00)
ON CONFLICT DO NOTHING;

-- Salaires horaires
INSERT INTO salaires_horaires (type_personnel, salaire_horaire_ariary, majoration_nuit, majoration_heures_supp) VALUES 
('Ouvrier Production', 8000.00, 1.25, 1.5),
('Technicien', 12000.00, 1.25, 1.5),
('Superviseur', 15000.00, 1.25, 1.5),
('Magasinier', 7000.00, 1.25, 1.5)
ON CONFLICT DO NOTHING;

-- Matériaux de base
INSERT INTO stock_materiaux (nom_materiau, categorie, type_materiau, prix_unitaire_ariary, unite, fournisseur, stock_actuel, stock_minimum) VALUES 
('Tissu Coton Blanc', 'Textile', 'Coton', 12000.00, 'mètre', 'Textile Import', 150.5, 50.0),
('Tissu Coton Noir', 'Textile', 'Coton', 12500.00, 'mètre', 'Textile Import', 120.0, 50.0),
('Encre Plastisol Rouge', 'Encre', 'Plastisol', 35000.00, 'litre', 'Fournitures Pro', 25.0, 5.0),
('Encre Plastisol Bleu', 'Encre', 'Plastisol', 35000.00, 'litre', 'Fournitures Pro', 20.0, 5.0),
('Cadre Sérigraphie 40x60', 'Équipement', 'Cadre', 180000.00, 'unité', 'Tools Express', 8.0, 3.0),
('Raclette Aluminium', 'Équipement', 'Raclette', 45000.00, 'unité', 'Tools Express', 15.0, 5.0)
ON CONFLICT DO NOTHING;

-- Utilisateurs par défaut
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES 
('admin', 'admin@bygagoos.mg', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', 'admin'),
('commercial', 'commercial@bygagoos.mg', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean', 'Dupont', 'commercial'),
('production', 'production@bygagoos.mg', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Martin', 'production'),
('magasinier', 'magasinier@bygagoos.mg', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pierre', 'Durand', 'magasinier')
ON CONFLICT DO NOTHING;

-- Commandes d'exemple
INSERT INTO commandes (client, produit, quantite, couleur_tissus, prix_total_ariary, statut, equipe_assigned) VALUES 
('Boutique Style', 'T-shirt Premium', 50, 'Bleu marine', 1250000.00, 'en_production', 'Équipe A'),
('Magasin Urban', 'Sweat-shirt', 25, 'Noir', 1125000.00, 'validée', NULL),
('Société XYZ', 'Polo', 30, 'Blanc', 900000.00, 'en_attente', NULL)
ON CONFLICT DO NOTHING;

-- ==================== INDEX POUR PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_date_creation ON commandes(date_creation);
CREATE INDEX IF NOT EXISTS idx_commandes_client ON commandes(client);
CREATE INDEX IF NOT EXISTS idx_mouvements_stock_date ON mouvements_stock(date_mouvement);
CREATE INDEX IF NOT EXISTS idx_mouvements_stock_type ON mouvements_stock(type_mouvement);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ==================== VUES UTILES ====================
CREATE OR REPLACE VIEW vue_commandes_details AS
SELECT 
    c.id,
    c.client,
    c.produit,
    c.quantite,
    c.couleur_tissus,
    c.prix_total_ariary,
    c.statut,
    c.date_creation,
    c.equipe_assigned,
    tc.nom_type as type_commande,
    ep.nom_validateur,
    ep.prenom_validateur
FROM commandes c
LEFT JOIN type_commandes tc ON c.type_commande_id = tc.id
LEFT JOIN equipe_production ep ON c.id = ep.commande_id;

-- Message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE '✅ Base de données ByGagoos initialisée avec succès!';
    RAISE NOTICE '📊 Tables créées: users, type_commandes, salaires_horaires, commandes, equipe_production, stock_materiaux, mouvements_stock';
    RAISE NOTICE '👥 Utilisateurs par défaut créés (mot de passe: password)';
    RAISE NOTICE '📦 Données d''exemple insérées';
END $$;