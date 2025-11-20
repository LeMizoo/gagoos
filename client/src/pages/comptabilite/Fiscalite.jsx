import React, { useState, useEffect } from 'react';
import './Parametres.css';

const Parametres = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [commandTypes, setCommandTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [fixedCosts, setFixedCosts] = useState([]);
    const [salarySettings, setSalarySettings] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Formater les montants en Ariary
    const formatAriary = (amount) => {
        return `${parseFloat(amount || 0).toLocaleString('fr-FR')} Ar`;
    };

    // Charger les données selon l'onglet actif
    useEffect(() => {
        loadTabData(activeTab);
        if (activeTab === 'overview') {
            loadStats();
        }
    }, [activeTab]);

    const loadStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/parametres/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log('API stats non disponible, utilisation des données par défaut');
                setDefaultStats();
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.log('Réponse stats non-JSON, données par défaut utilisées');
                setDefaultStats();
                return;
            }

            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Erreur chargement statistiques:', error);
            setDefaultStats();
        } finally {
            setLoading(false);
        }
    };

    const setDefaultStats = () => {
        setStats({
            command_types_count: 4,
            materials_count: 4,
            expenses_total: 450000,
            fixed_costs_total: 1850000
        });
    };

    const loadTabData = async (tab) => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            console.log(`Chargement des données pour: ${tab}`);
            const response = await fetch(`/api/parametres/${tab}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Vérifier si c'est du HTML au lieu du JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                console.log(`API paramètres non disponible pour ${tab}`);
                // Utiliser des données par défaut
                setDefaultData(tab);
                return;
            }

            if (!response.ok) {
                console.log(`Erreur HTTP ${response.status} pour ${tab}`);
                setDefaultData(tab);
                return;
            }

            if (!contentType || !contentType.includes('application/json')) {
                console.log(`Réponse non-JSON pour ${tab}`);
                setDefaultData(tab);
                return;
            }

            const data = await response.json();

            switch (tab) {
                case 'command-types':
                    setCommandTypes(data);
                    break;
                case 'materials':
                    setMaterials(data);
                    break;
                case 'fixed-costs':
                    setFixedCosts(data);
                    break;
                case 'salary-settings':
                    setSalarySettings(data);
                    break;
                case 'expenses':
                    setExpenses(data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
            setError(`API non disponible: ${error.message}`);
            setDefaultData(tab); // Charger les données par défaut
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour les données par défaut des paramètres
    const setDefaultData = (tab) => {
        console.log(`Chargement des données par défaut pour: ${tab}`);

        switch (tab) {
            case 'command-types':
                setCommandTypes([
                    { id: 1, name: 'DTF', description: 'Impression Direct to Film', base_price: 15000, is_active: true },
                    { id: 2, name: 'Sérigraphie', description: 'Impression sérigraphique', base_price: 12500, is_active: true },
                    { id: 3, name: 'Broderie', description: 'Broderie numérique', base_price: 25000, is_active: true },
                    { id: 4, name: 'Flocage', description: 'Application de flocage', base_price: 18000, is_active: true }
                ]);
                break;
            case 'materials':
                setMaterials([
                    { id: 1, category: 'Encre', name: 'Encre DTF Blanche', type: 'DTF', unit_price: 45000, unit: 'litre', supplier: 'Fournisseur A' },
                    { id: 2, category: 'Tissu', name: 'T-shirt Coton', type: 'Coton', unit_price: 8500, unit: 'pièce', supplier: 'Fournisseur B' },
                    { id: 3, category: 'Film', name: 'Film Transfert', type: 'DTF', unit_price: 2300, unit: 'mètre', supplier: 'Fournisseur C' },
                    { id: 4, category: 'Encre', name: 'Encre Sérigraphie', type: 'Plastisol', unit_price: 35000, unit: 'litre', supplier: 'Fournisseur A' }
                ]);
                break;
            case 'fixed-costs':
                setFixedCosts([
                    { id: 1, category: 'Énergie', description: 'Électricité mensuelle', amount: 450000, frequency: 'Mensuel' },
                    { id: 2, category: 'Loyer', description: 'Loyer atelier', amount: 1200000, frequency: 'Mensuel' },
                    { id: 3, category: 'Maintenance', description: 'Entretien machines', amount: 200000, frequency: 'Mensuel' }
                ]);
                break;
            case 'salary-settings':
                setSalarySettings([
                    { id: 1, role: 'Ouvrier', base_hourly_rate: 12500, night_premium_rate: 1.25, overtime_rate: 1.5 },
                    { id: 2, role: 'Technicien', base_hourly_rate: 15000, night_premium_rate: 1.25, overtime_rate: 1.5 },
                    { id: 3, role: 'Superviseur', base_hourly_rate: 18000, night_premium_rate: 1.3, overtime_rate: 1.75 }
                ]);
                break;
            case 'expenses':
                setExpenses([
                    {
                        id: 1,
                        date_purchased: new Date().toISOString(),
                        description: 'Achat encre DTF',
                        quantity: 10,
                        unit_cost: 45000,
                        total_cost: 450000,
                        first_name: 'Admin',
                        last_name: 'System'
                    }
                ]);
                break;
            default:
                break;
        }
    };

    const handleRetour = () => {
        window.history.back();
    };

    return (
        <div className="page-layout">
            <div className="page-main">
                <div className="page-header">
                    <div className="header-content">
                        <div>
                            <div className="breadcrumbs">
                                <span className="breadcrumb-item">
                                    <a href="#dashboard" className="breadcrumb-link">Accueil</a>
                                </span>
                                <span className="breadcrumb-separator">/</span>
                                <span className="breadcrumb-current">Paramètres Admin</span>
                            </div>
                            <h1 className="page-title">Paramètres Administrateur</h1>
                            <p className="page-subtitle">Gestion des coûts, tarifs et paramètres système</p>
                        </div>

                        <div className="page-actions">
                            <button className="nav-button secondary" onClick={handleRetour}>
                                ↩️ Retour
                            </button>
                            <button className="nav-button success" onClick={() => loadTabData(activeTab)}>
                                🔄 Actualiser
                            </button>
                        </div>
                    </div>
                </div>

                <div className="page-content">
                    <div className="parametres-container">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                                <button onClick={() => setError('')} className="close-error">×</button>
                            </div>
                        )}

                        {loading && (
                            <div className="loading-overlay">
                                <div className="loading-spinner">Chargement...</div>
                            </div>
                        )}

                        <div className="parametres-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                📊 Aperçu
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'command-types' ? 'active' : ''}`}
                                onClick={() => setActiveTab('command-types')}
                            >
                                🏷️ Types de Commande
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                                onClick={() => setActiveTab('materials')}
                            >
                                📦 Matériaux
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'fixed-costs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('fixed-costs')}
                            >
                                💰 Frais Fixes
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'salary-settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('salary-settings')}
                            >
                                👥 Salaires
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('expenses')}
                            >
                                💸 Dépenses
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'overview' && <OverviewTab stats={stats} formatAriary={formatAriary} />}
                            {activeTab === 'command-types' && (
                                <CommandTypesTab
                                    data={commandTypes}
                                    onUpdate={() => loadTabData('command-types')}
                                    formatAriary={formatAriary}
                                />
                            )}
                            {activeTab === 'materials' && (
                                <MaterialsTab
                                    data={materials}
                                    onUpdate={() => loadTabData('materials')}
                                    formatAriary={formatAriary}
                                />
                            )}
                            {activeTab === 'fixed-costs' && (
                                <FixedCostsTab
                                    data={fixedCosts}
                                    onUpdate={() => loadTabData('fixed-costs')}
                                    formatAriary={formatAriary}
                                />
                            )}
                            {activeTab === 'salary-settings' && (
                                <SalarySettingsTab
                                    data={salarySettings}
                                    onUpdate={() => loadTabData('salary-settings')}
                                    formatAriary={formatAriary}
                                />
                            )}
                            {activeTab === 'expenses' && (
                                <ExpensesTab
                                    data={expenses}
                                    onUpdate={() => loadTabData('expenses')}
                                    formatAriary={formatAriary}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant Overview
const OverviewTab = ({ stats, formatAriary }) => {
    return (
        <div className="overview-grid">
            <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-info">
                    <h3>Types de Commande</h3>
                    <p className="stat-value">{stats.command_types_count || 0}</p>
                    <p className="stat-desc">Configurés dans le système</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                    <h3>Matériaux Actifs</h3>
                    <p className="stat-value">{stats.materials_count || 0}</p>
                    <p className="stat-desc">En stock et disponibles</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                    <h3>Dépenses Total</h3>
                    <p className="stat-value">{stats.expenses_total ? formatAriary(stats.expenses_total) : '0 Ar'}</p>
                    <p className="stat-desc">Ce mois</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">💸</div>
                <div className="stat-info">
                    <h3>Frais Fixes Mensuels</h3>
                    <p className="stat-value">{stats.fixed_costs_total ? formatAriary(stats.fixed_costs_total) : '0 Ar'}</p>
                    <p className="stat-desc">Coûts récurrents</p>
                </div>
            </div>
        </div>
    );
};

// Composant Types de Commande
const CommandTypesTab = ({ data, onUpdate, formatAriary }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        base_price: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/parametres/command-types', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création');
            }

            setShowForm(false);
            setFormData({ name: '', description: '', base_price: '' });
            onUpdate();
        } catch (error) {
            console.error('Erreur création type commande:', error);
            alert('Erreur lors de la création');
        }
    };

    return (
        <div className="tab-panel">
            <div className="panel-header">
                <h2>Types de Commande</h2>
                <div className="panel-actions">
                    <button className="nav-button" onClick={() => setShowForm(true)}>
                        ➕ Nouveau Type
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Nouveau Type de Commande</h3>
                            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom du type *</label>
                                <input
                                    type="text"
                                    placeholder="DTF, Sérigraphie, Broderie..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Description détaillée du type de commande..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Prix de base (Ar) *</label>
                                <input
                                    type="number"
                                    step="1"
                                    placeholder="0"
                                    value={formData.base_price}
                                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="nav-button success">Créer</button>
                                <button type="button" className="nav-button secondary" onClick={() => setShowForm(false)}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="data-grid">
                {data.length === 0 ? (
                    <div className="no-data">
                        <p>Aucun type de commande configuré</p>
                        <button className="nav-button" onClick={() => setShowForm(true)}>
                            ➕ Créer le premier type
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Prix Base (Ar)</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <CommandTypeRow key={item.id} item={item} onUpdate={onUpdate} formatAriary={formatAriary} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// Composant ligne édition type commande
const CommandTypeRow = ({ item, onUpdate, formatAriary }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/parametres/command-types/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Erreur mise à jour:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de commande ?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/parametres/command-types/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <tr>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    <strong>{item.name}</strong>
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    item.description || <span className="text-muted">-</span>
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        step="1"
                        value={editData.base_price}
                        onChange={(e) => setEditData({ ...editData, base_price: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    formatAriary(item.base_price)
                )}
            </td>
            <td>
                {isEditing ? (
                    <select
                        value={editData.is_active}
                        onChange={(e) => setEditData({ ...editData, is_active: e.target.value === 'true' })}
                        className="edit-select"
                    >
                        <option value="true">Actif</option>
                        <option value="false">Inactif</option>
                    </select>
                ) : (
                    <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                        {item.is_active ? '🟢 Actif' : '🔴 Inactif'}
                    </span>
                )}
            </td>
            <td>
                {isEditing ? (
                    <div className="action-buttons">
                        <button onClick={handleUpdate} className="btn-success btn-sm" title="Valider">✓</button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary btn-sm" title="Annuler">✗</button>
                    </div>
                ) : (
                    <div className="action-buttons">
                        <button onClick={() => setIsEditing(true)} className="btn-edit btn-sm" title="Modifier">✏️</button>
                        <button onClick={handleDelete} className="btn-danger btn-sm" title="Supprimer">🗑️</button>
                    </div>
                )}
            </td>
        </tr>
    );
};

// Composants similaires pour les autres onglets
const MaterialsTab = ({ data, onUpdate, formatAriary }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        type: '',
        unit_price: '',
        unit: '',
        supplier: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/parametres/materials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({ category: '', name: '', type: '', unit_price: '', unit: '', supplier: '' });
                onUpdate();
            }
        } catch (error) {
            console.error('Erreur création matériau:', error);
            alert('Erreur lors de la création');
        }
    };

    return (
        <div className="tab-panel">
            <div className="panel-header">
                <h2>Matériaux et Fournitures</h2>
                <div className="panel-actions">
                    <button className="nav-button" onClick={() => setShowForm(true)}>
                        ➕ Nouveau Matériau
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Nouveau Matériau</h3>
                            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Catégorie *</label>
                                <input
                                    type="text"
                                    placeholder="Peinture, Toile, Encre, Tissu..."
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom du matériau *</label>
                                <input
                                    type="text"
                                    placeholder="Nom spécifique du matériau"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <input
                                    type="text"
                                    placeholder="plastisol, coton, polyester..."
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Prix unitaire (Ar) *</label>
                                <input
                                    type="number"
                                    step="1"
                                    placeholder="0"
                                    value={formData.unit_price}
                                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Unité *</label>
                                <input
                                    type="text"
                                    placeholder="litre, mètre, unité, kg..."
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fournisseur</label>
                                <input
                                    type="text"
                                    placeholder="Nom du fournisseur"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="nav-button success">Créer</button>
                                <button type="button" className="nav-button secondary" onClick={() => setShowForm(false)}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="data-grid">
                {data.length === 0 ? (
                    <div className="no-data">
                        <p>Aucun matériau configuré</p>
                        <button className="nav-button" onClick={() => setShowForm(true)}>
                            ➕ Ajouter le premier matériau
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Prix Unitaire (Ar)</th>
                                <th>Unité</th>
                                <th>Fournisseur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <MaterialRow key={item.id} item={item} onUpdate={onUpdate} formatAriary={formatAriary} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const MaterialRow = ({ item, onUpdate, formatAriary }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/parametres/materials/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                setIsEditing(false);
                onUpdate();
            }
        } catch (error) {
            console.error('Erreur mise à jour:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    return (
        <tr>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    <strong>{item.category}</strong>
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    item.name
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.type}
                        onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    item.type || <span className="text-muted">-</span>
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        step="1"
                        value={editData.unit_price}
                        onChange={(e) => setEditData({ ...editData, unit_price: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    formatAriary(item.unit_price)
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.unit}
                        onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    item.unit
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editData.supplier}
                        onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        className="edit-input"
                    />
                ) : (
                    item.supplier || <span className="text-muted">-</span>
                )}
            </td>
            <td>
                {isEditing ? (
                    <div className="action-buttons">
                        <button onClick={handleUpdate} className="btn-success btn-sm">✓</button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary btn-sm">✗</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-edit btn-sm">✏️</button>
                )}
            </td>
        </tr>
    );
};

// Composants pour les autres onglets (structure similaire)
const FixedCostsTab = ({ data, onUpdate, formatAriary }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="tab-panel">
            <div className="panel-header">
                <h2>Frais Fixes</h2>
                <div className="panel-actions">
                    <button className="nav-button" onClick={() => setShowForm(true)}>
                        ➕ Nouveau Frais
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Nouveau Frais Fixe</h3>
                            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <div className="form-placeholder">
                            <p>Formulaire d'ajout de frais fixe</p>
                            <div className="form-actions">
                                <button type="button" className="nav-button secondary" onClick={() => setShowForm(false)}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="data-grid">
                {data.length === 0 ? (
                    <div className="no-data">
                        <p>Aucun frais fixe configuré</p>
                        <button className="nav-button" onClick={() => setShowForm(true)}>
                            ➕ Ajouter le premier frais
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Description</th>
                                <th>Montant (Ar)</th>
                                <th>Fréquence</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td><strong>{item.category}</strong></td>
                                    <td>{item.description}</td>
                                    <td>{formatAriary(item.amount)}</td>
                                    <td>
                                        <span className={`frequency ${item.frequency.toLowerCase()}`}>
                                            {item.frequency}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit btn-sm">✏️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const SalarySettingsTab = ({ data, onUpdate, formatAriary }) => {
    return (
        <div className="tab-panel">
            <div className="panel-header">
                <h2>Paramètres Salariaux</h2>
                <div className="panel-actions">
                    <button className="nav-button">
                        ⚙️ Configurer
                    </button>
                </div>
            </div>
            <div className="data-grid">
                {data.length === 0 ? (
                    <div className="no-data">
                        <p>Aucun paramètre salarial configuré</p>
                        <button className="nav-button">
                            ⚙️ Configurer les salaires
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Rôle</th>
                                <th>Taux Horaire Base (Ar)</th>
                                <th>Majoration Nuit</th>
                                <th>Taux Heures Supp.</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td><strong>{item.role}</strong></td>
                                    <td>{formatAriary(item.base_hourly_rate)}/h</td>
                                    <td>{item.night_premium_rate}x</td>
                                    <td>{item.overtime_rate}x</td>
                                    <td>
                                        <button className="btn-edit btn-sm">✏️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const ExpensesTab = ({ data, onUpdate, formatAriary }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="tab-panel">
            <div className="panel-header">
                <h2>Dépenses</h2>
                <div className="panel-actions">
                    <button className="nav-button" onClick={() => setShowForm(true)}>
                        ➕ Nouvelle Dépense
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Nouvelle Dépense</h3>
                            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <div className="form-placeholder">
                            <p>Formulaire d'ajout de dépense</p>
                            <div className="form-actions">
                                <button type="button" className="nav-button secondary" onClick={() => setShowForm(false)}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="data-grid">
                {data.length === 0 ? (
                    <div className="no-data">
                        <p>Aucune dépense enregistrée</p>
                        <button className="nav-button" onClick={() => setShowForm(true)}>
                            ➕ Enregistrer une dépense
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Quantité</th>
                                <th>Coût Unitaire (Ar)</th>
                                <th>Total (Ar)</th>
                                <th>Enregistré par</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date_purchased).toLocaleDateString('fr-FR')}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatAriary(item.unit_cost)}</td>
                                    <td><strong>{formatAriary(item.total_cost)}</strong></td>
                                    <td>{item.first_name} {item.last_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Parametres;