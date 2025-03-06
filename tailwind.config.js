/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        error: 'var(--error)',
        success: 'var(--success)',
        'text-secondary': 'var(--text-secondary)',
        'background': 'var(--background)',
        'text-primary': 'var(--text-primary)',
        'background-paper': 'var(--background-paper)',
      },
    },
  },
  plugins: [],
} 