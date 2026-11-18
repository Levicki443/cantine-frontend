/**
 * @fileoverview Composant graphique à barres interactif en SVG pur.
 * @module components/charts/InteractiveBarChart
 * Idéal pour visualiser l'évolution des ventes et les revenus périodiques sans dépendance lourde.
 * Charte 3 couleurs : Vert Forêt (#183F35), Ivoire Chaud (#F6F3EA), Terracotta (#C87552).
 */

import React, { useState } from 'react';

export const InteractiveBarChart = ({
  data = [],
  xKey = 'label',
  yKey = 'value',
  color = '#183F35',
  height = 200,
  unit = 'FCFA'
}) => {
  const [survol, setSurvol] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-surface-textMuted bg-surface-muted/30 rounded-xl border border-dashed border-surface-border"
        style={{ height }}
      >
        Aucune donnée d'évolution disponible pour cette période.
      </div>
    );
  }

  const valeurs = data.map((d) => d[yKey] || 0);
  const valeurMax = Math.max(...valeurs, 1);
  const paddingX = 40;
  const paddingY = 24;
  const chartHeight = height - paddingY * 2;
  const barWidth = Math.max(12, Math.min(36, Math.floor(400 / (data.length * 2))));

  return (
    <div className="relative w-full animate-fade-in">
      <svg
        viewBox={`0 0 ${data.length * 70 + paddingX * 2} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Lignes de repère horizontales */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingY + chartHeight * (1 - ratio);
          return (
            <g key={ratio}>
              <line
                x1={paddingX}
                y1={y}
                x2={data.length * 70 + paddingX}
                y2={y}
                stroke="#DCE4DC"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-surface-textMuted font-mono"
              >
                {Math.round(valeurMax * ratio).toLocaleString('fr-FR')}
              </text>
            </g>
          );
        })}

        {/* Barres interactives avec transition fluide */}
        {data.map((item, index) => {
          const valeur = item[yKey] || 0;
          const ratio = valeur / valeurMax;
          const h = Math.max(4, chartHeight * ratio);
          const x = paddingX + index * 70 + 20;
          const y = paddingY + chartHeight - h;
          const estSurvole = survol === index;

          return (
            <g
              key={index}
              onMouseEnter={() => setSurvol(index)}
              onMouseLeave={() => setSurvol(null)}
              className="cursor-pointer"
            >
              {/* Zone invisible élargie pour faciliter le survol mobile et souris */}
              <rect
                x={x - 10}
                y={paddingY}
                width={barWidth + 20}
                height={chartHeight}
                fill="transparent"
              />
              {/* Barre principale animée */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="5"
                fill={estSurvole ? '#C87552' : color}
                className="transition-all duration-200 ease-saas origin-bottom hover:opacity-90"
              />
              {/* Libellé sous la barre */}
              <text
                x={x + barWidth / 2}
                y={paddingY + chartHeight + 14}
                textAnchor="middle"
                className={`text-[10px] transition-all duration-150 ${
                  estSurvole ? 'font-black fill-brand-forest' : 'fill-surface-textMuted'
                }`}
              >
                {item[xKey]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info-bulle flottante avec apparition douce */}
      {survol !== null && data[survol] && (
        <div className="absolute top-0 right-2 p-2.5 rounded-xl bg-surface-card border border-surface-border shadow-xl text-xs pointer-events-none animate-scale-in">
          <span className="font-bold text-surface-text block">{data[survol][xKey]}</span>
          <span className="text-brand-forest font-black">
            {(data[survol][yKey] || 0).toLocaleString('fr-FR')} {unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default InteractiveBarChart;
