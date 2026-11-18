import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      },
      colors: {
        // CHARTE OFFICIELLE CANTINE MANAGER — 3 COULEURS PRINCIPALES STRICTES
        brand: {
          forest: '#183F35',      // 1. Vert forêt profond (marque, navigation, boutons majeurs)
          primary: '#183F35',     // Alias principal
          hover: '#123028',       // Survol sombre élégant
          light: '#E3ECE8',       // Teinte vert forêt très adoucie pour badges et surfaces

          terracotta: '#C87552',  // 2. Terracotta (accentuation, actions secondaires, alertes douces)
          accent: '#C87552',      // Alias terracotta
          accentHover: '#B36443', // Survol terracotta
          gold: '#C87552',        // Rapprochement sur la palette 3 couleurs
          accentLight: '#F8EDE8'  // Fond doux terracotta
        },
        surface: {
          page: '#F6F3EA',        // 3. Ivoire chaud (fond global, calme et chaleureux)
          card: '#FFFFFF',        // Cartes blanches épurées
          muted: '#EDE7D9',       // Ivoire légèrement contrasté pour zones neutres
          border: '#E2DBD0',      // Séparateurs discrets ivoire grisé
          borderFocus: '#183F35', // Focus marqué vert forêt
          text: '#252B28',        // Anthracite profond — lisibilité optimale
          textMuted: '#5A6560'    // Gris doux pour hiérarchie secondaire
        },
        state: {
          success: '#183F35',
          successBg: '#E3ECE8',
          warning: '#C87552',
          warningBg: '#F8EDE8',
          danger: '#B34A38',
          dangerBg: '#FBF0EE',
          info: '#3B4D45',
          infoBg: '#EAF0ED',
          disabled: '#A0ABA6'
        },
        roleBadge: {
          admin: '#183F35',
          adminBg: '#E3ECE8',
          manager: '#C87552',
          managerBg: '#F8EDE8',
          cashier: '#183F35',
          cashierBg: '#E3ECE8',
          client: '#5A6560',
          clientBg: '#EDE7D9'
        }
      },
      transitionTimingFunction: {
        saas: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        scaleInSubtle: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' }
        },
        countPop: {
          '0%': { transform: 'scale(0.96)' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in-subtle': 'scaleInSubtle 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'count-pop': 'countPop 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }
    }
  },
  plugins: []
};
