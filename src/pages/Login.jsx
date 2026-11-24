/**
 * @fileoverview Écran de connexion réservé au Personnel et à l'Administration.
 * @module pages/Login
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Accès sécurisé Staff avec redirection automatique (< 325 lignes).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { prewarmBackend } from '../api/client';
import logo from '../assets/logo.jpg';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    prewarmBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      const utilisateur = await login(email, motDePasse);
      if (utilisateur.role === 'administrateur') {
        navigate('/admin');
      } else if (utilisateur.role === 'gestionnaire') {
        navigate('/gestionnaire');
      } else if (utilisateur.role === 'caissier') {
        navigate('/caisse');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErreur(err.message || 'Identifiants invalides. Veuillez vérifier vos accès.');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-surface-page">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-center">
          <img
            src={logo}
            alt="Logo officiel Cantine Manager"
            className="w-24 h-24 rounded-2xl object-cover shadow-md mb-4 border border-surface-border transition-transform duration-200 hover:scale-105"
          />
          <h1 className="text-3xl font-black tracking-tight text-surface-text">
            Cantine Manager
          </h1>
          <p className="mt-2 text-xs font-semibold text-brand-terracotta uppercase tracking-wider">
            Espace Réservé au Personnel & Administration
          </p>
        </div>

        <div className="p-8 card-container shadow-md border-surface-border bg-white">
          {erreur && (
            <div className="flex items-start p-4 mb-6 text-xs rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger animate-slide-up">
              <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">{erreur}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-2"
              >
                Identifiant ou Email Professionnel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-textMuted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 input-field font-medium"
                  autoComplete="email"
                  placeholder="nom@ecole.ci"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="motDePasse"
                className="block text-xs font-bold uppercase tracking-wider text-surface-text mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-textMuted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="motDePasse"
                  type={afficherMdp ? 'text' : 'password'}
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="pl-10 pr-10 input-field font-medium"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-textMuted hover:text-brand-forest transition"
                  aria-label={afficherMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {afficherMdp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={enCours}
              className="w-full btn-primary py-3 text-sm flex items-center justify-center space-x-2 shadow-md active:scale-95 disabled:active:scale-100"
            >
              {enCours ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  <span>Vérification des accès...</span>
                </>
              ) : (
                <>
                  <span>Connexion Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Retour direct vers la plateforme */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-bold text-brand-forest hover:text-brand-terracotta transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Consulter l'ardoise et les menus de la cantine</span>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-[11px] text-center text-surface-textMuted">
          Cantine Manager &copy; 2026 &bull; Plateforme certifiée et sécurisée
        </p>
      </div>
    </div>
  );
};

export default Login;
