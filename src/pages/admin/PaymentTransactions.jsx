/**
 * @fileoverview Supervision financière des transactions et règlements encaissés.
 * @module pages/admin/PaymentTransactions
 * Conforme à la Section 8 du cahier des charges (Paiements confirmés, échecs, caisses).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Wallet,
  Receipt
} from 'lucide-react';

export const PaymentTransactions = () => {
  const [ventes, setVentes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreMode, setFiltreMode] = useState('');
  const [totalEncaisse, setTotalEncaisse] = useState(0);

  const chargerTransactions = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/sales');
      if (res.success) {
        const liste = res.ventes || [];
        setVentes(liste);
        const total = liste
          .filter((v) => v.statut !== 'annulée')
          .reduce((sum, v) => sum + (v.montant_total || 0), 0);
        setTotalEncaisse(total);
      }
    } catch {
      // Ignorer l'erreur
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerTransactions();
  }, []);

  const ventesFiltrees = ventes.filter((v) => {
    if (!filtreMode) return true;
    return v.mode_paiement === filtreMode;
  });

  return (
    <AppLayout
      title="Registre des Paiements & Transactions"
      subtitle="Audit des encaissements réels enregistrés par le système de caisse et paiements électroniques"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-brand-forest text-white">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">
              Volume Total des Règlements
            </span>
            <span className="text-xl font-black text-brand-forest">
              {totalEncaisse.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filtreMode}
            onChange={(e) => setFiltreMode(e.target.value)}
            className="input-field text-xs py-2 capitalize"
          >
            <option value="">Tous les modes de paiement</option>
            <option value="espèces">Espèces</option>
            <option value="portefeuille">Portefeuille étudiant</option>
            <option value="wave">Wave</option>
            <option value="orange_money">Orange Money</option>
            <option value="carte">Carte Bancaire</option>
          </select>

          <button
            onClick={chargerTransactions}
            className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="card-container bg-surface-card border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-page/60 border-b border-surface-border text-surface-textMuted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Ticket / Réf.</th>
                <th className="py-3 px-4">Caissier / Opérateur</th>
                <th className="py-3 px-4">Moyen de Règlement</th>
                <th className="py-3 px-4 text-right">Montant Encaissé</th>
                <th className="py-3 px-4 text-center">Statut Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {ventesFiltrees.map((v) => (
                <tr key={v._id} className="hover:bg-surface-muted/30">
                  <td className="py-3 px-4 text-surface-textMuted font-mono text-[11px] whitespace-nowrap">
                    {new Date(v.date_vente).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 font-black text-surface-text">
                    {v.numero_ticket || `TICK-${v._id.slice(-6).toUpperCase()}`}
                  </td>
                  <td className="py-3 px-4 text-surface-text font-semibold">
                    {v.cashier_id ? `${v.cashier_id.prenom} ${v.cashier_id.nom}` : 'Terminal Automatique'}
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-brand-forest">
                    {v.mode_paiement || 'espèces'}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-brand-forest text-sm">
                    {v.montant_total?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-4 text-center">
                    {v.statut !== 'annulée' ? (
                      <Badge variant="success">Confirmé</Badge>
                    ) : (
                      <Badge variant="danger">Annulé / Remboursé</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {ventesFiltrees.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-surface-textMuted">
                    Aucune transaction répertoriée pour ce filtre.
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

export default PaymentTransactions;

