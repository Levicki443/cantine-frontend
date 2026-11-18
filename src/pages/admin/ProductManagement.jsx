/**
 * @fileoverview Gestion centralisée des produits, plats et tarifs pour le BackOffice.
 * @module pages/admin/ProductManagement
 * Modification instantanée des tarifs, quantités et état de disponibilité.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import AdminMealCard from './AdminMealCard';
import MealFormModal from './MealFormModal';
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PLATS_DEFAUT = [
  { nom: 'Garba Royal au Thon Frit', description: 'Semoule de manioc fine, pavé de thon frais mariné et frit, brunoise de tomates et oignons frais, piment doux.', prix: 1200, categorie: 'déjeuner', disponible: true, quantite_disponible: 35 },
  { nom: 'Attiéké & Poisson Tilapia Grillé', description: 'Poisson entier braisé au feu doux avec marinade maison aux herbes, servi avec attiéké frais et sauce tomate.', prix: 1800, categorie: 'déjeuner', disponible: true, quantite_disponible: 20 },
  { nom: 'Alloco & Poulet Braisé', description: 'Bananes plantains frites dorées servies avec quart de poulet braisé aux épices douces et sauce pimentée.', prix: 2500, categorie: 'déjeuner', disponible: true, quantite_disponible: 18 },
  { nom: 'Riz au Gras Spécial Chef', description: 'Riz long grain cuisiné dans un bouillon riche aux légumes frais, servi avec viande de bœuf fondante.', prix: 1500, categorie: 'déjeuner', disponible: true, quantite_disponible: 25 },
  { nom: 'Jus Artisanal de Bissap Glacé (50cl)', description: 'Boisson rafraîchissante traditionnelle à base de fleurs d’hibiscus, parfumée à la menthe et à l’ananas.', prix: 600, categorie: 'boissons', disponible: true, quantite_disponible: 50 },
  { nom: 'Coupe de Fruits Frais Tropicaux', description: 'Mélange d’ananas pain de sucre, mangue mûre et papaye fraîche du marché.', prix: 800, categorie: 'desserts', disponible: true, quantite_disponible: 30 },
  { nom: 'Petit-Déjeuner Continental', description: 'Deux viennoiseries au beurre, café au lait chaud ou thé, et un jus d’orange frais pressé.', prix: 1200, categorie: 'petit-déjeuner', disponible: true, quantite_disponible: 40 }
];

export const ProductManagement = () => {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('tous');
  const [modalOuverte, setModalOuverte] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);
  const [platASupprimer, setPlatASupprimer] = useState(null);
  const [enCoursSuppression, setEnCoursSuppression] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  const [form, setForm] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: 'déjeuner',
    quantite_disponible: 20,
    disponible: true
  });

  const chargerProduits = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/meals');
      if (res.success && res.repas && res.repas.length > 0) {
        setProduits(res.repas);
      } else {
        setProduits(PLATS_DEFAUT.map((p, i) => ({ ...p, _id: `local-${i}` })));
      }
    } catch {
      setProduits(PLATS_DEFAUT.map((p, i) => ({ ...p, _id: `local-${i}` })));
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const handleOuvrirModal = (produit = null) => {
    if (produit) {
      setProduitEnEdition(produit);
      setForm({
        nom: produit.nom,
        description: produit.description || '',
        prix: produit.prix,
        categorie: produit.categorie || 'déjeuner',
        quantite_disponible: produit.quantite_disponible ?? 20,
        disponible: produit.disponible !== false
      });
    } else {
      setProduitEnEdition(null);
      setForm({
        nom: '',
        description: '',
        prix: '',
        categorie: 'déjeuner',
        quantite_disponible: 20,
        disponible: true
      });
    }
    setModalOuverte(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    try {
      const payload = {
        ...form,
        prix: Number(form.prix),
        quantite_disponible: Number(form.quantite_disponible)
      };

      if (produitEnEdition && !produitEnEdition._id.startsWith('local-')) {
        await apiClient.put(`/meals/${produitEnEdition._id}`, payload);
        setMessage(`Tarif et fiche du plat "${payload.nom}" mis à jour avec succès.`);
      } else {
        await apiClient.post('/meals', payload);
        setMessage(`Le plat "${payload.nom}" a été ajouté à la carte officielle.`);
      }
      setModalOuverte(false);
      chargerProduits();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setErreur(err.message || 'Échec de l’enregistrement du plat.');
    }
  };

  const handleToggleDisponible = async (plat) => {
    try {
      if (!plat._id.startsWith('local-')) {
        await apiClient.put(`/meals/${plat._id}`, { disponible: !plat.disponible });
      }
      setProduits((prev) =>
        prev.map((p) => (p._id === plat._id ? { ...p, disponible: !p.disponible } : p))
      );
      setMessage(`Disponibilité de "${plat.nom}" actualisée.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setErreur(err.message || 'Action impossible.');
    }
  };

  const executerSuppression = async () => {
    if (!platASupprimer) return;
    setEnCoursSuppression(true);
    try {
      if (!platASupprimer._id.startsWith('local-')) {
        await apiClient.delete(`/meals/${platASupprimer._id}`);
      }
      setProduits((prev) => prev.filter((p) => p._id !== platASupprimer._id));
      setMessage(`Plat "${platASupprimer.nom}" retiré de la carte.`);
      setPlatASupprimer(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setErreur(err.message || 'Échec de la suppression.');
    } finally {
      setEnCoursSuppression(false);
    }
  };

  const categories = ['tous', 'déjeuner', 'boissons', 'desserts', 'petit-déjeuner'];

  const getCompteurCategorie = (cat) => {
    if (cat === 'tous') return produits.length;
    return produits.filter((p) => (p.categorie || '').toLowerCase() === cat.toLowerCase()).length;
  };

  const produitsFiltres = produits.filter((p) => {
    const matchCat =
      categorieFiltre === 'tous' || (p.categorie || '').toLowerCase() === categorieFiltre.toLowerCase();
    const matchRecherche =
      !recherche.trim() ||
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchRecherche;
  });

  return (
    <AppLayout
      title="Tarifs & Carte des Plats"
      subtitle="Gestion des fiches de repas, modification instantanée des tarifs et des stocks journaliers"
      breadcrumbs={[{ label: 'Restauration & Carte', to: '/admin/produits' }, { label: 'Tarifs & Carte des Plats' }]}
    >
      {message && (
        <div className="mb-4 p-3 rounded-xl bg-brand-light border border-brand-forest/20 text-brand-forest text-xs font-bold flex items-center animate-fade-in">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {erreur && (
        <div className="mb-4 p-3 rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger text-xs font-bold flex items-center animate-fade-in">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Barre de pilotage */}
      <div className="card-container p-4 mb-6 bg-surface-card space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-surface-textMuted" />
            <input
              type="text"
              placeholder="Rechercher par nom, ingrédients, recette..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="pl-10 input-field text-xs py-2"
            />
          </div>

          <button
            type="button"
            onClick={() => handleOuvrirModal()}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Plat & Tarif</span>
          </button>
        </div>

        {/* Filtres par catégories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const count = getCompteurCategorie(cat);
            const estActif = categorieFiltre === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategorieFiltre(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 ${
                  estActif
                    ? 'bg-brand-forest text-white shadow-sm'
                    : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-page'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    estActif ? 'bg-white/20 text-white' : 'bg-surface-page text-surface-textMuted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille des plats */}
      {chargement ? (
        <div className="text-center py-16 text-surface-textMuted text-xs font-bold">
          Actualisation du catalogue des plats...
        </div>
      ) : produitsFiltres.length === 0 ? (
        <div className="card-container bg-surface-card overflow-hidden">
          <EmptyState
            icon={<UtensilsCrossed className="w-7 h-7 text-brand-forest" />}
            title="Aucun plat trouvé"
            description="Aucune recette ne correspond à votre filtre de recherche actuel."
            actionLabel="Ajouter un plat"
            onAction={() => handleOuvrirModal()}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {produitsFiltres.map((plat) => (
            <AdminMealCard
              key={plat._id}
              plat={plat}
              onEdit={handleOuvrirModal}
              onToggleDispo={handleToggleDisponible}
              onDelete={(id, nom) => setPlatASupprimer(plat)}
            />
          ))}
        </div>
      )}

      {/* Modale d'ajout / modification de plat */}
      <MealFormModal
        ouverte={modalOuverte}
        onClose={() => setModalOuverte(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        estEdition={!!produitEnEdition}
      />

      {/* Modale de confirmation de suppression */}
      <ConfirmModal
        isOpen={Boolean(platASupprimer)}
        onClose={() => setPlatASupprimer(null)}
        onConfirm={executerSuppression}
        title="Supprimer ce plat de la carte ?"
        message={`Confirmez-vous le retrait définitif de "${platASupprimer?.nom}" ? Ce plat ne sera plus proposé aux convives.`}
        confirmLabel="Supprimer de la carte"
        loading={enCoursSuppression}
        variant="danger"
      />
    </AppLayout>
  );
};

export default ProductManagement;
