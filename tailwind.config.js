/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16202a',
        paper: '#f8fafc',
        line: '#d8dee8',
        brand: '#0f766e',
        signal: '#2563eb',
        warn: '#b45309',
        risk: '#b91c1c',
      },
      boxShadow: {
        panel: '0 12px 36px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
