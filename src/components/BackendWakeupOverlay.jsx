/**
 * @fileoverview Écran d'accueil et réveil intelligent du serveur backend (Render Cold Start).
 * @module components/BackendWakeupOverlay
 * Affiche le logo officiel arrondi au centre avec flou subtil et réveil automatique non-bloquant.
 */

import React, { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo.jpg';
import apiClient from '../api/client';
import { CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

const MAX_TIMEOUT_SECONDES = 90;
const TIMEOUT_LOCAL_SECONDES = 6;

export const BackendWakeupOverlay = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const isLocalApi = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // N'utiliser le court délai local que si le backend tourne lui aussi en local
  const maxAttente = (isLocalhost && isLocalApi) ? TIMEOUT_LOCAL_SECONDES : MAX_TIMEOUT_SECONDES;

  const [visible, setVisible] = useState(() => {
    return sessionStorage.getItem('cantine_backend_awake') !== 'true';
  });
  const [fadingOut, setFadingOut] = useState(false);
  const [secondesEcoulees, setSecondesEcoulees] = useState(0);
  const [estPret, setEstPret] = useState(false);
  const [aExpire, setAExpire] = useState(false);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);

  const getMessageDynamique = (sec) => {
    if (estPret) return 'Serveur opérationnel ! Accès à la cantine...';
    if (sec < 4) return 'Connexion sécurisée aux services Cantine Manager...';
    if (sec < 15) return 'Initialisation et réveil du serveur cloud...';
    if (sec < 45) return 'Démarrage du serveur en cours, veuillez patienter...';
    return 'Finalisation de la synchronisation de vos données...';
  };

  const terminerReveilAvecSucces = () => {
    setEstPret(true);
    sessionStorage.setItem('cantine_backend_awake', 'true');
    clearInterval(timerRef.current);
    clearInterval(pollingRef.current);

    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        setVisible(false);
      }, 400);
    }, 600);
  };

  const passerEtAcceder = () => {
    sessionStorage.setItem('cantine_backend_awake', 'true');
    clearInterval(timerRef.current);
    clearInterval(pollingRef.current);
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  const verifierSanteBackend = async () => {
    try {
      const res = await apiClient.get('/health');
      if (res && (res.success || res.status === 'en service')) {
        terminerReveilAvecSucces();
        return true;
      }
    } catch {
      // Backend en cours de réveil ou inaccessible
    }
    return false;
  };

  const demarrerSurveillance = () => {
    setAExpire(false);
    setSecondesEcoulees(0);

    // 1. Sonde immédiate
    verifierSanteBackend();

    // 2. Compteur régulier
    timerRef.current = setInterval(() => {
      setSecondesEcoulees((prev) => {
        const next = prev + 1;
        if (next >= maxAttente) {
          clearInterval(timerRef.current);
          clearInterval(pollingRef.current);
          if (isLocalhost) {
            // En local, autoriser l'accès automatiquement pour ne pas bloquer le développeur
            passerEtAcceder();
          } else {
            setAExpire(true);
          }
        }
        return next;
      });
    }, 1000);

    // 3. Boucle de polling toutes les 2.5s
    pollingRef.current = setInterval(async () => {
      const succes = await verifierSanteBackend();
      if (succes) {
        clearInterval(pollingRef.current);
      }
    }, 2500);
  };

  useEffect(() => {
    if (!visible) return;
    demarrerSurveillance();

    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollingRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <aside
      aria-label="Écran d'initialisation et réveil du serveur"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center select-none bg-surface-page/85 backdrop-blur-sm transition-opacity duration-400 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-md w-full flex flex-col items-center animate-fade-in">
        {/* Logo officiel arrondi avec ombre élégante et respiration */}
        <div className="relative mb-5">
          <img
            src={logo}
            alt="Logo officiel Cantine Manager"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-xl border-2 border-brand-forest/20 animate-pulse-subtle"
          />
          {estPret && (
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-brand-forest text-white shadow-lg animate-scale-in">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Titres de bienvenue */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-surface-text">
          Cantine Manager
        </h1>
        <p className="mt-1 text-xs font-bold text-surface-textMuted uppercase tracking-widest">
          Gérez votre cantine en toute simplicité
        </p>

        {/* Barre de progression dynamique */}
        {!aExpire ? (
          <div className="mt-6 w-full max-w-xs flex flex-col items-center space-y-3">
            <div className="w-full bg-surface-border/60 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  estPret ? 'bg-brand-forest w-full' : 'bg-brand-terracotta animate-pulse w-3/4'
                }`}
              />
            </div>

            <p className="text-xs font-bold text-surface-text text-center transition-all duration-200">
              {getMessageDynamique(secondesEcoulees)}
            </p>

            <span className="text-[10px] font-semibold text-surface-textMuted">
              {estPret ? 'Connexion établie' : `Initialisation : ${secondesEcoulees}s / ${maxAttente}s`}
            </span>

            {/* Accès rapide direct : ne bloque jamais l'utilisateur */}
            <button
              type="button"
              onClick={passerEtAcceder}
              className="mt-3 inline-flex items-center space-x-1.5 text-xs font-bold text-brand-forest hover:text-brand-terracotta transition underline-offset-4 hover:underline py-1 px-3 rounded-lg hover:bg-brand-forest/5"
            >
              <span>Accéder directement à l'espace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Assistance discrète si le délai de 90s est dépassé */
          <div className="mt-6 p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm max-w-sm text-xs space-y-3 animate-scale-in">
            <p className="text-xs font-bold text-surface-text text-center">
              Le serveur cloud termine son démarrage.
            </p>
            <p className="text-[11px] text-surface-textMuted text-center leading-relaxed">
              Vous pouvez patienter encore un instant ou continuer directement.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={demarrerSurveillance}
                className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réessayer</span>
              </button>
              <button
                type="button"
                onClick={passerEtAcceder}
                className="btn-primary text-xs py-2 px-3 flex items-center space-x-1"
              >
                <span>Accéder maintenant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default BackendWakeupOverlay;
