import '@testing-library/jest-dom';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return vi.fn();
  }),
  signInWithPopup: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(function() {
    this.setCustomParameters = vi.fn().mockReturnValue(this);
  }),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    VITE_GA_MEASUREMENT_ID: undefined,
    DEV: true,
    PROD: false,
  },
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock document.fullscreen
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true,
});

document.exitFullscreen = vi.fn(() => Promise.resolve());
Object.defineProperty(document.documentElement, 'requestFullscreen', {
  value: vi.fn(() => Promise.resolve()),
  writable: true,
});
