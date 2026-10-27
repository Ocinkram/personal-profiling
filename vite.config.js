import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const externalPackages = ['react', 'react-dom']

const isExternal = (id) => externalPackages.some(
  (packageName) => id === packageName || id.startsWith(`${packageName}/`),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: 'index', cssFileName: 'personal-profiling' },
    rolldownOptions: {
      external: isExternal,
      output: { banner: "import './personal-profiling.css';" },
    },
  },
})
