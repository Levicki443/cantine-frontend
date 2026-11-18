/**
 * @fileoverview Composant d'affichage enrichi du planning hebdomadaire de la cantine.
 * @module pages/client/WeeklyPlanningView
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552). Zéro étoile.
 */

import React from 'react';
import Badge from '../../components/Badge';
import {
  Calendar,
  ChefHat,
  Citrus
} from 'lucide-react';

/**
 * Vue prévisionnelle enrichie des repas du lundi au samedi.
 * @param {Object} props
 * @param {Array} props.joursSemaine Liste des jours de la semaine.
 * @param {string} props.jourSelectionne Id du jour actif.
 * @param {Function} props.setJourSelectionne Callback de sélection du jour.
 * @param {Object} props.jourActif Données du jour sélectionné.
 */
export const WeeklyPlanningView = ({
  joursSemaine,
  jourSelectionne,
  setJourSelectionne,
  jourActif
}) => {
  // Détection du jour courant (0 = dimanche, 1 = lundi, etc.)
  const indexJourCourant = new Date().getDay();
  const mapJours = ['', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const jourAujourdhuiId = mapJours[indexJourCourant] || 'lundi';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bandeau d'information doux */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border flex items-start space-x-3 text-xs text-surface-text shadow-xs">
        <div className="p-2 rounded-xl bg-brand-light text-brand-forest flex-shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="font-black text-brand-forest uppercase tracking-wider text-[11px] block">
            Programme Hebdomadaire Frais & Garanti
          </span>
          <p className="text-surface-textMuted text-xs mt-0.5">
            Chaque menu est cuisiné le matin même à partir d'ingrédients locaux livrés quotidiennement par nos producteurs partenaires.
          </p>
        </div>
      </div>

      {/* Sélecteur de semaine moderne type Segmented Day Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {joursSemaine.map((j) => {
          const estActif = jourSelectionne === j.id;
          const estAujourdhui = j.id === jourAujourdhuiId;

          return (
            <button
              key={j.id}
              type="button"
              onClick={() => setJourSelectionne(j.id)}
              className={`p-3 rounded-2xl text-center border transition-all duration-200 relative card-lift ${
                estActif
                  ? 'bg-brand-forest text-white border-brand-forest shadow-md'
                  : 'bg-surface-card border-surface-border text-surface-text hover:bg-surface-muted/60 hover:border-surface-borderFocus/40'
              }`}
            >
              {estAujourdhui && (
                <span
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs ${
                    estActif ? 'bg-brand-terracotta text-white' : 'bg-brand-terracotta text-white'
                  }`}
                >
                  Aujourd'hui
                </span>
              )}
              <span className="block text-[11px] font-black uppercase tracking-wider">
                {j.label}
              </span>
              <div className="flex items-center justify-center space-x-1 mt-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    estActif ? 'bg-brand-terracotta' : 'bg-state-success'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium ${
                    estActif ? 'text-surface-page/80' : 'text-surface-textMuted'
                  }`}
                >
                  Confirmé
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Carte Culinaire Prestige du Jour Sélectionné */}
      <div className="p-6 card-container shadow-sm border-surface-border bg-surface-card animate-fade-in-up">
        {/* En-tête de la formule */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-surface-border gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-terracotta">
                Formule Midi Complète
              </span>
              <span className="text-surface-border font-bold">•</span>
              <span className="text-xs text-surface-textMuted font-bold">11h30 – 14h30</span>
            </div>
            <h3 className="text-lg font-black text-surface-text mt-0.5">
              Menu du {jourActif?.label}
            </h3>
          </div>

          <div className="flex items-center space-x-2.5">
            <Badge variant="forest">
              {jourActif?.statut || 'Service Garanti'}
            </Badge>
            <span className="text-sm font-black text-brand-forest bg-brand-light px-3 py-1 rounded-xl">
              1 500 F CFA
            </span>
          </div>
        </div>

        {/* Grille des 2 composantes de la formule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plat Principal */}
          <div className="p-5 rounded-2xl bg-surface-page/70 border border-surface-border/80 card-lift">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 rounded-lg bg-brand-forest text-white">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-forest">
                Plat Principal & Accompagnement
              </span>
            </div>

            <h4 className="text-base font-black text-surface-text mt-1 leading-snug">
              {jourActif?.plat}
            </h4>

            <p className="text-xs text-surface-textMuted mt-2 leading-relaxed">
              Cuisiné le matin même par la brigade, avec garniture de féculents locaux et jus d'assaisonnement maison.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                Fait Maison
              </span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                Ingrédients Locaux
              </span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                Chaud & Généreux
              </span>
            </div>
          </div>

          {/* Boisson & Douceur */}
          <div className="p-5 rounded-2xl bg-surface-page/70 border border-surface-border/80 card-lift">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 rounded-lg bg-brand-terracotta text-white">
                <Citrus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-terracotta">
                Boisson Fraîche ou Dessert Inclus
              </span>
            </div>

            <h4 className="text-base font-black text-surface-text mt-1 leading-snug">
              {jourActif?.dessert}
            </h4>

            <p className="text-xs text-surface-textMuted mt-2 leading-relaxed">
              Boisson artisanale extraite de fruits frais ou douceur locale pour clore idéalement votre pause déjeuner.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                100% Naturel
              </span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                Servi Glacé
              </span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-surface-border text-surface-text">
                Sans Conservateur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanningView;
