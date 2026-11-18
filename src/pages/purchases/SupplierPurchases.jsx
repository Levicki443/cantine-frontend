/**
 * @fileoverview Module de gestion des approvisionnements, fournisseurs et générateur automatique de liste d'achats.
 * @module pages/purchases/SupplierPurchases
 * Conforme à la section 5 du cahier des charges opérationnel et financier.
 */

import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  Truck,
  ShoppingCart,
  Plus,
  Phone,
  DollarSign,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

const FOURNISSEURS_LOCAUX = [
  { id: '1', nom: 'Coopérative Vivrière d’Adjamé', contact: 'Mamadou Koné', tel: '+225 07 11 22 33 44', produits: 'Attiéké, Manioc, Banane plantain, Piment' },
  { id: '2', nom: 'Maison du Thon & Produits de la Mer', contact: 'Kouamé Eric', tel: '+225 05 99 88 77 66', produits: 'Thon frais, Carpe, Tilapia' },
  { id: '3', nom: 'Comptoir Agro Épicerie de Côte d’Ivoire', contact: 'Mme Bamba', tel: '+225 01 44 55 66 77', produits: 'Riz 50kg, Huile 25L, Épices, Sel' }
];

export const SupplierPurchases = () => {
  const [listeAchats, setListeAchats] = useState([
    { nom: 'Thon frais de pêche', besoin: 100, stockDispo: 40, prixUnitaire: 400, unite: 'unité', fournisseur: 'Maison du Thon' },
    { nom: 'Semoule de manioc (Attiéké)', besoin: 35, stockDispo: 15, prixUnitaire: 450, unite: 'kg', fournisseur: 'Coopérative Vivrière' },
    { nom: 'Piment frais haché', besoin: 2.5, stockDispo: 1, prixUnitaire: 1200, unite: 'kg', fournisseur: 'Coopérative Vivrière' },
    { nom: 'Riz Blanc 50kg', besoin: 10, stockDispo: 18, prixUnitaire: 18500, unite: 'sac', fournisseur: 'Comptoir Agro' },
    { nom: 'Huile Végétale 5L', besoin: 8, stockDispo: 10, prixUnitaire: 8500, unite: 'bidon', fournisseur: 'Comptoir Agro' }
  ]);

  const [message, setMessage] = useState(null);

  // Formule officielle de la section 5 : Quantité à acheter = Besoin prévisionnel - Stock disponible utilisable
  const calculArticles = listeAchats.map((item) => {
    const qteAcheter = Math.max(0, Math.round((item.besoin - item.stockDispo) * 100) / 100);
    const coutTotal = qteAcheter * item.prixUnitaire;
    return { ...item, qteAcheter, coutTotal, achatRequis: qteAcheter > 0 };
  });

  const budgetTotalRecommande = calculArticles.reduce((acc, curr) => acc + curr.coutTotal, 0);

  const validerCommande = () => {
    setMessage('Bon de commande prévisionnel généré et envoyé aux fournisseurs !');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AppLayout
      title="Achats, Fournisseurs & Approvisionnements"
      subtitle="Calcul automatique des achats prévisionnels (Besoin - Stock restant) et carnet fournisseurs"
    >
      {message && (
        <div className="flex items-center p-3 mb-6 text-xs rounded-lg bg-state-successBg border border-state-success text-state-success">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Synthèse du Budget d'Achat Prévisionnel */}
      <div className="p-5 mb-6 card-container bg-brand-light/30 border border-brand-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Budget Hebdomadaire d’Approvisionnement Recommandé
          </span>
          <p className="text-2xl font-black text-surface-text mt-1">
            {budgetTotalRecommande.toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-xs text-surface-textMuted mt-0.5">
            Calculé sur la base exacte des besoins des menus diminués des stocks en réserve
          </p>
        </div>

        <button
          onClick={validerCommande}
          className="btn-primary text-xs flex items-center shadow-md"
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          <span>Générer les bons de commande</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Liste d'achats automatique */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card-container overflow-hidden">
            <div className="p-4 border-b border-surface-border bg-surface-card flex items-center justify-between">
              <h3 className="text-sm font-bold text-surface-text">
                Articles Recommandés à l’Achat
              </h3>
              <Badge variant="gold">Formule : Besoin - Stock</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-page border-b border-surface-border text-surface-textMuted uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Matière Première</th>
                    <th className="py-2.5 px-4 font-bold text-right">Besoin Menu</th>
                    <th className="py-2.5 px-4 font-bold text-right">Stock Actuel</th>
                    <th className="py-2.5 px-4 font-bold text-right">À Acheter</th>
                    <th className="py-2.5 px-4 font-bold text-right">Coût Estimé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {calculArticles.map((art, idx) => (
                    <tr key={idx} className="hover:bg-surface-muted/20">
                      <td className="py-3 px-4 font-bold text-surface-text">{art.nom}</td>
                      <td className="py-3 px-4 text-right text-surface-text">{art.besoin} {art.unite}</td>
                      <td className="py-3 px-4 text-right text-surface-textMuted">{art.stockDispo} {art.unite}</td>
                      <td className="py-3 px-4 text-right font-black">
                        {art.achatRequis ? (
                          <span className="text-brand-terracotta">
                            +{art.qteAcheter} {art.unite}
                          </span>
                        ) : (
                          <span className="text-state-success font-bold">Aucun achat requis</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-brand-forest">
                        {art.coutTotal.toLocaleString('fr-FR')} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Fournisseurs Partenaires */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 card-container">
            <h3 className="text-sm font-bold text-surface-text mb-1 flex items-center">
              <Truck className="w-4 h-4 mr-1.5 text-brand-forest" />
              Fournisseurs Référencés
            </h3>
            <p className="text-xs text-surface-textMuted mb-4">
              Contacts directs pour vos commandes
            </p>

            <div className="space-y-3">
              {FOURNISSEURS_LOCAUX.map((f) => (
                <div key={f.id} className="p-3 rounded-xl border border-surface-border bg-surface-page/50">
                  <p className="text-xs font-bold text-surface-text">{f.nom}</p>
                  <p className="text-[11px] text-surface-textMuted mt-0.5">{f.produits}</p>
                  <div className="mt-2 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-surface-text font-medium">{f.contact}</span>
                    <a href={`tel:${f.tel}`} className="text-brand-forest font-bold hover:underline flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{f.tel}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupplierPurchases;

