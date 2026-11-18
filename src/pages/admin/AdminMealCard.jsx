/**
 * @fileoverview Carte de gestion administrative et tarifaire d'un plat au BackOffice.
 * @module pages/admin/AdminMealCard
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import Badge from '../../components/Badge';
import {
  UtensilsCrossed,
  CheckCircle2,
  Power,
  Edit2,
  Trash2,
  Flame,
  Coffee
} from 'lucide-react';

const getMetadonneesCategorie = (categorie = '') => {
  const cat = categorie.toLowerCase();
  if (cat.includes('boisson')) {
    return {
      indicateur: 'Frais au bar à jus',
      couleurPill: 'bg-brand-light text-brand-forest border-brand-forest/20',
      icone: <Coffee className="w-3.5 h-3.5 mr-1 text-brand-forest" />
    };
  }
  if (cat.includes('grill') || cat.includes('chaud') || cat.includes('déjeuner')) {
    return {
      indicateur: 'Chaud & mijoté sur place',
      couleurPill: 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/20',
      icone: <Flame className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
    };
  }
  return {
    indicateur: 'Préparé le matin',
    couleurPill: 'bg-surface-muted text-surface-text border-surface-border',
    icone: <UtensilsCrossed className="w-3.5 h-3.5 mr-1 text-brand-forest" />
  };
};

/**
 * Fiche d'administration d'un repas avec ajustement du tarif et statut.
 * @param {Object} props
 * @param {Object} props.plat Données du plat.
 * @param {Function} props.onEdit Callback d'ouverture de la modale de modification.
 * @param {Function} props.onToggleDispo Callback pour basculer la disponibilité.
 * @param {Function} props.onDelete Callback de suppression du plat.
 */
export const AdminMealCard = ({ plat, onEdit, onToggleDispo, onDelete }) => {
  const estDisponible = plat.disponible !== false;
  const { indicateur, couleurPill, icone } = getMetadonneesCategorie(plat.categorie);

  return (
    <div
      className={`card-container card-hover p-5 sm:p-6 flex flex-col justify-between bg-surface-card border transition-all duration-200 relative overflow-hidden animate-fade-in ${
        estDisponible ? 'border-surface-border' : 'border-brand-terracotta/40 bg-surface-page/40'
      }`}
    >
      {/* Ligne d'accentuation supérieure */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-200 ${
          estDisponible ? 'bg-brand-forest' : 'bg-brand-terracotta'
        }`}
      />

      <div>
        {/* En-tête : catégorie et badge d'état */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${couleurPill}`}>
            {icone}
            <span>{plat.categorie || 'Cuisine locale'}</span>
          </span>

          <button
            type="button"
            onClick={() => onToggleDispo(plat)}
            title="Cliquer pour basculer l'état"
            className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border transition active:scale-95 ${
              estDisponible
                ? 'bg-brand-light text-brand-forest border-brand-forest/20 hover:bg-brand-forest hover:text-white'
                : 'bg-brand-accentLight text-brand-terracotta border-brand-terracotta/30 hover:bg-brand-terracotta hover:text-white'
            }`}
          >
            <Power className="w-3 h-3 mr-1" />
            <span>{estDisponible ? 'Disponible' : 'Épuisé / Masqué'}</span>
          </button>
        </div>

        {/* Titre du plat */}
        <h4 className="text-base sm:text-lg font-black text-surface-text leading-snug">
          {plat.nom}
        </h4>

        {/* Description */}
        <p className="text-xs text-surface-textMuted mt-2 leading-relaxed line-clamp-2 font-medium">
          {plat.description || 'Spécialité culinaire fraîchement préparée pour les convives.'}
        </p>

        {/* Badges de caractéristiques */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border">
            Fait Maison
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-page text-surface-text border border-surface-border">
            Marché Local
          </span>
          <span className="text-[9px] font-bold text-surface-textMuted">
            &bull; {indicateur}
          </span>
        </div>
      </div>

      {/* Barre d'action inférieure : Tarif & Outils Admin */}
      <div className="mt-5 pt-3.5 border-t border-surface-border flex items-center justify-between">
        <div>
          <span className="text-[9px] text-surface-textMuted uppercase font-extrabold tracking-widest block">
            Tarif Convive
          </span>
          <span className="text-xl font-black text-brand-forest">
            {plat.prix?.toLocaleString('fr-FR')} <span className="text-xs font-bold text-surface-textMuted">FCFA</span>
          </span>
        </div>

        {/* Boutons d'édition et suppression */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => onEdit(plat)}
            title="Modifier le tarif et les informations"
            className="p-2 rounded-xl border border-surface-border bg-surface-page hover:bg-brand-light text-brand-forest hover:border-brand-forest/30 transition shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(plat._id, plat.nom)}
            title="Supprimer définitivement du menu"
            className="p-2 rounded-xl border border-brand-terracotta/20 bg-brand-accentLight/40 hover:bg-brand-terracotta hover:text-white text-brand-terracotta transition shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMealCard;

