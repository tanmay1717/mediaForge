import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0f4ff', 500: '#4f6df5', 600: '#3b5de7', 700: '#2d4ed9' },
      },
    },
  },
  plugins: [],
};
export default config;
