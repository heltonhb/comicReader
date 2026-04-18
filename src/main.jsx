import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { registerSW } from 'virtual:pwa-register'

// analytics helper (GA4)
import { initAnalytics } from './analytics';

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

// initialize analytics (no-op if GA_ID missing)
initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
