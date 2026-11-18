/**
 * @fileoverview Composant de carte repas gastronomique pour la vitrine étudiante.
 * @module pages/client/MealCard
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import Badge from '../../components/Badge';
import {
  UtensilsCrossed,
  CheckCircle2,
  Flame,
  Coffee,
  ChevronRight,
  Info
} from 'lucide-react';

/**
 * Détermine l'icône et l'étiquette de température selon la catégorie du plat.
 */
const getMetadonneesCategorie = (categorie = '') => {
  const cat = categorie.toLowerCase();
  if (cat.includes('boisson')) {
    return {
      indicateur: 'Frais au bar à jus',
      couleurPill: 'bg-brand-light text-brand-forest border-brand-forest/20',
      icone: <Coffee className="w-3.5 h-3.5 mr-1 text-brand-forest" />
    };
  }
  if (cat.includes('grill') || cat.includes('chaud')) {
    return {
      indicateur: 'Chaud & mijoté sur place',
      couleurPill: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20',
      icone: <Flame className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
    };
  }
  return {
    indicateur: 'Préparé ce matin',
    couleurPill: 'bg-surface-muted text-surface-text border-surface-border',
    icone: <UtensilsCrossed className="w-3.5 h-3.5 mr-1 text-brand-forest" />
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
  const { indicateur, couleurPill, icone } = getMetadonneesCategorie(plat.categorie);

  return (
    <div
      onClick={() => onSelect && onSelect(plat)}
      className="card-container card-hover p-5 sm:p-6 flex flex-col justify-between bg-surface-card border-surface-border group animate-fade-in cursor-pointer relative overflow-hidden"
    >
      {/* Ligne d'accent supérieure */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-forest/10 group-hover:bg-brand-terracotta transition-colors duration-200" />

      <div>
        {/* En-tête : catégorie et état de disponibilité */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${couleurPill}`}>
            {icone}
            <span>{plat.categorie || 'Cuisine locale'}</span>
          </span>

          {estDisponible ? (
            <span className="inline-flex items-center text-[10px] font-bold text-brand-forest bg-brand-light px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1 text-brand-forest" />
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] font-bold text-brand-terracotta bg-brand-accentLight px-2.5 py-0.5 rounded-full">
              Épuisé
            </span>
          )}
        </div>

        {/* Titre du plat avec accentuation au survol */}
        <h4 className="text-base sm:text-lg font-black text-surface-text group-hover:text-brand-forest transition-colors duration-200 leading-snug">
          {plat.nom}
        </h4>

        {/* Description gourmande */}
        <p className="text-xs text-surface-textMuted mt-2 leading-relaxed line-clamp-2 font-medium">
          {plat.description || 'Préparation fraîche du matin cuisinée avec des ingrédients locaux sélectionnés.'}
        </p>

        {/* Badges d'excellence & fraîcheur */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border">
            Fait Maison
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border">
            Marché Local
          </span>
          <span className="text-[9px] font-bold text-surface-textMuted text-[10px]">
            &bull; {indicateur}
          </span>
        </div>
      </div>

      {/* Pied de carte : Tarif XXL et bouton d'action */}
      <div className="mt-5 pt-3.5 border-t border-surface-border flex items-center justify-between">
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
          className="inline-flex items-center text-xs font-bold text-brand-forest group-hover:text-brand-terracotta bg-surface-page hover:bg-surface-muted px-3 py-1.5 rounded-xl border border-surface-border transition duration-150"
        >
          <span>Détails</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default MealCard;
