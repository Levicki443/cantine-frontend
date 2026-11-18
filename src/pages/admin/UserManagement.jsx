/**
 * @fileoverview Gestion complète des utilisateurs du système pour l'Administrateur.
 * @module pages/admin/UserManagement
 * Recherche instantanée, filtres, pagination, confirmation de suppression et rôles RBAC.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import UserFormModal from './UserFormModal';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Power,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [enCoursAction, setEnCoursAction] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [filtreRole, setFiltreRole] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [modalAjout, setModalAjout] = useState(false);
  const [userASupprimer, setUserASupprimer] = useState(null);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  const chargerUtilisateurs = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const params = new URLSearchParams();
      if (recherche) params.append('search', recherche);
      if (filtreRole) params.append('role', filtreRole);
      if (filtreStatut) params.append('statut', filtreStatut);

      const res = await apiClient.get(`/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de récupérer la liste des utilisateurs.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, [filtreRole, filtreStatut]);

  const handleCreerUtilisateur = async (formData) => {
    setEnCoursAction(true);
    setErreur(null);
    try {
      const res = await apiClient.post('/users', formData);
      if (res.success) {
        setMessage('Utilisateur créé avec succès.');
        setModalAjout(false);
        chargerUtilisateurs();
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      setErreur(err.message || "Erreur lors de la création de l'utilisateur.");
    } finally {
      setEnCoursAction(false);
    }
  };

  const handleToggleStatut = async (id) => {
    try {
      const res = await apiClient.patch(`/users/${id}/toggle-status`);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, statut: u.statut === 'actif' ? 'inactif' : 'actif' } : u))
        );
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de modifier le statut.');
    }
  };

  const handleRoleChange = async (id, nouveauRole) => {
    try {
      const res = await apiClient.patch(`/users/${id}/role`, { role: nouveauRole });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: nouveauRole } : u)));
        setMessage('Rôle mis à jour avec succès.');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setErreur(err.message || 'Impossible de modifier le rôle.');
    }
  };

  const executerSuppression = async () => {
    if (!userASupprimer) return;
    setEnCoursAction(true);
    try {
      const res = await apiClient.delete(`/users/${userASupprimer._id}`);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userASupprimer._id));
        setMessage(`Compte ${userASupprimer.email} supprimé.`);
        setUserASupprimer(null);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setErreur(err.message || 'Échec de la suppression.');
    } finally {
      setEnCoursAction(false);
    }
  };

  return (
    <AppLayout
      title="Comptes & Droits d'Accès"
      subtitle="Supervision du personnel, convives et privilèges RBAC"
      breadcrumbs={[{ label: 'Gouvernance', to: '/admin' }, { label: 'Comptes & Droits' }]}
    >
      {message && (
        <div className="mb-4 p-3 rounded-xl bg-brand-light border border-brand-forest/20 text-brand-forest text-xs font-bold flex items-center animate-fade-in">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {erreur && (
        <div className="mb-4 p-3 rounded-xl bg-state-dangerBg border border-state-danger/30 text-state-danger text-xs font-bold flex items-center animate-fade-in">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Barre d'actions & filtres */}
      <div className="card-container p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-card">
        <form onSubmit={(e) => { e.preventDefault(); chargerUtilisateurs(); }} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-surface-textMuted" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10 input-field text-xs py-2"
          />
        </form>

        <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
          <select
            value={filtreRole}
            onChange={(e) => setFiltreRole(e.target.value)}
            className="input-field text-xs py-2 w-auto"
          >
            <option value="">Tous les rôles</option>
            <option value="administrateur">Administrateur</option>
            <option value="gestionnaire">Gestionnaire</option>
            <option value="caissier">Caissier</option>
            <option value="client">Client</option>
          </select>

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="input-field text-xs py-2 w-auto"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>

          <button
            type="button"
            onClick={() => setModalAjout(true)}
            className="btn-primary text-xs py-2 px-3.5 whitespace-nowrap inline-flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="card-container overflow-hidden bg-surface-card">
        {chargement ? (
          <div className="p-12 text-center text-xs text-surface-textMuted flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-forest" />
            <span>Chargement des comptes utilisateurs...</span>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="w-7 h-7 text-brand-forest" />}
            title="Aucun utilisateur trouvé"
            description="Aucun compte ne correspond à vos filtres de recherche actuels."
            actionLabel="Réinitialiser la recherche"
            onAction={() => { setRecherche(''); setFiltreRole(''); setFiltreStatut(''); }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-surface-page/60 text-surface-textMuted uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Coordonnées</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Date création</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((u) => (
                  <tr key={u._id} className="table-row-hover">
                    <td className="py-3 px-4 font-bold text-surface-text">
                      {u.prenom} {u.nom}
                    </td>
                    <td className="py-3 px-4">
                      <span className="block text-surface-text font-medium">{u.email}</span>
                      <span className="text-[10px] text-surface-textMuted">{u.telephone || 'Non renseigné'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-surface-page border border-surface-border capitalize focus:border-brand-forest"
                      >
                        <option value="client">Client</option>
                        <option value="caissier">Caissier</option>
                        <option value="gestionnaire">Gestionnaire</option>
                        <option value="administrateur">Administrateur</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={u.statut === 'actif' ? 'success' : 'danger'}>
                        {u.statut}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-surface-textMuted text-[11px]">
                      {new Date(u.date_creation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleStatut(u._id)}
                        title={u.statut === 'actif' ? 'Désactiver le compte' : 'Activer le compte'}
                        className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-page text-surface-textMuted hover:text-brand-forest transition"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setUserASupprimer(u)}
                        title="Supprimer définitivement"
                        className="p-1.5 rounded-lg border border-state-danger/30 text-state-danger hover:bg-state-dangerBg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale d'ajout d'utilisateur */}
      <UserFormModal
        isOpen={modalAjout}
        onClose={() => setModalAjout(false)}
        onSubmit={handleCreerUtilisateur}
        enCours={enCoursAction}
      />

      {/* Modale de confirmation de suppression irréversible */}
      <ConfirmModal
        isOpen={Boolean(userASupprimer)}
        onClose={() => setUserASupprimer(null)}
        onConfirm={executerSuppression}
        title="Supprimer définitivement l'utilisateur ?"
        message={`Êtes-vous certain de vouloir supprimer le compte de ${userASupprimer?.prenom} ${userASupprimer?.nom} (${userASupprimer?.email}) ? Cette action est irréversible.`}
        confirmLabel="Supprimer le compte"
        loading={enCoursAction}
        variant="danger"
      />
    </AppLayout>
  );
};

export default UserManagement;
