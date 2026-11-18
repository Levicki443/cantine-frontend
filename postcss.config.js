import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @fileoverview Configuration PostCSS pour Cantine Manager Frontend.
 * Active le moteur Tailwind CSS avec résolution absolue du fichier de configuration.
 */
export default {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, 'tailwind.config.js') },
    autoprefixer: {},
  },
};
