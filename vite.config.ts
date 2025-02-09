import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "public",
  css: {
    postcss: './postcss.config.js',
  },
  base: "./", // ✅ Ensures correct asset paths in production
  build: {
    assetsInlineLimit: 0, // ✅ Forces Vite to copy assets instead of inlining them
    outDir: "dist",
  },
});


