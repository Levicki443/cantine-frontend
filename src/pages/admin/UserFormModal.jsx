/**
 * @fileoverview Modale de création et modification d'utilisateur pour l'administrateur.
 * @module pages/admin/UserFormModal
 * Validation stricte et charte 3 couleurs : Vert Forêt, Ivoire Chaud, Terracotta.
 */

import React, { useState } from 'react';
import { X, UserPlus, RefreshCw } from 'lucide-react';

export const UserFormModal = ({ isOpen, onClose, onSubmit, enCours = false }) => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    role: 'client'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-brand-forest/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <div
        className="bg-surface-card rounded-2xl border border-surface-border shadow-2xl w-full max-w-md p-6 animate-scale-in text-surface-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-light text-brand-forest flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black tracking-tight text-surface-text">
              Créer un compte utilisateur
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={enCours}
            className="p-1.5 rounded-lg text-surface-textMuted hover:text-surface-text hover:bg-surface-page transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="input-field text-xs"
                placeholder="Ex: Alexandre"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="input-field text-xs"
                placeholder="Ex: Kouassi"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
              Adresse email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field text-xs"
              placeholder="alexandre@cantine.ci"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="input-field text-xs"
              placeholder="+225 0707070707"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
              Mot de passe initial *
            </label>
            <input
              type="password"
              required
              value={form.mot_de_passe}
              onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
              className="input-field text-xs"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1">
              Rôle attribué *
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="input-field text-xs font-semibold"
            >
              <option value="client">Client / Convive</option>
              <option value="caissier">Personnel de Caisse</option>
              <option value="gestionnaire">Gestionnaire de Restauration</option>
              <option value="administrateur">Administrateur Système</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={enCours}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              className="btn-primary text-xs py-2 px-4 inline-flex items-center space-x-1.5"
            >
              {enCours && <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />}
              <span>Créer l'utilisateur</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

