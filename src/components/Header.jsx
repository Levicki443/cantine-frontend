/**
 * @fileoverview Barre d'en-tête supérieure avec fil d'Ariane et centre d'alertes.
 * @module components/Header
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire (#F6F3EA), Terracotta (#C87552).
 * Gestion transparente des convives invités et du personnel (< 325 lignes).
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
  ChevronRight,
  LogOut
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
      <div className="flex items-center space-x-3 min-w-0">
        <Link to="/" className="lg:hidden flex-shrink-0">
          <img
            src={logo}
            alt="Logo Cantine Manager"
            className="w-9 h-9 rounded-xl object-cover shadow-sm border border-surface-border"
          />
        </Link>
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

      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="hidden xl:flex items-center text-xs text-surface-text font-bold bg-surface-page px-3.5 py-1.5 rounded-xl border border-surface-border shadow-sm">
          <Calendar className="w-3.5 h-3.5 mr-2 text-brand-forest" />
          <span className="capitalize">{dateAujourdhui}</span>
        </div>

        <Badge variant={getRoleVariant(role)}>
          {user ? role?.toUpperCase() : 'CONVIVE'}
        </Badge>

        {(role === 'administrateur' || role === 'gestionnaire') && (
          <div className="relative">
            <button
              onClick={() => {
                setMenuOuvert(!menuOuvert);
                setProfilOuvert(false);
              }}
              className="p-2 rounded-xl text-surface-textMuted hover:text-brand-forest hover:bg-surface-page transition active:scale-90 relative"
              title="Centre de notifications"
            >
              <Bell className="w-5 h-5" />
              {nonLues > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-terracotta opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-terracotta" />
                </span>
              )}
            </button>

            {menuOuvert && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface-card border border-surface-border shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-surface-border flex items-center justify-between">
                  <span className="text-xs font-bold text-surface-text">Alertes & Notifications</span>
                  <span className="text-[10px] font-extrabold text-brand-terracotta bg-brand-accentLight px-2 py-0.5 rounded-full">
                    {nonLues} non lue(s)
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-surface-border/50">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id}
                        onClick={(e) => marquerLue(n._id, e)}
                        className={`p-3 text-xs cursor-pointer transition ${
                          n.lu ? 'bg-surface-card opacity-60' : 'bg-surface-page/60 hover:bg-surface-page'
                        }`}
                      >
                        <p className="font-bold text-surface-text">{n.titre}</p>
                        <p className="text-[11px] text-surface-textMuted line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-surface-textMuted">
                      Aucune notification récente
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setProfilOuvert(!profilOuvert);
                setMenuOuvert(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-surface-page transition active:scale-95"
              title="Mon profil"
            >
              <div className="w-8 h-8 rounded-full bg-brand-forest text-surface-page flex items-center justify-center font-black text-xs shadow-sm">
                {user?.prenom?.[0] || 'U'}
              </div>
            </button>

            {profilOuvert && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-card border border-surface-border shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-surface-border">
                  <p className="text-xs font-bold text-surface-text">{user?.prenom} {user?.nom}</p>
                  <p className="text-[10px] text-surface-textMuted truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-state-danger hover:bg-state-dangerBg flex items-center transition"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
