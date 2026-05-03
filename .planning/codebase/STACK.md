# Stack - Gibiteca HQ

## Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 7.2.4 | Build tool |
| TypeScript | 5.8.3 | Type safety |
| Zustand | 5.0.11 | State management |
| Firebase | 12.9.0 | Auth & Storage |
| Framer Motion | 12.33.0 | Animations |
| react-pageflip | 2.0.3 | Flipbook effect |
| react-virtuoso | 4.18.1 | Virtualization |
| react-router-dom | 7.13.0 | Routing |
| Tailwind CSS | 3.4.17 | Styling |

## Dev Tools

| Tool | Purpose |
|------|---------|
| Vitest | Testing |
| ESLint 9 | Linting |
| Prettier | Formatting |
| Vite PWA | Offline support |

## Dependencies Summary

- **UI**: React 18, Framer Motion, Lucide React
- **State**: Zustand (3 stores)
- **Auth**: Firebase Auth (Google + Anonymous)
- **Storage**: Firebase Storage
- **Reading**: react-pageflip, react-zoom-pan-pinch
- **Analytics**: Mixpanel, Google Analytics 4

## Build Commands

```
npm run dev      # Development
npm run build    # Production (converts PDFs first)
npm run build:fast  # Skip PDF conversion
npm run lint     # Linting
npm run test     # Tests
```