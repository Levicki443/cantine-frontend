/**
 * @fileoverview Supervision et suivi du cycle de vie des commandes au BackOffice.
 * @module pages/admin/OrderManagement
 * Conforme à la Section 7 du cahier des charges (Statuts, référence, clients, montants).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  RefreshCw,
  Eye
} from 'lucide-react';

const STATUTS = [
  { value: 'créée', label: 'Créée' },
  { value: 'confirmée', label: 'Confirmée' },
  { value: 'en préparation', label: 'En préparation' },
  { value: 'prête', label: 'Prête' },
  { value: 'servie', label: 'Servie' },
  { value: 'livrée', label: 'Livrée' },
  { value: 'annulée', label: 'Annulée' }
];

export const OrderManagement = () => {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('');
  const [recherche, setRecherche] = useState('');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);

  const chargerCommandes = async () => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      if (filtreStatut) params.append('statut', filtreStatut);
      if (recherche) params.append('search', recherche);

      const res = await apiClient.get(`/orders?${params.toString()}`);
      if (res.success) {
        setCommandes(res.orders || []);
      }
    } catch {
      // Ignorer l'erreur
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCommandes();
  }, [filtreStatut]);

  const handleChangerStatut = async (id, nouveauStatut) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, { statut: nouveauStatut });
      chargerCommandes();
      if (commandeSelectionnee && commandeSelectionnee._id === id) {
        setCommandeSelectionnee((prev) => ({ ...prev, statut: nouveauStatut }));
      }
    } catch (err) {
      alert(err.message || 'Impossible de mettre à jour le statut.');
    }
  };

  const getStatutBadge = (st) => {
    switch (st) {
      case 'prête':
      case 'prete':
      case 'livrée':
      case 'livree':
      case 'servie':
        return <Badge variant="success">{st}</Badge>;
      case 'créée':
      case 'en_attente':
      case 'en préparation':
      case 'en_preparation':
      case 'confirmée':
      case 'confirmee':
        return <Badge variant="warning">{st}</Badge>;
      case 'annulée':
      case 'annulee':
        return <Badge variant="danger">annulée</Badge>;
      default:
        return <Badge variant="muted">{st}</Badge>;
    }
  };

  return (
    <AppLayout
      title="Supervision des Commandes"
      subtitle="Suivi en direct du statut des commandes, validation et distribution aux convives"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-textMuted" />
            <input
              type="text"
              placeholder="Numéro de commande..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <button onClick={chargerCommandes} className="btn-primary text-xs py-2 px-3">
            Filtrer
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="input-field text-xs py-2 capitalize"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={chargerCommandes}
            className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="card-container bg-surface-card border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-page/60 border-b border-surface-border text-surface-textMuted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Réf. Commande</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Montant Total</th>
                <th className="py-3 px-4">Règlement</th>
                <th className="py-3 px-4">Statut Opérationnel</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {commandes.map((cmd) => (
                <tr key={cmd._id} className="table-row-hover">
                  <td className="py-3 px-4 font-black text-brand-forest">
                    {cmd.numero_commande}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-surface-text block">
                      {cmd.client_id ? `${cmd.client_id.prenom} ${cmd.client_id.nom}` : 'Client Comptoir'}
                    </span>
                    <span className="text-[10px] text-surface-textMuted">
                      {new Date(cmd.date_commande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-surface-textMuted">
                    {(cmd.lignes || []).map((l) => `${l.quantite}x ${l.nom_repas}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-black text-surface-text">
                    {cmd.montant_total?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-semibold text-surface-text">{cmd.mode_paiement || 'espèces'}</span>
                    <span className="text-[10px] text-state-success block">Payé</span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatutBadge(cmd.statut)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <select
                      value={cmd.statut}
                      onChange={(e) => handleChangerStatut(cmd._id, e.target.value)}
                      className="text-[10px] font-bold py-1 px-1.5 rounded-lg bg-surface-muted border border-surface-border capitalize"
                    >
                      {STATUTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {commandes.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-surface-textMuted">
                    Aucune commande enregistrée pour cette sélection.
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

export default OrderManagement;

