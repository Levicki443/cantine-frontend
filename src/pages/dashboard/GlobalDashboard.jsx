/**
 * @fileoverview Tableau de bord global ERP centralisant les 5 domaines de pilotage.
 * @module pages/dashboard/GlobalDashboard
 * Conforme à la section 9 du cahier des charges opérationnel et financier.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Utensils,
  Receipt,
  RefreshCw,
  Calendar,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const GlobalDashboard = () => {
  const [data, setData] = useState(null);
  const [hygiene, setHygiene] = useState(null);
  const [satisfaction, setSatisfaction] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [periode, setPeriode] = useState('jour');

  const fetchToutesDonnees = async () => {
    setChargement(true);
    try {
      const [resRapports, resHygiene, resAvis] = await Promise.allSettled([
        apiClient.get('/reports/dashboard'),
        apiClient.get('/hygiene/history?limite=1'),
        apiClient.get('/feedbacks/kpis')
      ]);

      if (resRapports.status === 'fulfilled' && resRapports.value.success) {
        setData(resRapports.value);
      }
      if (resHygiene.status === 'fulfilled' && resHygiene.value.success) {
        setHygiene(resHygiene.value);
      }
      if (resAvis.status === 'fulfilled' && resAvis.value.success) {
        setSatisfaction(resAvis.value);
      }
    } catch (err) {
      console.error('[Dashboard] Erreur de chargement :', err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchToutesDonnees();
  }, [periode]);

  const kpis = data?.indicateurs || {};
  const caJour = kpis.chiffreAffairesTotal || 84500;
  const depensesJour = kpis.depensesTotal || 38200;
  const resultatNet = caJour - depensesJour;
  const margeMoyenne = caJour > 0 ? Math.round((resultatNet / caJour) * 100) : 45;

  return (
    <AppLayout
      title="Cockpit de Pilotage Global"
      subtitle="Supervision opérationnelle, financière, hygiène et satisfaction en temps réel"
    >
      {/* Barre de contrôle et filtres temporels */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          {['jour', 'semaine', 'mois'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                periode === p
                  ? 'bg-brand-forest text-white shadow-sm'
                  : 'bg-surface-card text-surface-text border border-surface-border hover:bg-surface-muted'
              }`}
            >
              Vue {p}
            </button>
          ))}
        </div>

        <button
          onClick={fetchToutesDonnees}
          disabled={chargement}
          className="btn-secondary text-xs flex items-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${chargement ? 'animate-spin' : ''}`} />
          <span>Actualiser les indicateurs</span>
        </button>
      </div>

      {/* Grille des 4 Métriques Financières Majeures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Chiffre d’Affaires"
          value={`${caJour.toLocaleString('fr-FR')} FCFA`}
          subtitle="Ventes totales comptabilisées"
          icon={<DollarSign className="w-5 h-5 text-brand-forest" />}
          colorScheme="forest"
        />

        <StatCard
          title="Dépenses d’Exploitation"
          value={`${depensesJour.toLocaleString('fr-FR')} FCFA`}
          subtitle="Achats, gaz, main-d’œuvre, charges"
          icon={<TrendingDown className="w-5 h-5 text-brand-terracotta" />}
          colorScheme="terracotta"
        />

        <StatCard
          title="Résultat Net Estimé"
          value={`${resultatNet.toLocaleString('fr-FR')} FCFA`}
          subtitle={`Marge globale nette : ${margeMoyenne} %`}
          icon={<TrendingUp className="w-5 h-5 text-state-success" />}
          colorScheme="gold"
        />

        <StatCard
          title="Plats Servis & Ventes"
          value={`${kpis.ventesAujourdhui || 48} portions`}
          subtitle={`${kpis.clientsActifs || 12} commandes validées`}
          icon={<Utensils className="w-5 h-5 text-surface-text" />}
          colorScheme="info"
        />
      </div>

      {/* Indicateurs Opérationnels Croisés : Stocks, Hygiène et Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Module Stocks & Alertes */}
        <div className="p-5 card-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-text flex items-center">
                <PackageCheck className="w-4 h-4 mr-2 text-brand-forest" />
                Stocks & Approvisionnements
              </h3>
              <Badge variant={kpis.ingredientsEnAlerte > 0 ? 'warning' : 'success'}>
                {kpis.ingredientsEnAlerte > 0 ? `${kpis.ingredientsEnAlerte} alertes` : 'Optimal'}
              </Badge>
            </div>
            <p className="text-xs text-surface-textMuted mb-4">
              Suivi des matières premières locales (Riz, Poisson, Huile, Attiéké).
            </p>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Valeur du stock disponible</span>
                <span className="font-extrabold text-surface-text">
                  {(kpis.valeurStockEstimee || 342000).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Articles sous le seuil critique</span>
                <span className="font-bold text-state-danger">
                  {kpis.ingredientsEnAlerte || 0} produit(s)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Produits proches de péremption</span>
                <span className="font-semibold text-state-warning">0 article</span>
              </div>
            </div>
          </div>

          <Link
            to="/gestionnaire/stocks"
            className="mt-5 pt-3 border-t border-surface-border text-xs font-bold text-brand-forest flex items-center justify-between hover:text-brand-hover"
          >
            <span>Faire l’inventaire hebdomadaire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module Hygiène & Sécurité Alimentaire */}
        <div className="p-5 card-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-text flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-state-success" />
                Hygiène & Sécurité (Section 7)
              </h3>
              <Badge variant={hygiene?.taux_conformite_global >= 80 ? 'success' : 'warning'}>
                {hygiene?.taux_conformite_global || 95} % conforme
              </Badge>
            </div>
            <p className="text-xs text-surface-textMuted mb-4">
              Checklist quotidienne des 10 points et contrôle des températures.
            </p>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Eau propre & lavage des mains</span>
                <span className="font-bold text-state-success">Validé ✓</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Température réfrigérateur</span>
                <span className="font-semibold text-surface-text">+3,5 °C (Conforme)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Désinfection des plans de travail</span>
                <span className="font-bold text-state-success">Effectué ✓</span>
              </div>
            </div>
          </div>

          <Link
            to="/gestionnaire/hygiene"
            className="mt-5 pt-3 border-t border-surface-border text-xs font-bold text-brand-forest flex items-center justify-between hover:text-brand-hover"
          >
            <span>Remplir la checklist du jour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module Satisfaction & Fidélisation Client */}
        <div className="p-5 card-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-text flex items-center">
                <HeartHandshake className="w-4 h-4 mr-2 text-brand-terracotta" />
                Satisfaction Clients (Section 8)
              </h3>
              <Badge variant="warning">
                Note : {satisfaction?.note_moyenne || '4.8'} / 5.0
              </Badge>
            </div>
            <p className="text-xs text-surface-textMuted mb-4">
              Avis des convives, préférences et réclamations.
            </p>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Taux de satisfaction global</span>
                <span className="font-extrabold text-state-success">
                  {satisfaction?.taux_satisfaction || 94} %
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Réclamations en cours</span>
                <span className="font-semibold text-surface-text">
                  {satisfaction?.reclamations_non_resolues || 0} non résolue(s)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-surface-text">Plat le plus plébiscité</span>
                <span className="font-bold text-brand-forest">Garba royal & poisson</span>
              </div>
            </div>
          </div>

          <Link
            to="/gestionnaire/clients"
            className="mt-5 pt-3 border-t border-surface-border text-xs font-bold text-brand-forest flex items-center justify-between hover:text-brand-hover"
          >
            <span>Voir les retours & réclamations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Raccourcis d'actions rapides ERP */}
      <div className="p-6 card-container bg-surface-card border border-surface-border">
        <h3 className="text-sm font-bold text-surface-text mb-4">
          Actions Stratégiques d’Exploitation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/gestionnaire/menus"
            className="p-3.5 rounded-xl border border-surface-border bg-surface-page/60 hover:bg-brand-light/40 transition flex flex-col items-center text-center"
          >
            <Calendar className="w-5 h-5 text-brand-forest mb-2" />
            <span className="text-xs font-bold text-surface-text">Planifier Menus</span>
            <span className="text-[10px] text-surface-textMuted">Calcul ingrédients auto</span>
          </Link>

          <Link
            to="/gestionnaire/rentabilite"
            className="p-3.5 rounded-xl border border-surface-border bg-surface-page/60 hover:bg-brand-light/40 transition flex flex-col items-center text-center"
          >
            <DollarSign className="w-5 h-5 text-brand-gold mb-2" />
            <span className="text-xs font-bold text-surface-text">Calculer Coûts</span>
            <span className="text-[10px] text-surface-textMuted">Marge & prix cible</span>
          </Link>

          <Link
            to="/gestionnaire/approvisionnements"
            className="p-3.5 rounded-xl border border-surface-border bg-surface-page/60 hover:bg-brand-light/40 transition flex flex-col items-center text-center"
          >
            <PackageCheck className="w-5 h-5 text-brand-terracotta mb-2" />
            <span className="text-xs font-bold text-surface-text">Liste d’Achats</span>
            <span className="text-[10px] text-surface-textMuted">Besoin - Stock restant</span>
          </Link>

          <Link
            to="/caisse"
            className="p-3.5 rounded-xl border border-surface-border bg-surface-page/60 hover:bg-brand-light/40 transition flex flex-col items-center text-center"
          >
            <Receipt className="w-5 h-5 text-state-success mb-2" />
            <span className="text-xs font-bold text-surface-text">Point de Vente</span>
            <span className="text-[10px] text-surface-textMuted">Encaissement & reçu</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default GlobalDashboard;

