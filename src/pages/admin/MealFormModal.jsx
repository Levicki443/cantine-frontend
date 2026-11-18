/**
 * @fileoverview Modale de création et édition d'un repas pour le BackOffice.
 * @module pages/admin/MealFormModal
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import { X } from 'lucide-react';

const CATEGORIES_OFFICIELLES = ['déjeuner', 'petit-déjeuner', 'dîner', 'boissons', 'desserts', 'snacks'];

/**
 * Modale de saisie du formulaire repas et tarif.
 */
export const MealFormModal = ({
  ouverte,
  onClose,
  onSubmit,
  form,
  setForm,
  estEdition
}) => {
  if (!ouverte) return null;

  return (
    <div className="fixed inset-0 bg-brand-forest/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surface-card rounded-3xl border border-surface-border shadow-2xl w-full max-w-md p-6 sm:p-7 animate-scale-in relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-surface-textMuted hover:text-surface-text hover:bg-surface-page transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-surface-text mb-4">
          {estEdition ? 'Modifier le plat & son tarif' : 'Ajouter un nouveau plat'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
              Nom du plat ou de la boisson
            </label>
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="ex: Garba Royal au Thon Frit"
              className="input-field font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Catégorie
              </label>
              <select
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                className="input-field font-semibold capitalize"
              >
                {CATEGORIES_OFFICIELLES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-brand-forest block mb-1">
                Tarif Étudiant (FCFA)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                placeholder="1500"
                className="input-field font-black text-brand-forest"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
              Portions disponibles
            </label>
            <input
              type="number"
              min="0"
              value={form.quantite_disponible}
              onChange={(e) => setForm({ ...form, quantite_disponible: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
              Description & Ingrédients
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Composition, garnitures, préparation..."
              className="input-field font-medium"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-6 shadow-sm">
              {estEdition ? 'Enregistrer les modifications' : 'Ajouter à la carte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealFormModal;

