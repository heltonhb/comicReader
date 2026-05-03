# AGENTS.md - Gibiteca HQ

## Quick Commands

```bash
npm run dev              # Start dev server
npm run build            # Full build (converts PDFs first)
npm run build:fast      # Skip PDF conversion, faster build
npm run lint             # Check lint errors
npm run lint:fix         # Auto-fix lint issues
npm run format           # Format code
npm run format:check     # Check formatting only
npm run test             # Run tests
npm run test:coverage    # Tests with coverage
```

## Build Order

`npm run build` runs in sequence: `convert-hqs` → `vite build`. Use `build:fast` during development to skip PDF conversion.

## Project Structure

- **Entry**: `src/main.jsx` → `src/App.jsx` → `src/router.jsx`
- **Components**: `src/components/` - Reader, FlipbookReader, WebtoonMode, VolumeSelector
- **State**: `src/store/` - Zustand stores (authStore.js, useReaderStore.js, adminStore.js)
- **Config**: `src/firebase.js`, `src/analytics.js` (Mixpanel), `src/volumes.js` (volume registry)
- **Volumes**: `public/volumes/{volume-name}/` with `metadata.json`

## Testing

- Tests live alongside components (`.test.js`, `.test.jsx`) and in `src/test/`
- Use `src/test/setup.js` for test globals
- Vitest configured with jsdom for DOM testing

## Adding a Volume

1. Create `public/volumes/{name}/` with WebP images (1920px width, 85% quality)
2. Add `metadata.json`: `{"numPages": N, "title": "...", "author": "..."}`
3. Register in `src/volumes.js` VOLUMES array
4. Build and deploy

## Key Dependencies

- React 18 + React Router 7
- Vite 7 + TypeScript 5.8
- Zustand (state), Firebase (auth/storage), Framer Motion (animations)
- react-pageflip (flipbook), react-virtuoso (virtualization)
- PWA enabled via vite-plugin-pwa

## Lint Notes

- ESLint ignores: `dist`, `node_modules`, `_bmad*`, `.firebase`, `coverage`, `src/test`
- Config in `eslint.config.js` - uses typescript-eslint, react plugins, prettier
- Rules: `no-var: error`, `prefer-const: warn`, `react-refresh/only-export-components: warn`

## TypeScript

- Strict mode enabled in `tsconfig.json`
- Path alias: `@/*` maps to `src/*`
- No emit - type checking only

## Graphify Integration

- Plugin configured: `.opencode/plugins/graphify.js`
- Run `/graphify .` to build knowledge graph of this codebase
- Skills loaded from `/home/helton/.config/opencode/skills/`