import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/authStore';
import './index.css';

import { trackEvent } from './analytics';

function App() {
  const location = useLocation();
  const { initAuth, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="App w-full h-[100dvh] overflow-hidden bg-background touch-none overscroll-none relative">
      <ErrorBoundary>
        {!user && <AuthModal />}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
}

export default App;