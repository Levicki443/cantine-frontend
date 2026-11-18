/**
 * @fileoverview Suivi en temps réel des commandes et historique client.
 * @module pages/client/ClientOrders
 * Conforme aux sections 4.5 et 5.11 du cahier des charges.
 */

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import AppLayout from '../../components/AppLayout';
import Badge from '../../components/Badge';
import { Clock, CheckCircle2, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const ClientOrders = () => {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const chargerCommandes = async () => {
    setChargement(true);
    try {
      const res = await apiClient.get('/sales');
      if (res.success) {
        setCommandes(res.ventes || []);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des commandes.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  return (
    <AppLayout
      title="Mes Commandes & Historique"
      subtitle="Suivi de la préparation de vos repas et consultation des reçus"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-surface-text">Commandes récentes</h2>
          <p className="text-xs text-surface-textMuted">Mise à jour automatique de l'état</p>
        </div>
        <button
          onClick={chargerCommandes}
          disabled={chargement}
          className="btn-secondary text-xs flex items-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${chargement ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {erreur && (
        <div className="p-4 mb-6 text-sm rounded-lg bg-state-dangerBg border border-state-danger text-state-danger flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{erreur}</span>
        </div>
      )}

      <div className="space-y-4">
        {commandes.length > 0 ? (
          commandes.map((cmd) => (
            <div key={cmd._id} className="p-5 card-container">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-surface-border mb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-brand-primary block">
                    {cmd.numero_recu}
                  </span>
                  <span className="text-xs text-surface-textMuted">
                    {new Date(cmd.date_vente).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={cmd.statut === 'validée' ? 'success' : 'danger'}>
                    {cmd.statut === 'validée' ? 'Commande Confirmée' : 'Annulée'}
                  </Badge>
                </div>
              </div>

              {/* Lignes d'articles */}
              <div className="space-y-2 text-xs">
                {cmd.lignes?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-surface-text">
                    <span>
                      <span className="font-bold text-brand-primary mr-2">{item.quantite}x</span>
                      {item.nom_repas}
                    </span>
                    <span className="font-semibold text-surface-textMuted">
                      {item.sous_total?.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-surface-textMuted">
                  Règlement : <span className="font-semibold uppercase">{cmd.mode_paiement}</span>
                </span>
                <span className="text-sm font-extrabold text-surface-text">
                  Total : {cmd.montant_total?.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center card-container text-surface-textMuted text-sm">
            <PackageCheck className="w-10 h-10 mx-auto text-surface-textMuted/40 mb-3" />
            <p className="font-semibold text-surface-text">Aucune commande pour le moment</p>
            <p className="text-xs mt-1">Vos commandes validées apparaîtront ici en temps réel.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientOrders;

