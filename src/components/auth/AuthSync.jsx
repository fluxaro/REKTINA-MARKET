import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';

/** Syncs JWT auth user into AppContext (cart, toasts, etc.). One-way only. */
export default function AuthSync() {
  const { user: authUser, isAuthenticated } = useAuth();
  const { user: appUser, login } = useApp();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      if (!appUser || appUser.id !== authUser.id || appUser.email !== authUser.email) {
        login(authUser, true);
      }
    }
  }, [isAuthenticated, authUser, appUser, login]);

  return null;
}
