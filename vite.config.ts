import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuración de Vite: React, Tailwind y alias @ para shadcn
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Puerto fijo del entorno activo (evita instancias duplicadas en 5174, etc.)
  server: {
    port: 5175,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
