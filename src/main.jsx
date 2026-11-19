/**
 * @fileoverview Point d'entrée principal de l'application React Cantine Manager.
 * @module main
 * Routeur racine avec protection RBAC stricte pour le BackOffice et les modules ERP.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BackendWakeupOverlay from './components/BackendWakeupOverlay';

// Authentification publique
import Login from './pages/Login';
import Register from './pages/Register';

// BackOffice Administrateur
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import StaffManagement from './pages/admin/StaffManagement';
import ProductManagement from './pages/admin/ProductManagement';
import WeeklyPlanningManager from './pages/admin/WeeklyPlanningManager';
import OrderManagement from './pages/admin/OrderManagement';
import PaymentTransactions from './pages/admin/PaymentTransactions';
import FinancialReports from './pages/admin/FinancialReports';
import AuditLogs from './pages/admin/AuditLogs';
import NotificationCenter from './pages/admin/NotificationCenter';
import GeneralSettings from './pages/admin/GeneralSettings';

// Modules Métier Gestionnaire
import GlobalDashboard from './pages/dashboard/GlobalDashboard';
import MenuPlanner from './pages/menus/MenuPlanner';
import StockInventory from './pages/stocks/StockInventory';
import ProfitabilityCalculator from './pages/finances/ProfitabilityCalculator';
import SupplierPurchases from './pages/purchases/SupplierPurchases';
import FinanceCashier from './pages/finances/FinanceCashier';
import HygieneSecurity from './pages/hygiene/HygieneSecurity';
import CustomerLoyalty from './pages/clients/CustomerLoyalty';

// Caisse POS & Vente
import PosTerminal from './pages/caisse/PosTerminal';
import SalesHistory from './pages/caisse/SalesHistory';
import CashSessionsList from './pages/caisse/CashSessionsList';

// Espace Convives & Étudiants
import ClientMenu from './pages/client/ClientMenu';

import './index.css';

/**
 * Routeur racine orchestrant la navigation selon le statut et les rôles.
 */
const AppRouter = () => {
  const { isAuthenticated, role } = useAuth();

  const getHomeRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'administrateur') return '/admin';
    if (role === 'gestionnaire') return '/gestionnaire';
    if (role === 'caissier') return '/caisse';
    return '/client';
  };

  return (
    <Routes>
      {/* Routes Publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

      {/* --- BACKOFFICE ADMINISTRATEUR --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/personnel"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <StaffManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/produits"
        element={
          <ProtectedRoute allowedRoles={['administrateur', 'gestionnaire']}>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ardoise"
        element={
          <ProtectedRoute allowedRoles={['administrateur', 'gestionnaire']}>
            <WeeklyPlanningManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/commandes"
        element={
          <ProtectedRoute allowedRoles={['administrateur', 'gestionnaire']}>
            <OrderManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <PaymentTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/finances"
        element={
          <ProtectedRoute allowedRoles={['administrateur', 'gestionnaire']}>
            <FinanceCashier />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rapports"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <FinancialReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <NotificationCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/parametres"
        element={
          <ProtectedRoute allowedRoles={['administrateur']}>
            <GeneralSettings />
          </ProtectedRoute>
        }
      />

      {/* --- MODULES OPÉRATIONNELS GESTIONNAIRE --- */}
      <Route
        path="/gestionnaire"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <GlobalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/menus"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <MenuPlanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/stocks"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <StockInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/rentabilite"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <ProfitabilityCalculator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/approvisionnements"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <SupplierPurchases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/hygiene"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <HygieneSecurity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionnaire/clients"
        element={
          <ProtectedRoute allowedRoles={['gestionnaire', 'administrateur']}>
            <CustomerLoyalty />
          </ProtectedRoute>
        }
      />

      {/* --- POINT DE VENTE (POS CAISSE) --- */}
      <Route
        path="/caisse"
        element={
          <ProtectedRoute allowedRoles={['caissier', 'administrateur']}>
            <PosTerminal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caisse/ventes"
        element={
          <ProtectedRoute allowedRoles={['caissier', 'gestionnaire', 'administrateur']}>
            <SalesHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caisse/sessions"
        element={
          <ProtectedRoute allowedRoles={['caissier', 'administrateur']}>
            <CashSessionsList />
          </ProtectedRoute>
        }
      />

      {/* --- ESPACE ÉTUDIANTS / CONVIVES --- */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={['client', 'administrateur']}>
            <ClientMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/avis"
        element={
          <ProtectedRoute allowedRoles={['client', 'administrateur']}>
            <CustomerLoyalty />
          </ProtectedRoute>
        }
      />
      <Route path="/client/*" element={<Navigate to="/client" replace />} />

      {/* Redirection fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BackendWakeupOverlay />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
