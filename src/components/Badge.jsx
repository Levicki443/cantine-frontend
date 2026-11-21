/**
 * @fileoverview Composant de badge sémantique pour les statuts et rôles Cantine Manager.
 * @module components/Badge
 * Strictement aligné sur la palette 3 couleurs : Vert Forêt, Terracotta, Ivoire.
 * Micro-indicateur d'état interactif et LED pulsante.
 */

import React from 'react';

const VARIANTS = {
  // Statuts fonctionnels harmonisés
  success: 'bg-brand-light text-brand-forest border-brand-forest/20',
  forest: 'bg-brand-light text-brand-forest border-brand-forest/20',
  warning: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/25',
  danger: 'bg-state-dangerBg text-state-danger border-state-danger/25',
  info: 'bg-surface-muted text-surface-text border-surface-border',
  gold: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/25',
  muted: 'bg-surface-muted text-surface-textMuted border-surface-border',

  // Rôles utilisateurs
  admin: 'bg-brand-light text-brand-forest border-brand-forest/30 font-bold',
  manager: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/30 font-bold',
  cashier: 'bg-brand-light text-brand-forest border-brand-forest/30 font-bold',
  client: 'bg-surface-muted text-surface-text border-surface-border font-bold'
};

const DOT_COLORS = {
  success: 'bg-brand-forest',
  forest: 'bg-brand-forest',
  warning: 'bg-brand-terracotta',
  danger: 'bg-state-danger',
  info: 'bg-surface-textMuted',
  gold: 'bg-brand-terracotta',
  muted: 'bg-surface-textMuted'
};

/**
 * Badge visuel d'information et de statut avec micro-indicateur LED optionnel.
 * @param {Object} props
 * @param {string} [props.variant='muted'] Variante sémantique.
 * @param {boolean} [props.pulse=false] Activer la LED vivante qui pulse.
 * @param {React.ReactNode} props.children Contenu textuel du badge.
 * @param {string} [props.className] Classes CSS d'extension.
 */
export const Badge = ({ variant = 'muted', pulse = false, children, className = '' }) => {
  const variantClass = VARIANTS[variant] || VARIANTS.muted;
  const dotColor = DOT_COLORS[variant] || 'bg-brand-forest';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClass} transition-colors duration-200 ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1.5 flex-shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
