/**
 * @fileoverview Composant graphique circulaire (Donut) en SVG pur avec légende dynamique.
 * @module components/charts/InteractiveDonutChart
 * Répartition visuelle des méthodes de paiement et statuts.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useState } from 'react';

// Palette stricte harmonisée sur les 3 teintes officielles
const PALETTE = ['#183F35', '#C87552', '#3B4D45', '#7A8C84', '#B36443', '#5A6560'];

export const InteractiveDonutChart = ({
  data = [],
  labelKey = 'label',
  valueKey = 'value',
  size = 200,
  unit = 'FCFA'
}) => {
  const [survol, setSurvol] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-surface-textMuted bg-surface-muted/20 rounded-xl border border-dashed border-surface-border">
        Aucune donnée de répartition disponible.
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + (curr[valueKey] || 0), 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-surface-textMuted">
        Volume total nul.
      </div>
    );
  }

  const radius = size / 2 - 20;
  const strokeWidth = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
      {/* Cercle SVG avec transition fluide */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, idx) => {
            const val = item[valueKey] || 0;
            const percent = val / total;
            const strokeDashoffset = circumference * (1 - percent);
            const rotation = accumulatedPercent * 360;
            accumulatedPercent += percent;
            const color = item.color || PALETTE[idx % PALETTE.length];
            const estSurvole = survol === idx;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={estSurvole ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transformOrigin: 'center',
                  transform: `rotate(${rotation}deg)`
                }}
                className="transition-all duration-200 ease-saas cursor-pointer"
                onMouseEnter={() => setSurvol(idx)}
                onMouseLeave={() => setSurvol(null)}
              />
            );
          })}
        </svg>

        {/* Centre résumé du donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-bold text-surface-textMuted uppercase">
            {survol !== null && data[survol] ? data[survol][labelKey] : 'Total'}
          </span>
          <span className="text-sm font-black text-brand-forest transition-transform duration-150">
            {survol !== null && data[survol]
              ? `${Math.round(((data[survol][valueKey] || 0) / total) * 100)} %`
              : total.toLocaleString('fr-FR')}
          </span>
          {survol === null && <span className="text-[9px] text-surface-textMuted">{unit}</span>}
        </div>
      </div>

      {/* Légende interactive */}
      <div className="space-y-2 flex-1 max-w-xs">
        {data.map((item, idx) => {
          const color = item.color || PALETTE[idx % PALETTE.length];
          const val = item[valueKey] || 0;
          const pct = Math.round((val / total) * 100);
          const estSurvole = survol === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setSurvol(idx)}
              onMouseLeave={() => setSurvol(null)}
              className={`flex items-center justify-between p-1.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ease-saas ${
                estSurvole ? 'bg-surface-muted font-bold translate-x-1' : 'hover:bg-surface-muted/50'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-surface-text truncate">{item[labelKey]}</span>
              </div>
              <span className="text-surface-textMuted font-mono text-[11px] ml-2">
                {pct} %
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveDonutChart;
