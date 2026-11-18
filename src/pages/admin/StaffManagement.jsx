/**
 * @fileoverview Gestion du personnel de cantine (Admins, Gestionnaires, Caissiers).
 * @module pages/admin/StaffManagement
 * Conforme à la Section 9 du cahier des charges (Rôles d'exploitation, permissions et statuts).
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Power,
  RefreshCw
} from 'lucide-react';

export const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const chargerStaff = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const [resAdmins, resGest, resCaiss] = await Promise.all([
        apiClient.get('/users?role=administrateur'),
        apiClient.get('/users?role=gestionnaire'),
        apiClient.get('/users?role=caissier')
      ]);

      const tous = [
        ...(resAdmins.users || []),
        ...(resGest.users || []),
        ...(resCaiss.users || [])
      ];
      setStaff(tous);
    } catch (err) {
      setErreur(err.message || 'Impossible de charger le personnel.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerStaff();
  }, []);

  const handleToggleStatut = async (id) => {
    try {
      await apiClient.patch(`/users/${id}/toggle-status`);
      chargerStaff();
    } catch (err) {
      setErreur(err.message || 'Action impossible.');
    }
  };

  return (
    <AppLayout
      title="Gestion du Personnel & Permissions"
      subtitle="Supervision des employés habilités à la caisse, aux stocks et à l'administration"
      breadcrumbs={[{ label: 'Gouvernance', to: '/admin' }, { label: 'Personnel & Équipe' }]}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs text-surface-textMuted font-medium">
            {staff.length} collaborateur(s) sous contrat d'exploitation
          </span>
        </div>
        <button
          onClick={chargerStaff}
          disabled={chargement}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {erreur && (
        <div className="p-4 mb-6 rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger text-xs font-bold">
          {erreur}
        </div>
      )}

      {staff.length === 0 && !chargement ? (
        <div className="card-container bg-surface-card overflow-hidden">
          <EmptyState
            icon={<UserCheck className="w-7 h-7 text-brand-forest" />}
            title="Aucun personnel enregistré"
            description="Aucun employé avec rôle d'exploitation (Administrateur, Gestionnaire, Caissier) n'a été trouvé."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((membre) => {
            const estActif = membre.statut === 'actif';
            return (
              <div
                key={membre._id}
                className={`p-5 card-container card-hover bg-surface-card border transition flex flex-col justify-between ${
                  estActif ? 'border-surface-border' : 'border-state-danger/30 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={membre.role === 'administrateur' ? 'admin' : membre.role === 'gestionnaire' ? 'manager' : 'cashier'}>
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      <span className="capitalize">{membre.role}</span>
                    </Badge>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        estActif ? 'bg-brand-light text-brand-forest' : 'bg-state-dangerBg text-state-danger'
                      }`}
                    >
                      {membre.statut}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-surface-text">
                    {membre.prenom} {membre.nom}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-surface-textMuted">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-brand-forest" />
                      <span className="truncate">{membre.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>{membre.telephone || 'Aucun numéro'}</span>
                    </div>
                  </div>

                  {/* Habilitations selon le rôle */}
                  <div className="mt-4 pt-3 border-t border-surface-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-surface-textMuted block mb-1.5">
                      Habilitations accordées
                    </span>
                    <ul className="text-[11px] text-surface-text space-y-1 font-medium">
                      {membre.role === 'administrateur' && (
                        <>
                          <li className="flex items-center">✓ Contrôle total & sécurité bancaire</li>
                          <li className="flex items-center">✓ Gestion des utilisateurs & finances</li>
                          <li className="flex items-center">✓ Journal d'audit & configuration</li>
                        </>
                      )}
                      {membre.role === 'gestionnaire' && (
                        <>
                          <li className="flex items-center">✓ Planification hebdomadaire des menus</li>
                          <li className="flex items-center">✓ Gestion des stocks & inventaires</li>
                          <li className="flex items-center">✓ Approvisionnements fournisseurs</li>
                        </>
                      )}
                      {membre.role === 'caissier' && (
                        <>
                          <li className="flex items-center">✓ Encaissement Point de Vente (POS)</li>
                          <li className="flex items-center">✓ Rechargement portefeuille convives</li>
                          <li className="flex items-center">✓ Clôture de session de caisse</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[10px] text-surface-textMuted">
                    Inscrit le {new Date(membre.date_creation).toLocaleDateString('fr-FR')}
                  </span>
                  <button
                    onClick={() => handleToggleStatut(membre._id)}
                    className={`text-xs font-bold py-1 px-2.5 rounded-lg border transition flex items-center space-x-1 ${
                      estActif
                        ? 'border-state-danger text-state-danger hover:bg-state-dangerBg'
                        : 'border-brand-forest text-brand-forest hover:bg-brand-light'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{estActif ? 'Suspendre' : 'Réactiver'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default StaffManagement;
