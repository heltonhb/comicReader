import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                // If no user is logged in, perform anonymous sign in
                signInAnonymously(auth).catch((error) => {
                    console.error("Error with anonymous auth:", error);
                    setError(error);
                    setLoading(false);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading, error };
}
