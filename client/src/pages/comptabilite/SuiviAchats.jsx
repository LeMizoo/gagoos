import React, { useState } from 'react';

const SuiviAchats = () => {
    const [achats, setAchats] = useState([
        { id: 1, fournisseur: "InkCorp", produit: "Encre noire", quantite: "50kg", prix: "1200€", date: "10/12/2024", statut: "Livré" },
        { id: 2, fournisseur: "TextilePro", produit: "T-shirts XL", quantite: "500", prix: "750€", date: "12/12/2024", statut: "En cours" }
    ]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie mb-6">
                🛒 Suivi des Achats
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-bleu-serigraphie text-white">
                        <tr>
                            <th className="p-3 text-left">Fournisseur</th>
                            <th className="p-3 text-left">Produit</th>
                            <th className="p-3 text-left">Quantité</th>
                            <th className="p-3 text-left">Prix</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {achats.map(achat => (
                            <tr key={achat.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{achat.fournisseur}</td>
                                <td className="p-3">{achat.produit}</td>
                                <td className="p-3">{achat.quantite}</td>
                                <td className="p-3 font-bold text-green-500">{achat.prix}</td>
                                <td className="p-3">{achat.date}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${achat.statut === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {achat.statut}
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

export default SuiviAchats;