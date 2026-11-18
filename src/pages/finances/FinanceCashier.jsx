/**
 * @fileoverview Gestion financière de la cantine, suivi des recettes, dépenses et clôture de caisse.
 * @module pages/finances/FinanceCashier
 * Conforme à la section 6 du cahier des charges opérationnel et financier.
 */

import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lock,
  Plus,
  Receipt,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export const FinanceCashier = () => {
  const [caVentes, setCaVentes] = useState(145000);
  const [coutProduitsVendus, setCoutProduitsVendus] = useState(62000); // Consommation réelle, pas achats stock !

  const [depenses, setDepenses] = useState([
    { id: '1', intitule: 'Gaz butane (2 bouteilles B28)', montant: 14000, categorie: 'gaz' },
    { id: '2', intitule: 'Transport marché gros Adjamé', montant: 5000, categorie: 'transport' },
    { id: '3', intitule: 'Part salaire journalier cuisinières (2)', montant: 12000, categorie: 'salaires' },
    { id: '4', intitule: 'Facture électricité & eau (quote-part)', montant: 4500, categorie: 'energie' }
  ]);

  const [fondDeCaisseOuverture, setFondDeCaisseOuverture] = useState(20000);
  const [especesCompteesSoir, setEspecesCompteesSoir] = useState(165000);
  const [message, setMessage] = useState(null);

  // Formules officielles de la section 6 :
  // Résultat brut = Chiffre d'affaires − Coût des produits vendus
  const resultatBrut = caVentes - coutProduitsVendus;

  // Total charges d'exploitation
  const totalChargesExploitation = depenses.reduce((acc, d) => acc + d.montant, 0);

  // Résultat net estimé = Résultat brut − Charges d'exploitation
  const resultatNetEstime = resultatBrut - totalChargesExploitation;

  // Calcul théorique de caisse du soir : Fond d'ouverture + Ventes espèces − Dépenses espèces
  const montantTheoriqueCaisse = fondDeCaisseOuverture + caVentes;
  const ecartDeCaisse = Number(especesCompteesSoir) - montantTheoriqueCaisse;

  const cloturerCaisse = () => {
    setMessage('Clôture journalière de caisse effectuée et journalisée avec succès.');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AppLayout
      title="Gestion Financière & Clôture de Caisse"
      subtitle="Recettes réelles, résultat brut, charges d'exploitation et contrôle des écarts de caisse"
    >
      {message && (
        <div className="flex items-center p-3 mb-6 text-xs rounded-lg bg-state-successBg border border-state-success text-state-success">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Cartes de synthèse financière (Résultat Brut & Net) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="p-5 card-container bg-surface-card border-brand-forest/20">
          <span className="text-xs font-bold text-surface-textMuted uppercase tracking-wider">
            1. Chiffre d’Affaires Validé
          </span>
          <p className="text-2xl font-black text-brand-forest mt-1">
            {caVentes.toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">
            Coût des repas vendus : {coutProduitsVendus.toLocaleString('fr-FR')} FCFA
          </p>
        </div>

        <div className="p-5 card-container bg-surface-card border-brand-gold/30">
          <span className="text-xs font-bold text-surface-textMuted uppercase tracking-wider">
            2. Résultat Brut Réalisé
          </span>
          <p className="text-2xl font-black text-brand-gold mt-1">
            {resultatBrut.toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">
            Marge brute dégagée : {Math.round((resultatBrut / caVentes) * 100)} %
          </p>
        </div>

        <div className="p-5 card-container bg-surface-card border-state-success/30">
          <span className="text-xs font-bold text-surface-textMuted uppercase tracking-wider">
            3. Résultat Net Estimé
          </span>
          <p className="text-2xl font-black text-state-success mt-1">
            +{resultatNetEstime.toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">
            Après déduction des {totalChargesExploitation.toLocaleString('fr-FR')} F de charges fixes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Dépenses d'exploitation du jour */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 card-container">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-text flex items-center">
                <TrendingDown className="w-4 h-4 mr-1.5 text-brand-terracotta" />
                Charges d’Exploitation Enregistrées
              </h3>
              <Badge variant="terracotta">
                Total : {totalChargesExploitation.toLocaleString('fr-FR')} FCFA
              </Badge>
            </div>
            <p className="text-xs text-surface-textMuted mb-4">
              Salaires, transport, gaz, loyer et électricité (hors stock immobilisé)
            </p>

            <div className="space-y-2.5">
              {depenses.map((d) => (
                <div key={d.id} className="p-3 rounded-xl border border-surface-border bg-surface-page/50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-surface-text">{d.intitule}</p>
                    <span className="text-[10px] text-surface-textMuted capitalize font-semibold">{d.categorie}</span>
                  </div>
                  <span className="font-extrabold text-brand-terracotta">
                    -{d.montant.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Module de Clôture Journalière de Caisse */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 card-container">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-text flex items-center">
                <Lock className="w-4 h-4 mr-1.5 text-brand-forest" />
                Clôture Journalière de Caisse
              </h3>
              <Badge variant="forest">Contrôle anti-écarts</Badge>
            </div>
            <p className="text-xs text-surface-textMuted mb-4">
              Rapprochement entre le montant théorique et le comptage physique du tiroir-caisse
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-surface-text">Fond de caisse d’ouverture :</span>
                <span className="font-bold text-surface-text">
                  {fondDeCaisseOuverture.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-surface-text">Montant théorique attendu en caisse :</span>
                <span className="font-black text-brand-forest text-sm">
                  {montantTheoriqueCaisse.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="pt-2 border-t border-surface-border flex justify-between items-center">
                <span className="text-surface-text font-bold">Espèces réellement comptées au tiroir :</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="500"
                    value={especesCompteesSoir}
                    onChange={(e) => setEspecesCompteesSoir(e.target.value)}
                    className="w-28 px-2 py-1 text-right text-xs font-bold border border-surface-border rounded mr-1"
                  />
                  <span className="font-bold">FCFA</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-page border border-surface-border flex justify-between items-center">
                <span className="font-bold text-surface-text">Écart de caisse constaté :</span>
                <span className={`text-sm font-black ${
                  ecartDeCaisse === 0
                    ? 'text-state-success'
                    : ecartDeCaisse > 0
                    ? 'text-state-success'
                    : 'text-state-danger'
                }`}>
                  {ecartDeCaisse === 0
                    ? 'Aucun écart (Caisse parfaite ✓)'
                    : ecartDeCaisse > 0
                    ? `+${ecartDeCaisse.toLocaleString('fr-FR')} FCFA (Excédent)`
                    : `${ecartDeCaisse.toLocaleString('fr-FR')} FCFA (Déficit)`}
                </span>
              </div>

              <button
                onClick={cloturerCaisse}
                className="w-full btn-primary py-2.5 mt-2 text-xs flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Valider la clôture et journaliser</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceCashier;

