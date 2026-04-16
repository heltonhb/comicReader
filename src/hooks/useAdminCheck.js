import { useState, useEffect } from 'react';
import { getIdTokenResult } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to check admin privileges via Firebase Custom Claims
 * Returns { isAdmin: boolean, loading: boolean }
 */
export const useAdminCheck = () => {
  const { user } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(user, true);
        const claims = tokenResult.claims;
        setIsAdmin(claims.admin === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};

export default useAdminCheck;