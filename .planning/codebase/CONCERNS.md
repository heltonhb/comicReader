# Concerns - Gibiteca HQ

## Technical Concerns

### 1. High Coupling in Book.tsx

- **Issue**: Book component depends on 5+ hooks directly
- **Impact**: Hard to test, maintain, refactor
- **Mitigation**: useBookController extracted (recent refactor)

### 2. Hardcoded Volumes

- **Issue**: volumes.js contains hardcoded volume list
- **Impact**: Add volume = edit code + rebuild
- **Mitigation**: Added useVolumes hook + public/volumes.json

### 3. No TypeScript on Most Components

- **Issue**: Most files still .jsx (no type checking)
- **Impact**: Runtime errors, no autocomplete
- **Mitigation**: Started converting to .tsx (Book.tsx done)

### 4. Missing Test Coverage

- **Issue**: Only 4 test files, main components untested
- **Impact**: Regression risk
- **Mitigation**: Added Book.test.tsx, VolumeSelector.test.jsx

## Security Concerns

### 1. Firebase Rules

- **Status**: Should review storage rules for uploaded volumes
- **Action**: Audit Firestore/Storage rules

### 2. Environment Variables

- **Status**: GA_ID is optional (graceful fallback)
- **Action**: Ensure no secrets in client-side code

## Performance Concerns

### 1. Image Loading

- **Impact**: Large WebP files may slow initial load
- **Mitigation**: useImagePreloader hook exists

### 2. Bundle Size

- **Status**: Not measured
- **Action**: Run bundle analysis

## Maintenance Concerns

### 1. Dependency Updates

- **Risk**: Firebase, React, Vite update frequently
- **Action**: Regular dependency audit

### 2. PWA Configuration

- **Status**: Basic setup, could improve offline caching
- **Action**: Review cache strategies

## Roadmap Considerations

- [ ] Convert remaining .jsx to .tsx
- [ ] Add more component tests
- [ ] Set up CI for tests
- [ ] Bundle size monitoring
- [ ] Firebase security rules audit
- [ ] Consider React Query for data fetching