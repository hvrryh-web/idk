import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - uses repository name
  base: process.env.GITHUB_PAGES === 'true' ? '/idk/' : '/',
  server: {
    port: 5173,
  },
  build: {
    // Output to dist directory for GitHub Pages deployment
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: false,
  },
});
