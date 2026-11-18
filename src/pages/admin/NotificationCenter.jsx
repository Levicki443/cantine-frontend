/**
 * @fileoverview Centre complet des notifications et alertes système pour le BackOffice.
 * @module pages/admin/NotificationCenter
 * Conforme à la Section 11 du cahier des charges (Ruptures de stock, paiements, commandes).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Package,
  CreditCard,
  ShoppingBag,
  Info,
  CheckCheck,
  RefreshCw
} from 'lucide-react';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [chargement, setChargement] = useState(true);

  const chargerNotifications = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/admin/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch {
      // Échec silencieux
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerNotifications();
  }, []);

  const marquerLue = async (id) => {
    try {
      await apiClient.patch(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lu: true } : n))
      );
    } catch {
      // Ignorer
    }
  };

  const getIcone = (type) => {
    switch (type) {
      case 'alerte_stock':
      case 'rupture':
        return <Package className="w-5 h-5 text-state-danger" />;
      case 'paiement':
        return <CreditCard className="w-5 h-5 text-brand-forest" />;
      case 'nouvelle_commande':
      case 'commande_prete':
        return <ShoppingBag className="w-5 h-5 text-brand-terracotta" />;
      default:
        return <Info className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <AppLayout
      title="Centre de Notifications & Alertes Opérationnelles"
      subtitle="Historique des alertes de stock critique, confirmations de paiement et activités importantes"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="admin">
            <Bell className="w-3.5 h-3.5 mr-1" />
            <span>Alertes actives</span>
          </Badge>
          <span className="text-xs text-surface-textMuted">
            {notifications.filter((n) => !n.lu).length} notification(s) non lue(s)
          </span>
        </div>

        <button
          onClick={chargerNotifications}
          className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 card-container border transition flex items-start justify-between gap-4 ${
              n.lu
                ? 'bg-surface-card border-surface-border opacity-70'
                : 'bg-surface-card border-brand-forest/40 shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-surface-muted flex-shrink-0 mt-0.5">
                {getIcone(n.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-extrabold text-surface-text">{n.titre}</h4>
                  {!n.lu && (
                    <span className="w-2 h-2 rounded-full bg-state-danger flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-surface-textMuted mt-1">{n.message}</p>
                <span className="text-[10px] text-surface-textMuted font-mono mt-2 block">
                  {new Date(n.date).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>

            {!n.lu && (
              <button
                onClick={() => marquerLue(n._id)}
                className="btn-secondary text-[11px] py-1.5 px-3 flex items-center space-x-1 flex-shrink-0"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marquer lue</span>
              </button>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-12 text-center text-xs text-surface-textMuted bg-surface-card rounded-2xl border border-surface-border">
            Aucune alerte enregistrée dans le système.
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationCenter;

