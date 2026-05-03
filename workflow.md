# Fluxo de Dados - Gibiteca HQ

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ENTRADA                                     │
│  VolumeSelector (seleção) → BookWrapper (carregamento)             │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         ROTEAMENTO                                  │
│  react-router-dom: / → /read/:volumeId → /admin                    │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         LEITURA                                     │
│  Book.jsx → FlipbookReader / WebtoonMode → Page.jsx                 │
│  Hooks: useReaderHooks, useFullscreen, useReadingProgress           │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTENTICAÇÃO                                │
│  Firebase Auth → authStore (Zustand) → useAuth()                    │
│  Google Sign-In / Anonymous → AdminRoute (proteção)                │
└─────────────────────────────────────────────────────────────────────┘

## Fluxo Detalhado

### 1. Inicialização
```
main.jsx
  → RouterProvider (router)
  → initAnalytics (GA4)
  → registerSW (PWA)
```

### 2. Navegação
```
router.jsx
  ├── / → VolumeSelector (biblioteca)
  ├── /read/:volumeId → BookWrapper (lazy)
  │     └── Book.jsx → FlipbookReader / WebtoonMode
  │         └── Page.jsx (render)
  └── /admin → AdminRoute → AdminPanel (lazy)
```

### 3. Estado (Zustand)

| Store | Responsabilidade |
|-------|------------------|
| `useReaderStore` | Zoom, modo de leitura, thumbnails |
| `authStore` | Usuário, login, logout |
| `adminStore` | Upload, gestão de volumes |

### 4. Autenticação
```
Firebase Auth (firebase.js)
  ├── signInWithPopup (Google)
  ├── signInAnonymously
  └── signOut

→ authStore
  ├── user: User | null
  ├── loading: boolean
  └── initAuth() → onAuthStateChanged

→ useAuth() (hook)
  └── useAdminCheck() → AdminRoute
```

### 5. Dados de Volumes
```
volumes.js (export const VOLUMES)
  └── public/volumes/{volume-name}/
       ├── metadata.json { numPages, title, author }
       └── *.webp (imagens)

→ BookLoader.jsx (preload)
→ useImagePreloader (cache)
```

### 6. Analytics
```
analytics.js
  └── trackEvent(event, params)
       → gtag (GA4)
```

## Estrutura de Diretórios

```
src/
├── main.jsx              # Entry point
├── router.jsx            # Rotas React
├── App.jsx               # Layout principal
├── volumes.js            # Registro de volumes
├── firebase.js           # Firebase config
├── analytics.js          # GA4 tracking
├── store/
│   ├── useReaderStore.js  # Estado leitor
│   ├── authStore.js       # Estado auth
│   └── adminStore.js      # Estado admin
├── hooks/
│   ├── useAuth.js         # Auth hook
│   ├── useAdminCheck.js   # Verificação admin
│   ├── useReaderHooks.js  # Hooks de leitura
│   └── ...               # Outros hooks
└── components/
    ├── VolumeSelector.jsx  # Biblioteca
    ├── BookWrapper.jsx     # Container livro
    ├── Book.jsx           # Leitor principal
    ├── FlipbookReader.jsx # Modo flipbook
    ├── WebtoonMode.jsx    # Modo webtoon
    ├── Page.jsx           # Página individual
    ├── AuthModal.jsx      # Login
    ├── AdminRoute.jsx     # Rota protegida
    └── AdminPanel.jsx    # Painel admin
```

## Fluxo de Dados de Imagem

```
1. VolumeSelector → seleciona volume
2. Navigate(/read/:volumeId)
3. BookWrapper lazy-loads
4. BookLoader busca metadata.json
5. Carrega imagens via useImagePreloader
6. Page.jsx renderiza WebP
```

## Autenticação Firebase

```javascript
// firebase.js
auth = getAuth(app)
googleProvider = new GoogleAuthProvider()

// authStore.js
loginWithGoogle() → signInWithPopup(auth, googleProvider)
loginAnonymously() → signInAnonymously(auth)
logout() → signOut(auth)
```

## PWA Service Worker

```
registerSW()
  ├── onNeedRefresh → confirm() → updateSW(true)
  └── onOfflineReady → console.log()
```

## Eventos de Analytics

| Evento | Quando |
|--------|--------|
| page_view | Navigação de rota |
| volume_open | Abrir volume |
| reading_mode_change | Trocar modo (flipbook/webtoon) |

---

*Gerado automaticamente via análise de código*