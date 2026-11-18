/**
 * @fileoverview Historique et contrôle des sessions de caisse journalières.
 * @module pages/caisse/CashSessionsList
 * Conforme à la section 5.14 et à la supervision des clôtures financières.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const CashSessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const chargerSessions = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/cash-sessions');
      if (res.success) {
        setSessions(res.sessions || []);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des sessions.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerSessions();
  }, []);

  return (
    <AppLayout
      title="Historique des Sessions de Caisse"
      subtitle="Supervision des fonds de caisse, montants théoriques vs réels et motifs d'écarts"
    >
      {erreur && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Tableau des sessions de caisse */}
      <div className="card-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-xs text-surface-textMuted font-semibold uppercase bg-surface-muted/50">
                <th className="py-3.5 px-4">Caissier</th>
                <th className="py-3.5 px-4">Ouverture</th>
                <th className="py-3.5 px-4">Clôture</th>
                <th className="py-3.5 px-4">Fond Initial</th>
                <th className="py-3.5 px-4">Total Encaissé</th>
                <th className="py-3.5 px-4">Théorique</th>
                <th className="py-3.5 px-4">Réel Compté</th>
                <th className="py-3.5 px-4">Écart</th>
                <th className="py-3.5 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {sessions.length > 0 ? (
                sessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-surface-muted/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-surface-text">
                      {sess.caissier_id?.prenom} {sess.caissier_id?.nom}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-surface-textMuted">
                      {new Date(sess.date_ouverture).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-surface-textMuted">
                      {sess.date_cloture
                        ? new Date(sess.date_cloture).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '— En cours —'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-surface-text">
                      {(sess.montant_initial || 0).toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-state-success">
                      +{(sess.total_encaissements || 0).toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3.5 px-4 font-bold text-surface-text">
                      {(sess.montant_theorique || 0).toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3.5 px-4 text-xs text-surface-text">
                      {sess.montant_reel !== null
                        ? `${sess.montant_reel.toLocaleString('fr-FR')} F`
                        : 'Non clôturé'}
                    </td>
                    <td className="py-3.5 px-4">
                      {sess.ecart !== null ? (
                        sess.ecart === 0 ? (
                          <span className="text-xs font-bold text-state-success">0 F</span>
                        ) : (
                          <span
                            title={sess.motif_ecart || 'Écart inexpliqué'}
                            className="text-xs font-bold text-state-warning underline cursor-help"
                          >
                            {sess.ecart > 0 ? `+${sess.ecart}` : sess.ecart} F
                          </span>
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={sess.statut === 'ouverte' ? 'warning' : 'success'}>
                        {sess.statut}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-surface-textMuted text-sm">
                    {chargement ? 'Chargement des sessions...' : 'Aucune session de caisse enregistrée.'}
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

export default CashSessionsList;

