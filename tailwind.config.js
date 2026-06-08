export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['IBM Plex Sans', 'sans-serif'] },
      colors: {
        surface: '#09090b',
        primary: '#0C5CAB',
        success: '#10b981',
        danger: '#ef4444',
        warn: '#f59e0b',
      },
    },
  },
}
