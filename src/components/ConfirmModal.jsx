/**
 * @fileoverview Modale de confirmation sécurisée pour les actions critiques.
 * @module components/ConfirmModal
 * Évite les suppressions involontaires avec protection anti-double soumission.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, RefreshCw } from 'lucide-react';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen Indique si la modale est visible.
 * @param {() => void} props.onClose Callback de fermeture/annulation.
 * @param {() => void} props.onConfirm Callback de validation de l'action critique.
 * @param {string} props.title Titre explicite de l'opération.
 * @param {string} props.message Explication de l'impact irréversible de l'action.
 * @param {string} [props.confirmLabel='Confirmer la suppression'] Libellé du bouton critique.
 * @param {string} [props.cancelLabel='Annuler'] Libellé du bouton d'annulation.
 * @param {boolean} [props.loading=false] État de chargement bloquant.
 * @param {'danger'|'warning'|'primary'} [props.variant='danger'] Variante d'accentuation.
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loading = false,
  variant = 'danger'
}) => {
  // Fermeture à la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-forest/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        className="w-full max-w-md bg-surface-card rounded-2xl border border-surface-border shadow-2xl p-6 animate-scale-in-subtle text-surface-text transition-all duration-200 ease-saas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isDanger
                ? 'bg-state-dangerBg text-state-danger border border-state-danger/20'
                : 'bg-brand-accentLight text-brand-terracotta border border-brand-terracotta/20'
            }`}
          >
            {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-surface-textMuted hover:text-surface-text hover:bg-surface-page transition disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="confirm-modal-title" className="text-base font-black tracking-tight text-surface-text">
            {title}
          </h2>
          <p className="mt-2 text-xs text-surface-textMuted leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-2.5 pt-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary text-xs py-2 px-4"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`text-xs py-2 px-4 rounded-xl font-bold text-white transition shadow-sm inline-flex items-center space-x-1.5 ${
              isDanger
                ? 'bg-state-danger hover:bg-state-danger/90 active:scale-95'
                : 'bg-brand-terracotta hover:bg-brand-accentHover active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

