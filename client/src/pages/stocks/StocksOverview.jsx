import React, { useState, useEffect } from 'react';
import {
    Package,
    ArrowDown,
    ArrowUp,
    AlertTriangle,
    Plus,
    Search,
    Filter,
    Download,
    BarChart3
} from 'lucide-react';
import './Magasinier.css';

const Magasinier = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState({});
    const [stockItems, setStockItems] = useState([]);
    const [movements, setMovements] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [showMovementForm, setShowMovementForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Données du formulaire
    const [movementForm, setMovementForm] = useState({
        stock_item_id: '',
        movement_type: 'entree',
        quantity: '',
        beneficiary_name: '',
        reason: '',
        unit_cost: '',
        movement_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [itemForm, setItemForm] = useState({
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        unit: '',
        min_stock_level: '',
        current_stock: '',
        unit_cost: ''
    });

    // Formater les montants en Ariary
    const formatAriary = (amount) => {
        return `${parseFloat(amount || 0).toLocaleString('fr-FR')} Ar`;
    };

    useEffect(() => {
        loadDashboardData();
        loadCategories();
        loadSuppliers();
    }, []);

    useEffect(() => {
        switch (activeTab) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'stock':
                loadStockItems();
                break;
            case 'movements':
                loadMovements();
                break;
            case 'alerts':
                loadAlerts();
                break;
        }
    }, [activeTab]);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStockItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/items', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStockItems(data);
            }
        } catch (error) {
            console.error('Erreur chargement articles:', error);
        }
    };

    const loadMovements = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/movements', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMovements(data);
            }
        } catch (error) {
            console.error('Erreur chargement mouvements:', error);
        }
    };

    const loadAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/alerts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error('Erreur chargement alertes:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    };

    const loadSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/suppliers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Erreur chargement fournisseurs:', error);
        }
    };

    const handleMovementSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/movements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movementForm)
            });

            if (response.ok) {
                setShowMovementForm(false);
                setMovementForm({
                    stock_item_id: '',
                    movement_type: 'entree',
                    quantity: '',
                    beneficiary_name: '',
                    reason: '',
                    unit_cost: '',
                    movement_date: new Date().toISOString().split('T')[0],
                    notes: ''
                });
                loadDashboardData();
                loadMovements();
                loadStockItems();
                alert('Mouvement enregistré avec succès!');
            }
        } catch (error) {
            console.error('Erreur création mouvement:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/stock/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemForm)
            });

            if (response.ok) {
                setShowItemForm(false);
                setItemForm({
                    name: '',
                    description: '',
                    category_id: '',
                    supplier_id: '',
                    unit: '',
                    min_stock_level: '',
                    current_stock: '',
                    unit_cost: ''
                });
                loadStockItems();
                alert('Article créé avec succès!');
            }
        } catch (error) {
            console.error('Erreur création article:', error);
            alert('Erreur lors de la création');
        }
    };

    if (loading) {
        return (
            <div className="magasinier-container">
                <div className="loading">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="magasinier-container">
            <div className="magasinier-header">
                <div className="header-title">
                    <Package className="header-icon" />
                    <div>
                        <h1>Gestion du Stock</h1>
                        <p>Tableau de bord magasinier - Suivi des entrées et sorties</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowMovementForm(true)}
                    >
                        <Plus size={16} />
                        Nouveau Mouvement
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowItemForm(true)}
                    >
                        <Plus size={16} />
                        Nouvel Article
                    </button>
                </div>
            </div>

            {/* Navigation par onglets */}
            <div className="magasinier-tabs">
                <button
                    className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <BarChart3 size={18} />
                    Tableau de Bord
                </button>
                <button
                    className={`tab ${activeTab === 'stock' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stock')}
                >
                    <Package size={18} />
                    Stock ({stockItems.length})
                </button>
                <button
                    className={`tab ${activeTab === 'movements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('movements')}
                >
                    <ArrowUp size={18} />
                    Mouvements
                </button>
                <button
                    className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('alerts')}
                >
                    <AlertTriangle size={18} />
                    Alertes ({alerts.length})
                </button>
            </div>

            {/* Contenu des onglets */}
            <div className="tab-content">
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        data={dashboardData}
                        onRefresh={loadDashboardData}
                        formatAriary={formatAriary}
                    />
                )}

                {activeTab === 'stock' && (
                    <StockTab
                        items={stockItems}
                        onRefresh={loadStockItems}
                        formatAriary={formatAriary}
                    />
                )}

                {activeTab === 'movements' && (
                    <MovementsTab
                        movements={movements}
                        onRefresh={loadMovements}
                        formatAriary={formatAriary}
                    />
                )}

                {activeTab === 'alerts' && (
                    <AlertsTab
                        alerts={alerts}
                        onRefresh={loadAlerts}
                    />
                )}
            </div>

            {/* Modal nouveau mouvement */}
            {showMovementForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Nouveau Mouvement de Stock</h3>
                        <form onSubmit={handleMovementSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Article *</label>
                                    <select
                                        value={movementForm.stock_item_id}
                                        onChange={(e) => setMovementForm({ ...movementForm, stock_item_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un article</option>
                                        {stockItems.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} (Stock: {item.current_stock} {item.unit})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        value={movementForm.movement_type}
                                        onChange={(e) => setMovementForm({ ...movementForm, movement_type: e.target.value })}
                                        required
                                    >
                                        <option value="entree">Entrée</option>
                                        <option value="sortie">Sortie</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quantité *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={movementForm.quantity}
                                        onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Coût unitaire (Ar)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={movementForm.unit_cost}
                                        onChange={(e) => setMovementForm({ ...movementForm, unit_cost: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    {movementForm.movement_type === 'sortie' ? 'Bénéficiaire *' : 'Fournisseur'}
                                </label>
                                <input
                                    type="text"
                                    value={movementForm.beneficiary_name}
                                    onChange={(e) => setMovementForm({ ...movementForm, beneficiary_name: e.target.value })}
                                    required={movementForm.movement_type === 'sortie'}
                                    placeholder={movementForm.movement_type === 'sortie' ? 'Nom du bénéficiaire' : 'Nom du fournisseur'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Raison *</label>
                                <input
                                    type="text"
                                    value={movementForm.reason}
                                    onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                                    required
                                    placeholder="Ex: Commande client, Réapprovisionnement, etc."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input
                                        type="date"
                                        value={movementForm.movement_date}
                                        onChange={(e) => setMovementForm({ ...movementForm, movement_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    value={movementForm.notes}
                                    onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer le mouvement
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowMovementForm(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal nouvel article */}
            {showItemForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Nouvel Article en Stock</h3>
                        <form onSubmit={handleItemSubmit}>
                            <div className="form-group">
                                <label>Nom *</label>
                                <input
                                    type="text"
                                    value={itemForm.name}
                                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    rows="2"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Catégorie *</label>
                                    <select
                                        value={itemForm.category_id}
                                        onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Fournisseur</label>
                                    <select
                                        value={itemForm.supplier_id}
                                        onChange={(e) => setItemForm({ ...itemForm, supplier_id: e.target.value })}
                                    >
                                        <option value="">Sélectionner un fournisseur</option>
                                        {suppliers.map(supp => (
                                            <option key={supp.id} value={supp.id}>{supp.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Unité *</label>
                                    <input
                                        type="text"
                                        value={itemForm.unit}
                                        onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                                        required
                                        placeholder="Ex: litre, kg, unité, mètre"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock minimum</label>
                                    <input
                                        type="number"
                                        value={itemForm.min_stock_level}
                                        onChange={(e) => setItemForm({ ...itemForm, min_stock_level: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock actuel</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={itemForm.current_stock}
                                        onChange={(e) => setItemForm({ ...itemForm, current_stock: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Coût unitaire (Ar)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={itemForm.unit_cost}
                                        onChange={(e) => setItemForm({ ...itemForm, unit_cost: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Créer l'article
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowItemForm(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Composant Dashboard
const DashboardTab = ({ data, onRefresh, formatAriary }) => {
    const stats = data.monthly_stats || {};

    return (
        <div className="dashboard-tab">
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <Package />
                    </div>
                    <div className="stat-info">
                        <h3>Articles en Stock</h3>
                        <div className="stat-value">{data.total_items || 0}</div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <AlertTriangle />
                    </div>
                    <div className="stat-info">
                        <h3>Alertes Stock Faible</h3>
                        <div className="stat-value">{data.low_stock_count || 0}</div>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <ArrowDown />
                    </div>
                    <div className="stat-info">
                        <h3>Entrées Ce Mois</h3>
                        <div className="stat-value">{stats.total_entrees || 0}</div>
                    </div>
                </div>

                <div className="stat-card danger">
                    <div className="stat-icon">
                        <ArrowUp />
                    </div>
                    <div className="stat-info">
                        <h3>Sorties Ce Mois</h3>
                        <div className="stat-value">{stats.total_sorties || 0}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-movements">
                    <h3>Mouvements Récents</h3>
                    {data.recent_movements && data.recent_movements.length > 0 ? (
                        <div className="movements-list">
                            {data.recent_movements.map(movement => (
                                <div key={movement.id} className="movement-item">
                                    <div className="movement-type">
                                        <span className={`badge ${movement.movement_type}`}>
                                            {movement.movement_type === 'entree' ? 'Entrée' : 'Sortie'}
                                        </span>
                                    </div>
                                    <div className="movement-details">
                                        <div className="item-name">{movement.item_name}</div>
                                        <div className="movement-info">
                                            {movement.quantity} {movement.unit} •
                                            {movement.beneficiary_name && ` Pour: ${movement.beneficiary_name}`} •
                                            {new Date(movement.movement_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="movement-reason">{movement.reason}</div>
                                    {movement.total_cost && (
                                        <div className="movement-cost">{formatAriary(movement.total_cost)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">Aucun mouvement récent</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Composant Stock
const StockTab = ({ items, onRefresh, formatAriary }) => {
    return (
        <div className="stock-tab">
            <div className="tab-header">
                <h3>Articles en Stock</h3>
                <div className="tab-actions">
                    <button className="btn btn-outline">
                        <Filter size={16} />
                        Filtrer
                    </button>
                    <button className="btn btn-outline">
                        <Download size={16} />
                        Exporter
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Catégorie</th>
                            <th>Stock Actuel</th>
                            <th>Stock Minimum</th>
                            <th>Unité</th>
                            <th>Coût Unitaire (Ar)</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="item-name">{item.name}</div>
                                    {item.description && (
                                        <div className="item-desc">{item.description}</div>
                                    )}
                                </td>
                                <td>{item.category_name}</td>
                                <td>
                                    <span className={`stock-value ${item.current_stock <= item.min_stock_level ? 'low' : ''}`}>
                                        {item.current_stock}
                                    </span>
                                </td>
                                <td>{item.min_stock_level}</td>
                                <td>{item.unit}</td>
                                <td>{item.unit_cost ? formatAriary(item.unit_cost) : '-'}</td>
                                <td>
                                    <span className={`status ${item.current_stock <= item.min_stock_level ? 'alert' : 'ok'}`}>
                                        {item.current_stock <= item.min_stock_level ? 'Stock faible' : 'OK'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Composant Mouvements
const MovementsTab = ({ movements, onRefresh, formatAriary }) => {
    return (
        <div className="movements-tab">
            <div className="tab-header">
                <h3>Historique des Mouvements</h3>
                <div className="tab-actions">
                    <button className="btn btn-outline">
                        <Filter size={16} />
                        Filtrer
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Bénéficiaire/Fournisseur</th>
                            <th>Raison</th>
                            <th>Coût Total (Ar)</th>
                            <th>Enregistré par</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map(movement => (
                            <tr key={movement.id}>
                                <td>{new Date(movement.movement_date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${movement.movement_type}`}>
                                        {movement.movement_type === 'entree' ? 'Entrée' : 'Sortie'}
                                    </span>
                                </td>
                                <td>{movement.item_name}</td>
                                <td>{movement.quantity} {movement.unit}</td>
                                <td>{movement.beneficiary_name || '-'}</td>
                                <td>{movement.reason}</td>
                                <td>{movement.total_cost ? formatAriary(movement.total_cost) : '-'}</td>
                                <td>{movement.first_name} {movement.last_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Composant Alertes
const AlertsTab = ({ alerts, onRefresh }) => {
    return (
        <div className="alerts-tab">
            <div className="tab-header">
                <h3>Alertes Stock Faible</h3>
                <div className="alert-count">
                    {alerts.length} article(s) nécessitent une attention
                </div>
            </div>

            {alerts.length > 0 ? (
                <div className="alerts-grid">
                    {alerts.map(alert => (
                        <div key={alert.id} className="alert-card">
                            <div className="alert-icon">
                                <AlertTriangle />
                            </div>
                            <div className="alert-content">
                                <h4>{alert.name}</h4>
                                <p>Catégorie: {alert.category_name}</p>
                                <div className="stock-info">
                                    <span className="current-stock">Stock actuel: {alert.current_stock} {alert.unit}</span>
                                    <span className="min-stock">Stock minimum: {alert.min_stock_level} {alert.unit}</span>
                                </div>
                            </div>
                            <div className="alert-actions">
                                <button className="btn btn-primary btn-sm">
                                    Commander
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-alerts">
                    <Package size={48} />
                    <h3>Aucune alerte pour le moment</h3>
                    <p>Tous les articles sont en stock suffisant</p>
                </div>
            )}
        </div>
    );
};

export default Magasinier;