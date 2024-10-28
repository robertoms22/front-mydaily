/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mi-api.vercel.app', // Cambia esto a la URL de tu API en Vercel
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Esto elimina el prefijo /api
      }
    }
  }
});

