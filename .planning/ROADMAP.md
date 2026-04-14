# Roadmap

## Milestone 1: UX Leitura Fluída e Retenção
**Goal:** Alcançar uma Single Page Application responsiva na qual o usuário consegue acessar, ler e ter o progresso salvo em nuvem.

### Phase 1: Authentication & Sync Foundation
- **Plan 1.1:** Integração nativa do SDK de Auth do Firebase na Store Zustand.
- **Plan 1.2:** Estruturação da UX de SignIn/SignUp unificada e protetora de perfil.
- **Plan 1.3:** Setup das collections do Firestore (schema `UserProgress`) para ler e injetar o número da página no componente leitor.

### Phase 2: Leitor Responsivo Definitivo
- **Plan 2.1:** Limitação inteligente do Box-Model do `react-pageflip` para caber em edge-to-edge sem barras pretas invasivas.
- **Plan 2.2:** Pre-caching e virtualização de imagens (Image Lazy Load).
- **Plan 2.3:** Touch Gestures (Zoom Pan via lib).

## Milestone 2: Dinamismo de Operações Backoffice
**Goal:** Possuir um painel interno onde criar novos volumes se torna um drag-and-drop massivo e não requer alteração de código.

### Phase 3: The Admin Panel

**Goal:** Possuir um painel interno onde criar novos volumes se torna um drag-and-drop massivo e não requer alteração de código.

**Plans:**
- **Plan 3.1:** Route protection with Firebase Custom Claims verifying admin privileges.
- **Plan 3.2:** Cataloging form for volume creation in Firestore.
- **Plan 3.3:** Dropzone for mass file upload to Firebase Storage.

**Plan list:**
- [ ] 03-01-PLAN.md — Route protection with admin checks
- [ ] 03-02-PLAN.md — Cataloging form
- [ ] 03-03-PLAN.md — Dropzone upload
