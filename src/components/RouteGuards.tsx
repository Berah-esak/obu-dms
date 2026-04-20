import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/api';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicOnly = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, getDefaultRoute } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Checking session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return children;
};

export const RequireRole = ({
  roles,
  children,
}: {
  roles: UserRole[];
  children: JSX.Element;
}) => {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
