/**
 * @fileoverview Contexte React d'authentification et de gestion des rôles (RBAC).
 * @module context/AuthContext
 * Conforme aux règles d'accès définies dans le cahier des charges des flux utilisateurs.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cantine_token'));
  const [loading, setLoading] = useState(true);

  // Restauration de la session utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cantine_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/profile');
        if (response.success && response.utilisateur) {
          setUser(response.utilisateur);
          localStorage.setItem('cantine_user', JSON.stringify(response.utilisateur));
        } else {
          logout();
        }
      } catch (error) {
        console.error(`[Auth] Échec de restauration de session : ${error.message}`);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connecte l'utilisateur et initialise les jetons d'accès.
   */
  const login = async (email, motDePasse) => {
    const response = await apiClient.post('/auth/login', {
      email,
      mot_de_passe: motDePasse
    });

    if (response.success && response.token) {
      localStorage.setItem('cantine_token', response.token);
      localStorage.setItem('cantine_user', JSON.stringify(response.utilisateur));
      setToken(response.token);
      setUser(response.utilisateur);
      return response.utilisateur;
    }

    throw new Error(response.message || 'Échec de la connexion.');
  };

  /**
   * Enregistre un nouveau client et connecte directement la session.
   */
  const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);

    if (response.success && response.token) {
      localStorage.setItem('cantine_token', response.token);
      localStorage.setItem('cantine_user', JSON.stringify(response.utilisateur));
      setToken(response.token);
      setUser(response.utilisateur);
      return response.utilisateur;
    }

    throw new Error(response.message || "Échec de l'inscription.");
  };

  /**
   * Déconnexion sécurisée et purge locale des informations.
   */
  const logout = () => {
    localStorage.removeItem('cantine_token');
    localStorage.removeItem('cantine_user');
    setToken(null);
    setUser(null);
  };

  // Définition des permissions et indicateurs de rôles
  const value = useMemo(() => {
    const role = user?.role || null;

    return {
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      role,
      isAdmin: role === 'administrateur',
      isManager: role === 'gestionnaire',
      isCashier: role === 'caissier',
      isClient: role === 'client',
      hasRole: (...allowedRoles) => (role ? allowedRoles.includes(role) : false),
      login,
      register,
      logout
    };
  }, [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Crochet personnalisé pour consommer le contexte d'authentification en toute sécurité.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider.');
  }
  return context;
};

