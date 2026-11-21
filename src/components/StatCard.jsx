/**
 * @fileoverview Composant de carte KPI décisionnelle Cantine Manager.
 * @module components/StatCard
 * Cartes professionnelles épurées avec élévation douce et micro-indicateurs de tendance.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Carte de statistique affichant un indicateur clé avec hiérarchie visuelle maîtrisée.
 * @param {Object} props
 * @param {string} props.title Titre de l'indicateur.
 * @param {string|number} props.value Valeur principale affichée.
 * @param {string} [props.subtitle] Précision contextuelle ou tendance textuelle.
 * @param {{value: string, isPositive?: boolean}} [props.trend] Tendance chiffrée.
 * @param {React.ReactNode} props.icon Icône fonctionnelle Lucide.
 * @param {'forest'|'terracotta'|'neutral'|'brand'|'success'|'warning'|'danger'|'info'} [props.colorScheme='forest'] Schéma d'accentuation.
 * @param {string} [props.badge] Badge contextuel optionnel.
 * @param {() => void} [props.onClick] Callback optionnel au clic.
 */
export const StatCard = ({
  title,
  titre,
  value,
  valeur,
  subtitle,
  description,
  trend,
  tendance,
  badge,
  icon,
  icone: IconComponent,
  colorScheme = 'forest',
  variant,
  onClick
}) => {
  const displayTitle = title || titre;
  const displayValue = value ?? valeur;
  const displaySubtitle = subtitle || description;
  const displayIcon = icon || (IconComponent ? <IconComponent className="w-5 h-5" /> : null);
  const displayTrend = trend || (tendance === 'positive' ? { value: '+12%', isPositive: true } : null);
  const activeScheme = variant || colorScheme;

  const schemeClasses = {
    forest: 'bg-brand-light text-brand-forest border-brand-forest/20 group-hover:border-brand-forest/40',
    brand: 'bg-brand-light text-brand-forest border-brand-forest/20 group-hover:border-brand-forest/40',
    success: 'bg-brand-light text-brand-forest border-brand-forest/20 group-hover:border-brand-forest/40',
    terracotta: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20 group-hover:border-brand-terracotta/40',
    warning: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20 group-hover:border-brand-terracotta/40',
    danger: 'bg-state-dangerBg text-state-danger border-state-danger/20 group-hover:border-state-danger/40',
    neutral: 'bg-surface-muted text-surface-text border-surface-border',
    info: 'bg-surface-muted text-surface-text border-surface-border'
  };

  const selectedScheme = schemeClasses[activeScheme] || schemeClasses.forest;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`p-5 card-container card-hover animate-fade-in group relative overflow-hidden ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-surface-textMuted truncate">
            {displayTitle}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-surface-text group-hover:text-brand-forest transition-colors duration-200">
            {displayValue}
          </p>

          <div className="mt-2.5 flex items-center space-x-2 flex-wrap gap-y-1">
            {displayTrend && (
              <span
                className={`inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  displayTrend.isPositive !== false
                    ? 'text-brand-forest bg-brand-light border border-brand-forest/20'
                    : 'text-brand-terracotta bg-brand-accentLight border border-brand-terracotta/20'
                }`}
              >
                {displayTrend.isPositive !== false ? (
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0" />
                )}
                <span>{displayTrend.value}</span>
              </span>
            )}

            {badge && (
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-accentLight text-brand-terracotta border border-brand-terracotta/25">
                {badge}
              </span>
            )}

            {displaySubtitle && (
              <p className="text-[11px] text-surface-textMuted font-medium line-clamp-1">
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm border ${selectedScheme}`}
        >
          {displayIcon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
