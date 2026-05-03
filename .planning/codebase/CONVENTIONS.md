# Conventions - Gibiteca HQ

## Code Style

### ESLint Rules

- `no-var`: error (use const/let)
- `prefer-const`: warn
- `react-refresh/only-export-components`: warn
- `no-unused-vars`: off (TypeScript handles)

### Formatting

- Prettier configured
- Run `npm run format` or `npm run format:check`

## Component Patterns

### Functional Components

```jsx
// Default - use function declaration
const Book = ({ volume, onBack }) => {
  // ...
};

// Or arrow function with explicit return type (TypeScript)
const Book: React.FC<BookProps> = ({ volume, onBack }) => {
  return <div>...</div>;
};
```

### Hooks

```javascript
// Custom hook - prefix with 'use'
export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  return { user, login, logout };
};
```

### State Management

```javascript
// Zustand store pattern
import { create } from 'zustand';

export const useReaderStore = create((set) => ({
  isZoomed: false,
  setIsZoomed: (value) => set({ isZoomed: value }),
}));
```

## Import Patterns

```javascript
// Relative imports for project code
import Book from './components/Book';
import { useAuth } from './hooks/useAuth';

// Absolute imports via @ alias
import { Volume } from '@/types';
```

## File Organization

- One component per file
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`
- Types in `src/types/index.ts` or co-located

## React Patterns

- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations
- Use `React.lazy()` for code splitting routes

## CSS/Tailwind

- Utility classes via Tailwind CSS
- Custom colors: `#D4AF37` (gold), `#1a1a1a` (dark bg)
- Use `lucide-react` for icons