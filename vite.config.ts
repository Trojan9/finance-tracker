import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [require('@tailwindcss/postcss')],
  root: "public",
  css: {
    postcss: './postcss.config.js',
  },
});

