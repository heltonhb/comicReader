# Conventions

## Código
- **Paradigma**: Componentes React funcionais com uso massivo de **Hooks**.
- **Linguagem**: JavaScript moderno (ESM) com JSX. (Projeto não utiliza TypeScript explicitamente, confiando em prop-types ou JS dinâmico livre).
- **Gerenciamento de Estado**: Preferencialmente descentralizado com **Zustand** no `/store`, evitando Prop Drilling complexo.

## Estilização
- Uso de **Tailwind CSS v3** como solução core para CSS, junto com PostCSS.
- Microinterações e controles de Viewport feitas via React e **Framer Motion**.

## Fluxo de Compilação
- Ao invés de imagens pesadas subirem em runtime, arquivos raw passam primeiramente pelo script autoral `convert-pdf-to-webp` como etapa recomendada do pipeline para economia de banda em leituras e armazenamento na nuvem.
