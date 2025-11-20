// components/comptabilite/Fiscalite.jsx
import React, { useState } from 'react';

const Fiscalite = () => {
    const [tva, setTva] = useState({
        collectee: {
            base: 10000,
            taux: 20,
            montant: 2000
        },
        deductible: {
            achats_materiel: 500,
            charges_diverses: 300,
            immobilisations: 200
        },
        a_payer: {
            calcul: 1000,
            echeances: "Mensuelle"
        }
    });

    const [taxeCommunale, setTaxeCommunale] = useState({
        base_calcul: 50000,
        taux: 5,
        montant: 2500,
        periodicite: "Trimestrielle"
    });

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">📋 Gestion Fiscalité</h2>

            {/* TVA */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">TVA (20%)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-semibold">TVA Collectée</h4>
                        <p>Base: {tva.collectee.base}€</p>
                        <p>Montant: {tva.collectee.montant}€</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">TVA Déductible</h4>
                        <p>Total: {Object.values(tva.deductible).reduce((a, b) => a + b, 0)}€</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded">
                        <h4 className="font-semibold">TVA à Payer</h4>
                        <p className="text-xl font-bold">{tva.a_payer.calcul}€</p>
                        <p>Échéance: {tva.a_payer.echeances}</p>
                    </div>
                </div>
            </div>

            {/* Taxe Communale */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Taxe Communale (5%)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p>Base de calcul: {taxeCommunale.base_calcul}€</p>
                        <p>Taux: {taxeCommunale.taux}%</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded">
                        <h4 className="font-semibold">Montant dû</h4>
                        <p className="text-xl font-bold">{taxeCommunale.montant}€</p>
                        <p>Périodicité: {taxeCommunale.periodicite}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fiscalite;