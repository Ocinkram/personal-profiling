import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App
    aid={import.meta.env.VITE_AID}
    apiKey={import.meta.env.VITE_API_KEY}
    env={import.meta.env.VITE_ENV ?? 'dev'}
    apiOrigin={import.meta.env.VITE_API_ORIGIN}
  />,
)
