/**
 * @fileoverview Gestion des stocks d'ingrédients, alertes et régularisations d'inventaire.
 * @module pages/gestion/StockManagement
 * Conforme aux sections 5.6, 5.7 et à la règle de gestion 6.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  Package,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const StockManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [filtreAlerte, setFiltreAlerte] = useState(false);
  const [modalAjustement, setModalAjustement] = useState(false);
  const [ingredientSelectionne, setIngredientSelectionne] = useState(null);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  // Formulaire d'ajustement de stock
  const [ajustementForm, setAjustementForm] = useState({
    quantite: '',
    type_mouvement: 'ajustement inventaire',
    motif: ''
  });

  const chargerStocks = async () => {
    setChargement(true);
    try {
      const url = filtreAlerte ? '/ingredients/alerts' : '/ingredients';
      const res = await apiClient.get(url);
      if (res.success) {
        setIngredients(res.ingredients || []);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des stocks.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerStocks();
  }, [filtreAlerte]);

  const ouvrirAjustement = (ingredient) => {
    setIngredientSelectionne(ingredient);
    setAjustementForm({
      quantite: '',
      type_mouvement: 'ajustement inventaire',
      motif: ''
    });
    setModalAjustement(true);
  };

  const handleAjusterStock = async (e) => {
    e.preventDefault();
    if (!ingredientSelectionne) return;

    try {
      const res = await apiClient.post(`/ingredients/${ingredientSelectionne._id}/adjust`, {
        quantite: parseFloat(ajustementForm.quantite),
        type_mouvement: ajustementForm.type_mouvement,
        motif: ajustementForm.motif
      });

      if (res.success) {
        setMessage(`Stock de « ${ingredientSelectionne.nom} » mis à jour avec succès.`);
        setModalAjustement(false);
        chargerStocks();
      }
    } catch (err) {
      setErreur(err.message || 'Échec de l’ajustement de stock.');
    }
  };

  return (
    <AppLayout
      title="Gestion des Stocks & Ingrédients"
      subtitle="Surveiller les quantités, prévenir les ruptures et contrôler les flux alimentaires"
    >
      {/* Barre d'action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFiltreAlerte(false)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              !filtreAlerte
                ? 'bg-brand-primary text-white'
                : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-muted'
            }`}
          >
            Tous les ingrédients
          </button>
          <button
            onClick={() => setFiltreAlerte(true)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center transition ${
              filtreAlerte
                ? 'bg-state-danger text-white'
                : 'bg-surface-card border border-surface-border text-state-danger hover:bg-state-dangerBg'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            <span>Alertes & Ruptures</span>
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

      {/* Tableau des stocks */}
      <div className="card-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-xs text-surface-textMuted font-semibold uppercase bg-surface-muted/50">
                <th className="py-3.5 px-4">Ingrédient</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Stock Actuel</th>
                <th className="py-3.5 px-4">Seuil Minimum</th>
                <th className="py-3.5 px-4">Prix Réf.</th>
                <th className="py-3.5 px-4">État</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {ingredients.length > 0 ? (
                ingredients.map((item) => {
                  const estEnRupture = item.quantite_stock === 0;
                  const estEnAlerte = item.quantite_stock <= item.seuil_minimum;

                  return (
                    <tr key={item._id} className="hover:bg-surface-muted/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-surface-text">
                        {item.nom}
                      </td>
                      <td className="py-3.5 px-4 text-surface-textMuted text-xs">
                        {item.categorie}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-surface-text">
                        {item.quantite_stock} {item.unite}
                      </td>
                      <td className="py-3.5 px-4 text-surface-textMuted text-xs">
                        {item.seuil_minimum} {item.unite}
                      </td>
                      <td className="py-3.5 px-4 text-surface-text text-xs">
                        {(item.prix_reference || 0).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-4">
                        {estEnRupture ? (
                          <Badge variant="danger">Rupture</Badge>
                        ) : estEnAlerte ? (
                          <Badge variant="warning">Stock Faible</Badge>
                        ) : (
                          <Badge variant="success">Normal</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => ouvrirAjustement(item)}
                          className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                          <span>Ajuster</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-surface-textMuted text-sm">
                    {chargement ? 'Chargement des stocks...' : 'Aucun ingrédient répertorié.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajustement d'inventaire */}
      {modalAjustement && ingredientSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-text/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 card-container shadow-xl">
            <h3 className="text-lg font-bold text-surface-text mb-2">
              Ajustement du stock : {ingredientSelectionne.nom}
            </h3>
            <p className="text-xs text-surface-textMuted mb-4">
              Stock actuel : {ingredientSelectionne.quantite_stock} {ingredientSelectionne.unite}
            </p>

            <form onSubmit={handleAjusterStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Type de mouvement
                </label>
                <select
                  value={ajustementForm.type_mouvement}
                  onChange={(e) =>
                    setAjustementForm({ ...ajustementForm, type_mouvement: e.target.value })
                  }
                  className="input-field text-sm"
                >
                  <option value="ajustement inventaire">Ajustement inventaire (positif ou négatif)</option>
                  <option value="sortie perte">Sortie perte (avarie / périmé)</option>
                  <option value="sortie préparation">Sortie cuisine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Quantité ({ingredientSelectionne.unite})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex : 5 ou -2"
                  value={ajustementForm.quantite}
                  onChange={(e) =>
                    setAjustementForm({ ...ajustementForm, quantite: e.target.value })
                  }
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">
                  Motif obligatoire de l'ajustement
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Écart constaté lors de l'inventaire mensuel"
                  value={ajustementForm.motif}
                  onChange={(e) =>
                    setAjustementForm({ ...ajustementForm, motif: e.target.value })
                  }
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalAjustement(false)}
                  className="btn-secondary text-xs"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Valider le mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default StockManagement;

