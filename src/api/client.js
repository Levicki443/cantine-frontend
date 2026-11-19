/**
 * @fileoverview Client HTTP Axios configuré avec intercepteurs de sécurité JWT.
 * @module api/client
 * Conforme aux règles d'audit et de traçabilité sécurisée des requêtes.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s : résilience aux réveils cloud (Render Cold Start)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Intercepteur de requête : injection systématique du jeton JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cantine_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gestion centralisée des erreurs HTTP et déconnexion sur 401
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // Normalisation élégante des messages d'erreur : aucune fuite technique brute
    let message = error.response?.data?.message;

    if (!message) {
      if (!error.response || status >= 500) {
        message = 'Le serveur est temporairement inaccessible. Veuillez vérifier que le service backend est actif ou réessayer.';
      } else if (status === 404) {
        message = 'La ressource demandée est introuvable sur le serveur.';
      } else if (status === 403) {
        message = 'Accès refusé : vous ne disposez pas des autorisations nécessaires.';
      } else if (status === 400) {
        message = 'Les informations transmises sont incomplètes ou invalides.';
      } else {
        message = 'Une erreur inattendue est survenue lors de la communication avec le serveur.';
      }
    }

    if (status === 401) {
      // Déconnexion et purge des jetons expirés
      localStorage.removeItem('cantine_token');
      localStorage.removeItem('cantine_user');

      // Ne rediriger que si l'on ne se trouve pas déjà sur l'écran d'authentification
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

