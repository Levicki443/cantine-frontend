/**
 * @fileoverview Composant standardisé d'état vide (Empty State).
 * @module components/EmptyState
 * Présente un message courtois et une action d'engagement quand aucune donnée n'existe.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import { PackageOpen } from 'lucide-react';

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] Icône illustrative personnalisée.
 * @param {string} props.title Titre explicatif de l'état vide.
 * @param {string} [props.description] Message d'aide ou conseil pour commencer.
 * @param {string} [props.actionLabel] Libellé du bouton d'action principal.
 * @param {() => void} [props.onAction] Callback déclenché au clic sur l'action.
 * @param {string} [props.secondaryActionLabel] Libellé d'action secondaire.
 * @param {() => void} [props.onSecondaryAction] Callback action secondaire.
 */
export const EmptyState = ({
  icon,
  title = 'Aucune donnée disponible',
  description = 'Il n’y a aucun élément à afficher pour le moment.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-surface-muted text-surface-textMuted flex items-center justify-center mb-4 border border-surface-border shadow-xs">
        {icon || <PackageOpen className="w-7 h-7 text-brand-forest/60" />}
      </div>

      <h3 className="text-base font-black text-surface-text tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-xs text-surface-textMuted max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex items-center space-x-3 flex-wrap justify-center gap-y-2">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

