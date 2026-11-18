/**
 * @fileoverview Modale d'affichage et d'impression thermique du reçu de vente client.
 * @module pages/caisse/ReceiptModal
 * Conforme aux règles d'immutabilité et de traçabilité des transactions.
 */

import React from 'react';
import { Printer, X, CheckCircle, UtensilsCrossed } from 'lucide-react';

export const ReceiptModal = ({ vente, onClose }) => {
  if (!vente) return null;

  const handlePrint = () => {
    window.print();
  };

  const dateFormatee = new Date(vente.date_vente).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-text/60 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 card-container shadow-2xl relative bg-surface-card">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-surface-textMuted hover:text-surface-text rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Billet thermique imprimable */}
        <div id="recu-thermique" className="text-center font-mono text-xs text-surface-text py-2">
          {/* Logo & En-tête */}
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-brand-light text-brand-primary">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-text">
            Cantine Manager
          </h2>
          <p className="text-[11px] text-surface-textMuted">Institut Supérieur Jean Paul II</p>
          <p className="text-[10px] text-surface-textMuted">Tél : +225 07 00 00 00 00</p>

          <div className="my-3 border-b border-dashed border-surface-border"></div>

          {/* Métadonnées de vente */}
          <div className="text-left space-y-1 text-[11px] text-surface-text">
            <p className="flex justify-between">
              <span className="text-surface-textMuted">N° Reçu :</span>
              <span className="font-bold">{vente.numero_recu}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-surface-textMuted">Date :</span>
              <span>{dateFormatee}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-surface-textMuted">Caissier :</span>
              <span>
                {vente.cashier_id?.prenom} {vente.cashier_id?.nom}
              </span>
            </p>
            {vente.client_id && (
              <p className="flex justify-between">
                <span className="text-surface-textMuted">Client :</span>
                <span>
                  {vente.client_id?.prenom} {vente.client_id?.nom}
                </span>
              </p>
            )}
          </div>

          <div className="my-3 border-b border-dashed border-surface-border"></div>

          {/* Lignes d'articles */}
          <div className="text-left space-y-2 text-[11px]">
            {vente.lignes?.map((ligne, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <span className="font-medium text-surface-text">{ligne.nom_repas}</span>
                  <span className="block text-[10px] text-surface-textMuted">
                    {ligne.quantite} x {ligne.prix_unitaire?.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <span className="font-bold text-surface-text">
                  {ligne.sous_total?.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            ))}
          </div>

          <div className="my-3 border-b border-dashed border-surface-border"></div>

          {/* Récapitulatif financier */}
          <div className="text-left space-y-1 text-[11px]">
            {vente.reduction > 0 && (
              <p className="flex justify-between text-state-danger font-medium">
                <span>Réduction :</span>
                <span>-{vente.reduction?.toLocaleString('fr-FR')} FCFA</span>
              </p>
            )}
            <p className="flex justify-between text-sm font-extrabold text-surface-text pt-1">
              <span>TOTAL NET :</span>
              <span className="text-brand-primary">
                {vente.montant_total?.toLocaleString('fr-FR')} FCFA
              </span>
            </p>
            <p className="flex justify-between text-surface-textMuted">
              <span>Montant Versé :</span>
              <span>{vente.montant_paye?.toLocaleString('fr-FR')} FCFA</span>
            </p>
            <p className="flex justify-between font-bold text-state-success">
              <span>Monnaie Rendue :</span>
              <span>{vente.monnaie_rendue?.toLocaleString('fr-FR')} FCFA</span>
            </p>
            <p className="flex justify-between text-surface-textMuted text-[10px] pt-1">
              <span>Mode de règlement :</span>
              <span className="uppercase font-semibold">{vente.mode_paiement}</span>
            </p>
          </div>

          <div className="my-4 border-b border-dashed border-surface-border"></div>

          <p className="text-[10px] text-surface-textMuted italic">
            Merci de votre confiance et bon appétit !
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="mt-6 flex space-x-3">
          <button onClick={handlePrint} className="btn-primary flex-1 text-xs py-2.5">
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Imprimer le ticket</span>
          </button>
          <button onClick={onClose} className="btn-secondary text-xs px-4">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

