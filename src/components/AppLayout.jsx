/**
 * @fileoverview Disposition maîtresse globale de l'application (Layout ERP).
 * @module components/AppLayout
 * Assure la cohérence visuelle, la navigation et le motion design responsive.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Enveloppe principale de l'interface avec Sidebar et Header intégrés.
 * @param {Object} props
 * @param {string} props.title Titre de la page active.
 * @param {string} [props.subtitle] Sous-titre ou description contextuelle.
 * @param {Array<{label: string, to?: string}>} [props.breadcrumbs] Fil d'Ariane contextuel.
 * @param {React.ReactNode} props.children Contenu principal de la page.
 */
export const AppLayout = ({ title, subtitle, breadcrumbs = [], children }) => {
  return (
    <div className="flex h-screen bg-[#F8F6F0] overflow-hidden">
      {/* Barre latérale persistante avec transition fluide */}
      <Sidebar />

      {/* Conteneur principal avec transition d'apparition douce */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
