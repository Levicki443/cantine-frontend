/**
 * @fileoverview Composant panier et calculs financiers du terminal de caisse.
 * @module pages/caisse/PosCart
 * Animations d'insertion d'articles et calculs financiers temps réel.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react';

export const PosCart = ({
  panier,
  modifierQuantite,
  viderPanier,
  totalNet,
  modePaiement,
  setModePaiement,
  montantVerse,
  setMontantVerse,
  monnaieRendue,
  handleValiderEncaissement,
  enCoursValidation,
  sessionActive
}) => {
  const modesPaiementAutorises = ['espèces', 'Mobile Money', 'carte bancaire'];

  return (
    <div className="lg:col-span-4 p-5 card-container flex flex-col justify-between bg-surface-card h-full animate-fade-in shadow-sm">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
          <h3 className="text-sm font-black text-surface-text flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2 text-brand-forest" />
            <span>Ticket en cours ({panier.reduce((a, b) => a + b.quantite, 0)})</span>
          </h3>
          {panier.length > 0 && (
            <button
              onClick={viderPanier}
              className="text-xs text-state-danger hover:underline flex items-center active:scale-95 transition"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Vider</span>
            </button>
          )}
        </div>

        {/* Liste des articles du panier avec animation fluide */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {panier.length > 0 ? (
            panier.map((item) => (
              <div
                key={item.meal_id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-page/70 border border-surface-border text-xs animate-slide-up transition-all duration-150 hover:bg-surface-page"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-bold text-surface-text truncate">{item.nom_repas}</p>
                  <p className="text-[10px] text-surface-textMuted font-medium">
                    {item.prix_unitaire.toLocaleString('fr-FR')} FCFA / unité
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => modifierQuantite(item.meal_id, -1)}
                    className="w-6 h-6 rounded-lg bg-surface-card border border-surface-border text-surface-text hover:bg-surface-muted flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Diminuer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black text-xs w-5 text-center text-surface-text">{item.quantite}</span>
                  <button
                    onClick={() => modifierQuantite(item.meal_id, 1)}
                    className="w-6 h-6 rounded-lg bg-surface-card border border-surface-border text-surface-text hover:bg-surface-muted flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Augmenter"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-black text-brand-forest ml-3 text-right">
                  {(item.prix_unitaire * item.quantite).toLocaleString('fr-FR')} F
                </span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-surface-textMuted flex flex-col items-center">
              <ShoppingCart className="w-8 h-8 text-surface-border mb-2" />
              <span>Votre ticket est actuellement vide.</span>
              <span className="text-[10px] text-surface-textMuted/70 mt-0.5">Touchez un plat dans la grille pour l'ajouter.</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-surface-border space-y-3">
        <div className="flex justify-between items-center text-base font-black text-surface-text">
          <span className="text-xs uppercase tracking-wider text-surface-textMuted">TOTAL NET :</span>
          <span className="text-lg sm:text-xl font-black text-brand-forest transition-transform">
            {totalNet.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        {/* Choix tactile du mode de paiement */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-textMuted mb-1.5">
            Mode de règlement
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {modesPaiementAutorises.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setModePaiement(mode)}
                className={`py-2 text-[11px] font-bold rounded-xl border capitalize transition-all duration-150 active:scale-95 ${
                  modePaiement === mode
                    ? 'bg-brand-forest text-white border-brand-forest shadow-sm'
                    : 'bg-surface-card border-surface-border text-surface-text hover:bg-surface-page'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Espèces reçues et monnaie à rendre */}
        {modePaiement === 'espèces' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-surface-textMuted mb-1">
                Espèces versées
              </label>
              <input
                type="number"
                min="0"
                placeholder={totalNet.toString()}
                value={montantVerse}
                onChange={(e) => setMontantVerse(e.target.value)}
                className="input-field py-1.5 text-xs font-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-surface-textMuted mb-1">
                Monnaie à rendre
              </label>
              <div className="py-2 px-3 rounded-xl bg-brand-light border border-brand-forest/20 text-brand-forest font-black text-center text-xs truncate">
                {monnaieRendue.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleValiderEncaissement}
          disabled={panier.length === 0 || enCoursValidation || !sessionActive}
          className="btn-accent w-full py-3 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 disabled:active:scale-100"
        >
          {enCoursValidation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Enregistrement en cours...</span>
            </>
          ) : (
            <>
              <span>Valider & Imprimer le Ticket</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PosCart;
