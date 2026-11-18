/**
 * @fileoverview Tableau de bord principal de Gouvernance BackOffice Administrateur.
 * @module pages/admin/AdminDashboard
 * Conforme à la Section 2 du cahier des charges (15 indicateurs réels & graphiques interactifs).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import InteractiveBarChart from '../../components/charts/InteractiveBarChart';
import InteractiveDonutChart from '../../components/charts/InteractiveDonutChart';
import {
  Users,
  Utensils,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  CreditCard,
  Award
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const chargerStatistiques = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const res = await apiClient.get('/admin/stats');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de récupérer les indicateurs réels.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerStatistiques();
  }, []);

  const kpis = data?.indicateurs || {};
  const graphiques = data?.graphiques || {};

  const barChartData = (graphiques.evolutionVentes || []).map((v) => ({
    label: v._id.slice(5), // MM-DD
    value: v.ca
  }));

  const donutChartData = (graphiques.repartitionPaiements || []).map((p) => ({
    label: p._id || 'Espèces',
    value: p.totalMontant
  }));

  return (
    <AppLayout
      title="Centre de Gouvernance Administrateur"
      subtitle="Supervision en temps réel des utilisateurs, stocks, commandes et flux financiers connectés à MongoDB"
      breadcrumbs={[{ label: 'Gouvernance' }, { label: 'Cockpit Stratégique' }]}
    >
      {/* Barre d'action supérieure */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="success">Base MongoDB active</Badge>
          <span className="text-xs text-surface-textMuted">• Données agrégées sans simulation</span>
        </div>
        <button
          onClick={chargerStatistiques}
          disabled={chargement}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
          <span>Actualiser les métriques</span>
        </button>
      </div>

      {erreur && (
        <div className="p-4 mb-6 rounded-xl bg-state-dangerBg border border-state-danger text-state-danger text-xs flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      {/* 1. Bloc Recettes & Ventes */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-3 flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-1 text-brand-forest" />
          <span>Performance Financière Réelle</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            titre="Chiffre d'Affaires du Jour"
            valeur={`${(kpis.caJournalier || 0).toLocaleString('fr-FR')} FCFA`}
            description="Recettes validées ce jour"
            icone={DollarSign}
            tendance="positive"
          />
          <StatCard
            titre="Chiffre d'Affaires Hebdomadaire"
            valeur={`${(kpis.caHebdomadaire || 0).toLocaleString('fr-FR')} FCFA`}
            description="Cumul depuis lundi"
            icone={TrendingUp}
            tendance="positive"
          />
          <StatCard
            titre="Chiffre d'Affaires Mensuel"
            valeur={`${(kpis.caMensuel || 0).toLocaleString('fr-FR')} FCFA`}
            description="Mois calendaire en cours"
            icone={CreditCard}
          />
          <StatCard
            titre="Transactions Encaissées"
            valeur={kpis.totalTransactions || 0}
            description="Ventes confirmées en caisse"
            icone={CheckCircle2}
          />
        </div>
      </div>

      {/* 2. Bloc Utilisateurs & Personnel */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-3 flex items-center">
          <Users className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
          <span>Comptes Utilisateurs & Personnel</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 card-container bg-surface-card border border-surface-border">
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Total Inscrits</span>
            <span className="text-xl font-extrabold text-surface-text">{kpis.totalUsers || 0}</span>
          </div>
          <div className="p-4 card-container bg-surface-card border border-surface-border">
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Clients / Élèves</span>
            <span className="text-xl font-extrabold text-brand-forest">{kpis.clientsCount || 0}</span>
          </div>
          <div className="p-4 card-container bg-surface-card border border-surface-border">
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Administrateurs</span>
            <span className="text-xl font-extrabold text-brand-terracotta">{kpis.adminsCount || 0}</span>
          </div>
          <div className="p-4 card-container bg-surface-card border border-surface-border">
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Gestionnaires</span>
            <span className="text-xl font-extrabold text-brand-terracotta">{kpis.managersCount || 0}</span>
          </div>
          <div className="p-4 card-container bg-surface-card border border-surface-border">
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Caissiers</span>
            <span className="text-xl font-extrabold text-brand-forest">{kpis.cashiersCount || 0}</span>
          </div>
        </div>
      </div>

      {/* 3. Bloc Produits & Commandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 card-container bg-surface-card border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Catalogue Produits</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-2xl font-black text-surface-text">{kpis.totalMeals || 0}</span>
              <span className="text-xs text-state-success font-semibold">({kpis.mealsDisponibles || 0} disponibles)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-state-danger block">Ruptures</span>
            <span className="text-lg font-bold text-state-danger">{kpis.mealsRupture || 0}</span>
          </div>
        </div>

        <div className="p-4 card-container bg-surface-card border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">Flux Commandes</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-2xl font-black text-surface-text">{kpis.totalOrders || 0}</span>
              <span className="text-xs text-state-success font-semibold">({kpis.ordersTerminees || 0} terminées)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-state-warning block">En attente</span>
            <span className="text-lg font-bold text-state-warning">{kpis.ordersEnAttente || 0}</span>
          </div>
        </div>
      </div>

      {/* 4. Graphiques interactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-5 card-container bg-surface-card border border-surface-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-4 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-brand-forest" />
            <span>Évolution des Ventes (7 Derniers Jours)</span>
          </h4>
          <InteractiveBarChart data={barChartData} xKey="label" yKey="value" height={220} unit="FCFA" />
        </div>

        <div className="p-5 card-container bg-surface-card border border-surface-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-4 flex items-center">
            <CreditCard className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
            <span>Répartition par Moyen de Paiement</span>
          </h4>
          <InteractiveDonutChart data={donutChartData} labelKey="label" valueKey="value" size={190} unit="FCFA" />
        </div>
      </div>

      {/* 5. Top 5 des produits les plus vendus */}
      <div className="p-5 card-container bg-surface-card border border-surface-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-textMuted mb-4 flex items-center">
          <Award className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
          <span>Top 5 des Produits les Plus Populaires</span>
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-surface-border text-surface-textMuted uppercase text-[10px]">
                <th className="py-2">Rang</th>
                <th className="py-2">Désignation du Plat</th>
                <th className="py-2 text-center">Portions Vendues</th>
                <th className="py-2 text-right">Chiffre d'Affaires Généré</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {(graphiques.topVentes || []).map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-muted/30">
                  <td className="py-2.5 font-bold text-brand-terracotta">#{idx + 1}</td>
                  <td className="py-2.5 font-bold text-surface-text">{p._id}</td>
                  <td className="py-2.5 text-center font-semibold text-brand-forest">
                    {p.quantiteTotale} portions
                  </td>
                  <td className="py-2.5 text-right font-black text-surface-text">
                    {p.ca?.toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              ))}
              {(!graphiques.topVentes || graphiques.topVentes.length === 0) && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-surface-textMuted">
                    Aucune vente enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
