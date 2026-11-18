/**
 * @fileoverview Modale d'ouverture et de clôture sécurisée des sessions de caisse.
 * @module pages/caisse/CashSessionModal
 * Conforme à la section 5.14 et au contrôle strict des écarts de caisse.
 */

import React, { useState } from 'react';
import apiClient from '../../api/client';
import { DollarSign, AlertTriangle, CheckCircle, X } from 'lucide-react';

export const CashSessionModal = ({ sessionActive, mode = 'ouvrir', onClose, onSessionUpdated }) => {
  const [montantInitial, setMontantInitial] = useState('10000');
  const [montantReel, setMontantReel] = useState('');
  const [motifEcart, setMotifEcart] = useState('');
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const montantTheorique = sessionActive?.montant_theorique || 0;
  const montantReelNum = parseFloat(montantReel) || 0;
  const ecartCalcule = Math.round((montantReelNum - montantTheorique) * 100) / 100;
  const aEcart = montantReel !== '' && ecartCalcule !== 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      if (mode === 'ouvrir') {
        const res = await apiClient.post('/cash-sessions/open', {
          montant_initial: parseFloat(montantInitial)
        });
        if (res.success) {
          onSessionUpdated(res.session);
          onClose();
        }
      } else {
        if (aEcart && (!motifEcart || motifEcart.trim().length === 0)) {
          throw new Error('Un écart entre le montant théorique et le montant réel exige une justification explicite.');
        }

        const res = await apiClient.post('/cash-sessions/close', {
          montant_reel: montantReelNum,
          motif_ecart: aEcart ? motifEcart : null
        });
        if (res.success) {
          onSessionUpdated(null);
          onClose();
        }
      }
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue lors de l’opération de caisse.');
    } finally {
      setEnCours(false);
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

        <h3 className="text-lg font-bold text-surface-text mb-2 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-brand-primary" />
          <span>{mode === 'ouvrir' ? 'Ouverture de session de caisse' : 'Clôture de session de caisse'}</span>
        </h3>
        <p className="text-xs text-surface-textMuted mb-6">
          {mode === 'ouvrir'
            ? 'Veuillez saisir le fond de caisse initial disponible dans le tiroir-caisse.'
            : 'Veuillez compter physiquement les espèces et saisir le total réel compté.'}
        </p>

        {erreur && (
          <div className="p-3 mb-4 text-xs rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{erreur}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'ouvrir' ? (
            <div>
              <label className="block text-xs font-semibold text-surface-text mb-1">
                Fond de caisse initial (FCFA)
              </label>
              <input
                type="number"
                min="0"
                required
                value={montantInitial}
                onChange={(e) => setMontantInitial(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          ) : (
            <>
              {/* Récapitulatif théorique de la session */}
              <div className="p-4 rounded-lg bg-surface-muted/60 border border-surface-border space-y-2 text-xs">
                <div className="flex justify-between text-surface-textMuted">
                  <span>Fond initial :</span>
                  <span>{(sessionActive?.montant_initial || 0).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-surface-textMuted">
                  <span>Total encaissements :</span>
                  <span className="text-state-success font-semibold">
                    +{(sessionActive?.total_encaissements || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-surface-text pt-1 border-t border-surface-border">
                  <span>Montant théorique attendu :</span>
                  <span className="text-brand-primary">
                    {montantTheorique.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Montant réel compté dans la caisse (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Montant physique compté"
                  value={montantReel}
                  onChange={(e) => setMontantReel(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {montantReel !== '' && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    ecartCalcule === 0
                      ? 'bg-state-successBg text-state-success border border-state-success/30'
                      : 'bg-state-warningBg text-state-warning border border-state-warning/30'
                  }`}
                >
                  <span>Écart constaté :</span>
                  <span>
                    {ecartCalcule > 0 ? `+${ecartCalcule}` : ecartCalcule} FCFA{' '}
                    {ecartCalcule === 0 ? '(Caisse parfaite)' : '(Écart détecté)'}
                  </span>
                </div>
              )}

              {aEcart && (
                <div>
                  <label className="block text-xs font-semibold text-state-danger mb-1">
                    Justification obligatoire de l'écart *
                  </label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Préciser la raison de la différence..."
                    value={motifEcart}
                    onChange={(e) => setMotifEcart(e.target.value)}
                    className="input-field text-xs border-state-danger focus:ring-state-danger/30"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-surface-border">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Annuler
            </button>
            <button type="submit" disabled={enCours} className="btn-primary text-xs">
              {enCours
                ? 'Traitement en cours...'
                : mode === 'ouvrir'
                ? 'Ouvrir la caisse'
                : 'Clôturer la session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashSessionModal;

