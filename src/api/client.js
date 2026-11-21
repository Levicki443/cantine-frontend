/**
 * @fileoverview Client HTTP Axios configuré avec intercepteurs de sécurité JWT et résilience cloud.
 * @module api/client
 * Conforme aux règles d'audit, de traçabilité sécurisée et de résilience aux pannes réseau.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Pré-réveil automatique et silencieux du serveur (Warm-up)
export const prewarmBackend = async () => {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 6000 });
  } catch {
    // Échec silencieux intentionnel : le pré-réveil ne doit jamais bloquer l'UI
  }
};

// Intercepteur de requête : injection systématique du jeton JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cantine_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse avec gestion intelligente des pannes et messages clairs
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    // Tentative unique de réessai automatique sur panne réseau temporaire
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await apiClient(originalRequest);
      } catch (retryErr) {
        return Promise.reject(new Error(getResilientErrorMessage(retryErr)));
      }
    }

    if (status === 401) {
      localStorage.removeItem('cantine_token');
      localStorage.removeItem('cantine_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message = getResilientErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

/**
 * Génère un message d'erreur clair et contextualisé sans fuite technique.
 */
function getResilientErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  const isDev = import.meta.env.DEV;
  const status = error.response ? error.response.status : null;

  if (!error.response) {
    if (isDev) {
      return "Le serveur backend local n'est pas actif sur le port 5000. Lancez 'demarrer.bat' ou 'npm run dev' dans le dossier cantine-backend.";
    }
    return "Le serveur distant est en cours d'initialisation ou momentanément indisponible. Veuillez patienter quelques secondes et réessayer.";
  }

  if (status >= 500) {
    return "Une anomalie temporaire s'est produite sur le serveur. Veuillez réessayer dans un instant.";
  }
  if (status === 404) return "La ressource demandée est introuvable sur le serveur.";
  if (status === 403) return "Accès refusé : vous ne disposez pas des autorisations nécessaires.";
  if (status === 400) return "Les informations transmises sont incomplètes ou invalides.";

  return "Une erreur inattendue est survenue lors de la communication avec le serveur.";
}

export default apiClient;
