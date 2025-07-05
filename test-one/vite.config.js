import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/script.js'),
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'background') return 'background.js';
          if (assetInfo.name === 'content') return 'script.js';
          return 'assets/[name].js';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
