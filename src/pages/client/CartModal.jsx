/**
 * @fileoverview Modale de récapitulatif du panier et validation de commande client.
 * @module pages/client/CartModal
 * Conforme au diagramme 6 du processus de commande et de paiement.
 */

import React, { useState } from 'react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Plus, Minus, X, CheckCircle, AlertTriangle } from 'lucide-react';

export const CartModal = ({ panier, modifierQuantite, onClose, onCommandeConfirmee }) => {
  const { user } = useAuth();
  const [modePaiement, setModePaiement] = useState('espèces');
  const [notes, setNotes] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);

  const totalNet = panier.reduce((sum, item) => sum + item.prix_unitaire * item.quantite, 0);

  const handleConfirmerCommande = async () => {
    if (panier.length === 0) return;
    setChargement(true);
    setErreur(null);

    try {
      // Pour les clients, créer une vente ou une commande selon le mode choisi
      const payload = {
        client_id: user?._id || null,
        reduction: 0,
        montant_paye: totalNet,
        mode_paiement: modePaiement,
        lignes: panier.map((p) => ({
          meal_id: p.meal_id,
          quantite: p.quantite
        }))
      };

      const res = await apiClient.post('/sales', payload);
      if (res.success) {
        setSucces(true);
        setTimeout(() => {
          onCommandeConfirmee();
        }, 1500);
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de valider votre commande.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-text/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 card-container shadow-2xl relative bg-surface-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-surface-textMuted hover:text-surface-text rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-surface-text mb-4 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-brand-primary" />
          <span>Mon Panier de Commande</span>
        </h3>

        {succes ? (
          <div className="py-8 text-center space-y-3">
            <div className="flex justify-center text-state-success">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h4 className="text-base font-bold text-surface-text">
              Commande confirmée avec succès !
            </h4>
            <p className="text-xs text-surface-textMuted">
              Votre commande a été transmise en cuisine pour préparation.
            </p>
          </div>
        ) : (
          <>
            {erreur && (
              <div className="p-3 mb-4 text-xs rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{erreur}</span>
              </div>
            )}

            {/* Articles du panier */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 mb-4">
              {panier.map((item) => (
                <div
                  key={item.meal_id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border text-xs"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-surface-text">{item.nom_repas}</p>
                    <p className="text-[10px] text-surface-textMuted">
                      {item.prix_unitaire.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => modifierQuantite(item.meal_id, -1)}
                      className="p-1 rounded bg-surface-card border border-surface-border text-surface-text"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{item.quantite}</span>
                    <button
                      onClick={() => modifierQuantite(item.meal_id, 1)}
                      className="p-1 rounded bg-surface-card border border-surface-border text-surface-text"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-bold text-surface-text ml-3">
                    {(item.prix_unitaire * item.quantite).toLocaleString('fr-FR')} F
                  </span>
                </div>
              ))}
            </div>

            {/* Sélection du mode de paiement */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-surface-text mb-1.5">
                Mode de règlement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'espèces', label: 'Au comptoir' },
                  { id: 'Mobile Money', label: 'Mobile Money' },
                  { id: 'crédit autorisé', label: 'Solde prépayé' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setModePaiement(mode.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                      modePaiement === mode.id
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-surface-card border-surface-border text-surface-textMuted hover:bg-surface-muted'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total et confirmation */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-surface-text">Total à régler :</span>
              <span className="text-lg font-extrabold text-brand-primary">
                {totalNet.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <button
              onClick={handleConfirmerCommande}
              disabled={chargement || panier.length === 0}
              className="w-full btn-primary py-3 text-sm font-bold shadow-md"
            >
              {chargement ? 'Traitement en cours...' : 'Confirmer et commander'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;

