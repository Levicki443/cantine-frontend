/**
 * @fileoverview Modale détaillée pour la consultation d'un plat de la cantine.
 * @module pages/client/MealDetailModal
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import Badge from '../../components/Badge';
import {
  UtensilsCrossed,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Info
} from 'lucide-react';

/**
 * Modale de consultation détaillée des ingrédients et allergènes d'un plat.
 * @param {Object} props
 * @param {Object} props.plat Le plat sélectionné.
 * @param {Function} props.onClose Fonction de fermeture de la modale.
 */
export const MealDetailModal = ({ plat, onClose }) => {
  if (!plat) return null;

  return (
    <div className="fixed inset-0 bg-brand-forest/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surface-card rounded-3xl border border-surface-border shadow-2xl w-full max-w-lg p-6 sm:p-7 animate-scale-in relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-surface-textMuted hover:text-surface-text hover:bg-surface-page transition duration-150"
          aria-label="Fermer la fiche"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête de la fiche plat */}
        <div className="flex items-center space-x-2.5 mb-3">
          <Badge variant="muted" className="capitalize text-xs font-bold">
            {plat.categorie || 'Cuisine traditionnelle'}
          </Badge>
          <span className="inline-flex items-center text-[10px] font-bold text-brand-forest bg-brand-light px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 mr-1 text-brand-forest" />
            Disponible au comptoir
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-surface-text leading-tight">
          {plat.nom}
        </h3>

        <p className="text-xs text-surface-textMuted mt-2.5 leading-relaxed font-medium">
          {plat.description || 'Préparation fraîche élaborée chaque matin par notre brigade selon les recettes traditionnelles.'}
        </p>

        {/* Bloc Ingrédients & Savoir-faire */}
        <div className="mt-5 p-4 rounded-2xl bg-surface-page/70 border border-surface-border space-y-2.5 text-xs">
          <div className="flex items-center text-brand-forest font-bold text-xs">
            <UtensilsCrossed className="w-4 h-4 mr-2 text-brand-terracotta" />
            <span>Engagements culinaires & Origine</span>
          </div>
          <p className="text-[11px] text-surface-textMuted leading-normal">
            Ingrédients frais du terroir ivoirien. Cuisson au feu doux préservant toutes les qualités nutritionnelles.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-card border border-surface-border text-surface-text">
              🌿 100% Produits Naturels
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-card border border-surface-border text-surface-text">
              🥣 Cuisiné le matin même
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-card border border-surface-border text-surface-text">
              🍲 Portion copieuse
            </span>
          </div>
        </div>

        {/* Informations allergènes & retrait */}
        <div className="mt-4 p-3.5 rounded-2xl bg-brand-light/30 border border-brand-forest/15 flex items-start space-x-3 text-xs text-surface-text">
          <Info className="w-4 h-4 text-brand-forest flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Modalité de service :</strong> Règlement et retrait direct au comptoir de la cantine lors de votre passage en caisse.
          </p>
        </div>

        {/* Pied de modale : Tarif & Bouton */}
        <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-surface-textMuted tracking-wider block">
              Tarif unitaire
            </span>
            <span className="text-2xl font-black text-brand-forest">
              {plat.prix?.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-primary text-xs py-2.5 px-6 rounded-xl shadow-sm"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetailModal;

