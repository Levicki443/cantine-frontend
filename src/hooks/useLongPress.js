/**
 * @fileoverview Hook React pour la détection d'appui continu prolongé (Long Press).
 * @module hooks/useLongPress
 * Gère de manière universelle la souris, les stylets et les écrans tactiles (< 325 lignes).
 */

import { useState, useRef, useCallback } from 'react';

/**
 * Hook pour exécuter une action après un maintien continu d'une durée spécifiée.
 * @param {Function} onLongPress - Fonction exécutée une fois le délai atteint.
 * @param {number} [delayMs=10000] - Durée requise en millisecondes.
 * @returns {object} { isPressing, handlers }
 */
export const useLongPress = (onLongPress, delayMs = 10000) => {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef(null);
  const triggeredRef = useRef(false);

  const startPress = useCallback(
    (e) => {
      // Ignorer tout clic autre que le clic principal (gauche / toucher)
      if (e.button && e.button !== 0) return;

      triggeredRef.current = false;
      setIsPressing(true);

      timerRef.current = setTimeout(() => {
        triggeredRef.current = true;
        setIsPressing(false);
        if (typeof onLongPress === 'function') {
          onLongPress(e);
        }
      }, delayMs);
    },
    [onLongPress, delayMs]
  );

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  }, []);

  const handleClick = useCallback((e) => {
    // Si l'appui long a été consommé, on neutralise le clic de navigation par défaut
    if (triggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      triggeredRef.current = false;
    }
  }, []);

  const handleContextMenu = useCallback((e) => {
    // Évite l'affichage intempestif du menu contextuel mobile lors du maintien
    if (isPressing || triggeredRef.current) {
      e.preventDefault();
    }
  }, [isPressing]);

  return {
    isPressing,
    handlers: {
      onPointerDown: startPress,
      onPointerUp: cancelPress,
      onPointerLeave: cancelPress,
      onPointerCancel: cancelPress,
      onClick: handleClick,
      onContextMenu: handleContextMenu
    }
  };
};

export default useLongPress;
