/**
 * @fileoverview Composant de badge sémantique pour les statuts et rôles Cantine Manager.
 * @module components/Badge
 * Strictement aligné sur la palette 3 couleurs : Vert Forêt, Terracotta, Ivoire.
 */

import React from 'react';

const VARIANTS = {
  // Statuts fonctionnels harmonisés
  success: 'bg-brand-light text-brand-forest border-brand-forest/20',
  warning: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20',
  danger: 'bg-state-dangerBg text-state-danger border-state-danger/20',
  info: 'bg-surface-muted text-surface-text border-surface-border',
  gold: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20',
  muted: 'bg-surface-muted text-surface-textMuted border-surface-border',

  // Rôles utilisateurs
  admin: 'bg-brand-light text-brand-forest border-brand-forest/20 font-bold',
  manager: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20 font-bold',
  cashier: 'bg-brand-light text-brand-forest border-brand-forest/20 font-bold',
  client: 'bg-surface-muted text-surface-text border-surface-border font-bold'
};

/**
 * Badge visuel d'information et de statut.
 * @param {Object} props
 * @param {string} [props.variant='muted'] Variante sémantique.
 * @param {React.ReactNode} props.children Contenu textuel du badge.
 * @param {string} [props.className] Classes CSS d'extension.
 */
export const Badge = ({ variant = 'muted', children, className = '' }) => {
  const variantClass = VARIANTS[variant] || VARIANTS.muted;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
