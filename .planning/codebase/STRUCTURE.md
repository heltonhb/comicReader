# Structure - Gibiteca HQ

## Directory Layout

```
hq/
├── public/
│   └── volumes/           # Volume images (WebP)
│       ├── {volume-id}/
│       │   ├── metadata.json
│       │   └── page.{n}.webp
│   └── volumes.json       # External volumes config
├── src/
│   ├── components/       # 17 React components
│   ├── hooks/            # 9 custom hooks
│   ├── store/            # 3 Zustand stores
│   └── types/            # TypeScript definitions
├── .planning/
│   └── codebase/         # GSD mapping output (this)
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
└── vitest.config.js
```

## Component Hierarchy

```
App
├── VolumeSelector (/)
│   └── GoldCarousel
├── BookWrapper (/read/:volumeId) [lazy]
│   └── Book
│       ├── FlipbookReader
│       │   └── Page
│       └── WebtoonMode
│           └── Page
├── ReaderControls
├── ProgressBar
├── ThumbnailDrawer
└── AdminRoute (/admin) [lazy]
    └── AdminPanel
        ├── VolumeForm
        ├── Dropzone
        └── FileList
```

## File Statistics

| Category | Count |
|----------|-------|
| Components | 17 |
| Hooks | 9 |
| Stores | 3 |
| Types | ~15 interfaces |
| Config files | 8 |
| Total JS/JSX/TS/TSX | ~50 files |

## Naming Conventions

- Components: PascalCase (`Book.tsx`, `VolumeSelector.jsx`)
- Hooks: camelCase with `use` prefix (`useAuth.js`, `useReaderHooks.js`)
- Stores: camelCase (`authStore.js`, `useReaderStore.js`)
- Config: camelCase or kebab-case (`eslint.config.js`, `vite.config.js`)