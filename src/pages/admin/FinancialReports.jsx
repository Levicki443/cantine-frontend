/**
 * @fileoverview Rapports professionnels, analyses financières et exportations pour le BackOffice.
 * @module pages/admin/FinancialReports
 * Conforme à la Section 10 du cahier des charges (Rapports journalier, hebdo, mensuel, export).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import {
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
  Calendar,
  Filter,
  Download,
  Printer,
  DollarSign,
  PieChart
} from 'lucide-react';

export const FinancialReports = () => {
  const [bilan, setBilan] = useState(null);
  const [repartition, setRepartition] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [periodeType, setPeriodeType] = useState('mois');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const appliquerPeriodeRapide = (type) => {
    setPeriodeType(type);
    const now = new Date();
    let dDebut = new Date();
    let dFin = new Date();

    if (type === 'jour') {
      dDebut = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (type === 'semaine') {
      const jour = now.getDay() || 7;
      dDebut.setDate(now.getDate() - jour + 1);
    } else if (type === 'mois') {
      dDebut = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (type === 'annee') {
      dDebut = new Date(now.getFullYear(), 0, 1);
    }

    setDateDebut(dDebut.toISOString().split('T')[0]);
    setDateFin(dFin.toISOString().split('T')[0]);
  };

  const chargerRapport = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const params = new URLSearchParams();
      if (dateDebut) params.append('dateDebut', dateDebut);
      if (dateFin) params.append('dateFin', dateFin);

      const res = await apiClient.get(`/reports/financial?${params.toString()}`);
      if (res.success) {
        setBilan(res.bilanFinancier || {});
        setRepartition(res.repartitionPaiements || []);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors du calcul du rapport financier.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    appliquerPeriodeRapide('mois');
  }, []);

  useEffect(() => {
    if (dateDebut) chargerRapport();
  }, [dateDebut, dateFin]);

  const [messageExport, setMessageExport] = useState(null);

  const exporterCSV = () => {
    const lignes = [
      ['Indicateur', 'Montant (FCFA)'],
      ['Recettes Ventes', bilan?.recettesVentes || 0],
      ['Charges Exploitation', bilan?.chargesExploitation || 0],
      ['Achats Fournisseurs', bilan?.achatsFournisseurs || 0],
      ['Résultat Net Estimé', bilan?.resultatNet || 0],
      ['Nombre de Ventes', bilan?.nombreVentes || 0],
      ['Nombre de Dépenses', bilan?.nombreDepenses || 0]
    ];
    const contenuCSV = 'data:text/csv;charset=utf-8,' + lignes.map((e) => e.join(';')).join('\n');
    const encodedUri = encodeURI(contenuCSV);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_financier_cantine_${dateDebut}_au_${dateFin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessageExport('Rapport financier exporté au format CSV avec succès.');
    setTimeout(() => setMessageExport(null), 3500);
  };

  return (
    <AppLayout
      title="Rapports d'Exploitation & Analyses"
      subtitle="Bilan comptable consolidé, analyse des marges et répartition des recettes par moyen de paiement"
      breadcrumbs={[{ label: 'Finances & Pilotage', to: '/admin/finances' }, { label: 'Rapports Financiers' }]}
    >
      {/* Toast d'export CSV animé */}
      {messageExport && (
        <div className="flex items-center p-3.5 mb-6 text-xs rounded-xl bg-state-successBg border border-state-success/30 text-state-success shadow-sm animate-fade-in-down">
          <Download className="w-4 h-4 mr-2 flex-shrink-0 animate-bounce-subtle" />
          <span className="font-semibold">{messageExport}</span>
        </div>
      )}

      {/* Barre de sélection de période */}
      <div className="p-4 mb-6 card-container bg-surface-card border border-surface-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm animate-fade-in-up">
        <div className="flex flex-wrap items-center gap-2">
          {['jour', 'semaine', 'mois', 'annee'].map((p) => (
            <button
              key={p}
              onClick={() => appliquerPeriodeRapide(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 btn-interactive ${
                periodeType === p
                  ? 'bg-brand-forest text-white shadow-sm'
                  : 'bg-surface-muted text-surface-text hover:bg-surface-border/80'
              }`}
            >
              {p === 'jour' ? 'Aujourd’hui' : p}
            </button>
          ))}

          <div className="flex items-center space-x-1.5 ml-2 text-xs">
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="input-field text-xs py-1.5 px-2.5 rounded-lg"
            />
            <span className="text-surface-textMuted font-bold">à</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="input-field text-xs py-1.5 px-2.5 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exporterCSV}
            className="btn-secondary btn-interactive text-xs py-2 px-3.5 flex items-center space-x-1.5 rounded-xl shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary btn-interactive text-xs py-2 px-3.5 flex items-center space-x-1.5 rounded-xl shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {erreur && (
        <div className="p-4 mb-6 rounded-xl bg-state-dangerBg border border-state-danger text-state-danger text-xs animate-shake">
          {erreur}
        </div>
      )}

      {/* Cartes financières synthétiques avec stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            titre="Recettes des Ventes"
            valeur={`${(bilan?.recettesVentes || 0).toLocaleString('fr-FR')} FCFA`}
            description={`${bilan?.nombreVentes || 0} transaction(s) validée(s)`}
            icone={DollarSign}
            tendance="positive"
            variant="forest"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            titre="Achats Fournisseurs"
            valeur={`${(bilan?.achatsFournisseurs || 0).toLocaleString('fr-FR')} FCFA`}
            description="Approvisionnements livrés"
            icone={FileSpreadsheet}
            variant="forest"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            titre="Charges d'Exploitation"
            valeur={`${(bilan?.chargesExploitation || 0).toLocaleString('fr-FR')} FCFA`}
            description={`${bilan?.nombreDepenses || 0} dépense(s) validée(s)`}
            icone={CreditCard}
            variant="forest"
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            titre="Résultat Net Estimé"
            valeur={`${(bilan?.resultatNet || 0).toLocaleString('fr-FR')} FCFA`}
            description="Recettes − Charges d'exploitation"
            icone={TrendingUp}
            tendance={(bilan?.resultatNet || 0) >= 0 ? 'positive' : 'negative'}
            variant="terracotta"
          />
        </div>
      </div>

      {/* Répartition par mode de paiement */}
      <div className="p-5 card-container bg-surface-card border border-surface-border mb-6 shadow-sm animate-fade-in-up stagger-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-4 flex items-center">
          <PieChart className="w-3.5 h-3.5 mr-1.5 text-brand-forest" />
          <span>Répartition des Ventes par Moyen de Règlement</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repartition.map((r, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-surface-page/60 border border-surface-border card-lift transition-all duration-200"
            >
              <span className="text-[10px] font-bold uppercase text-brand-terracotta block tracking-wide">
                {r._id || 'Espèces'}
              </span>
              <span className="text-base font-black text-brand-forest mt-1 block">
                {(r.montant || 0).toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-[10px] text-surface-textMuted">
                {r.volume || 0} ticket(s) émis
              </span>
            </div>
          ))}
          {repartition.length === 0 && (
            <p className="text-xs text-surface-textMuted col-span-4 text-center py-4">
              Aucune recette enregistrée sur cette période.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FinancialReports;
