// components/production/CommandesList.jsx
import React, { useState } from 'react';

const CommandesList = () => {
    const [commandes, setCommandes] = useState([
        {
            id: 1,
            client: "Client A",
            type_produit: "Textile",
            quantite: 500,
            date_livraison: "15/12/2024",
            statut: "En production",
            priorite: "Normal"
        }
    ]);

    const getStatusColor = (statut) => {
        const colors = {
            'Devis': 'bg-gray-200',
            'Confirmé': 'bg-blue-200',
            'En production': 'bg-orange-200',
            'Livré': 'bg-green-200'
        };
        return colors[statut] || 'bg-gray-200';
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">📋 Gestion des Commandes</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-bleu-serigraphie text-white">
                        <tr>
                            <th className="p-3">Client</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Quantité</th>
                            <th className="p-3">Livraison</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3">Priorité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map(commande => (
                            <tr key={commande.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{commande.client}</td>
                                <td className="p-3">{commande.type_produit}</td>
                                <td className="p-3">{commande.quantite}</td>
                                <td className="p-3">{commande.date_livraison}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full ${getStatusColor(commande.statut)}`}>
                                        {commande.statut}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {commande.priorite === 'Urgent' ? '🚨' : '✅'} {commande.priorite}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CommandesList;