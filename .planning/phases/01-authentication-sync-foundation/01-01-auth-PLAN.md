---
description: "Construção da autenticação via Firebase, rotas protegidas e conexão da store Zustand para sessão de usuários."
wave: 1
depends_on: []
files_modified:
  - src/firebase.js
  - src/store/authStore.js
  - src/components/AuthModal.jsx
  - src/router.jsx
  - package.json
autonomous: false
---

# Phase 1: Authentication & Sync Foundation

## Goal
Estabelecer o Firebase Auth (E-mail/Senha + Google Auth) na aplicação, gerenciado globalmente pelo Zustand, e proteger rotas no React Router.

## Tasks

```xml
<task>
  <action>
    Instalar pacote do Firebase (caso esteja pendente) e inicializar `getAuth` e `GoogleAuthProvider`.
    Modificar `src/firebase.js` expondo:
    ```javascript
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    export const db = getFirestore(app);
    ```
  </action>
  <read_first>
    - package.json
    - src/firebase.js
  </read_first>
  <acceptance_criteria>
    - src/firebase.js contains `export const auth = getAuth(app);`
    - src/firebase.js contains `export const googleProvider`
    - src/firebase.js contains `export const db = getFirestore(app);`
  </acceptance_criteria>
</task>

<task>
  <action>
    Criar a store global de autenticação em `src/store/authStore.js`.
    A store deve utilizar Zustand para gerir o estado: `user` (default: null), `loading` (default: true).
    Deve exportar as ações `loginWithGoogle()`, `loginWithEmail(email, password)`, `logout()` e escutar mudanças usando `onAuthStateChanged` da lib `firebase/auth`.
  </action>
  <read_first>
    - src/store/authStore.js
  </read_first>
  <acceptance_criteria>
    - src/store/authStore.js contains `const useAuthStore = create`
    - src/store/authStore.js contains `onAuthStateChanged`
    - src/store/authStore.js exports `useAuthStore`
  </acceptance_criteria>
</task>

<task>
  <action>
    Criar o componente visual de login em `src/components/AuthModal.jsx`.
    Ele deve fornecer 1 botão "Entrar com Google" (que chama `loginWithGoogle()` do `useAuthStore`).
    Deve utilizar o Tailwind para aplicar centralização e overlay escuro de modal.
  </action>
  <read_first>
    - src/components/AuthModal.jsx
  </read_first>
  <acceptance_criteria>
    - src/components/AuthModal.jsx contains `loginWithGoogle` invocations
    - src/components/AuthModal.jsx contains Tailwind class `fixed inset-0` or similar for modal.
  </acceptance_criteria>
</task>

<task>
  <action>
    Implementar bloqueio de rotas não autenticadas como "Protected Route", se aplicável para `admin`, ou preparar o React Router no `router.jsx` para expor o `AuthModal` caso `user === null`.
  </action>
  <read_first>
    - src/router.jsx
  </read_first>
  <acceptance_criteria>
    - src/router.jsx contains `useAuthStore` wrapper logic
  </acceptance_criteria>
</task>
```
