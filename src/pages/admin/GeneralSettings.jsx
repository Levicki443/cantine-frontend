/**
 * @fileoverview Configuration générale et paramètres d'exploitation de la cantine.
 * @module pages/admin/GeneralSettings
 * Conforme à la Section 13 du cahier des charges (Nom, coordonnées, horaires, seuils).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  Settings,
  Save,
  Clock,
  Building,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    nom_cantine: '',
    email_contact: '',
    telephone_contact: '',
    horaires: {
      petit_dejeuner: '07h00 - 08h30',
      dejeuner: '11h30 - 14h30',
      diner: '18h30 - 20h30'
    },
    seuil_alerte_stock_defaut: 10,
    modes_paiement_actifs: []
  });

  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [message, setMessage] = useState(null);

  const chargerSettings = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/admin/settings');
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    } catch {
      // Échec silencieux
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSauvegarde(true);
    setMessage(null);
    try {
      const res = await apiClient.put('/admin/settings', settings);
      if (res.success) {
        setMessage('Paramètres généraux enregistrés avec succès.');
      }
    } catch {
      setMessage('Erreur lors de la sauvegarde.');
    } finally {
      setSauvegarde(false);
    }
  };

  return (
    <AppLayout
      title="Paramètres Généraux de l'Établissement"
      subtitle="Configuration de l'identité de la cantine, des plages horaires de service et des seuils d'alerte"
      breadcrumbs={[{ label: 'Gouvernance & Sécurité', to: '/admin' }, { label: 'Paramètres Généraux' }]}
    >
      {message && (
        <div className="p-3.5 mb-6 rounded-xl bg-state-successBg border border-state-success/30 text-state-success text-xs flex items-center shadow-sm animate-fade-in-down">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 animate-bounce-subtle" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl animate-fade-in-up">
        {/* Identité de l'établissement */}
        <div className="p-6 card-container bg-surface-card border border-surface-border shadow-sm">
          <h3 className="text-sm font-extrabold text-surface-text mb-4 flex items-center">
            <Building className="w-4 h-4 mr-2 text-brand-forest" />
            <span>Identité & Coordonnées Officielles</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Nom de la structure / cantine
              </label>
              <input
                type="text"
                required
                value={settings.nom_cantine}
                onChange={(e) => setSettings({ ...settings, nom_cantine: e.target.value })}
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Courriel de contact administratif
              </label>
              <input
                type="email"
                required
                value={settings.email_contact}
                onChange={(e) => setSettings({ ...settings, email_contact: e.target.value })}
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Ligne téléphonique de la régie
              </label>
              <input
                type="text"
                value={settings.telephone_contact}
                onChange={(e) => setSettings({ ...settings, telephone_contact: e.target.value })}
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Seuil d'alerte stock par défaut (kg/unités)
              </label>
              <input
                type="number"
                min="1"
                value={settings.seuil_alerte_stock_defaut}
                onChange={(e) => setSettings({ ...settings, seuil_alerte_stock_defaut: Number(e.target.value) })}
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
          </div>
        </div>

        {/* Horaires d'ouverture */}
        <div className="p-6 card-container bg-surface-card border border-surface-border shadow-sm">
          <h3 className="text-sm font-extrabold text-surface-text mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-brand-terracotta" />
            <span>Créneaux Horaires de Restauration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Petit-Déjeuner
              </label>
              <input
                type="text"
                value={settings.horaires?.petit_dejeuner || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horaires: { ...settings.horaires, petit_dejeuner: e.target.value }
                  })
                }
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Déjeuner (Service principal)
              </label>
              <input
                type="text"
                value={settings.horaires?.dejeuner || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horaires: { ...settings.horaires, dejeuner: e.target.value }
                  })
                }
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-surface-textMuted block mb-1">
                Dîner
              </label>
              <input
                type="text"
                value={settings.horaires?.diner || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    horaires: { ...settings.horaires, diner: e.target.value }
                  })
                }
                className="input-field rounded-xl py-2.5 px-3"
              />
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sauvegarde}
            className="btn-primary btn-interactive text-xs py-3 px-7 flex items-center space-x-2 rounded-xl shadow-sm"
          >
            {sauvegarde ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{sauvegarde ? 'Enregistrement...' : 'Sauvegarder les paramètres'}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
};

export default GeneralSettings;

