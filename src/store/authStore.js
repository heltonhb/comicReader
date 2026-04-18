import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuth: () => {
    return onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  loginWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  },

  loginAnonymously: async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous login error:', error);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}));
