import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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

  // fire a page_view event on route change
  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="App w-full h-[100dvh] overflow-hidden bg-background touch-none overscroll-none relative">
      <ErrorBoundary>
        {!user && <AuthModal />}
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
