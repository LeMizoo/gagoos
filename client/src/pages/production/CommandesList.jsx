import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Edit,
    CheckCircle,
    Clock,
    PlayCircle,
    PauseCircle,
    Eye,
    ArrowUpDown,
    Play,
    Square,
    Truck
} from 'lucide-react';
import { formatAriary } from '../../utils/currency';
import './Production.css';

const CommandesList = () => {
    const { user } = useContext(AuthContext);
    const [commandes, setCommandes] = useState([]);
    const [filteredCommandes, setFilteredCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortField, setSortField] = useState('date_livraison');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showForm, setShowForm] = useState(false);
    const [editingCommande, setEditingCommande] = useState(null);

    // Statuts possibles pour une commande
    const statuts = [
        { value: 'en_attente', label: 'En Attente', color: 'gray', progression: 0 },
        { value: 'en_preparation', label: 'En Préparation', color: 'blue', progression: 25 },
        { value: 'en_production', label: 'En Production', color: 'orange', progression: 60 },
        { value: 'en_controle', label: 'En Contrôle Qualité', color: 'purple', progression: 90 },
        { value: 'termine', label: 'Terminé', color: 'green', progression: 100 },
        { value: 'livre', label: 'Livré', color: 'teal', progression: 100 }
    ];

    // État du formulaire
    const [formData, setFormData] = useState({
        client: "",
        type_produit: "Textile",
        produit: "",
        quantite: 0,
        date_livraison: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        statut: "en_attente",
        priorite: "moyenne",
        date_commande: new Date().toISOString().split('T')[0],
        couleur_tissus: '',
        heure_debut: '',
        heure_fin: '',
        taille_2_ans: 0,
        taille_4_ans: 0,
        taille_6_ans: 0,
        taille_8_ans: 0,
        taille_10_ans: 0,
        taille_12_ans: 0,
        taille_s: 0,
        taille_m: 0,
        taille_l: 0
    });

    const [unitPrices, setUnitPrices] = useState({
        prix_unitaire_2_ans: 5000,
        prix_unitaire_4_ans: 5000,
        prix_unitaire_6_ans: 5000,
        prix_unitaire_8_ans: 5000,
        prix_unitaire_10_ans: 5000,
        prix_unitaire_12_ans: 5000,
        prix_unitaire_s: 5000,
        prix_unitaire_m: 5000,
        prix_unitaire_l: 5000
    });

    useEffect(() => {
        loadCommandes();
    }, []);

    useEffect(() => {
        filterAndSortCommandes();
    }, [commandes, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

    const loadCommandes = () => {
        const demoCommandes = [
            {
                id: 1,
                numero: 'CMD-2024-001',
                client: 'Boutique Style Madagascar',
                produit: 'Barkoay Premium',
                type_produit: 'Textile',
                quantite: 50,
                montant: 2250000,
                date_commande: '2024-01-10',
                date_livraison: '2024-01-20',
                statut: 'en_production',
                priorite: 'haute',
                equipe: 'Équipe Alpha',
                etape_actuelle: 'Assemblage',
                progression: 60,
                couleur_tissus: 'Bleu',
                taille_s: 20,
                taille_m: 25,
                taille_l: 5
            },
            {
                id: 2,
                numero: 'CMD-2024-002',
                client: 'Artisanat Tanà',
                produit: 'Barkoay Standard',
                type_produit: 'Textile',
                quantite: 35,
                montant: 1440000,
                date_commande: '2024-01-12',
                date_livraison: '2024-01-22',
                statut: 'en_preparation',
                priorite: 'moyenne',
                equipe: 'Équipe Beta',
                etape_actuelle: 'Découpe',
                progression: 30,
                couleur_tissus: 'Rouge',
                taille_s: 15,
                taille_m: 15,
                taille_l: 5
            },
            {
                id: 3,
                numero: 'CMD-2024-003',
                client: 'Hôtel Sakamanga',
                produit: 'Accessoires Barkoay',
                type_produit: 'Accessoires',
                quantite: 20,
                montant: 1260000,
                date_commande: '2024-01-08',
                date_livraison: '2024-01-18',
                statut: 'termine',
                priorite: 'basse',
                equipe: 'Équipe Gamma',
                etape_actuelle: 'Contrôle Final',
                progression: 100,
                couleur_tissus: 'Vert',
                taille_s: 10,
                taille_m: 8,
                taille_l: 2
            },
            {
                id: 4,
                numero: 'CMD-2024-004',
                client: 'Export Madagascar',
                produit: 'Barkoay Deluxe',
                type_produit: 'Textile',
                quantite: 25,
                montant: 2340000,
                date_commande: '2024-01-14',
                date_livraison: '2024-01-21',
                statut: 'en_controle',
                priorite: 'haute',
                equipe: 'Équipe Alpha',
                etape_actuelle: 'Contrôle Qualité',
                progression: 90,
                couleur_tissus: 'Noir',
                taille_s: 10,
                taille_m: 10,
                taille_l: 5
            },
            {
                id: 5,
                numero: 'CMD-2024-005',
                client: 'Galerie Art Mada',
                produit: 'Barkoay Standard',
                type_produit: 'Textile',
                quantite: 40,
                montant: 1710000,
                date_commande: '2024-01-05',
                date_livraison: '2024-01-15',
                statut: 'livre',
                priorite: 'moyenne',
                equipe: 'Équipe Delta',
                etape_actuelle: 'Livraison',
                progression: 100,
                couleur_tissus: 'Bleu Marine',
                taille_s: 15,
                taille_m: 20,
                taille_l: 5
            }
        ];

        setCommandes(demoCommandes);
        setLoading(false);
    };

    const filterAndSortCommandes = () => {
        let filtered = commandes.filter(commande => {
            const matchesSearch =
                commande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                commande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                commande.produit.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || commande.statut === statusFilter;
            const matchesPriority = priorityFilter === 'all' || commande.priorite === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Tri
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (sortField.includes('date')) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredCommandes(filtered);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Fonctions pour changer le statut des commandes
    const demarrerProduction = (commandeId) => {
        setCommandes(prev => prev.map(commande =>
            commande.id === commandeId
                ? {
                    ...commande,
                    statut: 'en_production',
                    progression: 60,
                    etape_actuelle: 'Production'
                }
                : commande
        ));
    };

    const mettreEnPause = (commandeId) => {
        setCommandes(prev => prev.map(commande =>
            commande.id === commandeId
                ? {
                    ...commande,
                    statut: 'en_preparation',
                    progression: 25,
                    etape_actuelle: 'En pause'
                }
                : commande
        ));
    };

    const passerEnControle = (commandeId) => {
        setCommandes(prev => prev.map(commande =>
            commande.id === commandeId
                ? {
                    ...commande,
                    statut: 'en_controle',
                    progression: 90,
                    etape_actuelle: 'Contrôle Qualité'
                }
                : commande
        ));
    };

    const terminerCommande = (commandeId) => {
        setCommandes(prev => prev.map(commande =>
            commande.id === commandeId
                ? {
                    ...commande,
                    statut: 'termine',
                    progression: 100,
                    etape_actuelle: 'Terminé'
                }
                : commande
        ));
    };

    const livrerCommande = (commandeId) => {
        setCommandes(prev => prev.map(commande =>
            commande.id === commandeId
                ? {
                    ...commande,
                    statut: 'livre',
                    progression: 100,
                    etape_actuelle: 'Livré'
                }
                : commande
        ));
    };

    const getStatutInfo = (statut) => {
        return statuts.find(s => s.value === statut) || statuts[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const totalPieces = getTotalPieces(formData);
            const totalAmount = calculateTotalAmount(formData);

            if (!editingCommande) {
                const newCommande = {
                    id: Date.now(),
                    numero: `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
                    ...formData,
                    quantite: totalPieces,
                    montant: totalAmount,
                    progression: getStatutInfo(formData.statut).progression,
                    etape_actuelle: getEtapeActuelle(formData.statut),
                    equipe: 'À assigner',
                    created_at: new Date().toISOString()
                };
                setCommandes(prev => [newCommande, ...prev]);
                alert('✅ Commande créée avec succès!');
            } else {
                setCommandes(prev => prev.map(cmd =>
                    cmd.id === editingCommande.id
                        ? {
                            ...cmd,
                            ...formData,
                            quantite: totalPieces,
                            montant: totalAmount,
                            progression: getStatutInfo(formData.statut).progression,
                            etape_actuelle: getEtapeActuelle(formData.statut)
                        }
                        : cmd
                ));
                alert('✅ Commande modifiée avec succès!');
            }

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error('❌ Erreur sauvegarde commande:', error);
            alert('❌ Erreur: ' + error.message);
        }
    };

    const getEtapeActuelle = (statut) => {
        const etapes = {
            'en_attente': 'En attente',
            'en_preparation': 'Préparation',
            'en_production': 'Production',
            'en_controle': 'Contrôle Qualité',
            'termine': 'Terminé',
            'livre': 'Livré'
        };
        return etapes[statut] || 'En attente';
    };

    const calculateTotalAmount = (data) => {
        return (
            (data.taille_2_ans || 0) * (unitPrices.prix_unitaire_2_ans || 0) +
            (data.taille_4_ans || 0) * (unitPrices.prix_unitaire_4_ans || 0) +
            (data.taille_6_ans || 0) * (unitPrices.prix_unitaire_6_ans || 0) +
            (data.taille_8_ans || 0) * (unitPrices.prix_unitaire_8_ans || 0) +
            (data.taille_10_ans || 0) * (unitPrices.prix_unitaire_10_ans || 0) +
            (data.taille_12_ans || 0) * (unitPrices.prix_unitaire_12_ans || 0) +
            (data.taille_s || 0) * (unitPrices.prix_unitaire_s || 0) +
            (data.taille_m || 0) * (unitPrices.prix_unitaire_m || 0) +
            (data.taille_l || 0) * (unitPrices.prix_unitaire_l || 0)
        );
    };

    const getTotalPieces = (data) => {
        return (
            (data.taille_2_ans || 0) + (data.taille_4_ans || 0) + (data.taille_6_ans || 0) +
            (data.taille_8_ans || 0) + (data.taille_10_ans || 0) + (data.taille_12_ans || 0) +
            (data.taille_s || 0) + (data.taille_m || 0) + (data.taille_l || 0)
        );
    };

    const resetForm = () => {
        setFormData({
            client: "",
            type_produit: "Textile",
            produit: "",
            quantite: 0,
            date_livraison: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            statut: "en_attente",
            priorite: "moyenne",
            date_commande: new Date().toISOString().split('T')[0],
            couleur_tissus: '',
            heure_debut: '',
            heure_fin: '',
            taille_2_ans: 0,
            taille_4_ans: 0,
            taille_6_ans: 0,
            taille_8_ans: 0,
            taille_10_ans: 0,
            taille_12_ans: 0,
            taille_s: 0,
            taille_m: 0,
            taille_l: 0
        });
        setEditingCommande(null);
    };

    const editCommande = (commande) => {
        setFormData({
            client: commande.client || "",
            type_produit: commande.type_produit || "Textile",
            produit: commande.produit || "",
            quantite: commande.quantite || 0,
            date_livraison: commande.date_livraison || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            statut: commande.statut || "en_attente",
            priorite: commande.priorite || "moyenne",
            date_commande: commande.date_commande ? new Date(commande.date_commande).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            couleur_tissus: commande.couleur_tissus || '',
            heure_debut: commande.heure_debut || '',
            heure_fin: commande.heure_fin || '',
            taille_2_ans: commande.taille_2_ans || 0,
            taille_4_ans: commande.taille_4_ans || 0,
            taille_6_ans: commande.taille_6_ans || 0,
            taille_8_ans: commande.taille_8_ans || 0,
            taille_10_ans: commande.taille_10_ans || 0,
            taille_12_ans: commande.taille_12_ans || 0,
            taille_s: commande.taille_s || 0,
            taille_m: commande.taille_m || 0,
            taille_l: commande.taille_l || 0
        });
        setEditingCommande(commande);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="production-container">
                <div className="loading-spinner">Chargement des commandes...</div>
            </div>
        );
    }

    return (
        <div className="production-container">
            <div className="production-header">
                <div className="header-content">
                    <h1>Gestion des Commandes</h1>
                    <p>Suivez et gérez l'ensemble des commandes en cours</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    <Plus size={16} />
                    Nouvelle Commande
                </button>
            </div>

            {/* Filtres et Recherche */}
            <div className="filters-section">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tous les statuts</option>
                        {statuts.map(statut => (
                            <option key={statut.value} value={statut.value}>
                                {statut.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="all">Toutes priorités</option>
                        <option value="haute">Haute</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="basse">Basse</option>
                    </select>
                </div>
            </div>

            {/* Liste des Commandes */}
            <div className="commandes-table-container">
                <table className="commandes-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('numero')}>
                                <span>N° Commande</span>
                                <ArrowUpDown size={14} />
                            </th>
                            <th onClick={() => handleSort('client')}>
                                <span>Client</span>
                                <ArrowUpDown size={14} />
                            </th>
                            <th>Produit</th>
                            <th onClick={() => handleSort('date_livraison')}>
                                <span>Livraison</span>
                                <ArrowUpDown size={14} />
                            </th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Progression</th>
                            <th>Équipe</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommandes.map(commande => {
                            const statutInfo = getStatutInfo(commande.statut);
                            return (
                                <tr key={commande.id}>
                                    <td className="commande-numero">
                                        <strong>{commande.numero}</strong>
                                    </td>
                                    <td className="commande-client">
                                        {commande.client}
                                    </td>
                                    <td className="commande-produit">
                                        <div>
                                            <strong>{commande.produit}</strong>
                                            <span className="quantite">{commande.quantite} unités</span>
                                            {commande.couleur_tissus && (
                                                <span className="couleur-indicator">
                                                    {commande.couleur_tissus}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="commande-date">
                                        {new Date(commande.date_livraison).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="commande-montant">
                                        {formatAriary(commande.montant)}
                                    </td>
                                    <td className="commande-statut">
                                        <span className={`status-badge ${statutInfo.color}`}>
                                            {statutInfo.label}
                                        </span>
                                    </td>
                                    <td className="commande-progression">
                                        <div className="progression-container">
                                            <div className="progression-bar">
                                                <div
                                                    className="progression-fill"
                                                    style={{ width: `${commande.progression}%` }}
                                                ></div>
                                            </div>
                                            <span className="progression-text">
                                                {commande.progression}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="commande-equipe">
                                        {commande.equipe}
                                    </td>
                                    <td className="commande-actions">
                                        <div className="actions-group">
                                            {/* Actions selon le statut */}
                                            {commande.statut === 'en_attente' && (
                                                <button
                                                    onClick={() => demarrerProduction(commande.id)}
                                                    className="btn-action start"
                                                    title="Démarrer production"
                                                >
                                                    <Play size={16} />
                                                </button>
                                            )}

                                            {commande.statut === 'en_preparation' && (
                                                <button
                                                    onClick={() => demarrerProduction(commande.id)}
                                                    className="btn-action start"
                                                    title="Démarrer production"
                                                >
                                                    <Play size={16} />
                                                </button>
                                            )}

                                            {commande.statut === 'en_production' && (
                                                <>
                                                    <button
                                                        onClick={() => mettreEnPause(commande.id)}
                                                        className="btn-action pause"
                                                        title="Mettre en pause"
                                                    >
                                                        <PauseCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => passerEnControle(commande.id)}
                                                        className="btn-action next"
                                                        title="Passer en contrôle qualité"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {commande.statut === 'en_controle' && (
                                                <button
                                                    onClick={() => terminerCommande(commande.id)}
                                                    className="btn-action complete"
                                                    title="Marquer comme terminé"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}

                                            {commande.statut === 'termine' && (
                                                <button
                                                    onClick={() => livrerCommande(commande.id)}
                                                    className="btn-action deliver"
                                                    title="Marquer comme livré"
                                                >
                                                    <Truck size={16} />
                                                </button>
                                            )}

                                            {/* Action Voir Détails */}
                                            <button
                                                className="btn-action view"
                                                title="Voir détails"
                                                onClick={() => editCommande(commande)}
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {/* Action Éditer */}
                                            <button
                                                className="btn-action edit"
                                                title="Modifier"
                                                onClick={() => editCommande(commande)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredCommandes.length === 0 && (
                    <div className="empty-state">
                        <p>Aucune commande trouvée</p>
                    </div>
                )}
            </div>

            {/* Résumé */}
            <div className="commandes-summary">
                <div className="summary-card">
                    <h3>Total Commandes</h3>
                    <span className="summary-value">{commandes.length}</span>
                </div>
                <div className="summary-card">
                    <h3>En Production</h3>
                    <span className="summary-value">
                        {commandes.filter(c => c.statut === 'en_production').length}
                    </span>
                </div>
                <div className="summary-card">
                    <h3>À Livrer cette semaine</h3>
                    <span className="summary-value">
                        {commandes.filter(c => {
                            const livraison = new Date(c.date_livraison);
                            const aujourdhui = new Date();
                            const semaine = new Date(aujourdhui.setDate(aujourdhui.getDate() + 7));
                            return livraison <= semaine;
                        }).length}
                    </span>
                </div>
            </div>

            {/* Formulaire de commande */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingCommande ? 'Modifier la Commande' : 'Nouvelle Commande'}</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="close-button"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="form-container">
                            {/* Section informations de base */}
                            <div className="form-section">
                                <h4>Informations de base</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Client *</label>
                                        <input
                                            type="text"
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type de produit *</label>
                                        <select
                                            value={formData.type_produit}
                                            onChange={(e) => setFormData({ ...formData, type_produit: e.target.value })}
                                            required
                                        >
                                            <option value="Textile">Textile</option>
                                            <option value="Papeterie">Papeterie</option>
                                            <option value="Accessoires">Accessoires</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Produit *</label>
                                        <input
                                            type="text"
                                            value={formData.produit}
                                            onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Couleur tissus</label>
                                        <input
                                            type="text"
                                            value={formData.couleur_tissus}
                                            onChange={(e) => setFormData({ ...formData, couleur_tissus: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section dates et statut */}
                            <div className="form-section">
                                <h4>Planning et statut</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Date commande *</label>
                                        <input
                                            type="date"
                                            value={formData.date_commande}
                                            onChange={(e) => setFormData({ ...formData, date_commande: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date livraison *</label>
                                        <input
                                            type="date"
                                            value={formData.date_livraison}
                                            onChange={(e) => setFormData({ ...formData, date_livraison: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Statut *</label>
                                        <select
                                            value={formData.statut}
                                            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                                            required
                                        >
                                            {statuts.map(statut => (
                                                <option key={statut.value} value={statut.value}>
                                                    {statut.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Priorité *</label>
                                        <select
                                            value={formData.priorite}
                                            onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                                            required
                                        >
                                            <option value="basse">Basse</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="haute">Haute</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section quantités */}
                            <div className="form-section">
                                <h4>Quantités par taille</h4>
                                <div className="quantites-grid">
                                    {[
                                        { key: 'taille_2_ans', label: '2 ans', priceKey: 'prix_unitaire_2_ans' },
                                        { key: 'taille_4_ans', label: '4 ans', priceKey: 'prix_unitaire_4_ans' },
                                        { key: 'taille_6_ans', label: '6 ans', priceKey: 'prix_unitaire_6_ans' },
                                        { key: 'taille_8_ans', label: '8 ans', priceKey: 'prix_unitaire_8_ans' },
                                        { key: 'taille_10_ans', label: '10 ans', priceKey: 'prix_unitaire_10_ans' },
                                        { key: 'taille_12_ans', label: '12 ans', priceKey: 'prix_unitaire_12_ans' },
                                        { key: 'taille_s', label: 'S', priceKey: 'prix_unitaire_s' },
                                        { key: 'taille_m', label: 'M', priceKey: 'prix_unitaire_m' },
                                        { key: 'taille_l', label: 'L', priceKey: 'prix_unitaire_l' }
                                    ].map(({ key, label, priceKey }) => (
                                        <div key={key} className="quantite-item">
                                            <label>{label}</label>
                                            <div className="quantite-inputs">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData[key]}
                                                    onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) || 0 })}
                                                    placeholder="Qté"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="100"
                                                    value={unitPrices[priceKey]}
                                                    onChange={(e) => setUnitPrices({ ...unitPrices, [priceKey]: parseFloat(e.target.value) || 0 })}
                                                    placeholder="Prix"
                                                />
                                            </div>
                                            <div className="sous-total">
                                                {((formData[key] || 0) * (unitPrices[priceKey] || 0)).toLocaleString('fr-FR')} Ar
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total général */}
                                <div className="total-section">
                                    <div className="total-item">
                                        <span>Quantité totale:</span>
                                        <strong>{getTotalPieces(formData)} pièces</strong>
                                    </div>
                                    <div className="total-item">
                                        <span>Total général:</span>
                                        <strong className="total-amount">
                                            {calculateTotalAmount(formData).toLocaleString('fr-FR')} Ar
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Actions du formulaire */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    {editingCommande ? 'Modifier' : 'Créer'} la commande
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommandesList;