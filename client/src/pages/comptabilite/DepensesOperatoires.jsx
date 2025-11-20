import React, { useState } from 'react';

const DepensesOperatoires = () => {
    const [depenses, setDepenses] = useState({
        energie: {
            electricite: "450€",
            gaz: "180€",
            eau: "75€"
        },
        fournitures: {
            peintures: "1,200€",
            materiels: "850€",
            entretien: "150€"
        },
        logistique: {
            deplacements: "300€",
            livraisons: "420€",
            emballages: "180€"
        }
    });

    const totalDepenses = Object.values(depenses).reduce((total, categorie) => {
        return total + Object.values(categorie).reduce((catTotal, montant) => {
            return catTotal + parseFloat(montant.replace('€', '').replace(',', ''));
        }, 0);
    }, 0);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie">
                💰 Dépenses Opérationnelles
            </h1>

            {/* Total */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-2xl font-bold text-red-500">
                    Total des dépenses: {totalDepenses.toLocaleString()}€
                </h2>
            </div>

            {/* Énergie */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">⚡ Énergie</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Électricité</p>
                        <p className="text-2xl text-orange-creatif">{depenses.energie.electricite}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Gaz</p>
                        <p className="text-2xl text-orange-500">{depenses.energie.gaz}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Eau</p>
                        <p className="text-2xl text-blue-500">{depenses.energie.eau}</p>
                    </div>
                </div>
            </div>

            {/* Fournitures */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">🛍️ Fournitures</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Peintures & Encres</p>
                        <p className="text-2xl text-purple-500">{depenses.fournitures.peintures}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Matériels</p>
                        <p className="text-2xl text-gray-500">{depenses.fournitures.materiels}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Entretien</p>
                        <p className="text-2xl text-green-500">{depenses.fournitures.entretien}</p>
                    </div>
                </div>
            </div>

            {/* Logistique */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">🚚 Logistique</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Déplacements</p>
                        <p className="text-2xl text-yellow-500">{depenses.logistique.deplacements}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Livraisons</p>
                        <p className="text-2xl text-blue-500">{depenses.logistique.livraisons}</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                        <p className="text-lg font-semibold">Emballages</p>
                        <p className="text-2xl text-brown-500">{depenses.logistique.emballages}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepensesOperatoires;