# Requirements

## Phase 1: Firebase Auth & Session Tracking
- Autenticação e-mail/senha via Firebase.
- Autenticação com Google (OAuth).
- Middleware no roteamento do React Router para proteger rotas logadas.
- Criação e atualização de nó no Firestore vinculando o `uid` da sessão ao `id` da HQ e `pageIndex` correspondente.
- Recuperação mágica do contexto ao recarregar a HQ (o botão 'Ler' puxa a última página lida direto do banco).

## Phase 2: Painel Dinâmico (Admin)
- Rota protegida `/admin` que requer role claim de admin.
- Interface para cadastro de nova HQ (título, sinopse, capa).
- Módulo Upload de Volumes/Páginas em massa para o Firebase Storage.
- Disparo da ingestão com WebP.

## Phase 3: Leitura e UX Enhancements
- Restringir aspect-ratio via Tailwind para não distorcer o `react-pageflip` em mobile/foldables.
- Tratamento de Swipe touch gestures.
- Fullscreen automático no modo Leitura (opcional do navegador em mobile).
- Lazy loading agressivo: Renderizar em virtualização apenas página atual e 2 contíguas.
