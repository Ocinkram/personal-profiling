import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['react', 'react-dom', '@mui/material', '@mui/icons-material'] },
  },
})
