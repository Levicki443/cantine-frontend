/**
 * @fileoverview Composant de protection et de restriction d'accès aux routes privées (RBAC).
 * @module components/ProtectedRoute
 * Conforme au diagramme de vérification des rôles et des permissions.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Garde de sécurité pour les routes privées d'administration et de caisse.
 * @param {Object} props
 * @param {React.ReactNode} props.children Composant enfant à afficher si autorisé.
 * @param {Array<string>} [props.allowedRoles] Liste des rôles ayant accès à la route.
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-page">
        <div className="w-12 h-12 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-surface-textMuted">
          Vérification sécurisée de vos autorisations...
        </p>
      </div>
    );
  }

  // Redirection vers la page de connexion réservée au personnel si non authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des droits d'accès basés sur les rôles RBAC
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    let redirectionSecurisee = '/';
    if (role === 'administrateur') redirectionSecurisee = '/admin';
    else if (role === 'gestionnaire') redirectionSecurisee = '/gestionnaire';
    else if (role === 'caissier') redirectionSecurisee = '/caisse';

    return <Navigate to={redirectionSecurisee} replace />;
  }

  return children;
};

export default ProtectedRoute;
