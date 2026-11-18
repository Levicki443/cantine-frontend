/**
 * @fileoverview Écran d'inscription sécurisé pour les convives Cantine Manager.
 * @module pages/Register
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmationMdp: ''
  });

  const [afficherMdp, setAfficherMdp] = useState(false);
  const [afficherConfirm, setAfficherConfirm] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validerMotDePasse = (mdp) => {
    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regExp.test(mdp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);

    if (formData.motDePasse !== formData.confirmationMdp) {
      setErreur('Les mots de passe saisis ne sont pas identiques.');
      return;
    }

    if (!validerMotDePasse(formData.motDePasse)) {
      setErreur(
        'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
      return;
    }

    setEnCours(true);

    try {
      await register({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim() || undefined,
        mot_de_passe: formData.motDePasse,
        role: 'client'
      });
      navigate('/client');
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue lors de l’inscription.');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start sm:justify-center items-center py-6 sm:py-10 px-4 bg-surface-page overflow-y-auto">
      <div className="w-full max-w-lg my-auto animate-fade-in">
        <div className="flex flex-col items-center mb-4 sm:mb-6 text-center">
          <img
            src={logo}
            alt="Logo officiel Cantine Manager"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md mb-2 sm:mb-3 border border-surface-border transition-transform duration-200 hover:scale-105"
          />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-surface-text">
            Créer un compte convive
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs font-semibold text-surface-textMuted uppercase tracking-wider">
            Rejoignez l'espace cantine et consultez les menus du jour
          </p>
        </div>

        <div className="p-8 card-container shadow-md border-surface-border">
          {erreur && (
            <div className="flex items-start p-4 mb-5 text-xs rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger animate-slide-up">
              <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5" />
              <span>{erreur}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="pl-9 input-field text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="pl-9 input-field text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 input-field text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <Phone className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="pl-9 input-field text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                  <input
                    type={afficherMdp ? 'text' : 'password'}
                    name="motDePasse"
                    required
                    value={formData.motDePasse}
                    onChange={handleChange}
                    className="pl-9 pr-9 input-field text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherMdp(!afficherMdp)}
                    className="absolute inset-y-0 right-2.5 my-auto text-surface-textMuted hover:text-brand-forest"
                  >
                    {afficherMdp ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-1">
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-surface-textMuted" />
                  <input
                    type={afficherConfirm ? 'text' : 'password'}
                    name="confirmationMdp"
                    required
                    value={formData.confirmationMdp}
                    onChange={handleChange}
                    className="pl-9 pr-9 input-field text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherConfirm(!afficherConfirm)}
                    className="absolute inset-y-0 right-2.5 my-auto text-surface-textMuted hover:text-brand-forest"
                  >
                    {afficherConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={enCours}
              className="w-full mt-3 btn-primary py-3 text-sm flex items-center justify-center space-x-2 shadow-md"
            >
              {enCours ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Valider mon inscription</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-surface-border text-center">
            <p className="text-xs text-surface-textMuted">
              Déjà inscrit sur Cantine Manager ?{' '}
              <Link to="/login" className="font-bold text-brand-terracotta hover:underline ml-1">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
