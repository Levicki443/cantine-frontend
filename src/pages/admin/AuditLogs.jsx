/**
 * @fileoverview Journal d'audit de sécurité et traçabilité des opérations sensibles.
 * @module pages/admin/AuditLogs
 * Conforme à la Section 12 du cahier des charges (Traçabilité inviolable, IP, auteur, date).
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  Laptop,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreAction, setFiltreAction] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const chargerLogs = async () => {
    setChargement(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (filtreAction) params.append('action', filtreAction);

      const res = await apiClient.get(`/admin/audit-logs?${params.toString()}`);
      if (res.success) {
        setLogs(res.logs || []);
        setTotal(res.total || 0);
      }
    } catch {
      // Échec silencieux
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerLogs();
  }, [page, filtreAction]);

  return (
    <AppLayout
      title="Journal d'Activité & Sécurité (Audit Logs)"
      subtitle="Registre inviolable traçant chaque opération sensible, connexion, modification de rôle et flux financier"
      breadcrumbs={[{ label: 'Gouvernance & Sécurité', to: '/admin' }, { label: 'Journal d’Audit' }]}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="admin">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            <span>Audit Bancaire Conforme</span>
          </Badge>
          <span className="text-xs text-surface-textMuted font-medium">• {total} événements consignés</span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filtreAction}
            onChange={(e) => {
              setFiltreAction(e.target.value);
              setPage(1);
            }}
            className="input-field text-xs py-2 px-3 rounded-xl transition-all"
          >
            <option value="">Toutes les actions</option>
            <option value="connexion">Connexion</option>
            <option value="déconnexion">Déconnexion</option>
            <option value="création">Création</option>
            <option value="modification">Modification</option>
            <option value="suppression_ou_archivage">Suppression</option>
            <option value="ouverture_caisse">Ouverture Caisse</option>
            <option value="clôture_caisse">Clôture Caisse</option>
          </select>

          <button
            onClick={chargerLogs}
            className="btn-secondary btn-interactive text-xs py-2 px-3.5 flex items-center space-x-1.5 rounded-xl shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      <div className="card-container bg-surface-card border border-surface-border overflow-hidden shadow-sm animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-page/80 border-b border-surface-border text-surface-textMuted uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entité / Cible</th>
                <th className="py-3 px-4">Opérateur</th>
                <th className="py-3 px-4">Adresse IP</th>
                <th className="py-3 px-4">Résultat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {logs.map((log) => (
                <tr key={log._id} className="table-row-hover transition-colors duration-150">
                  <td className="py-3 px-4 text-surface-textMuted font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.date).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-brand-forest capitalize bg-surface-muted px-2.5 py-1 rounded-lg text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-surface-text">
                    {log.entite} {log.reference ? `(${log.reference})` : ''}
                  </td>
                  <td className="py-3 px-4">
                    {log.utilisateur_id ? (
                      <span className="text-surface-text font-medium">
                        {log.utilisateur_id.prenom} {log.utilisateur_id.nom}
                        <span className="text-[10px] text-surface-textMuted block">
                          ({log.utilisateur_id.email})
                        </span>
                      </span>
                    ) : (
                      <span className="text-surface-textMuted italic">Système ou Visiteur</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-surface-textMuted font-mono text-[11px]">
                    {log.ip || '127.0.0.1'}
                  </td>
                  <td className="py-3 px-4">
                    {log.statut === 'succès' ? (
                      <span className="inline-flex items-center text-state-success font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-state-success" />
                        Succès
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-state-danger font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5 mr-1 text-state-danger" />
                        Échec
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-surface-textMuted text-xs">
                    Aucun événement d'audit enregistré pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditLogs;

