import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  server: { port: 5173 },
  
  // Add this configuration to fix WebSocket issues in production
  build: {
    // Disable sourcemaps in production for better performance
    sourcemap: false,
    // Roll up all HMR code to prevent WebSocket connections
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group development-only code in a separate chunk
          if (id.includes('node_modules/@vite') || id.includes('node_modules/vite')) {
            return 'vite-hmr';
          }
        }
      }
    }
  }
})