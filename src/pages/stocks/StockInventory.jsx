/**
 * @fileoverview Gestion des stocks de matières premières et inventaire hebdomadaire avec calcul des écarts.
 * @module pages/stocks/StockInventory
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 * Interactivité tactile et barres de niveau dynamiques.
 */

import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import {
  Package,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Search,
  Layers
} from 'lucide-react';

const PRODUITS_INITIAUX = [
  { id: '1', nom: 'Riz Blanc Supérieur', categorie: 'Céréales', unite: 'sac', stockTheorique: 18, stockPhysique: 18, seuil: 5, prixAchat: 18500, peremption: '2027-01-15' },
  { id: '2', nom: 'Semoule de manioc (Attiéké)', categorie: 'Féculents', unite: 'kg', stockTheorique: 35, stockPhysique: 32, seuil: 10, prixAchat: 450, peremption: '2026-11-20' },
  { id: '3', nom: 'Thon frais de pêche', categorie: 'Poissons', unite: 'unité', stockTheorique: 40, stockPhysique: 38, seuil: 15, prixAchat: 400, peremption: '2026-11-09' },
  { id: '4', nom: 'Huile Végétale 5L', categorie: 'Épicerie', unite: 'bidon', stockTheorique: 10, stockPhysique: 10, seuil: 3, prixAchat: 8500, peremption: '2027-06-30' },
  { id: '5', nom: 'Viande de Bœuf découpée', categorie: 'Viandes', unite: 'kg', stockTheorique: 25, stockPhysique: 24, seuil: 8, prixAchat: 3200, peremption: '2026-11-12' },
  { id: '6', nom: 'Piment frais & Oignons', categorie: 'Légumes', unite: 'kg', stockTheorique: 8, stockPhysique: 6.5, seuil: 3, prixAchat: 1200, peremption: '2026-11-14' }
];

export const StockInventory = () => {
  const [produits, setProduits] = useState(PRODUITS_INITIAUX);
  const [recherche, setRecherche] = useState('');
  const [modeInventaire, setModeInventaire] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePhysiqueChange = (id, valeur) => {
    setProduits(
      produits.map((p) =>
        p.id === id ? { ...p, stockPhysique: Number(valeur) } : p
      )
    );
  };

  const validerInventaire = () => {
    setMessage('Inventaire hebdomadaire validé. Tous les écarts ont été enregistrés avec traçabilité.');
    setModeInventaire(false);
    setTimeout(() => setMessage(null), 4500);
  };

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.categorie.toLowerCase().includes(recherche.toLowerCase())
  );

  const valeurTotale = produits.reduce(
    (sum, p) => sum + p.stockTheorique * p.prixAchat,
    0
  );
  const nbCritiques = produits.filter((p) => p.stockTheorique <= p.seuil).length;

  return (
    <AppLayout
      title="Stocks & Inventaire Hebdomadaire"
      subtitle="Suivi des matières premières locales, barres de niveau en direct et réconciliation physique"
    >
      {message && (
        <div className="flex items-center p-3.5 mb-6 text-xs rounded-xl bg-brand-light border border-brand-forest/20 text-brand-forest shadow-sm animate-fade-in-down">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 animate-bounce-subtle" />
          <span className="font-bold">{message}</span>
        </div>
      )}

      {/* Cartes KPI avec micro-animations et élévation douce */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            titre="Matières en Réserve"
            valeur={`${produits.length} références`}
            icone={Layers}
            variant="forest"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            titre="Valeur Globale Estimée"
            valeur={`${valeurTotale.toLocaleString('fr-FR')} F`}
            icone={Package}
            variant="forest"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            titre="Seuils Critiques"
            valeur={`${nbCritiques} en alerte`}
            icone={AlertTriangle}
            variant="terracotta"
            badge={nbCritiques > 0 ? 'Réapprovisionner' : 'Optimal'}
          />
        </div>
      </div>

      {/* Barre d'outils et bascule mode inventaire */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-surface-textMuted" />
          <input
            type="text"
            placeholder="Rechercher riz, poisson, huile..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-9 input-field text-xs py-2.5 transition-all duration-200"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {!modeInventaire ? (
            <button
              onClick={() => setModeInventaire(true)}
              className="btn-primary text-xs flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-xl shadow-sm active:scale-95"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              <span>Lancer l’inventaire du Samedi</span>
            </button>
          ) : (
            <button
              onClick={validerInventaire}
              className="btn-accent text-xs flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-xl shadow-sm active:scale-95"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Valider les écarts constatés</span>
            </button>
          )}
        </div>
      </div>

      {/* Tableau complet avec barres de niveau et survol interactif */}
      <div className="card-container overflow-hidden shadow-sm animate-fade-in-up stagger-2">
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-card">
          <h3 className="text-sm font-bold text-surface-text">
            {modeInventaire
              ? 'Mode Inventaire Hebdomadaire Actif — Renseignez le stock physique compté'
              : 'État des Stocks & Barres de Niveau en Direct'}
          </h3>
          <Badge variant={modeInventaire ? 'warning' : 'forest'} pulse={modeInventaire}>
            {produitsFiltres.length} matières premières
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-page border-b border-surface-border text-surface-textMuted uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4 text-right">Prix Achat</th>
                <th className="py-3 px-4 text-right">Stock & Niveau</th>
                <th className="py-3 px-4 text-right">Stock Physique</th>
                <th className="py-3 px-4 text-right">Écart</th>
                <th className="py-3 px-4">Péremption</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {produitsFiltres.map((p) => {
                const ecart = Math.round((p.stockPhysique - p.stockTheorique) * 100) / 100;
                const estFaible = p.stockTheorique <= p.seuil;
                const ratio = Math.min(100, Math.round((p.stockTheorique / (p.seuil * 2.5)) * 100));

                return (
                  <tr key={p.id} className="table-row-hover">
                    <td className="py-3 px-4 font-bold text-surface-text">{p.nom}</td>
                    <td className="py-3 px-4 text-surface-textMuted">{p.categorie}</td>
                    <td className="py-3 px-4 text-right font-medium text-surface-text">
                      {p.prixAchat.toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-surface-text">
                      <div className="flex flex-col items-end">
                        <span>{p.stockTheorique} {p.unite}</span>
                        <div className="w-20 h-1.5 bg-surface-muted/50 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              estFaible ? 'bg-brand-terracotta' : 'bg-brand-forest'
                            }`}
                            style={{ width: `${Math.max(6, ratio)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {modeInventaire ? (
                        <input
                          type="number"
                          step="0.5"
                          value={p.stockPhysique}
                          onChange={(e) => handlePhysiqueChange(p.id, e.target.value)}
                          className="w-20 px-2 py-1 text-right text-xs font-bold border border-brand-forest rounded-lg shadow-xs focus:ring-1 focus:ring-brand-forest"
                        />
                      ) : (
                        <span className="font-semibold text-surface-text">
                          {p.stockPhysique} {p.unite}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-black">
                      {ecart === 0 ? (
                        <span className="text-surface-textMuted">0</span>
                      ) : ecart < 0 ? (
                        <span className="text-brand-terracotta font-semibold">
                          {ecart} {p.unite} (Perte)
                        </span>
                      ) : (
                        <span className="text-brand-forest font-semibold">
                          +{ecart} {p.unite}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-surface-textMuted text-[11px]">
                      {p.peremption}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={estFaible ? 'warning' : 'forest'} pulse={estFaible}>
                        {estFaible ? 'Seuil critique' : 'Disponible'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default StockInventory;
