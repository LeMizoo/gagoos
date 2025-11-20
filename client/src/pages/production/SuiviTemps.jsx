import React, { useState } from 'react';

const SuiviTemps = () => {
    const [tempsProduction, setTempsProduction] = useState([
        { commande: "#245", produit: "T-shirts", temps_estime: "8h", temps_reel: "7h30", ecart: "-30min" },
        { commande: "#246", produit: "Flyers", temps_estime: "4h", temps_reel: "3h45", ecart: "-15min" }
    ]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie mb-6">
                ⏰ Suivi des Temps de Production
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-bleu-serigraphie text-white">
                        <tr>
                            <th className="p-3 text-left">Commande</th>
                            <th className="p-3 text-left">Produit</th>
                            <th className="p-3 text-left">Temps estimé</th>
                            <th className="p-3 text-left">Temps réel</th>
                            <th className="p-3 text-left">Écart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tempsProduction.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{item.commande}</td>
                                <td className="p-3">{item.produit}</td>
                                <td className="p-3">{item.temps_estime}</td>
                                <td className="p-3">{item.temps_reel}</td>
                                <td className={`p-3 font-bold ${item.ecart.startsWith('-') ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {item.ecart}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuiviTemps;