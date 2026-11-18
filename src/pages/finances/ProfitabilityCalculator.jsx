/**
 * @fileoverview Calculateur interactif de rentabilité, coût de revient et simulateur de prix de vente.
 * @module pages/finances/ProfitabilityCalculator
 * Conforme à la section 4 du cahier des charges opérationnel et financier.
 */

import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Flame,
  Zap,
  ShoppingBag,
  Users,
  CheckCircle,
  Percent
} from 'lucide-react';

const RECETTES_PREDEFINIES = [
  {
    id: '1',
    nom: 'Garba Royal (Attiéké & Thon frit)',
    coutIngredients: 600,
    prixActuel: 1200,
    portionsBase: 1,
    details: [
      { nom: 'Thon frais découpé', qte: '1 tranche (200g)', cout: 400 },
      { nom: 'Attiéké de qualité', qte: '350g', cout: 150 },
      { nom: 'Huile, piment frais, oignon, sel', qte: 'Assaisonnement', cout: 50 }
    ]
  },
  {
    id: '2',
    nom: 'Alloco & Poulet Braisé',
    coutIngredients: 1400,
    prixActuel: 2500,
    portionsBase: 1,
    details: [
      { nom: 'Quart de poulet fermier', qte: '1/4', cout: 900 },
      { nom: 'Bananes plantains mûres (2)', qte: '300g', cout: 350 },
      { nom: 'Huile de friture et marinade', qte: 'Dose', cout: 150 }
    ]
  },
  {
    id: '3',
    nom: 'Placali & Sauce Gombo Bœuf',
    coutIngredients: 850,
    prixActuel: 1500,
    portionsBase: 1,
    details: [
      { nom: 'Pâte de manioc fermentée (Placali)', qte: '400g', cout: 200 },
      { nom: 'Viande de bœuf avec os', qte: '150g', cout: 450 },
      { nom: 'Gombo frais, kroumbi, piment', qte: 'Sauce', cout: 200 }
    ]
  }
];

export const ProfitabilityCalculator = () => {
  const [platSelectionne, setPlatSelectionne] = useState(RECETTES_PREDEFINIES[0]);

  // Frais d'exploitation complémentaires par portion
  const [fraisGazCharbon, setFraisGazCharbon] = useState(80);
  const [fraisEauElec, setFraisEauElec] = useState(40);
  const [fraisEmballage, setFraisEmballage] = useState(50);
  const [fraisMainOeuvre, setFraisMainOeuvre] = useState(150);
  const [prixVenteSimule, setPrixVenteSimule] = useState(platSelectionne.prixActuel);

  // Formules officielles de la section 4 :
  // Coût total par portion = Ingrédients + Frais directs + Part frais indirects
  const totalFraisAnnexes =
    Number(fraisGazCharbon) +
    Number(fraisEauElec) +
    Number(fraisEmballage) +
    Number(fraisMainOeuvre);

  const coutTotalPortion = platSelectionne.coutIngredients + totalFraisAnnexes;
  const beneficeBrut = Math.round(Number(prixVenteSimule) - coutTotalPortion);
  const margeBrutePourcentage =
    prixVenteSimule > 0
      ? Math.round(((beneficeBrut / Number(prixVenteSimule)) * 100) * 10) / 10
      : 0;

  // Simulateur de prix selon marge cible (Formule : Coût de revient / (1 - Marge/100))
  const calculerPrixPourMarge = (margeCible) => {
    return Math.ceil(coutTotalPortion / (1 - margeCible / 100) / 50) * 50;
  };

  const handleSelectPlat = (plat) => {
    setPlatSelectionne(plat);
    setPrixVenteSimule(plat.prixActuel);
  };

  return (
    <AppLayout
      title="Calculateur de Rentabilité & Prix de Vente"
      subtitle="Maîtrise du coût de revient par portion, charges directes et simulation de marge"
    >
      {/* Choix de la recette testée */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6">
        {RECETTES_PREDEFINIES.map((plat) => (
          <button
            key={plat.id}
            onClick={() => handleSelectPlat(plat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center whitespace-nowrap ${
              platSelectionne.id === plat.id
                ? 'bg-brand-forest text-white shadow-sm'
                : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-muted'
            }`}
          >
            <span>{plat.nom}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Structure des Coûts (Ingrédients + Énergie + Frais) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Détail ingrédients */}
          <div className="p-5 card-container">
            <div className="flex items-center justify-between mb-3 border-b border-surface-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-surface-text">
                  1. Ingrédients alimentaires de base
                </h3>
                <p className="text-xs text-surface-textMuted">Matières premières par portion</p>
              </div>
              <span className="text-sm font-black text-brand-forest">
                {platSelectionne.coutIngredients.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="space-y-2">
              {platSelectionne.details.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-surface-text font-medium">
                    {d.nom} <span className="text-surface-textMuted text-[11px]">({d.qte})</span>
                  </span>
                  <span className="font-bold text-surface-text">
                    {d.cout.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Frais directs et indirects (Gaz, eau, main d'œuvre, emballages) */}
          <div className="p-5 card-container">
            <h3 className="text-sm font-bold text-surface-text mb-1">
              2. Frais directs & indirects d’exploitation (par portion)
            </h3>
            <p className="text-xs text-surface-textMuted mb-4">
              Ajustez selon la consommation réelle de votre cantine
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1 flex items-center">
                  <Flame className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
                  Gaz ou charbon de bois (FCFA)
                </label>
                <input
                  type="number"
                  value={fraisGazCharbon}
                  onChange={(e) => setFraisGazCharbon(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-brand-gold" />
                  Eau & électricité (FCFA)
                </label>
                <input
                  type="number"
                  value={fraisEauElec}
                  onChange={(e) => setFraisEauElec(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1 flex items-center">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1 text-brand-forest" />
                  Emballage / Barquette (FCFA)
                </label>
                <input
                  type="number"
                  value={fraisEmballage}
                  onChange={(e) => setFraisEmballage(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-surface-text" />
                  Part main-d’œuvre (FCFA)
                </label>
                <input
                  type="number"
                  value={fraisMainOeuvre}
                  onChange={(e) => setFraisMainOeuvre(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Bilan de Rentabilité & Simulateur de Prix Cible */}
        <div className="lg:col-span-5 space-y-5">
          {/* Carte Résultat Net et Coût Total */}
          <div className="p-6 card-container bg-surface-card border-brand-forest/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-textMuted">
                Synthèse Financière
              </span>
              <Badge variant={margeBrutePourcentage >= 30 ? 'success' : 'warning'}>
                {margeBrutePourcentage >= 30 ? 'Excellente marge' : 'Marge faible'}
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Coût total de revient par portion :</span>
                <span className="font-extrabold text-brand-terracotta text-sm">
                  {coutTotalPortion.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Prix de vente simulé :</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="50"
                    value={prixVenteSimule}
                    onChange={(e) => setPrixVenteSimule(e.target.value)}
                    className="w-24 px-2 py-1 text-right text-xs font-bold border border-surface-border rounded mr-1"
                  />
                  <span className="text-xs font-bold">FCFA</span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex justify-between items-center">
                <span className="text-xs font-bold text-surface-text">
                  Bénéfice brut par portion :
                </span>
                <span className="text-base font-black text-brand-forest">
                  +{beneficeBrut.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-textMuted">Taux de marge brute :</span>
                <span className="font-bold text-brand-gold text-sm">
                  {margeBrutePourcentage} %
                </span>
              </div>
            </div>

            {/* Simulateur de prix selon objectifs */}
            <div className="p-4 rounded-xl bg-surface-page border border-surface-border">
              <p className="text-xs font-bold text-surface-text mb-2.5 flex items-center">
                <Percent className="w-3.5 h-3.5 mr-1 text-brand-gold" />
                Simulateur : Prix à fixer pour atteindre...
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-surface-textMuted">25 % de marge :</span>
                  <span className="font-bold text-surface-text">
                    {calculerPrixPourMarge(25).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-textMuted">35 % de marge (Cible recommandée) :</span>
                  <span className="font-extrabold text-brand-forest">
                    {calculerPrixPourMarge(35).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-textMuted">50 % de marge :</span>
                  <span className="font-bold text-surface-text">
                    {calculerPrixPourMarge(50).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfitabilityCalculator;

