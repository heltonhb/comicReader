import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('Nova versão disponível. Recarregar?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('App pronto para funcionar offline.')
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
