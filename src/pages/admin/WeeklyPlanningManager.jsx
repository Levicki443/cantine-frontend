/**
 * @fileoverview Édition de l'Ardoise et des horaires de service pour le BackOffice.
 * @module pages/admin/WeeklyPlanningManager
 * Permet à l'administrateur de modifier les menus de la semaine et les créneaux affichés aux étudiants.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import { CalendarDays, Clock, UtensilsCrossed, Save, CheckCircle, AlertCircle } from 'lucide-react';

const JOURS_DEFAUT = [
  { id: 'lundi', label: 'Lundi', plat: 'Riz blanc & Sauce Graine au poisson fumé', dessert: 'Jus de Bissap glacé', statut: 'Service garanti' },
  { id: 'mardi', label: 'Mardi', plat: 'Attiéké & Tilapia braisé sauce tomate-oignon', dessert: 'Coupe de fruits frais', statut: 'Service garanti' },
  { id: 'mercredi', label: 'Mercredi', plat: 'Garba authentique (Semoule de manioc & Thon frit)', dessert: 'Gnamakoudji frais', statut: 'Spécialité Ivoirienne' },
  { id: 'jeudi', label: 'Jeudi', plat: 'Placali & Sauce Kopê avec viande de bœuf', dessert: 'Banane douce', statut: 'Service garanti' },
  { id: 'vendredi', label: 'Vendredi', plat: 'Spaghetti sauté gourmand aux légumes & boulettes', dessert: 'Jus de Tamarin', statut: 'Service garanti' },
  { id: 'samedi', label: 'Samedi', plat: 'Menu Spécial Découverte du Chef', dessert: 'Salade de mangue', statut: 'Menu d’exception' }
];

export const WeeklyPlanningManager = () => {
  const [horaires, setHoraires] = useState({
    statut_service: 'Ouvert',
    dejeuner: '11h30 – 14h30',
    diner: '18h30 – 20h30',
    petit_dejeuner: '07h00 – 08h30'
  });

  const [suggestionChef, setSuggestionChef] = useState({
    nom: 'Formule Gourmande & Équilibrée de la Cantine',
    description: 'Cuisinée chaque matin avec des produits frais du marché.',
    tarif: 1500
  });

  const [jours, setJours] = useState(JOURS_DEFAUT);
  const [jourSelectionne, setJourSelectionne] = useState('lundi');
  const [sauvegarde, setSauvegarde] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  const chargerPlanning = async () => {
    try {
      const res = await apiClient.get('/planning/weekly');
      if (res.success && res.planning) {
        if (res.planning.horaires) setHoraires(res.planning.horaires);
        if (res.planning.suggestion_chef) setSuggestionChef(res.planning.suggestion_chef);
        if (res.planning.jours && res.planning.jours.length > 0) setJours(res.planning.jours);
      }
    } catch {
      // Garder les valeurs par défaut
    }
  };

  useEffect(() => {
    chargerPlanning();
  }, []);

  const handleModifierJour = (champ, valeur) => {
    setJours((prev) => prev.map((j) => (j.id === jourSelectionne ? { ...j, [champ]: valeur } : j)));
  };

  const handleSauvegarder = async (e) => {
    e.preventDefault();
    setSauvegarde(true);
    setMessage(null);
    setErreur(null);
    try {
      const payload = { horaires, suggestion_chef: suggestionChef, jours };
      const res = await apiClient.put('/planning/weekly', payload);
      if (res.success) {
        setMessage('L’ardoise des étudiants a été mise à jour en direct !');
      }
    } catch (err) {
      setErreur(err.message || 'Impossible d’enregistrer le planning.');
    } finally {
      setSauvegarde(false);
    }
  };

  const jourActif = jours.find((j) => j.id === jourSelectionne) || jours[0];

  return (
    <AppLayout
      title="Édition de l'Ardoise & Horaires de Service"
      subtitle="Modifiez les menus hebdomadaires, les créneaux d'ouverture et la formule du chef affichés aux étudiants"
      breadcrumbs={[{ label: 'Restauration & Carte', to: '/admin/produits' }, { label: 'Ardoise & Horaires' }]}
    >
      {message && (
        <div className="p-4 mb-6 rounded-xl bg-state-successBg border border-state-success text-state-success text-xs flex items-center shadow-sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{message}</span>
        </div>
      )}
      {erreur && (
        <div className="p-4 mb-6 rounded-xl bg-state-dangerBg border border-state-danger text-state-danger text-xs flex items-center shadow-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      <form onSubmit={handleSauvegarder} className="space-y-6">
        {/* 1. Horaires & Statut de service */}
        <div className="p-5 card-container bg-surface-card border border-surface-border">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
            <h3 className="text-sm font-extrabold text-surface-text flex items-center">
              <Clock className="w-4 h-4 mr-2 text-brand-forest" />
              <span>Horaires de Service & État de la Cantine</span>
            </h3>
            <span className="text-[10px] text-surface-textMuted uppercase font-semibold">Bandeau supérieur étudiant</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Statut Restaurant</label>
              <select
                value={horaires.statut_service}
                onChange={(e) => setHoraires({ ...horaires, statut_service: e.target.value })}
                className="input-field font-bold capitalize"
              >
                <option value="Ouvert">Ouvert</option>
                <option value="Fermé">Fermé</option>
                <option value="En préparation">En préparation</option>
                <option value="Service en cours">Service en cours</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Déjeuner</label>
              <input
                type="text"
                value={horaires.dejeuner}
                onChange={(e) => setHoraires({ ...horaires, dejeuner: e.target.value })}
                placeholder="11h30 – 14h30"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Dîner</label>
              <input
                type="text"
                value={horaires.diner}
                onChange={(e) => setHoraires({ ...horaires, diner: e.target.value })}
                placeholder="18h30 – 20h30"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Petit-Déjeuner</label>
              <input
                type="text"
                value={horaires.petit_dejeuner}
                onChange={(e) => setHoraires({ ...horaires, petit_dejeuner: e.target.value })}
                placeholder="07h00 – 08h30"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* 2. Suggestion Spéciale du Chef du jour */}
        <div className="p-5 card-container bg-surface-card border border-surface-border">
          <div className="border-b border-surface-border pb-3 mb-4">
            <h3 className="text-sm font-extrabold text-surface-text flex items-center">
              <UtensilsCrossed className="w-4 h-4 mr-2 text-brand-terracotta" />
              <span>Suggestion Spéciale du Chef (Menu Phare)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Titre de la formule</label>
                <input
                  type="text"
                  value={suggestionChef.nom}
                  onChange={(e) => setSuggestionChef({ ...suggestionChef, nom: e.target.value })}
                  placeholder="ex: Formule Gourmande & Équilibrée de la Cantine"
                  className="input-field font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={suggestionChef.description}
                  onChange={(e) => setSuggestionChef({ ...suggestionChef, description: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">Tarif (FCFA)</label>
              <input
                type="number"
                min="0"
                value={suggestionChef.tarif}
                onChange={(e) => setSuggestionChef({ ...suggestionChef, tarif: Number(e.target.value) })}
                className="input-field text-base font-black text-brand-forest"
              />
            </div>
          </div>
        </div>

        {/* 3. Planning Hebdomadaire (Lundi à Samedi) */}
        <div className="p-5 card-container bg-surface-card border border-surface-border">
          <div className="border-b border-surface-border pb-3 mb-4">
            <h3 className="text-sm font-extrabold text-surface-text flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-brand-gold" />
              <span>Planning des Menus de la Semaine (Lundi au Samedi)</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {jours.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setJourSelectionne(j.id)}
                className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition ${
                  jourSelectionne === j.id
                    ? 'bg-brand-forest text-white shadow-sm'
                    : 'bg-surface-muted text-surface-text hover:bg-surface-border'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>

          {/* Formulaire d'édition pour le jour sélectionné */}
          <div className="p-5 rounded-2xl bg-surface-page/60 border border-surface-border space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <span className="text-sm font-extrabold text-surface-text">Programmation du {jourActif?.label}</span>
              <input
                type="text"
                value={jourActif?.statut || 'Service garanti'}
                onChange={(e) => handleModifierJour('statut', e.target.value)}
                placeholder="Statut (ex: Service garanti)"
                className="input-field text-xs py-1 px-2.5 max-w-[200px]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-brand-terracotta block mb-1">Plat Principal & Accompagnement</label>
              <input
                type="text"
                required
                value={jourActif?.plat || ''}
                onChange={(e) => handleModifierJour('plat', e.target.value)}
                placeholder="ex: Riz blanc & Sauce Graine au poisson fumé"
                className="input-field font-extrabold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-brand-gold block mb-1">Boisson Locale ou Dessert Inclus</label>
              <input
                type="text"
                required
                value={jourActif?.dessert || ''}
                onChange={(e) => handleModifierJour('dessert', e.target.value)}
                placeholder="ex: Jus de Bissap glacé"
                className="input-field font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde globale */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={sauvegarde}
            className="btn-primary text-xs py-3 px-8 flex items-center space-x-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{sauvegarde ? 'Publication en cours...' : 'Publier immédiatement sur l’Ardoise des étudiants'}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
};

export default WeeklyPlanningManager;
