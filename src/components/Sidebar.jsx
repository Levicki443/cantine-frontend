/**
 * @fileoverview Barre latérale de navigation ERP organisée par pôles métier.
 * @module components/Sidebar
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 * Accès public direct et connexion discrète pour l'équipe (< 325 lignes).
 */

import React, { useState, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLongPress } from '../hooks/useLongPress';
import logo from '../assets/logo.jpg';
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Calculator,
  Truck,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
  Users,
  ShoppingCart,
  Receipt,
  CreditCard,
  MessageSquareHeart,
  LogOut,
  UtensilsCrossed,
  ShieldAlert,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [retracte, setRetracte] = useState(false);
  const [mobileOuvert, setMobileOuvert] = useState(false);

  // Accès secret au Back Office par appui maintenu (10 secondes)
  const declencherAccesSecret = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const { handlers: secretHandlers } = useLongPress(declencherAccesSecret, 10000);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminSections = [
    {
      titre: 'Gouvernance & Équipe',
      links: [
        { to: '/admin', label: 'Cockpit Stratégique', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
        { to: '/admin/utilisateurs', label: 'Comptes & Droits', icon: <Users className="w-4 h-4" /> },
        { to: '/admin/personnel', label: 'Personnel & Équipe', icon: <UserCheck className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Restauration & Carte',
      links: [
        { to: '/admin/produits', label: 'Tarifs & Carte des Plats', icon: <UtensilsCrossed className="w-4 h-4" /> },
        { to: '/admin/ardoise', label: 'Ardoise & Horaires', icon: <CalendarDays className="w-4 h-4" /> },
        { to: '/gestionnaire/menus', label: 'Planning Hebdomadaire', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Ventes & Caisse',
      links: [
        { to: '/caisse', label: 'Terminal POS Rapide', icon: <CreditCard className="w-4 h-4" /> },
        { to: '/admin/commandes', label: 'Suivi des Commandes', icon: <ShoppingCart className="w-4 h-4" /> },
        { to: '/admin/transactions', label: 'Paiements & Reçus', icon: <Receipt className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Logistique & Stocks',
      links: [
        { to: '/gestionnaire/stocks', label: 'Inventaires & Alertes', icon: <Package className="w-4 h-4" /> },
        { to: '/gestionnaire/approvisionnements', label: 'Achats Fournisseurs', icon: <Truck className="w-4 h-4" /> },
        { to: '/gestionnaire/hygiene', label: 'Normes & Hygiène', icon: <ShieldCheck className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Finances & Pilotage',
      links: [
        { to: '/admin/finances', label: 'Comptabilité Globale', icon: <DollarSign className="w-4 h-4" /> },
        { to: '/gestionnaire/rentabilite', label: 'Marge & Rentabilité', icon: <Calculator className="w-4 h-4" /> },
        { to: '/admin/rapports', label: 'Rapports & Audit', icon: <ShieldAlert className="w-4 h-4" /> },
        { to: '/admin/notifications', label: 'Centre d’Alertes', icon: <Bell className="w-4 h-4" /> },
        { to: '/admin/parametres', label: 'Paramètres Système', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const gestionnaireSections = [
    {
      titre: 'Pilotage & Restauration',
      links: [
        { to: '/gestionnaire', label: 'Cockpit Gestion', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
        { to: '/admin/produits', label: 'Tarifs & Carte des Plats', icon: <UtensilsCrossed className="w-4 h-4" /> },
        { to: '/admin/ardoise', label: 'Ardoise & Horaires', icon: <CalendarDays className="w-4 h-4" /> },
        { to: '/gestionnaire/menus', label: 'Planning des Menus', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Logistique & Ventes',
      links: [
        { to: '/gestionnaire/stocks', label: 'Stocks & Ingrédients', icon: <Package className="w-4 h-4" /> },
        { to: '/gestionnaire/approvisionnements', label: 'Fournisseurs & Achats', icon: <Truck className="w-4 h-4" /> },
        { to: '/caisse', label: 'Terminal POS', icon: <CreditCard className="w-4 h-4" /> },
        { to: '/gestionnaire/clients', label: 'Avis & Retours Convives', icon: <HeartHandshake className="w-4 h-4" /> }
      ]
    },
    {
      titre: 'Contrôle & Rentabilité',
      links: [
        { to: '/gestionnaire/rentabilite', label: 'Coûts & Rentabilité', icon: <Calculator className="w-4 h-4" /> },
        { to: '/gestionnaire/hygiene', label: 'Hygiène & Sécurité', icon: <ShieldCheck className="w-4 h-4" /> },
        { to: '/admin/finances', label: 'Journal de Caisse', icon: <DollarSign className="w-4 h-4" /> }
      ]
    }
  ];

  const caissierSections = [
    {
      titre: 'Caisse & Encaissements',
      links: [
        { to: '/caisse', label: 'Caisse Tactile POS', icon: <ShoppingCart className="w-4 h-4" />, end: true },
        { to: '/caisse/ventes', label: 'Journal des Tickets', icon: <Receipt className="w-4 h-4" /> },
        { to: '/caisse/sessions', label: 'Clôture de Caisse', icon: <DollarSign className="w-4 h-4" /> }
      ]
    }
  ];

  const clientSections = [
    {
      titre: 'Espace Convive',
      links: [
        { to: '/', label: 'Ardoise & Menus du Jour', icon: <UtensilsCrossed className="w-4 h-4" />, end: true },
        { to: '/client/avis', label: 'Partager un Avis', icon: <MessageSquareHeart className="w-4 h-4" /> }
      ]
    }
  ];

  const sections =
    role === 'administrateur'
      ? adminSections
      : role === 'gestionnaire'
      ? gestionnaireSections
      : role === 'caissier'
      ? caissierSections
      : clientSections;

  return (
    <>
      <button
        onClick={() => setMobileOuvert(!mobileOuvert)}
        className="lg:hidden fixed bottom-5 right-5 z-50 p-3.5 rounded-full bg-brand-forest text-surface-page shadow-2xl active:scale-95 transition"
        aria-label="Basculer la navigation"
      >
        {mobileOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOuvert && (
        <div
          onClick={() => setMobileOuvert(false)}
          className="lg:hidden fixed inset-0 bg-brand-forest/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col bg-brand-forest text-surface-page min-h-screen transition-all duration-300 ease-in-out border-r border-brand-forest/40 ${
          retracte ? 'w-20' : 'w-64'
        } ${mobileOuvert ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 bg-brand-hover/40">
          <Link to="/" className="flex items-center min-w-0">
            <img
              src={logo}
              alt="Logo Cantine Manager"
              className="w-10 h-10 rounded-xl object-cover mr-3 shadow-sm flex-shrink-0 border border-white/20 transition-transform duration-200 hover:scale-105"
            />
            {!retracte && (
              <div className="truncate">
                <span className="text-sm font-black tracking-tight text-surface-page block">Cantine Manager</span>
                <span className="text-[10px] font-bold text-surface-page/70 uppercase tracking-widest block">
                  {user ? role?.toUpperCase() : 'ESPACE CANTINE'}
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setRetracte(!retracte)}
            className="hidden lg:flex p-1.5 rounded-lg text-surface-page/70 hover:text-white hover:bg-white/10 transition active:scale-90"
            title={retracte ? 'Déplier la barre' : 'Rétracter la barre'}
          >
            {retracte ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!retracte && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-surface-page/50">
                  {section.titre}
                </div>
              )}
              {section.links.map((link) => {
                const estCibleSecrete = !user && link.to === '/';
                const secretProps = estCibleSecrete ? secretHandlers : {};

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={(e) => {
                      if (secretProps.onClick) {
                        secretProps.onClick(e);
                      }
                      if (!e.defaultPrevented) {
                        setMobileOuvert(false);
                      }
                    }}
                    onPointerDown={secretProps.onPointerDown}
                    onPointerUp={secretProps.onPointerUp}
                    onPointerLeave={secretProps.onPointerLeave}
                    onPointerCancel={secretProps.onPointerCancel}
                    onContextMenu={secretProps.onContextMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ease-saas group select-none relative overflow-hidden ${
                        isActive
                          ? 'bg-brand-terracotta text-white shadow-sm font-bold translate-x-1'
                          : 'text-surface-page/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
                      }`
                    }
                    title={retracte ? link.label : undefined}
                  >
                    <span className="flex-shrink-0 mr-3 transition-transform duration-200 group-hover:scale-110">{link.icon}</span>
                    {!retracte && <span className="truncate">{link.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {user && (
          <div className="p-3 border-t border-white/10 bg-brand-hover/30">
            {!retracte && (
              <div className="flex items-center mb-2.5 px-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-terracotta text-white font-black text-xs flex-shrink-0 shadow-sm">
                  {user?.prenom?.[0] || 'U'}
                </div>
                <div className="ml-2.5 min-w-0 flex-1">
                  <p className="text-xs font-bold text-surface-page truncate">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-[10px] text-surface-page/70 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-3 py-2 text-xs font-bold text-white bg-white/10 hover:bg-brand-terracotta rounded-xl transition duration-200 active:scale-95"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              {!retracte && <span>Déconnexion</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
