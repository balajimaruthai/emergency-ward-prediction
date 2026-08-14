/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Times New Roman', 'Times', 'Georgia', 'serif'],
        serif: ['Times New Roman', 'Times', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#111C2D',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        available: {
          DEFAULT: '#16A34A',
          light: '#22C55E',
          bg: '#F0FDF4',
        },
        moderate: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          bg: '#EFF6FF',
        },
        high: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
          bg: '#FFFBEB',
        },
        critical: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          bg: '#FEF2F2',
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'panel': '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        'panel-hover': '0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)',
        'float': '0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
