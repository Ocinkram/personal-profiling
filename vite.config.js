import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const externalPackages = [
  'react',
  'react-dom',
  '@emotion/react',
  '@emotion/styled',
  '@mui/material',
  '@mui/icons-material',
  '@mui/system',
]

const isExternal = (id) => externalPackages.some(
  (packageName) => id === packageName || id.startsWith(`${packageName}/`),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: 'index' },
    rolldownOptions: { external: isExternal },
  },
})
