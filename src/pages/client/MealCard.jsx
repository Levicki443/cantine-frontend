/**
 * @fileoverview Composant de carte repas gastronomique pour la vitrine étudiante.
 * @module pages/client/MealCard
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Template professionnel avec élévation dynamique et micro-interactions (< 325 lignes).
 */

import React from 'react';
import Badge from '../../components/Badge';
import {
  UtensilsCrossed,
  Flame,
  Coffee,
  ChevronRight,
  Sparkles
} from 'lucide-react';

/**
 * Détermine l'icône et l'étiquette selon la catégorie du plat.
 */
const getMetadonneesCategorie = (categorie = '') => {
  const cat = categorie.toLowerCase();
  if (cat.includes('boisson')) {
    return {
      indicateur: 'Frais au bar à jus',
      couleurPill: 'bg-brand-light text-brand-forest border-brand-forest/20',
      icone: <Coffee className="w-4 h-4 text-brand-forest" />,
      iconeBg: 'bg-brand-light'
    };
  }
  if (cat.includes('grill') || cat.includes('chaud') || cat.includes('déjeuner') || cat.includes('dejeuner')) {
    return {
      indicateur: 'Chaud & mijoté sur place',
      couleurPill: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20',
      icone: <Flame className="w-4 h-4 text-brand-terracotta" />,
      iconeBg: 'bg-brand-accentLight'
    };
  }
  return {
    indicateur: 'Préparé ce matin',
    couleurPill: 'bg-surface-muted text-surface-text border-surface-border',
    icone: <UtensilsCrossed className="w-4 h-4 text-brand-forest" />,
    iconeBg: 'bg-surface-page'
  };
};

/**
 * Carte de présentation d'un plat avec déclenchement de la modale de détails.
 * @param {Object} props
 * @param {Object} props.plat Données du plat.
 * @param {Function} [props.onSelect] Fonction appelée lors du clic sur la fiche.
 */
export const MealCard = ({ plat, onSelect }) => {
  const estDisponible = plat.disponible !== false && (plat.quantite_disponible ?? 10) > 0;
  const { indicateur, couleurPill, icone, iconeBg } = getMetadonneesCategorie(plat.categorie);

  return (
    <div
      onClick={() => onSelect && onSelect(plat)}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-surface-border hover:border-brand-forest/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Accent de couleur supérieur au survol */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-surface-border group-hover:bg-brand-forest transition-colors duration-300" />

      <div>
        {/* En-tête : Badge catégorie + Icône stylisée + État de disponibilité */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-xl ${iconeBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
              {icone}
            </div>
            <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${couleurPill}`}>
              {plat.categorie || 'Cuisine locale'}
            </span>
          </div>

          <Badge variant={estDisponible ? 'success' : 'danger'} pulse={estDisponible}>
            {estDisponible ? 'Disponible' : 'Épuisé'}
          </Badge>
        </div>

        {/* Titre du plat avec mise en valeur au survol */}
        <h4 className="text-base sm:text-lg font-black text-surface-text group-hover:text-brand-forest transition-colors duration-200 leading-snug mt-1">
          {plat.nom}
        </h4>

        {/* Description gourmande */}
        <p className="text-xs text-surface-textMuted mt-2 leading-relaxed line-clamp-2 font-medium">
          {plat.description || 'Préparation fraîche du matin cuisinée avec des ingrédients locaux sélectionnés.'}
        </p>

        {/* Badges de qualité & fraîcheur */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border/60">
            Fait Maison
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border/60">
            Marché Local
          </span>
          <span className="text-[10px] text-surface-textMuted font-semibold">
            &bull; {indicateur}
          </span>
        </div>
      </div>

      {/* Pied de carte : Tarif et bouton d'action tactile */}
      <div className="mt-5 pt-3.5 border-t border-surface-border/60 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-surface-textMuted uppercase font-extrabold tracking-widest block">
            Tarif Convive
          </span>
          <span className="text-xl font-black text-brand-forest">
            {plat.prix?.toLocaleString('fr-FR')} <span className="text-xs font-bold text-surface-textMuted">FCFA</span>
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(plat);
          }}
          className="btn-primary py-2 px-3.5 text-xs shadow-xs group-hover:shadow group-hover:bg-brand-hover active:scale-95"
        >
          <span>Découvrir</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default MealCard;
