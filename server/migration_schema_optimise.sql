-- BYGAGOOS - MIGRATION SÉCURISÉE
-- NE SUPPRIME PAS LES TABLES EXISTANTES

-- 1. AJOUT DES NOUVELLES COLONNES À LA TABLE USERS
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. METTRE À JOUR LES VALEURS PAR DÉFAUT
UPDATE users SET 
    first_name = COALESCE(first_name, 'Prénom'),
    last_name = COALESCE(last_name, 'Nom'),
    role = COALESCE(role, 'user'),
    is_approved = COALESCE(is_approved, TRUE)
WHERE first_name IS NULL OR last_name IS NULL;

-- 3. MODIFIER LES CONTRAINTES (si nécessaire)
ALTER TABLE users 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- 4. AJOUT DES CONTRAINTES DE CHECK POUR LE ROLE
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'gerante', 'user'));

-- 5. MISE À JOUR TABLE DEMANDS
ALTER TABLE demands
ADD COLUMN IF NOT EXISTS category_id INTEGER,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS deadline DATE,
ADD COLUMN IF NOT EXISTS assigned_gerante_id INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 6. CONTRAINTES POUR DEMANDS
ALTER TABLE demands
ADD CONSTRAINT demands_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
ADD CONSTRAINT demands_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- 7. CRÉATION TABLE CATEGORIES SI ELLE N'EXISTE PAS
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. INSERTION CATÉGORIES PAR DÉFAUT (uniquement si vide)
INSERT INTO categories (name, description)
SELECT 'Plomberie', 'Réparations et installations de plomberie'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Plomberie');

INSERT INTO categories (name, description)
SELECT 'Électricité', 'Travaux électriques et dépannage'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Électricité');

INSERT INTO categories (name, description) 
SELECT 'Maçonnerie', 'Travaux de maçonnerie et rénovation'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Maçonnerie');

INSERT INTO categories (name, description)
SELECT 'Menuiserie', 'Travaux de bois et menuiserie'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Menuiserie');

INSERT INTO categories (name, description)
SELECT 'Peinture', 'Peinture intérieure et extérieure'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Peinture');

INSERT INTO categories (name, description)
SELECT 'Nettoyage', 'Services de nettoyage professionnel'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Nettoyage');

INSERT INTO categories (name, description)
SELECT 'Jardinage', 'Entretien de jardins et espaces verts'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Jardinage');

-- 9. S'ASSURER QU'IL Y A UN ADMIN
INSERT INTO users (email, password, first_name, last_name, role, is_approved)
SELECT 'admin@bygagoos.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', 'admin', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin');

-- 10. METTRE À JOUR LES STATUTS EXISTANTS DANS DEMANDS
UPDATE demands SET 
    status = COALESCE(status, 'pending'),
    priority = COALESCE(priority, 'medium')
WHERE status IS NULL OR priority IS NULL;