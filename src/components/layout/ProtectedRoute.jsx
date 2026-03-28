import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/** Redirects to /login if not authenticated, or to / if role doesn't match */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
