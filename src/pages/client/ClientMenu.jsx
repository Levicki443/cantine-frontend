/**
 * @fileoverview Vitrine consultative des menus et de l'ardoise pour les convives.
 * @module pages/client/ClientMenu
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 * Template restaurant haut de gamme avec micro-interactions et animations en cascade (< 325 lignes).
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import MealCard from './MealCard';
import ChefSpecialCard from './ChefSpecialCard';
import MealDetailModal from './MealDetailModal';
import WeeklyPlanningView from './WeeklyPlanningView';
import {
  UtensilsCrossed,
  CalendarDays,
  Clock,
  HeartHandshake,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

const PLATS_DEFAUT = [
  { _id: '1', nom: 'Garba Royal au Thon Frit', description: 'Semoule de manioc fine, pavé de thon frais mariné et frit, brunoise de tomates et oignons frais, piment doux.', prix: 1200, categorie: 'déjeuner', disponible: true, quantite_disponible: 35 },
  { _id: '2', nom: 'Attiéké & Poisson Tilapia Grillé', description: 'Poisson entier braisé au feu doux avec marinade maison aux herbes, servi avec attiéké frais et sauce tomate.', prix: 1800, categorie: 'déjeuner', disponible: true, quantite_disponible: 20 },
  { _id: '3', nom: 'Alloco & Poulet Braisé Croustillant', description: 'Bananes plantains frites dorées servies avec un quart de poulet braisé aux épices douces et sauce pimentée.', prix: 2500, categorie: 'déjeuner', disponible: true, quantite_disponible: 18 },
  { _id: '4', nom: 'Riz au Gras Spécial Chef', description: 'Riz long grain cuisiné dans un bouillon riche aux légumes frais, servi avec viande de bœuf fondante.', prix: 1500, categorie: 'déjeuner', disponible: true, quantite_disponible: 25 },
  { _id: '5', nom: 'Jus Artisanal de Bissap Glacé (50cl)', description: 'Boisson rafraîchissante traditionnelle à base de fleurs d’hibiscus, parfumée à la menthe fraîche et à l’ananas.', prix: 600, categorie: 'boissons', disponible: true, quantite_disponible: 50 },
  { _id: '6', nom: 'Coupe de Fruits Frais Tropicaux', description: 'Mélange d’ananas pain de sucre, mangue mûre parfumée et papaye fraîche du marché.', prix: 800, categorie: 'desserts', disponible: true, quantite_disponible: 30 },
  { _id: '7', nom: 'Petit-Déjeuner Continental & Viennoiseries', description: 'Deux viennoiseries au beurre, café au lait chaud ou thé parfumé, et jus d’orange pressé.', prix: 1200, categorie: 'petit-déjeuner', disponible: true, quantite_disponible: 40 }
];

const JOURS_FALLBACK = [
  { id: 'lundi', label: 'Lundi', plat: 'Riz blanc & Sauce Graine au poisson fumé', dessert: 'Jus de Bissap glacé', statut: 'Service garanti' },
  { id: 'mardi', label: 'Mardi', plat: 'Attiéké & Tilapia braisé sauce tomate-oignon', dessert: 'Coupe de fruits frais', statut: 'Service garanti' },
  { id: 'mercredi', label: 'Mercredi', plat: 'Garba authentique (Semoule de manioc & Thon frit)', dessert: 'Gnamakoudji frais', statut: 'Spécialité Ivoirienne' },
  { id: 'jeudi', label: 'Jeudi', plat: 'Placali & Sauce Kopê avec viande de bœuf', dessert: 'Banane douce', statut: 'Service garanti' },
  { id: 'vendredi', label: 'Vendredi', plat: 'Spaghetti sauté gourmand aux légumes & boulettes', dessert: 'Jus de Tamarin', statut: 'Service garanti' },
  { id: 'samedi', label: 'Samedi', plat: 'Menu Spécial Découverte du Chef', dessert: 'Salade de mangue', statut: 'Menu d’exception' }
];

export const ClientMenu = () => {
  const [repas, setRepas] = useState(PLATS_DEFAUT);
  const [categories, setCategories] = useState(['tous', 'déjeuner', 'boissons', 'desserts', 'petit-déjeuner']);
  const [categorieActive, setCategorieActive] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [platSelectionne, setPlatSelectionne] = useState(null);
  const [ongletActif, setOngletActif] = useState('aujourdhui');
  const [jourSelectionne, setJourSelectionne] = useState('lundi');

  const [horaires, setHoraires] = useState({
    statut_service: 'Ouvert',
    dejeuner: '11h30 – 14h30',
    diner: '18h30 – 20h30',
    petit_dejeuner: '07h00 – 08h30'
  });

  const [suggestionChef, setSuggestionChef] = useState({
    nom: 'Formule Gourmande & Équilibrée de la Cantine',
    description: 'Riz blanc parfumé accompagné d’une sauce graine mijotée au poisson fumé du matin, servi avec jus de bissap glacé.',
    tarif: 1500
  });

  const [joursSemaine, setJoursSemaine] = useState(JOURS_FALLBACK);

  const chargerDonnees = async () => {
    try {
      const resPlats = await apiClient.get('/meals');
      if (resPlats.success && resPlats.repas && resPlats.repas.length > 0) {
        setRepas(resPlats.repas);
        const cats = ['tous', ...new Set(resPlats.repas.map((p) => p.categorie).filter(Boolean))];
        setCategories(cats);
      }

      const resPlanning = await apiClient.get('/planning/weekly');
      if (resPlanning.success && resPlanning.planning) {
        if (resPlanning.planning.horaires) setHoraires(resPlanning.planning.horaires);
        if (resPlanning.planning.suggestion_chef) setSuggestionChef(resPlanning.planning.suggestion_chef);
        if (resPlanning.planning.jours && resPlanning.planning.jours.length > 0) {
          setJoursSemaine(resPlanning.planning.jours);
        }
      }
    } catch {
      // Données de secours préservées
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const repasFiltres = repas.filter((r) => {
    const matchCat =
      categorieActive === 'tous' || (r.categorie || '').toLowerCase() === categorieActive.toLowerCase();
    const matchRecherche =
      !recherche.trim() ||
      r.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchRecherche;
  });

  const getCompteurCategorie = (cat) => {
    if (cat === 'tous') return repas.length;
    return repas.filter((r) => (r.categorie || '').toLowerCase() === cat.toLowerCase()).length;
  };

  const jourActif = joursSemaine.find((j) => j.id === jourSelectionne) || joursSemaine[0];

  return (
    <AppLayout
      title="Ardoise & Carte de la Cantine"
      subtitle="Découvrez les préparations fraîches du jour, la formule signature du chef et le planning hebdomadaire."
    >
      {/* 1. Bandeau dynamique Horaires de Service avec LED pulsante */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-surface-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-brand-light text-brand-forest flex-shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-surface-text">
                Service Restaurant :
              </span>
              <Badge variant="success" pulse>
                {horaires.statut_service}
              </Badge>
            </div>
            <p className="text-xs text-surface-textMuted mt-0.5">
              Déjeuner : <strong className="text-surface-text">{horaires.dejeuner}</strong> &bull; Dîner : <strong className="text-surface-text">{horaires.diner}</strong>
            </p>
          </div>
        </div>

        <div className="text-xs text-brand-forest font-bold bg-surface-page px-3.5 py-1.5 rounded-xl border border-surface-border shadow-xs">
          Petit-Déjeuner : <strong className="text-brand-terracotta">{horaires.petit_dejeuner}</strong>
        </div>
      </div>

      {/* 2. Onglets interactifs Menu du Jour vs Planning */}
      <div className="inline-flex p-1.5 bg-surface-card rounded-2xl border border-surface-border mb-6 shadow-xs">
        <button
          onClick={() => setOngletActif('aujourdhui')}
          className={`py-2 px-5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all duration-200 active:scale-95 ${
            ongletActif === 'aujourdhui'
              ? 'bg-brand-forest text-white shadow-sm'
              : 'text-surface-textMuted hover:text-surface-text'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu du Jour & Carte</span>
        </button>

        <button
          onClick={() => setOngletActif('semaine')}
          className={`py-2 px-5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all duration-200 active:scale-95 ${
            ongletActif === 'semaine'
              ? 'bg-brand-forest text-white shadow-sm'
              : 'text-surface-textMuted hover:text-surface-text'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Planning de la Semaine</span>
        </button>
      </div>

      {ongletActif === 'aujourdhui' ? (
        <div className="space-y-6">
          {/* Fiche Prestige : Suggestion Signature du Chef */}
          <ChefSpecialCard suggestionChef={suggestionChef} />

          {/* Barre de Recherche & Filtres par catégories */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-surface-text">
                Carte des Plats & Spécialités
              </h4>

              {/* Recherche instantanée */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-surface-textMuted" />
                <input
                  type="text"
                  placeholder="Rechercher un plat, ingrédient..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10 input-field text-xs py-2 shadow-xs"
                />
              </div>
            </div>

            {/* Boutons de filtres tactiles avec compteurs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1.5">
              {categories.map((cat) => {
                const count = getCompteurCategorie(cat);
                const estActif = categorieActive === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategorieActive(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 active:scale-95 ${
                      estActif
                        ? 'bg-brand-forest text-white shadow-sm font-black'
                        : 'bg-white border border-surface-border text-surface-text hover:bg-surface-page'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        estActif ? 'bg-white/20 text-white' : 'bg-surface-muted text-surface-textMuted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grille des plats avec entrée en cascade */}
          {repasFiltres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {repasFiltres.map((plat, idx) => (
                <div key={plat._id} className={`animate-fade-in-up stagger-${Math.min(6, (idx % 6) + 1)}`}>
                  <MealCard plat={plat} onSelect={(p) => setPlatSelectionne(p)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-container bg-white overflow-hidden shadow-sm">
              <EmptyState
                icon={<UtensilsCrossed className="w-6 h-6 text-brand-forest" />}
                title="Aucun plat ne correspond à votre recherche"
                description="Essayez un autre mot-clé ou réinitialisez la sélection des catégories."
                actionLabel="Réinitialiser les filtres"
                onAction={() => {
                  setCategorieActive('tous');
                  setRecherche('');
                }}
              />
            </div>
          )}

          {/* Ruban des 3 Engagements Qualité avec élévation douce */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-surface-border text-center flex flex-col items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-full bg-brand-light text-brand-forest flex items-center justify-center mb-2 shadow-xs">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-surface-text">Ingrédients 100% Frais</span>
              <p className="text-[10px] text-surface-textMuted mt-0.5 font-medium">Approvisionnement quotidien auprès du marché local.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-surface-border text-center flex flex-col items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-full bg-brand-accentLight text-brand-terracotta flex items-center justify-center mb-2 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-surface-text">Cuisiné sur Place</span>
              <p className="text-[10px] text-surface-textMuted mt-0.5 font-medium">Préparation matinale par nos chefs cuisiniers certifiés.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-surface-border text-center flex flex-col items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-full bg-surface-muted text-surface-text flex items-center justify-center mb-2 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-surface-text">Service Express</span>
              <p className="text-[10px] text-surface-textMuted mt-0.5 font-medium">Distribution fluide pour votre pause déjeuner.</p>
            </div>
          </div>
        </div>
      ) : (
        <WeeklyPlanningView
          joursSemaine={joursSemaine}
          jourSelectionne={jourSelectionne}
          setJourSelectionne={setJourSelectionne}
          jourActif={jourActif}
        />
      )}

      {/* Raccourci vers avis & suggestions */}
      <div className="mt-8 p-5 rounded-2xl bg-white border border-surface-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-brand-light text-brand-forest shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-surface-text">
              Un avis sur le repas ou une suggestion d'amélioration ?
            </h4>
            <p className="text-[11px] text-surface-textMuted font-medium">
              Votre avis compte pour adapter les quantités et la qualité du service.
            </p>
          </div>
        </div>

        <Link
          to="/client/avis"
          className="btn-primary text-xs py-2 px-4 whitespace-nowrap flex items-center space-x-1 shadow-sm active:scale-95"
        >
          <span>Partager mon avis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Modale détaillée du plat sélectionné */}
      <MealDetailModal plat={platSelectionne} onClose={() => setPlatSelectionne(null)} />
    </AppLayout>
  );
};

export default ClientMenu;
