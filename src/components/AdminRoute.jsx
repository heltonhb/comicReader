import { Navigate, Outlet } from 'react-router-dom';
import { useAdminCheck } from '../useAdminCheck';

// Component for loading state
const LoadingSpinner = () => (
  <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center text-white">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-white/10" />
      <div className="absolute w-16 h-16 rounded-full border-t-2 border-[#D4AF37] animate-spin" />
    </div>
    <p className="mt-20 text-[#D4AF37] tracking-widest text-sm uppercase">Verificando Acesso...</p>
  </div>
);

/**
 * AdminRoute - Route protection wrapper component
 * Wraps child routes and verifies admin privileges via custom claims
 * Non-admin users are redirected to home page
 */
const AdminRoute = () => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;