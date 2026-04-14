# Testing

## Frameworks Core
- Atualmente, não há dependências de testes listadas (`jest`, `vitest`, `playwright`, `cypress`) no escopo de `package.json`.
- A validação de código atual repousa totalmente em linting visual (`npm run lint` utilizando ESLint).

## Estratégia Recomendada
Pela natureza visual da aplicação de leitura em canvas / pageflip:
- **Testes Unitários:** Seria ideal validar os hooks lógicos que definem progresso de páginas do histórico ou volumes (`volumes.js`).
- **End-to-End (E2E):** Frameworks como Playwright ou Cypress para validar os eventos de tap e pan-zoom na área visível da revista (UX core).
