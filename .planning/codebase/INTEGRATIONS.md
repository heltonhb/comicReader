# Integrations

## Backend Providers
- **Firebase** (`firebase`): Empregado possivelmente para autenticação, banco de dados (Firestore), hosting ou storage (verificação de `firebase.js`).
- **Mixpanel** (`mixpanel-browser`): Serviço de Analytics configurado no frontend (`analytics.js`) para rastreamento comportamental de usuários na plataforma.

## PWA & Utilitários
- **Vite PWA** (`vite-plugin-pwa`): Utilizado para provisionar caching offline para que o Comic Reader possa ser instalado localmente.
- **Node Scripts (pdf2pic)**: Dependência do sistema local com Ghostscript para renderizar e dividir páginas PDF em imagens WebP via `convert-hqs` run script.
