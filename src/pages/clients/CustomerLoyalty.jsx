/**
 * @fileoverview Module de fidélisation, recueil des avis et traitement des réclamations clients.
 * @module pages/clients/CustomerLoyalty
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Suppression totale des icônes et caractères étoiles — Notation chiffrée sobre.
 */

import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  HeartHandshake,
  Award,
  AlertCircle,
  CheckCircle,
  Plus,
  Send,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

const AVIS_EXEMPLES = [
  { id: '1', nom: 'Mlle Kouamé', type: 'avis', note: 5, plat: 'Garba Royal', commentaire: 'Le poisson était très frais et l’attiéké bien aéré ! Service impeccable.', date: '06/11/2026', statut: 'resolu' },
  { id: '2', nom: 'M. Touré Amadou', type: 'reclamation', note: 2, plat: 'Alloco Poulet', commentaire: 'Le piment était beaucoup trop fort aujourd’hui, merci de le servir séparément.', date: '05/11/2026', statut: 'en_cours' },
  { id: '3', nom: 'Soro Fatou', type: 'suggestion', note: 4, plat: 'Petit-déjeuner', commentaire: 'Possibilité de proposer du pain complet en alternative au pain blanc ?', date: '04/11/2026', statut: 'nouveau' }
];

export const CustomerLoyalty = () => {
  const [retours, setRetours] = useState(AVIS_EXEMPLES);
  const [filtreType, setFiltreType] = useState('tous');
  const [nouveauRetour, setNouveauRetour] = useState({
    nom_client: '',
    type: 'avis',
    note_satisfaction: 5,
    plat: '',
    commentaire: ''
  });
  const [message, setMessage] = useState(null);

  const retoursFiltres = retours.filter((r) =>
    filtreType === 'tous' ? true : r.type === filtreType
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nouveauRetour.nom_client || !nouveauRetour.commentaire) return;

    setRetours([
      {
        id: Date.now().toString(),
        nom: nouveauRetour.nom_client,
        type: nouveauRetour.type,
        note: Number(nouveauRetour.note_satisfaction),
        plat: nouveauRetour.plat || 'Menu Général',
        commentaire: nouveauRetour.commentaire,
        date: new Date().toLocaleDateString('fr-FR'),
        statut: 'nouveau'
      },
      ...retours
    ]);

    setNouveauRetour({ nom_client: '', type: 'avis', note_satisfaction: 5, plat: '', commentaire: '' });
    setMessage('Retour convive enregistré avec succès.');
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <AppLayout
      title="Fidélisation & Satisfaction Convives"
      subtitle="Recueil des avis, suggestions et gestion des réclamations"
    >
      {message && (
        <div className="flex items-center p-3.5 mb-6 text-xs rounded-xl bg-brand-light border border-brand-forest/20 text-brand-forest shadow-xs animate-slide-up">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Cartes KPIs de Satisfaction sobres et sans étoiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-5 card-container card-hover border-surface-border">
          <span className="text-[10px] font-bold text-surface-textMuted uppercase tracking-wider">
            Note Globale Moyenne
          </span>
          <p className="text-2xl font-black text-brand-forest mt-1.5 flex items-baseline">
            4.8 <span className="text-xs text-surface-textMuted ml-1.5 font-bold">/ 5.0</span>
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">148 avis certifiés</p>
        </div>

        <div className="p-5 card-container card-hover border-surface-border">
          <span className="text-[10px] font-bold text-surface-textMuted uppercase tracking-wider">
            Taux de Satisfaction
          </span>
          <p className="text-2xl font-black text-brand-forest mt-1.5">94 %</p>
          <p className="text-[11px] text-surface-textMuted mt-1">Convives satisfaits</p>
        </div>

        <div className="p-5 card-container card-hover border-surface-border">
          <span className="text-[10px] font-bold text-surface-textMuted uppercase tracking-wider">
            Doléances en Cours
          </span>
          <p className="text-2xl font-black text-brand-terracotta mt-1.5">
            {retours.filter((r) => r.type === 'reclamation' && r.statut !== 'resolu').length}
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">En cours de traitement</p>
        </div>

        <div className="p-5 card-container card-hover border-surface-border">
          <span className="text-[10px] font-bold text-surface-textMuted uppercase tracking-wider">
            Préférence Principale
          </span>
          <p className="text-sm font-black text-brand-forest mt-2 truncate">
            Garba Royal & Thon
          </p>
          <p className="text-[11px] text-surface-textMuted mt-1">85 % de notes maximales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Liste des avis et réclamations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card-container p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
              <h3 className="text-sm font-black text-surface-text">
                Registre des Retours Convives
              </h3>

              {/* Filtres par type */}
              <div className="flex space-x-1.5">
                {['tous', 'avis', 'reclamation', 'suggestion'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFiltreType(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition ${
                      filtreType === type
                        ? 'bg-brand-forest text-white shadow-xs'
                        : 'bg-surface-page border border-surface-border text-surface-text hover:bg-surface-muted'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {retoursFiltres.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-surface-border bg-surface-page/50 transition hover:bg-surface-page">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-black text-surface-text">{r.nom}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-surface-card border border-surface-border text-surface-text text-[11px] font-extrabold shadow-xs">
                        {r.note} / 5
                      </span>
                    </div>
                    <Badge variant={r.type === 'reclamation' ? 'danger' : r.type === 'suggestion' ? 'warning' : 'success'}>
                      {r.type}
                    </Badge>
                  </div>

                  <p className="text-xs text-surface-text leading-relaxed font-medium">{r.commentaire}</p>

                  <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] text-surface-textMuted">
                    <span>Menu : <strong className="text-surface-text">{r.plat}</strong></span>
                    <span>{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire d'enregistrement */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 card-container">
            <h3 className="text-sm font-black text-surface-text mb-1 flex items-center">
              <Plus className="w-4 h-4 mr-1.5 text-brand-forest" />
              Consigner un Retour
            </h3>
            <p className="text-xs text-surface-textMuted mb-4">
              Enregistrez les avis reçus au comptoir
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1 text-surface-text">Nom du convive</label>
                <input
                  type="text"
                  required
                  value={nouveauRetour.nom_client}
                  onChange={(e) => setNouveauRetour({ ...nouveauRetour, nom_client: e.target.value })}
                  placeholder="Ex: Kouamé Affoué"
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-surface-text">Catégorie</label>
                <select
                  value={nouveauRetour.type}
                  onChange={(e) => setNouveauRetour({ ...nouveauRetour, type: e.target.value })}
                  className="input-field text-xs py-2 font-semibold"
                >
                  <option value="avis">Avis régulier</option>
                  <option value="reclamation">Réclamation service</option>
                  <option value="suggestion">Suggestion d’amélioration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-surface-text">Évaluation chiffrée</label>
                <select
                  value={nouveauRetour.note_satisfaction}
                  onChange={(e) => setNouveauRetour({ ...nouveauRetour, note_satisfaction: e.target.value })}
                  className="input-field text-xs py-2 font-bold"
                >
                  <option value="5">Score 5/5 — Excellent</option>
                  <option value="4">Score 4/5 — Très satisfaisant</option>
                  <option value="3">Score 3/5 — Moyen</option>
                  <option value="2">Score 2/5 — Insatisfaisant</option>
                  <option value="1">Score 1/5 — À corriger d'urgence</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-surface-text">Plat concerné</label>
                <input
                  type="text"
                  value={nouveauRetour.plat}
                  onChange={(e) => setNouveauRetour({ ...nouveauRetour, plat: e.target.value })}
                  placeholder="Ex: Garba, Placali..."
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-surface-text">Détail du commentaire</label>
                <textarea
                  required
                  rows="3"
                  value={nouveauRetour.commentaire}
                  onChange={(e) => setNouveauRetour({ ...nouveauRetour, commentaire: e.target.value })}
                  placeholder="Remarques et retours d'expérience..."
                  className="input-field text-xs py-2 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs flex items-center justify-center space-x-1.5 shadow-sm mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enregistrer le retour</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerLoyalty;
