/**
 * ProtectedRoute — guards routes by role using JWT auth or demo session.
 */

import { Navigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ children, roles = null }) {
  const { user: authUser, loading, isAuthenticated } = useAuth();
  const { user: appUser } = useApp();
  const user = authUser || appUser;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader size={28} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
