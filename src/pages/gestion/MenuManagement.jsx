/**
 * @fileoverview Gestion de la carte des repas et publication des menus du jour.
 * @module pages/gestion/MenuManagement
 * Conforme aux sections 5.4 et 5.5 du cahier des charges officiel.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  UtensilsCrossed,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const MenuManagement = () => {
  const [repas, setRepas] = useState([]);
  const [menuDuJour, setMenuDuJour] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [modalRepas, setModalRepas] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  // Formulaire d'ajout de repas
  const [formRepas, setFormRepas] = useState({
    nom: '',
    description: '',
    categorie: 'déjeuner',
    prix: '',
    quantite_disponible: 20
  });

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [resRepas, resMenu] = await Promise.all([
        apiClient.get('/meals'),
        apiClient.get('/menus/today')
      ]);

      if (resRepas.success) setRepas(resRepas.repas || []);
      if (resMenu.success) setMenuDuJour(resMenu.menu || null);
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des menus.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const handleToggleDisponibilite = async (repasItem) => {
    try {
      const res = await apiClient.patch(`/meals/${repasItem._id}/availability`);
      if (res.success) {
        setRepas(
          repas.map((r) =>
            r._id === repasItem._id ? { ...r, disponible: res.disponible } : r
          )
        );
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de modifier la disponibilité.');
    }
  };

  const handleCreerRepas = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/meals', {
        ...formRepas,
        prix: parseFloat(formRepas.prix),
        quantite_disponible: parseInt(formRepas.quantite_disponible, 10)
      });

      if (res.success) {
        setMessage('Nouveau plat ajouté avec succès à la carte.');
        setModalRepas(false);
        setFormRepas({
          nom: '',
          description: '',
          categorie: 'déjeuner',
          prix: '',
          quantite_disponible: 20
        });
        chargerDonnees();
      }
    } catch (err) {
      setErreur(err.message || 'Échec de la création du repas.');
    }
  };

  return (
    <AppLayout
      title="Carte des Plats & Menus de la Cantine"
      subtitle="Composer les menus du jour, fixer les prix et contrôler les portions préparées"
    >
      {/* En-tête : Menu du jour actif */}
      <div className="p-6 mb-8 card-container bg-brand-light/30 border-brand-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-brand-primary text-white mr-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Au programme aujourd'hui
              </span>
              <h2 className="text-xl font-bold text-surface-text mt-0.5">
                {menuDuJour ? menuDuJour.nom : 'Menu standard de la cantine'}
              </h2>
              <p className="text-xs text-surface-textMuted mt-1">
                {menuDuJour?.description || 'Tous les plats disponibles sont servis au comptoir.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalRepas(true)}
            className="btn-primary text-xs flex items-center self-start md:self-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Ajouter un plat à la carte</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-successBg border border-state-success text-state-success flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {erreur && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Grille des plats de la carte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repas.map((plat) => (
          <div key={plat._id} className="p-5 card-container flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <Badge variant="muted">{plat.categorie}</Badge>
                <button
                  onClick={() => handleToggleDisponibilite(plat)}
                  title={plat.disponible ? 'Désactiver la vente' : 'Activer la vente'}
                  className="text-surface-textMuted hover:text-brand-primary transition"
                >
                  {plat.disponible ? (
                    <span className="flex items-center text-xs font-semibold text-state-success">
                      <ToggleRight className="w-5 h-5 mr-1" /> En vente
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-semibold text-state-danger">
                      <ToggleLeft className="w-5 h-5 mr-1" /> Épuisé
                    </span>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-surface-text">{plat.nom}</h3>
              <p className="text-xs text-surface-textMuted mt-1 line-clamp-2">
                {plat.description || 'Plat cuisiné du jour avec ingrédients frais.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
              <div>
                <p className="text-xs text-surface-textMuted">Portions restantes</p>
                <p className="text-sm font-bold text-surface-text mt-0.5">
                  {plat.quantite_disponible} portion(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-textMuted">Prix unitaire</p>
                <p className="text-base font-extrabold text-brand-primary mt-0.5">
                  {plat.prix.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout de repas */}
      {modalRepas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-text/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 card-container shadow-xl">
            <h3 className="text-lg font-bold text-surface-text mb-4 flex items-center">
              <UtensilsCrossed className="w-5 h-5 mr-2 text-brand-primary" />
              <span>Nouveau plat à la carte</span>
            </h3>

            <form onSubmit={handleCreerRepas} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">Nom du plat</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Riz sauce graine avec poulet"
                  value={formRepas.nom}
                  onChange={(e) => setFormRepas({ ...formRepas, nom: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">Catégorie</label>
                  <select
                    value={formRepas.categorie}
                    onChange={(e) => setFormRepas({ ...formRepas, categorie: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="petit-déjeuner">Petit-déjeuner</option>
                    <option value="déjeuner">Déjeuner</option>
                    <option value="dîner">Dîner</option>
                    <option value="boissons">Boissons</option>
                    <option value="desserts">Desserts</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-text mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="1500"
                    value={formRepas.prix}
                    onChange={(e) => setFormRepas({ ...formRepas, prix: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Portions préparées initiales
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formRepas.quantite_disponible}
                  onChange={(e) =>
                    setFormRepas({ ...formRepas, quantite_disponible: e.target.value })
                  }
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Ingrédients principaux, accompagnements..."
                  value={formRepas.description}
                  onChange={(e) => setFormRepas({ ...formRepas, description: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalRepas(false)}
                  className="btn-secondary text-xs"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Enregistrer le plat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default MenuManagement;

