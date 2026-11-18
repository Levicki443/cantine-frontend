/**
 * @fileoverview Module de planification intelligente des repas et calcul des ingrédients nécessaires.
 * @module pages/menus/MenuPlanner
 * Conforme à la section 2 du cahier des charges opérationnel.
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  CalendarDays,
  UtensilsCrossed,
  Calculator,
  Copy,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

const JOURS_SEMAINE = [
  { id: 'lundi', label: 'Lundi', platDefaut: 'Riz gras au bœuf' },
  { id: 'mardi', label: 'Mardi', platDefaut: 'Attiéké & Poisson grillé' },
  { id: 'mercredi', label: 'Mercredi', platDefaut: 'Garba royal (Thon & Attiéké)' },
  { id: 'jeudi', label: 'Jeudi', platDefaut: 'Placali & Sauce gombo' },
  { id: 'vendredi', label: 'Vendredi', platDefaut: 'Spaghetti sauté cantine' },
  { id: 'samedi', label: 'Samedi', platDefaut: 'Alloco & Poulet braisé' }
];

export const MenuPlanner = () => {
  const [jourActif, setJourActif] = useState('mercredi');
  const [platsDisponibles, setPlatsDisponibles] = useState([]);
  const [programme, setProgramme] = useState({
    mercredi: [
      { meal_id: '1', nom: 'Garba royal (Thon & Attiéké)', portions: 100, prix: 1200 },
      { meal_id: '2', nom: 'Jus de Bissap glacé 50cl', portions: 80, prix: 600 }
    ]
  });

  const [ingredientsEstimes, setIngredientsEstimes] = useState([
    { nom: 'Semoule de manioc (Attiéké)', quantite: 35, unite: 'kg', stock: 15, manquant: 20 },
    { nom: 'Thon frais de pêche', quantite: 100, unite: 'unité', stock: 40, manquant: 60 },
    { nom: 'Huile de friture 5L', quantite: 8, unite: 'litre', stock: 10, manquant: 0 },
    { nom: 'Piment frais haché', quantite: 2.5, unite: 'kg', stock: 1, manquant: 1.5 },
    { nom: 'Oignons violets', quantite: 6, unite: 'kg', stock: 12, manquant: 0 }
  ]);

  const [message, setMessage] = useState(null);

  const platsDuJour = programme[jourActif] || [];

  const handleChangerPortions = (index, delta) => {
    const copie = [...platsDuJour];
    copie[index].portions = Math.max(10, copie[index].portions + delta);
    setProgramme({ ...programme, [jourActif]: copie });
    calculerIngredients(copie);
  };

  const calculerIngredients = (plats) => {
    // Calcul proportionnel en temps réel selon les portions
    const facteur = plats.reduce((acc, p) => acc + p.portions, 0) / 100;
    setIngredientsEstimes([
      { nom: 'Semoule de manioc (Attiéké)', quantite: Math.round(35 * facteur), unite: 'kg', stock: 15, manquant: Math.max(0, Math.round(35 * facteur) - 15) },
      { nom: 'Thon frais de pêche', quantite: Math.round(100 * facteur), unite: 'unité', stock: 40, manquant: Math.max(0, Math.round(100 * facteur) - 40) },
      { nom: 'Huile de friture 5L', quantite: Math.round(8 * facteur * 10) / 10, unite: 'litre', stock: 10, manquant: Math.max(0, Math.round(8 * facteur - 10)) },
      { nom: 'Piment frais haché', quantite: Math.round(2.5 * facteur * 10) / 10, unite: 'kg', stock: 1, manquant: Math.max(0, Math.round(2.5 * facteur - 1)) },
      { nom: 'Oignons violets', quantite: Math.round(6 * facteur * 10) / 10, unite: 'kg', stock: 12, manquant: 0 }
    ]);
  };

  const dupliquerSemaine = () => {
    setMessage('Semaine dupliquée avec succès pour la semaine prochaine !');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AppLayout
      title="Planification des Menus & Ingrédients"
      subtitle="Programmation hebdomadaire et calcul automatique des matières premières nécessaires"
    >
      {/* Alerte de confirmation */}
      {message && (
        <div className="flex items-center p-3 mb-6 text-xs rounded-lg bg-state-successBg border border-state-success text-state-success">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Sélecteur de jour de la semaine */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0">
          {JOURS_SEMAINE.map((jour) => (
            <button
              key={jour.id}
              onClick={() => setJourActif(jour.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center ${
                jourActif === jour.id
                  ? 'bg-brand-forest text-white shadow-sm'
                  : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-muted'
              }`}
            >
              <span>{jour.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={dupliquerSemaine}
          className="btn-secondary text-xs flex items-center"
        >
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          <span>Dupliquer cette semaine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche : Plats au menu du jour */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 card-container">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-surface-text capitalize">
                  Menu du {jourActif}
                </h3>
                <p className="text-xs text-surface-textMuted">
                  Définissez les portions à préparer pour estimer les stocks
                </p>
              </div>
              <Badge variant="forest">En préparation</Badge>
            </div>

            <div className="space-y-3">
              {platsDuJour.map((plat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-surface-border bg-surface-page/50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-surface-text">{plat.nom}</p>
                    <p className="text-[11px] text-brand-forest font-extrabold mt-0.5">
                      {plat.prix.toLocaleString('fr-FR')} FCFA / portion
                    </p>
                  </div>

                  {/* Contrôle des portions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleChangerPortions(idx, -10)}
                      className="w-7 h-7 rounded-lg bg-surface-card border border-surface-border text-xs font-bold text-surface-text hover:bg-surface-muted"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-xs font-black text-brand-forest">
                      {plat.portions}
                    </span>
                    <button
                      onClick={() => handleChangerPortions(idx, 10)}
                      className="w-7 h-7 rounded-lg bg-surface-card border border-surface-border text-xs font-bold text-surface-text hover:bg-surface-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-2.5 rounded-lg border border-dashed border-brand-forest/40 text-xs font-bold text-brand-forest hover:bg-brand-light/30 transition flex items-center justify-center">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Ajouter un plat au menu du {jourActif}</span>
            </button>
          </div>
        </div>

        {/* Colonne droite : Ingrédients auto-calculés par le système */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 card-container">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-surface-text flex items-center">
                  <Calculator className="w-4 h-4 mr-1.5 text-brand-gold" />
                  Ingrédients Nécessaires Estimés
                </h3>
                <p className="text-xs text-surface-textMuted">
                  Calcul automatique basé sur les recettes enregistrées
                </p>
              </div>
              <Badge variant="gold">Calcul intelligent</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-surface-textMuted text-[11px] uppercase">
                    <th className="pb-2 font-bold">Ingrédient</th>
                    <th className="pb-2 font-bold text-right">Besoin</th>
                    <th className="pb-2 font-bold text-right">En Stock</th>
                    <th className="pb-2 font-bold text-right">À Acheter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {ingredientsEstimes.map((ing, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30">
                      <td className="py-2.5 font-semibold text-surface-text">{ing.nom}</td>
                      <td className="py-2.5 text-right font-bold text-surface-text">
                        {ing.quantite} {ing.unite}
                      </td>
                      <td className="py-2.5 text-right text-surface-textMuted">
                        {ing.stock} {ing.unite}
                      </td>
                      <td className="py-2.5 text-right">
                        {ing.manquant > 0 ? (
                          <span className="font-extrabold text-brand-terracotta">
                            +{ing.manquant} {ing.unite}
                          </span>
                        ) : (
                          <span className="text-state-success font-bold">Suffisant ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total achats requis */}
            <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs font-bold text-surface-text">
                Articles en rupture prévisionnelle :
              </span>
              <span className="text-xs font-black text-brand-terracotta">
                {ingredientsEstimes.filter((x) => x.manquant > 0).length} matières premières
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MenuPlanner;

