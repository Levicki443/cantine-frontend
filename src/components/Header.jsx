/**
 * @fileoverview Barre d'en-tête supérieure avec fil d'Ariane et centre d'alertes.
 * @module components/Header
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Zéro icône étoile.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Badge from './Badge';
import logo from '../assets/logo.jpg';
import {
  Bell,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Header = ({ title = 'Tableau de bord', subtitle, breadcrumbs = [] }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [profilOuvert, setProfilOuvert] = useState(false);

  const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getRoleVariant = (r) => {
    if (r === 'administrateur') return 'admin';
    if (r === 'gestionnaire') return 'manager';
    if (r === 'caissier') return 'cashier';
    return 'client';
  };

  const chargerNotifications = async () => {
    if (role === 'administrateur' || role === 'gestionnaire') {
      try {
        const res = await apiClient.get('/admin/notifications');
        if (res.success) {
          setNotifications(res.notifications || []);
          setNonLues(res.nonLues || 0);
        }
      } catch {
        // En cas de panne, garder la cloche silencieuse
      }
    }
  };

  useEffect(() => {
    chargerNotifications();
  }, [role]);

  const marquerLue = async (id, e) => {
    e.stopPropagation();
    try {
      await apiClient.patch(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lu: true } : n))
      );
      setNonLues((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignorer l'échec silencieux
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-surface-card border-b border-surface-border relative z-30 transition-colors shadow-xs">
      {/* Zone gauche : Logo mobile + Titre + Fil d'Ariane */}
      <div className="flex items-center space-x-3 min-w-0">
        <img
          src={logo}
          alt="Logo Cantine Manager"
          className="lg:hidden w-9 h-9 rounded-xl object-cover shadow-sm border border-surface-border flex-shrink-0"
        />
        <div className="min-w-0">
          {breadcrumbs.length > 0 && (
            <nav aria-label="Fil d'Ariane" className="hidden sm:flex items-center space-x-1 text-[11px] font-semibold text-surface-textMuted mb-0.5">
              <Link to="/" className="hover:text-brand-forest transition">Accueil</Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-surface-border" />
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-brand-forest transition">{crumb.label}</Link>
                  ) : (
                    <span className="text-surface-text font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-surface-text truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] sm:text-[11px] text-surface-textMuted font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Zone droite : Date, Rôle, Alertes & Profil */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="hidden xl:flex items-center text-xs text-surface-text font-bold bg-surface-page px-3.5 py-1.5 rounded-xl border border-surface-border shadow-sm">
          <Calendar className="w-3.5 h-3.5 mr-2 text-brand-forest" />
          <span className="capitalize">{dateAujourdhui}</span>
        </div>

        <Badge variant={getRoleVariant(role)}>
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span className="capitalize">{role || 'Convive'}</span>
        </Badge>

        {/* Notifications pour Admin et Gestionnaire */}
        {(role === 'administrateur' || role === 'gestionnaire') && (
          <div className="relative">
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              title="Centre d'alertes & notifications"
              className="relative p-2 text-surface-textMuted hover:text-brand-forest hover:bg-surface-page rounded-xl transition duration-150"
            >
              <Bell className="w-5 h-5" />
              {nonLues > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-terracotta text-[9px] font-black text-white shadow-sm animate-pulse-subtle">
                  {nonLues > 9 ? '9+' : nonLues}
                </span>
              )}
            </button>

            {menuOuvert && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-card border border-surface-border shadow-2xl p-4 z-50 animate-scale-in">
                <div className="flex items-center justify-between border-b border-surface-border pb-2.5 mb-2.5">
                  <span className="text-xs font-bold text-surface-text">
                    Notifications ({nonLues} non lues)
                  </span>
                  <Link
                    to="/admin/notifications"
                    onClick={() => setMenuOuvert(false)}
                    className="text-[10px] text-brand-forest font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Voir tout</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      className={`p-2.5 rounded-xl border text-xs transition duration-150 ${
                        n.lu
                          ? 'bg-surface-page/40 border-surface-border text-surface-textMuted'
                          : 'bg-brand-light/30 border-brand-forest/20 text-surface-text font-semibold'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] block">{n.titre}</span>
                        {!n.lu && (
                          <button
                            onClick={(e) => marquerLue(n._id, e)}
                            className="text-[10px] text-brand-terracotta hover:underline ml-2 flex-shrink-0"
                          >
                            Marquer lu
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-surface-textMuted font-normal mt-0.5">{n.message}</p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <p className="text-center text-xs text-surface-textMuted py-4">
                      Aucune nouvelle notification.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profil rapide avec menu dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfilOuvert(!profilOuvert)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-surface-page transition duration-150"
            title="Menu profil"
          >
            <div className="w-8 h-8 rounded-full bg-brand-forest text-white font-black text-xs flex items-center justify-center shadow-xs">
              {user?.prenom?.[0] || 'U'}
            </div>
          </button>

          {profilOuvert && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-surface-card border border-surface-border shadow-xl p-2 z-50 animate-scale-in text-xs">
              <div className="px-3 py-2 border-b border-surface-border mb-1">
                <p className="font-bold text-surface-text truncate">{user?.prenom} {user?.nom}</p>
                <p className="text-[10px] text-surface-textMuted truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setProfilOuvert(false); logout(); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-brand-terracotta hover:bg-brand-terracotta/10 font-bold transition duration-150"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
