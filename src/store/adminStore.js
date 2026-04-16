import { create } from 'zustand';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Zustand store for admin panel state
 * Provides volume CRUD operations for Firestore
 */
export const useAdminStore = create((set, get) => ({
  volumes: [],
  loading: false,
  error: null,

  // Fetch all volumes from Firestore
  fetchVolumes: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'volumes'));
      const volumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ volumes, loading: false });
    } catch (error) {
      console.error('Error fetching volumes:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Create a new volume in Firestore
  createVolume: async (volumeData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, 'volumes'), {
        ...volumeData,
        createdAt: new Date().toISOString()
      });
      const newVolume = { id: docRef.id, ...volumeData };
      set(state => ({
        volumes: [...state.volumes, newVolume],
        loading: false
      }));
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating volume:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete a volume from Firestore
  deleteVolume: async (volumeId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'volumes', volumeId));
      set(state => ({
        volumes: state.volumes.filter(v => v.id !== volumeId),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting volume:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Update an existing volume
  updateVolume: async (volumeId, volumeData) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, 'volumes', volumeId), {
        ...volumeData,
        updatedAt: new Date().toISOString()
      });
      set(state => ({
        volumes: state.volumes.map(v => 
          v.id === volumeId ? { ...v, ...volumeData } : v
        ),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error updating volume:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAdminStore;