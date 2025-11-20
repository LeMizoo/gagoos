-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    date_commande DATE NOT NULL,
    taille_2_ans INTEGER DEFAULT 0,
    taille_4_ans INTEGER DEFAULT 0,
    taille_6_ans INTEGER DEFAULT 0,
    taille_8_ans INTEGER DEFAULT 0,
    taille_10_ans INTEGER DEFAULT 0,
    taille_12_ans INTEGER DEFAULT 0,
    taille_S INTEGER DEFAULT 0,
    taille_M INTEGER DEFAULT 0,
    taille_L INTEGER DEFAULT 0,
    couleur_tissus VARCHAR(100) NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'équipe de production
CREATE TABLE IF NOT EXISTS equipe_production (
    id SERIAL PRIMARY KEY,
    commande_id INTEGER REFERENCES commandes(id) ON DELETE CASCADE,
    nom_validateur VARCHAR(100) NOT NULL,
    prenom_validateur VARCHAR(100) NOT NULL,
    nombre_personnels INTEGER NOT NULL,
    prenoms_personnels TEXT,
    heure_entree TIME NOT NULL,
    heure_sortie TIME NOT NULL,
    total_heures_travail DECIMAL(4,2),
    majoration_nuit BOOLEAN DEFAULT FALSE,
    montant_majoration DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_commande_date ON commandes(date_commande);
CREATE INDEX idx_equipe_commande_id ON equipe_production(commande_id);