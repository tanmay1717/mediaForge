import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f4f4f5', 100: '#e4e4e7', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 900: '#18181b' },
      },
    },
  },
  plugins: [],
};
export default config;
