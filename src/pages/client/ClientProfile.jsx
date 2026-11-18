/**
 * @fileoverview Gestion du compte personnel, solde prépayé et abonnements.
 * @module pages/client/ClientProfile
 * Conforme aux sections 4.5 et 5.16 du cahier des charges.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { CreditCard, User, Mail, Phone, ShieldCheck, CheckCircle } from 'lucide-react';

export const ClientProfile = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState(null);

  return (
    <AppLayout
      title="Mon Compte & Solde Prépayé"
      subtitle="Consultez votre crédit disponible et gérez vos informations personnelles"
    >
      {/* Carte du solde */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 p-6 card-container bg-brand-light/30 border-brand-primary/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Compte Déjeuner Prépayé
              </span>
              <Badge variant="success">Actif</Badge>
            </div>
            <p className="text-xs text-surface-textMuted font-medium">Solde disponible pour vos repas</p>
            <p className="text-3xl font-extrabold text-surface-text mt-1">
              {(user?.solde || 0).toLocaleString('fr-FR')} FCFA
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-primary/10 flex items-center justify-between text-xs text-surface-textMuted">
            <span>Paiement direct au comptoir sans espèces</span>
            <span className="font-semibold text-brand-primary">Rechargeable en caisse</span>
          </div>
        </div>

        <StatCard
          title="Catégorie de compte"
          value={user?.categorie || 'Client'}
          subtitle="Profil d'établissement"
          icon={<ShieldCheck className="w-6 h-6" />}
          colorScheme="info"
        />
      </div>

      {/* Informations personnelles */}
      <div className="p-6 card-container max-w-2xl">
        <h3 className="text-base font-bold text-surface-text mb-4 flex items-center">
          <User className="w-4 h-4 mr-2 text-brand-primary" />
          <span>Informations du profil</span>
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
            <span className="text-xs text-surface-textMuted font-medium">Nom complet</span>
            <span className="font-semibold text-surface-text">
              {user?.prenom} {user?.nom}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
            <span className="text-xs text-surface-textMuted font-medium flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Courriel
            </span>
            <span className="font-semibold text-surface-text">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
            <span className="text-xs text-surface-textMuted font-medium flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5" /> Téléphone
            </span>
            <span className="font-semibold text-surface-text">
              {user?.telephone || 'Non renseigné'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-surface-border text-xs text-surface-textMuted">
          Pour toute demande de mise à jour de vos informations ou pour recharger votre solde prépayé,
          veuillez vous adresser au guichet de caisse de la cantine.
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientProfile;

