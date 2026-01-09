import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Creates a separate chunk for everything inside node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})