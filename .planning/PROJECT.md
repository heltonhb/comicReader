# Historia HQ — Leitor de Quadrinhos

## O Que É Este Projeto?
Uma Single Page Application (SPA) moderna, fluída e responsiva criada para a leitura de histórias em quadrinhos digitais. Focado em oferecer uma experiência "agradável de leitura, adaptável a qualquer dispositivo", combinando alta responsividade, transições nativas e uma infraestrutura escalável com Firebase.

### Visão & Valores
1. **UX Primeiro:** Não importa se no celular, tablet ou desktop, a experiência de leitura e a interface do usuário devem ser impecáveis.
2. **Imersão Tradicional:** A leitura preserva o formato de revista/mangá (page flip lateral), emulando as mídias físicas no ambiente digital.
3. **Escalável e Dinâmico:** Conteúdos não devem ser hardcoded. O app foi pensado para possuir um painel admin de retroabastecimento contínuo de HQs.
4. **Progresso Contínuo:** Através de login de usuário livre e rápido via Firebase, o leitor não perde a página que parou, independentemente de quando ele decidir fechar a aba.

## Por Que Este Projeto Existe?
- **Problema:** Muitos leitores web são antiquados, pesados, com controles difíceis e carregamento engasgado (reflow de imagens grande demais).
- **Desejo:** Trazer o poder das SPAs (React) processando as HQs renderizadas em formato otimizado (WebP) diretamente para uma UX mágica.
- **Público:** Leitores casuais ou hardcore de HQs online que apreciam um design minimalista e focado no conteúdo.

## Requirements

### Validated
- ✓ [Core Foundation] App estruturado sobre React 18, Vite e Tailwind CSS v3 para performance extrema. 
- ✓ [Processamento Frontend] Lógica base para flip de páginas (`react-pageflip`), zoom e pan (`react-zoom-pan-pinch`) adicionadas.
- ✓ [Pipeline de Imagens] Script utilitário em Node para conversão prévia dos PDFs pesados para formatação amigável WebP (`scripts/convert-pdf-to-webp.js`).
- ✓ [Infra Firebase] Bibliotecas do Firebase conectadas inicialmente e projeto referenciado.

### Active
- [ ] Construir o **Painel Admin** para upload e estruturação dinâmica de novos quadrinhos e volumes.
- [ ] Finalizar e integrar **Autenticação de Usuários** usando Firebase Authentication (E-mail/Senha ou Google).
- [ ] Implementar sistema de **Salvar Progresso de Leitura** vinculando a página atual lida ao UID no Firestore.
- [ ] Polimento Premium de Interface: Certificar que o "Flip Page" e a adaptação do aspecto ocorram sem cortes nas laterais do dispositivo mobile.

### Out of Scope
- [Scraping/Webcrawling Automático] — O foco não é criar um bot agregador neste momento, as HQs têm curadoria e upload definidos via Admin Panel.
- [Modo Webtoon Padrão Vertical] — O leitor escolheu UX Revista/Mangá lateral, remover preocupações com scroll infinito vertical contínuo por prioridade de tempo.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Modo Revista (Flip Lateral)** | Sensação imersiva tradicional é preferida acima da rolagem infinita estilo feed. | — Pending |
| **Catalogação Dinâmica via Admin** | Facilita a expansão do produto ao invés de depender de push no Git para incluir cada novo arquivo. | — Pending |
| **Autenticação Firebase** | Permite reter usuários e salvar progresso via UID, provê "cloud save" de graça e de forma segura. | — Pending |
| **Conversão para WebP** | Economia brutal de banda e evita out-of-memory nos celulares de entrada frente a imagens HD brutas. | Validated |

---
*Last updated: 2026-04-13 after initialization*
