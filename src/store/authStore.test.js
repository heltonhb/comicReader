import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase auth functions before imports
const mockOnAuthStateChanged = vi.fn();
const mockSignInWithPopup = vi.fn();
const mockSignInAnonymously = vi.fn();
const mockSignOut = vi.fn();

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mockOnAuthStateChanged,
  signInWithPopup: mockSignInWithPopup,
  signInAnonymously: mockSignInAnonymously,
  signOut: mockSignOut,
}));

vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// Create a simple mock for zustand
const createMockStore = (initialState) => {
  let state = { ...initialState };
  const listeners = new Set();

  const setState = (partial) => {
    state = { ...state, ...(typeof partial === 'function' ? partial(state) : partial) };
    listeners.forEach((l) => l(state));
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { setState, getState, subscribe };
};

// Dynamically import the store under test
let useAuthStore;

beforeEach(async () => {
  vi.clearAllMocks();
  mockOnAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null);
    return vi.fn();
  });

  // Re-import to reset module state
  vi.resetModules();
  const module = await import('../store/authStore');
  useAuthStore = module.useAuthStore;
});

describe('useAuthStore', () => {
  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it('should set loading to false when auth state changes', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    // Simulate initAuth
    useAuthStore.getState().initAuth();
    const state = useAuthStore.getState();

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('should call signInWithPopup on loginWithGoogle', async () => {
    const mockUser = { uid: '456' };
    mockSignInWithPopup.mockResolvedValue({ user: mockUser });

    await useAuthStore.getState().loginWithGoogle();

    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  it('should handle loginWithGoogle errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    mockSignInWithPopup.mockRejectedValue(new Error('Popup closed'));

    await useAuthStore.getState().loginWithGoogle();

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should call signInAnonymously on loginAnonymously', async () => {
    const mockUser = { uid: '789', isAnonymous: true };
    mockSignInAnonymously.mockResolvedValue({ user: mockUser });

    await useAuthStore.getState().loginAnonymously();

    expect(mockSignInAnonymously).toHaveBeenCalled();
  });

  it('should call signOut on logout', async () => {
    mockSignOut.mockResolvedValue(undefined);

    await useAuthStore.getState().logout();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should handle logout errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockRejectedValue(new Error('Sign out failed'));

    await useAuthStore.getState().logout();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
