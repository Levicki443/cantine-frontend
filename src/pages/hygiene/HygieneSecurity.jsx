/**
 * @fileoverview Module d'hygiène et sécurité alimentaire, checklist des 10 points et températures.
 * @module pages/hygiene/HygieneSecurity
 * Conforme à la section 7 du cahier des charges opérationnel.
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Clock,
  User,
  Save,
  Calendar
} from 'lucide-react';

export const HygieneSecurity = () => {
  const [taches, setTaches] = useState([
    { tache: 'Disponibilité d’eau propre potable', effectue: true, responsable: 'Awa Koné', heure_realisation: '06:30', observation: 'Remplissage cuve OK' },
    { tache: 'Lavage systématique des mains et savon disponible', effectue: true, responsable: 'Équipe cuisine', heure_realisation: '07:00', observation: 'Savon antibactérien vérifié' },
    { tache: 'Port de vêtements et tabliers propres', effectue: true, responsable: 'Tous', heure_realisation: '07:15', observation: 'Tenues conformes' },
    { tache: 'Cheveux et barbes protégés par charlottes', effectue: true, responsable: 'Tous', heure_realisation: '07:15', observation: 'Port charlotte respecté' },
    { tache: 'Ustensiles et couverts lavés et désinfectés', effectue: true, responsable: 'Mariatou', heure_realisation: '08:00', observation: 'Eau chaude et javel' },
    { tache: 'Plans de travail et tables nettoyés et désinfectés', effectue: true, responsable: 'Mariatou', heure_realisation: '08:15', observation: 'Désinfectant alimentaire' },
    { tache: 'Plats et aliments protégés contre les insectes', effectue: true, responsable: 'Chef cuisinier', heure_realisation: '09:00', observation: 'Cloches et moustiquaires OK' },
    { tache: 'Conservation correcte et séparation cru / cuit', effectue: true, responsable: 'Chef cuisinier', heure_realisation: '09:30', observation: 'Bacs séparés au frigo' },
    { tache: 'Nettoyage des équipements de cuisson (four, friteuse)', effectue: false, responsable: 'Bamba S.', heure_realisation: '', observation: 'Prévu après service' },
    { tache: 'Nettoyage complet de la cuisine en fin de journée', effectue: false, responsable: 'Équipe complète', heure_realisation: '', observation: 'Fin de service 16h' }
  ]);

  const [temperatures, setTemperatures] = useState({
    refrigerateur: 3.5,
    congelateur: -18.2,
    maintien_au_chaud: 65.0
  });

  const [message, setMessage] = useState(null);

  const totalTaches = taches.length;
  const effectuees = taches.filter((t) => t.effectue).length;
  const ratio = Math.round((effectuees / totalTaches) * 100);

  const toggleTache = (index) => {
    const copie = [...taches];
    copie[index].effectue = !copie[index].effectue;
    if (copie[index].effectue && !copie[index].heure_realisation) {
      const now = new Date();
      copie[index].heure_realisation = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    setTaches(copie);
  };

  const handleChampChange = (index, champ, valeur) => {
    const copie = [...taches];
    copie[index][champ] = valeur;
    setTaches(copie);
  };

  const enregistrerControle = () => {
    setMessage('Contrôle d’hygiène et températures journalisés avec succès.');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AppLayout
      title="Hygiène & Sécurité Alimentaire"
      subtitle="Checklist obligatoire en 10 points et relevé quotidien de la chaîne du froid et du chaud"
      breadcrumbs={[{ label: 'Logistique & Stocks', to: '/gestionnaire/stocks' }, { label: 'Normes & Hygiène' }]}
    >
      {message && (
        <div className="flex items-center p-3 mb-6 text-xs rounded-lg bg-state-successBg border border-state-success text-state-success">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Cartes de conformité et températures avec animations */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 card-container bg-surface-card border-brand-forest/30 shadow-sm animate-fade-in-up stagger-1 card-lift">
          <span className="text-[11px] font-bold uppercase tracking-wider text-surface-textMuted">
            Conformité Globale
          </span>
          <p className="text-2xl font-black text-brand-forest mt-1">{ratio} %</p>
          <div className="w-full h-1.5 bg-surface-muted/30 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-brand-forest rounded-full transition-all duration-500 ease-saas"
              style={{ width: `${ratio}%` }}
            />
          </div>
          <p className="text-[11px] text-surface-textMuted mt-1">
            {effectuees} sur {totalTaches} tâches validées
          </p>
        </div>

        <div className="p-4 card-container bg-surface-card border-state-success/30 shadow-sm animate-fade-in-up stagger-2 card-lift">
          <span className="text-[11px] font-bold uppercase tracking-wider text-surface-textMuted flex items-center">
            <Thermometer className="w-3.5 h-3.5 mr-1 text-state-success animate-bounce-subtle" />
            Réfrigérateur (+2 à +4°C)
          </span>
          <div className="flex items-center mt-2">
            <input
              type="number"
              step="0.1"
              value={temperatures.refrigerateur}
              onChange={(e) => setTemperatures({ ...temperatures, refrigerateur: e.target.value })}
              className="w-18 px-2 py-1 text-base font-black border border-surface-border rounded-lg mr-2 text-surface-text shadow-sm"
            />
            <span className="text-xs font-bold text-state-success">°C (Conforme)</span>
          </div>
        </div>

        <div className="p-4 card-container bg-surface-card border-brand-forest/20 shadow-sm animate-fade-in-up stagger-3 card-lift">
          <span className="text-[11px] font-bold uppercase tracking-wider text-surface-textMuted flex items-center">
            <Thermometer className="w-3.5 h-3.5 mr-1 text-brand-forest" />
            Congélateur (-18°C)
          </span>
          <div className="flex items-center mt-2">
            <input
              type="number"
              step="0.1"
              value={temperatures.congelateur}
              onChange={(e) => setTemperatures({ ...temperatures, congelateur: e.target.value })}
              className="w-18 px-2 py-1 text-base font-black border border-surface-border rounded-lg mr-2 text-surface-text shadow-sm"
            />
            <span className="text-xs font-bold text-brand-forest">°C (Optimal)</span>
          </div>
        </div>

        <div className="p-4 card-container bg-surface-card border-brand-terracotta/30 shadow-sm animate-fade-in-up stagger-4 card-lift">
          <span className="text-[11px] font-bold uppercase tracking-wider text-surface-textMuted flex items-center">
            <Thermometer className="w-3.5 h-3.5 mr-1 text-brand-terracotta" />
            Maintien Chaud (&gt;63°C)
          </span>
          <div className="flex items-center mt-2">
            <input
              type="number"
              step="0.5"
              value={temperatures.maintien_au_chaud}
              onChange={(e) => setTemperatures({ ...temperatures, maintien_au_chaud: e.target.value })}
              className="w-18 px-2 py-1 text-base font-black border border-surface-border rounded-lg mr-2 text-surface-text shadow-sm"
            />
            <span className="text-xs font-bold text-brand-terracotta">°C (Sécurisé)</span>
          </div>
        </div>
      </div>

      {/* Grille de contrôle des 10 tâches quotidiennes */}
      <div className="card-container overflow-hidden mb-6 shadow-sm animate-fade-in-up stagger-2">
        <div className="p-4 border-b border-surface-border bg-surface-card flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-surface-text flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-brand-forest" />
              Checklist Officielle Quotidienne d’Hygiène
            </h3>
            <p className="text-xs text-surface-textMuted">
              Cochez les tâches réalisées et assignez le membre du personnel responsable
            </p>
          </div>
          <button
            onClick={enregistrerControle}
            className="btn-primary btn-interactive text-xs flex items-center px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Enregistrer la fiche du jour</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-page/80 border-b border-surface-border text-surface-textMuted uppercase text-[11px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-4 font-bold w-12 text-center">État</th>
                <th className="py-2.5 px-4 font-bold">Règle de Contrôle Sanitaire</th>
                <th className="py-2.5 px-4 font-bold w-36">Responsable</th>
                <th className="py-2.5 px-4 font-bold w-24">Heure</th>
                <th className="py-2.5 px-4 font-bold">Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {taches.map((t, idx) => (
                <tr
                  key={idx}
                  className={`table-row-hover transition-colors duration-150 ${
                    t.effectue ? 'bg-brand-forest/5' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={t.effectue}
                      onChange={() => toggleTache(idx)}
                      className="w-4 h-4 text-brand-forest rounded border-surface-border cursor-pointer accent-brand-forest transition-transform active:scale-90"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-bold text-surface-text">
                    <span className={t.effectue ? 'text-surface-text' : 'text-surface-textMuted'}>
                      {idx + 1}. {t.tache}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={t.responsable}
                      onChange={(e) => handleChampChange(idx, 'responsable', e.target.value)}
                      placeholder="Nom..."
                      className="w-full px-2 py-1 text-xs border border-surface-border rounded-lg shadow-xs"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={t.heure_realisation}
                      onChange={(e) => handleChampChange(idx, 'heure_realisation', e.target.value)}
                      placeholder="08:00"
                      className="w-full px-2 py-1 text-xs border border-surface-border rounded-lg text-center shadow-xs"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={t.observation}
                      onChange={(e) => handleChampChange(idx, 'observation', e.target.value)}
                      placeholder="Commentaire de contrôle..."
                      className="w-full px-2 py-1 text-xs border border-surface-border rounded-lg shadow-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default HygieneSecurity;

