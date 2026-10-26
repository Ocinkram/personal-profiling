import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App
    AID={import.meta.env.VITE_AID}
    API_KEY={import.meta.env.VITE_API_KEY}
    ENV={import.meta.env.VITE_ENV ?? 'dev'}
    API_ORIGIN={import.meta.env.VITE_API_ORIGIN}
  />,
)
