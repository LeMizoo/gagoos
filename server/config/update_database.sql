-- Table des types de commandes avec tarifs unitaires
CREATE TABLE IF NOT EXISTS type_commandes (
    id SERIAL PRIMARY KEY,
    nom_type VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    prix_unitaire_ariary DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des salaires horaires
CREATE TABLE IF NOT EXISTS salaires_horaires (
    id SERIAL PRIMARY KEY,
    type_personnel VARCHAR(100) UNIQUE NOT NULL,
    salaire_horaire_ariary DECIMAL(12,2) NOT NULL,
    majoration_nuit DECIMAL(5,2) DEFAULT 1.25, -- 25% de majoration par défaut
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modification de la table commandes pour ajouter le type
ALTER TABLE commandes 
ADD COLUMN IF NOT EXISTS type_commande_id INTEGER REFERENCES type_commandes(id),
ADD COLUMN IF NOT EXISTS prix_total_ariary DECIMAL(12,2) DEFAULT 0;

-- Add statut column if missing (status of the commande)
ALTER TABLE commandes
    ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'En attente';

-- Add per-size unit price columns
ALTER TABLE commandes
    ADD COLUMN IF NOT EXISTS prix_unitaire_2_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_4_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_6_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_8_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_10_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_12_ans DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_S DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_M DECIMAL(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prix_unitaire_L DECIMAL(12,2) DEFAULT 0;

-- Modification de la table equipe_production pour ajouter le type de personnel et salaire
ALTER TABLE equipe_production 
ADD COLUMN IF NOT EXISTS type_personnel_id INTEGER REFERENCES salaires_horaires(id),
ADD COLUMN IF NOT EXISTS salaire_total_ariary DECIMAL(12,2) DEFAULT 0;

-- Insertion des types de commandes par défaut
INSERT INTO type_commandes (nom_type, description, prix_unitaire_ariary) VALUES
('T-Shirt Simple', 'T-Shirt basique coton', 5000.00),
('T-Shirt Premium', 'T-Shirt qualité premium', 8000.00),
('Polo', 'Polo classique', 12000.00),
('Chemise', 'Chemise de travail', 15000.00),
('Uniforme', 'Uniforme professionnel', 20000.00),
('Veste', 'Veste de travail', 25000.00)
ON CONFLICT (nom_type) DO NOTHING;

-- Insertion des salaires horaires par défaut
INSERT INTO salaires_horaires (type_personnel, salaire_horaire_ariary, majoration_nuit) VALUES
('Ouvrier Débutant', 3000.00, 1.25),
('Ouvrier Qualifié', 4500.00, 1.30),
('Chef d''Équipe', 6000.00, 1.35),
('Contremaître', 8000.00, 1.40),
('Superviseur', 10000.00, 1.45)
ON CONFLICT (type_personnel) DO NOTHING;