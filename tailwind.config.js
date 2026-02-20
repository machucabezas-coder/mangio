/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        sidebar: '#1e293b',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        surface: '#1e293b',
        'surface-2': '#334155',
        border: '#334155',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
}
