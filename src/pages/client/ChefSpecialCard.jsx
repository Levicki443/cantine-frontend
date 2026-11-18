/**
 * @fileoverview Carte de mise en valeur de la Suggestion Signature du Chef.
 * @module pages/client/ChefSpecialCard
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import { Flame, UtensilsCrossed, Coffee } from 'lucide-react';

/**
 * Fiche prestige pour la formule signature du jour.
 * @param {Object} props
 * @param {Object} props.suggestionChef Données de la suggestion du chef.
 */
export const ChefSpecialCard = ({ suggestionChef }) => {
  return (
    <div className="p-6 card-container card-hover border-l-4 border-brand-terracotta bg-surface-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm animate-fade-in">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-brand-accentLight text-brand-terracotta animate-pulse-soft">
            Formule Signature du Jour
          </span>
          <span className="text-[10px] font-bold text-brand-forest bg-brand-light px-2 py-0.5 rounded-md">
            Préparation fraîche
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-surface-text mt-2">
          {suggestionChef.nom}
        </h3>
        <p className="text-xs text-surface-textMuted mt-1.5 leading-relaxed max-w-2xl font-medium">
          {suggestionChef.description}
        </p>

        {/* Détails de la formule */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] font-bold text-surface-text">
          <span className="flex items-center">
            <Flame className="w-3.5 h-3.5 text-brand-terracotta mr-1" />
            Plat chaud cuisiné
          </span>
          <span className="text-surface-border">&bull;</span>
          <span className="flex items-center">
            <UtensilsCrossed className="w-3.5 h-3.5 text-brand-forest mr-1" />
            Accompagnement inclus
          </span>
          <span className="text-surface-border">&bull;</span>
          <span className="flex items-center">
            <Coffee className="w-3.5 h-3.5 text-brand-terracotta mr-1" />
            Boisson locale fraîche
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 lg:border-l lg:border-surface-border lg:pl-6 text-left lg:text-right w-full lg:w-auto flex lg:flex-col justify-between items-center lg:items-end">
        <div>
          <span className="text-[10px] uppercase font-bold text-surface-textMuted tracking-wider block">
            Tarif Formule Complète
          </span>
          <span className="text-2xl font-black text-brand-forest block">
            {suggestionChef.tarif?.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
        <span className="mt-2 inline-block px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-brand-forest text-white shadow-xs">
          Service Immédiat
        </span>
      </div>
    </div>
  );
};

export default ChefSpecialCard;

