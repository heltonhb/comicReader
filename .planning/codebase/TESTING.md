# Testing - Gibiteca HQ

## Test Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| @testing-library/react | React testing |
| @testing-library/user-event | User interactions |
| jsdom | DOM environment |

## Test Files Location

- Co-located with components: `src/components/*.test.tsx`
- Store tests: `src/store/*.test.js`
- Setup: `src/test/setup.js`

## Running Tests

```bash
npm run test           # Watch mode
npm run test -- --run  # Single run
npm run test:coverage  # With coverage
npm run test:ui        # UI mode
```

## Test Patterns

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Book from './Book';

vi.mock('../hooks/useBookController', () => ({
  useBookController: () => ({ /* mock return */ })
}));

describe('Book', () => {
  it('renders without crashing', () => {
    render(<Book volume={mockVolume} />, { wrapper: BrowserRouter });
  });
});
```

### Store Testing

```javascript
import { useAuthStore } from './authStore';

describe('authStore', () => {
  it('sets user on auth state change', () => {
    const { setState } = useAuthStore;
    // Test state changes
  });
});
```

## Test Coverage

Currently covers:
- VolumeSelector (3 tests)
- Book (2 tests)
- authStore (7 tests)
- useReaderStore (14 tests)

## Mock Patterns

- Firebase: Mocked in `src/test/setup.js`
- localStorage: Mocked in setup
- Fullscreen API: Mocked in setup