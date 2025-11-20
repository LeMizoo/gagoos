import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, Plus, Trash2, Edit2, TrendingUp, Users, Zap, Clock } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Navigation from '../../components/shared/Navigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatAriary } from '../../utils/currency';
import '../../pages/dashboard/Dashboard.css';
import './Production.css';

const Production = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [newCommande, setNewCommande] = useState({
        date_commande: new Date().toISOString().split('T')[0],
        type_commande_id: 1,
        taille_2_ans: 0,
        taille_4_ans: 0,
        taille_6_ans: 0,
        taille_8_ans: 0,
        taille_10_ans: 0,
        taille_12_ans: 0,
        taille_s: 0,
        taille_m: 0,
        taille_l: 0,
        couleur_tissus: '',
        heure_debut: '08:00',
        heure_fin: '17:00',
        prix_unitaire_ariary: 0
    });

    const [editingId, setEditingId] = useState(null);
    const [editingCommande, setEditingCommande] = useState(null);

    // Helper: format various date inputs to yyyy-MM-dd for <input type="date">
    const formatDateForInput = (d) => {
        if (!d) return '';
        if (typeof d === 'string') {
            if (d.includes('T')) return d.split('T')[0];
            if (d.length >= 10) return d.slice(0, 10);
        }
        try {
            return new Date(d).toISOString().split('T')[0];
        } catch (err) {
            return '';
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Charger des données de démonstration
            loadDemoData();
        } catch (err) {
            console.error('Erreur chargement données:', err);
            setError(err.message || 'Erreur lors du chargement des données');
            loadDemoData(); // Charger les données de démo en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    const loadDemoData = () => {
        // Données de démonstration
        const demoStats = {
            totalCommandes: 24,
            commandesSemaine: 8,
            chiffreAffaires: 15600000,
            personnelActif: 12
        };

        const demoCommandes = [
            {
                id: 1,
                date_commande: '2024-01-15',
                couleur_tissus: 'Rouge',
                heure_debut: '08:00',
                heure_fin: '17:00',
                taille_2_ans: 5,
                taille_4_ans: 3,
                taille_6_ans: 2,
                taille_8_ans: 4,
                taille_10_ans: 3,
                taille_12_ans: 2,
                taille_s: 10,
                taille_m: 15,
                taille_l: 8,
                prix_unitaire_ariary: 25000,
                statut: 'En cours'
            },
            {
                id: 2,
                date_commande: '2024-01-16',
                couleur_tissus: 'Bleu',
                heure_debut: '08:00',
                heure_fin: '16:00',
                taille_2_ans: 2,
                taille_4_ans: 4,
                taille_6_ans: 3,
                taille_8_ans: 2,
                taille_10_ans: 1,
                taille_12_ans: 2,
                taille_s: 8,
                taille_m: 12,
                taille_l: 6,
                prix_unitaire_ariary: 28000,
                statut: 'Terminé'
            }
        ];

        setStats(demoStats);
        setCommandes(demoCommandes);
        setError(null);
    };

    const handleAddCommande = async (e) => {
        e.preventDefault();
        try {
            // Simulation d'ajout
            const newCommandeWithId = {
                ...newCommande,
                id: Date.now(),
                statut: 'En attente'
            };

            setCommandes([newCommandeWithId, ...commandes]);
            setNewCommande({
                date_commande: new Date().toISOString().split('T')[0],
                type_commande_id: 1,
                taille_2_ans: 0,
                taille_4_ans: 0,
                taille_6_ans: 0,
                taille_8_ans: 0,
                taille_10_ans: 0,
                taille_12_ans: 0,
                taille_s: 0,
                taille_m: 0,
                taille_l: 0,
                couleur_tissus: '',
                heure_debut: '08:00',
                heure_fin: '17:00',
                prix_unitaire_ariary: 0
            });
            setShowForm(false);
            setError(null);
        } catch (err) {
            setError('Erreur création commande: ' + err.message);
        }
    };

    const handleDeleteCommande = async (id) => {
        if (!confirm('Confirmer la suppression?')) return;
        try {
            setCommandes(commandes.filter(c => c.id !== id));
            setError(null);
        } catch (err) {
            setError('Erreur suppression: ' + err.message);
        }
    };

    const handleEditCommande = (commande) => {
        setEditingId(commande.id);
        setEditingCommande({ ...commande });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingCommande(null);
    };

    const handleSaveEdit = async (id) => {
        try {
            setCommandes(commandes.map(c => c.id === id ? editingCommande : c));
            setEditingId(null);
            setEditingCommande(null);
            setError(null);
        } catch (err) {
            setError('Erreur mise à jour: ' + err.message);
        }
    };

    const calculateNombreTotal = (commande) => {
        return (
            (commande.taille_2_ans || 0) +
            (commande.taille_4_ans || 0) +
            (commande.taille_6_ans || 0) +
            (commande.taille_8_ans || 0) +
            (commande.taille_10_ans || 0) +
            (commande.taille_12_ans || 0) +
            (commande.taille_s || commande.taille_S || 0) +
            (commande.taille_m || commande.taille_M || 0) +
            (commande.taille_l || commande.taille_L || 0)
        );
    };

    const calculateMontantTotal = (commande) => {
        return calculateNombreTotal(commande) * (commande.prix_unitaire_ariary || 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Navigation />

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div>
                        <h1>Production</h1>
                        <p>Gestion des commandes et suivi de production</p>
                    </div>
                </div>

                {/* Messages erreur */}
                {error && (
                    <div className="alert alert-error mb-4">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Statistiques */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Total Commandes</h3>
                                <p>{stats.totalCommandes || 0}</p>
                            </div>
                            <TrendingUp className="stat-icon" size={32} style={{ color: '#3b82f6' }} />
                        </div>

                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Cette semaine</h3>
                                <p>{stats.commandesSemaine || 0}</p>
                            </div>
                            <Zap className="stat-icon" size={32} style={{ color: '#10b981' }} />
                        </div>

                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>CA (Ar)</h3>
                                <p>{formatAriary(stats.chiffreAffaires || 0)}</p>
                            </div>
                            <TrendingUp className="stat-icon" size={32} style={{ color: '#8b5cf6' }} />
                        </div>

                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Personnel actif</h3>
                                <p>{stats.personnelActif || 0}</p>
                            </div>
                            <Users className="stat-icon" size={32} style={{ color: '#f59e0b' }} />
                        </div>
                    </div>
                )}

                {/* Bouton ajouter */}
                <div className="section-actions mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        Nouvelle commande
                    </button>
                </div>

                {/* Formulaire ajout */}
                {showForm && (
                    <div className="form-container">
                        <h2>Nouvelle Commande</h2>
                        <form onSubmit={handleAddCommande}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={newCommande.date_commande}
                                        onChange={(e) => setNewCommande({ ...newCommande, date_commande: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Couleur Tissus</label>
                                    <input
                                        type="text"
                                        value={newCommande.couleur_tissus}
                                        onChange={(e) => setNewCommande({ ...newCommande, couleur_tissus: e.target.value })}
                                        placeholder="ex: Rouge, Bleu..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Heure Début</label>
                                    <input
                                        type="time"
                                        value={newCommande.heure_debut}
                                        onChange={(e) => setNewCommande({ ...newCommande, heure_debut: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Heure Fin</label>
                                    <input
                                        type="time"
                                        value={newCommande.heure_fin}
                                        onChange={(e) => setNewCommande({ ...newCommande, heure_fin: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Taille 2-4 ans</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCommande.taille_2_ans}
                                        onChange={(e) => setNewCommande({ ...newCommande, taille_2_ans: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Taille S</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCommande.taille_s}
                                        onChange={(e) => setNewCommande({ ...newCommande, taille_s: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Taille M</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCommande.taille_m}
                                        onChange={(e) => setNewCommande({ ...newCommande, taille_m: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Taille L</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCommande.taille_l}
                                        onChange={(e) => setNewCommande({ ...newCommande, taille_l: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Prix Unitaire (Ar)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCommande.prix_unitaire_ariary}
                                        onChange={(e) => setNewCommande({ ...newCommande, prix_unitaire_ariary: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Créer</button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-secondary"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des commandes */}
                <div className="content-section">
                    <div className="section-header">
                        <h2>Commandes</h2>
                    </div>

                    <div style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <div>
                            <strong>Total Général (toutes commandes):</strong>
                            <span style={{ marginLeft: 8 }}>{formatAriary(commandes.reduce((acc, c) => acc + calculateMontantTotal(c), 0))}</span>
                        </div>
                    </div>

                    {commandes.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucune commande</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Couleur</th>
                                        <th>Horaires</th>
                                        <th>Nombre Total</th>
                                        <th>Prix Unitaire (Ar)</th>
                                        <th>Montant Total (Ar)</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commandes.map(commande => (
                                        <tr key={commande.id}>
                                            <td>{commande.date_commande}</td>
                                            <td>{commande.couleur_tissus}</td>
                                            <td>{commande.heure_debut} - {commande.heure_fin}</td>
                                            <td className="font-weight-bold">{calculateNombreTotal(commande)}</td>
                                            <td>{formatAriary(commande.prix_unitaire_ariary || 0)}</td>
                                            <td className="font-weight-bold">{formatAriary(calculateMontantTotal(commande))}</td>
                                            <td>
                                                <span className={`status-badge ${(commande.statut || 'En attente').toLowerCase().replace(' ', '-')}`}>
                                                    {commande.statut || 'En attente'}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={() => handleEditCommande(commande)}
                                                    className="btn-icon"
                                                    title="Éditer"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCommande(commande.id)}
                                                    className="btn-icon btn-danger"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal édition */}
                {editingId && editingCommande && (
                    <div className="modal-overlay" onClick={handleCancelEdit}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Éditer Commande #{editingId}</h2>
                                <button className="modal-close" onClick={handleCancelEdit}>×</button>
                            </div>
                            <form className="modal-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={formatDateForInput(editingCommande.date_commande)}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, date_commande: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Couleur Tissus</label>
                                        <input
                                            type="text"
                                            value={editingCommande.couleur_tissus}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, couleur_tissus: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Heure Début</label>
                                        <input
                                            type="time"
                                            value={editingCommande.heure_debut}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, heure_debut: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Heure Fin</label>
                                        <input
                                            type="time"
                                            value={editingCommande.heure_fin}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, heure_fin: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 2 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_2_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_2_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 4 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_4_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_4_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 6 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_6_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_6_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 8 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_8_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_8_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 10 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_10_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_10_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille 12 ans</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_12_ans || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_12_ans: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille S</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_s || editingCommande.taille_S || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_s: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille M</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_m || editingCommande.taille_M || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_m: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Taille L</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.taille_l || editingCommande.taille_L || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, taille_l: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Prix Unitaire (Ar)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editingCommande.prix_unitaire_ariary || 0}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, prix_unitaire_ariary: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Statut</label>
                                        <select
                                            value={editingCommande.statut || 'En attente'}
                                            onChange={(e) => setEditingCommande({ ...editingCommande, statut: e.target.value })}
                                        >
                                            <option value="En attente">En attente</option>
                                            <option value="En cours">En cours</option>
                                            <option value="Terminé">Terminé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveEdit(editingId)}
                                        className="btn btn-primary"
                                    >
                                        Sauvegarder
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="btn btn-secondary"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Production;