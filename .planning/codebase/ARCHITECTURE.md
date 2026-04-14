# Architecture

## Padrão Frontend-Firebase
O projeto adota a arquitetura de **Single Page Application (SPA)** serverless utilizando os serviços do **Firebase**.

1. **Frontend (Vite + React)**:
   - Gerencia estado global utilizando **Zustand**.
   - Renderiza interfaces utilizando as bibliotecas `react-pageflip` (possível lógica de HQ) e `react-zoom-pan-pinch` para UX de leitura de quadrinhos.
   - Gerencia roteamento via `react-router-dom`.

2. **Backend (Firebase)**:
   - Gerenciamento de eventos de banco de dados, storage de imagens (provavelmente WebP) e autenticação gerida diretamente pelo Firebase SDK (`firebase.js`).

## Conversão de Midia
- Existe um script local (`scripts/convert-pdf-to-webp.js`) que processa PDFs base originais e os converte em WebP pelo Node.js utilizando `pdf2pic` como pré-build ou fase de ingestão de dados.
