/**
 * @fileoverview Historique des ventes, réimpression des tickets et annulations motivées.
 * @module pages/caisse/SalesHistory
 * Conforme aux règles de gestion 4, 5 et 10.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import ReceiptModal from './ReceiptModal';
import {
  Receipt,
  Search,
  Printer,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const SalesHistory = () => {
  const [ventes, setVentes] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [recuSelectionne, setRecuSelectionne] = useState(null);
  const [modalAnnulation, setModalAnnulation] = useState(false);
  const [venteAAnnuler, setVenteAAnnuler] = useState(null);
  const [motifAnnulation, setMotifAnnulation] = useState('');
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  const chargerVentes = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/sales');
      if (res.success) {
        setVentes(res.ventes || []);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des ventes.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerVentes();
  }, []);

  const handleAnnulerVente = async (e) => {
    e.preventDefault();
    if (!venteAAnnuler) return;

    try {
      const res = await apiClient.post(`/sales/${venteAAnnuler._id}/cancel`, {
        motif_annulation: motifAnnulation
      });

      if (res.success) {
        setMessage(`Vente ${venteAAnnuler.numero_recu} annulée avec succès. Les stocks ont été restaurés.`);
        setModalAnnulation(false);
        setMotifAnnulation('');
        chargerVentes();
      }
    } catch (err) {
      setErreur(err.message || 'Échec de l’annulation de la vente.');
    }
  };

  const ventesFiltrees = ventes.filter((v) =>
    v.numero_recu.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <AppLayout
      title="Journal des Ventes & Reçus de Caisse"
      subtitle="Consultation, réimpression de tickets et traçabilité inaltérable des encaissements"
    >
      {/* Barre de recherche */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-surface-textMuted" />
          <input
            type="text"
            placeholder="Rechercher par N° de reçu..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-9 input-field text-sm"
          />
        </div>
      </div>

      {message && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-successBg border border-state-success text-state-success flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {erreur && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Tableau des ventes */}
      <div className="card-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-xs text-surface-textMuted font-semibold uppercase bg-surface-muted/50">
                <th className="py-3.5 px-4">N° Reçu</th>
                <th className="py-3.5 px-4">Date & Heure</th>
                <th className="py-3.5 px-4">Caissier</th>
                <th className="py-3.5 px-4">Mode Règlement</th>
                <th className="py-3.5 px-4">Articles</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Montant Total</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {ventesFiltrees.length > 0 ? (
                ventesFiltrees.map((vente) => (
                  <tr key={vente._id} className="hover:bg-surface-muted/30 transition">
                    <td className="py-3.5 px-4 font-bold text-brand-primary">
                      {vente.numero_recu}
                    </td>
                    <td className="py-3.5 px-4 text-surface-textMuted text-xs">
                      {new Date(vente.date_vente).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-surface-text text-xs">
                      {vente.cashier_id?.prenom} {vente.cashier_id?.nom}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="muted">{vente.mode_paiement}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-surface-textMuted">
                      {vente.lignes?.reduce((a, b) => a + b.quantite, 0)} article(s)
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={vente.statut === 'validée' ? 'success' : 'danger'}>
                        {vente.statut}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-surface-text">
                      {vente.montant_total.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setRecuSelectionne(vente)}
                          title="Imprimer le ticket de caisse"
                          className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" />
                          <span>Reçu</span>
                        </button>

                        {vente.statut === 'validée' && (
                          <button
                            onClick={() => {
                              setVenteAAnnuler(vente);
                              setModalAnnulation(true);
                            }}
                            title="Annuler la vente"
                            className="btn-secondary text-xs px-2 py-1.5 text-state-danger hover:bg-state-dangerBg"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-surface-textMuted text-sm">
                    {chargement ? 'Chargement des ventes...' : 'Aucune transaction enregistrée.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'impression de reçu */}
      {recuSelectionne && (
        <ReceiptModal vente={recuSelectionne} onClose={() => setRecuSelectionne(null)} />
      )}

      {/* Modale d'annulation motivée */}
      {modalAnnulation && venteAAnnuler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-text/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 card-container shadow-xl">
            <h3 className="text-lg font-bold text-state-danger mb-2">
              Annulation de la vente {venteAAnnuler.numero_recu}
            </h3>
            <p className="text-xs text-surface-textMuted mb-4">
              Conformément à la règle 5, toute annulation financière doit être justifiée.
              Les portions vendues seront automatiquement réintégrées dans les stocks.
            </p>

            <form onSubmit={handleAnnulerVente} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Motif obligatoire de l'annulation *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Ex : Erreur de saisie caissier, client parti avant le service..."
                  value={motifAnnulation}
                  onChange={(e) => setMotifAnnulation(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalAnnulation(false)}
                  className="btn-secondary text-xs"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs bg-state-danger hover:bg-state-danger/90"
                >
                  Confirmer l'annulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default SalesHistory;

