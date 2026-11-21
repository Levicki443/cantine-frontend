/**
 * @fileoverview Terminal de vente express et encaissement tactile (Point de Vente).
 * @module pages/caisse/PosTerminal
 * Conforme aux flux de caisse rapide et modularisation stricte (< 325 lignes).
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import ReceiptModal from './ReceiptModal';
import CashSessionModal from './CashSessionModal';
import PosCart from './PosCart';
import {
  DollarSign,
  Lock,
  Search,
  AlertCircle,
  Plus
} from 'lucide-react';

export const PosTerminal = () => {
  const [repas, setRepas] = useState([]);
  const [categories, setCategories] = useState(['tous']);
  const [categorieActive, setCategorieActive] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [panier, setPanier] = useState([]);
  const [reduction, setReduction] = useState(0);
  const [montantVerse, setMontantVerse] = useState('');
  const [modePaiement, setModePaiement] = useState('espèces');

  const [sessionActive, setSessionActive] = useState(null);
  const [modalSession, setModalSession] = useState(false);
  const [modeModalSession, setModeModalSession] = useState('ouvrir');

  const [derniereVente, setDerniereVente] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [enCoursValidation, setEnCoursValidation] = useState(false);

  const verifierSession = async () => {
    try {
      const res = await apiClient.get('/cash-sessions/current');
      if (res.success && res.sessionActive) {
        setSessionActive(res.sessionActive);
      } else {
        setSessionActive(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const chargerRepas = async () => {
    try {
      const res = await apiClient.get('/meals?disponible=true');
      if (res.success) {
        setRepas(res.repas || []);
        const cats = ['tous', ...new Set((res.repas || []).map((r) => r.categorie))];
        setCategories(cats);
      }
    } catch (err) {
      setErreur(err.message);
    }
  };

  useEffect(() => {
    verifierSession();
    chargerRepas();
  }, []);

  const ajouterAuPanier = (plat) => {
    if (!plat.disponible || plat.quantite_disponible <= 0) return;

    setPanier((prev) => {
      const existant = prev.find((item) => item.meal_id === plat._id);
      if (existant) {
        if (existant.quantite >= plat.quantite_disponible) return prev;
        return prev.map((item) =>
          item.meal_id === plat._id
            ? { ...item, quantite: item.quantite + 1, total_ligne: (item.quantite + 1) * item.prix_unitaire }
            : item
        );
      }
      return [
        ...prev,
        {
          meal_id: plat._id,
          nom_repas: plat.nom,
          prix_unitaire: plat.prix,
          quantite: 1,
          total_ligne: plat.prix,
          quantite_disponible: plat.quantite_disponible
        }
      ];
    });
  };

  const modifierQuantite = (mealId, delta) => {
    setPanier((prev) =>
      prev
        .map((item) => {
          if (item.meal_id === mealId) {
            const nouvelleQte = item.quantite + delta;
            if (nouvelleQte <= 0) return null;
            if (nouvelleQte > item.quantite_disponible) return item;
            return {
              ...item,
              quantite: nouvelleQte,
              total_ligne: nouvelleQte * item.prix_unitaire
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const viderPanier = () => {
    setPanier([]);
    setMontantVerse('');
  };

  const totalBrut = panier.reduce((acc, curr) => acc + curr.total_ligne, 0);
  const totalNet = Math.max(0, totalBrut - reduction);
  const versementNum = Number(montantVerse) || 0;
  const monnaieRendue = modePaiement === 'espèces' && versementNum > totalNet ? versementNum - totalNet : 0;

  const handleValiderEncaissement = async () => {
    if (panier.length === 0) return;
    if (!sessionActive) {
      setErreur('Veuillez d’abord ouvrir une session de caisse.');
      return;
    }
    if (modePaiement === 'espèces' && versementNum < totalNet) {
      setErreur('Le montant versé par le client est insuffisant.');
      return;
    }

    setEnCoursValidation(true);
    setErreur(null);

    try {
      const payload = {
        articles: panier.map((p) => ({ meal_id: p.meal_id, quantite: p.quantite })),
        mode_paiement: modePaiement,
        montant_verse: modePaiement === 'espèces' ? versementNum : totalNet,
        reduction
      };

      const res = await apiClient.post('/sales', payload);
      if (res.success && res.vente) {
        setDerniereVente(res.vente);
        viderPanier();
        chargerRepas();
        verifierSession();
      }
    } catch (err) {
      setErreur(err.message || 'Échec de la validation de la vente.');
    } finally {
      setEnCoursValidation(false);
    }
  };

  const repasFiltres = repas.filter((r) => {
    const matchCat = categorieActive === 'tous' || r.categorie === categorieActive;
    const matchRecherche = !recherche || r.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchRecherche;
  });

  return (
    <AppLayout
      title="Terminal de Caisse Express (POS)"
      subtitle="Encaissement tactile rapide, gestion des tickets et calcul dynamique de monnaie"
      breadcrumbs={[{ label: 'Opérations & Ventes', to: '/caisse' }, { label: 'Terminal POS' }]}
    >
      {/* Bandeau d'état tactile de la session de caisse */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-forest flex items-center justify-center relative flex-shrink-0">
            <DollarSign className="w-5 h-5" />
            {sessionActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-forest opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-forest" />
              </span>
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-surface-textMuted block">État de la caisse</span>
            <span className="text-xs font-black text-surface-text">
              {sessionActive ? `Session Active • Fond initial : ${sessionActive.fond_caisse_initial} FCFA` : 'Aucune session ouverte'}
            </span>
          </div>
        </div>

        <div>
          {sessionActive ? (
            <button
              onClick={() => { setModeModalSession('cloturer'); setModalSession(true); }}
              className="btn-secondary text-xs border-brand-terracotta text-brand-terracotta hover:bg-brand-accentLight active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              <span>Clôturer la caisse</span>
            </button>
          ) : (
            <button
              onClick={() => { setModeModalSession('ouvrir'); setModalSession(true); }}
              className="btn-primary text-xs shadow-sm active:scale-95"
            >
              <span>Ouvrir une session</span>
            </button>
          )}
        </div>
      </div>

      {erreur && (
        <div className="p-3 mb-4 text-xs rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger flex items-center animate-fade-in-down">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="font-semibold">{erreur}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grille tactile des plats */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-textMuted" />
              <input
                type="text"
                placeholder="Rechercher un plat tactile..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-9 input-field text-xs py-2"
              />
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition active:scale-95 ${
                    categorieActive === cat
                      ? 'bg-brand-forest text-white shadow-sm'
                      : 'bg-surface-card border border-surface-border text-surface-text hover:bg-surface-page'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grandes tuiles tactiles interactives */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {repasFiltres.map((plat) => {
              const dispo = plat.quantite_disponible;
              const seuilBas = dispo > 0 && dispo <= 5;

              return (
                <button
                  key={plat._id}
                  onClick={() => ajouterAuPanier(plat)}
                  disabled={dispo <= 0}
                  className="touch-tile group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-surface-textMuted uppercase font-bold block truncate">
                        {plat.categorie}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          dispo <= 0
                            ? 'bg-state-dangerBg text-state-danger'
                            : seuilBas
                            ? 'bg-brand-accentLight text-brand-terracotta'
                            : 'bg-brand-light text-brand-forest'
                        }`}
                      >
                        {dispo > 0 ? `${dispo} dispo` : 'Épuisé'}
                      </span>
                    </div>
                    <span className="text-xs font-black text-surface-text line-clamp-2 mt-0.5 group-hover:text-brand-forest transition-colors">
                      {plat.nom}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-border/50 flex items-center justify-between">
                    <span className="text-xs font-black text-brand-forest">
                      {plat.prix.toLocaleString('fr-FR')} F
                    </span>
                    <span className="w-5 h-5 rounded-full bg-brand-light text-brand-forest flex items-center justify-center group-hover:bg-brand-forest group-hover:text-white transition-colors duration-200">
                      <Plus className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panier interactif */}
        <PosCart
          panier={panier}
          modifierQuantite={modifierQuantite}
          viderPanier={viderPanier}
          totalNet={totalNet}
          modePaiement={modePaiement}
          setModePaiement={setModePaiement}
          montantVerse={montantVerse}
          setMontantVerse={setMontantVerse}
          monnaieRendue={monnaieRendue}
          handleValiderEncaissement={handleValiderEncaissement}
          enCoursValidation={enCoursValidation}
          sessionActive={sessionActive}
        />
      </div>

      {derniereVente && (
        <ReceiptModal vente={derniereVente} onClose={() => setDerniereVente(null)} />
      )}

      {modalSession && (
        <CashSessionModal
          sessionActive={sessionActive}
          mode={modeModalSession}
          onClose={() => setModalSession(false)}
          onSessionUpdated={(nouvelleSession) => setSessionActive(nouvelleSession)}
        />
      )}
    </AppLayout>
  );
};

export default PosTerminal;
