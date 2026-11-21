/**
 * @fileoverview Carte prestige de mise en valeur de la Suggestion Signature du Chef.
 * @module pages/client/ChefSpecialCard
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Template haut de gamme avec élévation et micro-interactions (< 325 lignes).
 */

import React from 'react';
import { Flame, UtensilsCrossed, Coffee, Sparkles } from 'lucide-react';

/**
 * Fiche prestige pour la formule signature du jour.
 * @param {Object} props
 * @param {Object} props.suggestionChef Données de la suggestion du chef.
 */
export const ChefSpecialCard = ({ suggestionChef }) => {
  return (
    <div className="p-6 sm:p-7 rounded-2xl border border-brand-terracotta/30 bg-gradient-to-br from-white via-surface-card to-brand-accentLight/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden group">
      {/* Accent lumineux d'arrière-plan */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-terracotta/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-brand-terracotta text-white shadow-xs">
            <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
            Formule Signature du Chef
          </span>
          <span className="inline-flex items-center text-[10px] font-bold text-brand-forest bg-brand-light px-3 py-1 rounded-full border border-brand-forest/20">
            Préparation fraîche du matin
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-surface-text mt-2 group-hover:text-brand-forest transition-colors duration-200">
          {suggestionChef.nom}
        </h3>
        <p className="text-xs sm:text-sm text-surface-textMuted mt-2 leading-relaxed max-w-2xl font-medium">
          {suggestionChef.description}
        </p>

        {/* Détails gourmands de la formule */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-surface-border/60 text-xs font-bold text-surface-text">
          <span className="inline-flex items-center text-brand-terracotta">
            <Flame className="w-4 h-4 mr-1.5" />
            Plat chaud cuisiné
          </span>
          <span className="text-surface-border">&bull;</span>
          <span className="inline-flex items-center text-brand-forest">
            <UtensilsCrossed className="w-4 h-4 mr-1.5" />
            Accompagnement inclus
          </span>
          <span className="text-surface-border">&bull;</span>
          <span className="inline-flex items-center text-brand-terracotta">
            <Coffee className="w-4 h-4 mr-1.5" />
            Boisson locale fraîche
          </span>
        </div>
      </div>

      {/* Bloc Tarif Prestige */}
      <div className="flex-shrink-0 lg:border-l lg:border-surface-border lg:pl-8 text-left lg:text-right w-full lg:w-auto flex lg:flex-col justify-between items-center lg:items-end relative z-10">
        <div>
          <span className="text-[10px] uppercase font-bold text-surface-textMuted tracking-wider block">
            Formule Tout Compris
          </span>
          <span className="text-2xl sm:text-3xl font-black text-brand-forest block tracking-tight mt-0.5">
            {suggestionChef.tarif?.toLocaleString('fr-FR')} <span className="text-sm font-bold text-surface-textMuted">FCFA</span>
          </span>
        </div>
        <span className="mt-2.5 inline-flex items-center px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-brand-forest text-white shadow-sm group-hover:bg-brand-hover transition-colors">
          Service Immédiat
        </span>
      </div>
    </div>
  );
};

export default ChefSpecialCard;
