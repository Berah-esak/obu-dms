import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/types/api';
import { apiService } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
  getDefaultRoute: () => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const normalizeRole = (role?: string): UserRole => {
  const normalized = String(role || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  const mapping: Record<string, UserRole> = {
    student: 'student',
    dorm_admin: 'dorm_admin',
    maintenance_staff: 'maintenance',
    maintenance: 'maintenance',
    management: 'management',
    system_admin: 'system_admin',
  };

  return mapping[normalized] || 'student';
};

const normalizeStatus = (status?: string): 'active' | 'inactive' => {
  return String(status || '').toLowerCase() === 'inactive' ? 'inactive' : 'active';
};

const normalizeUser = (user: User): User => ({
  ...user,
  role: normalizeRole(user.role),
  status: normalizeStatus(user.status),
});

const defaultRouteByRole = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/dashboard';
    case 'maintenance':
      return '/maintenance';
    case 'dorm_admin':
    case 'management':
    case 'system_admin':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshSession = useCallback(async () => {
    const storedToken = localStorage.getItem('dms_token');
    const storedUser = localStorage.getItem('dms_user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        const normalizedUser = normalizeUser(parsedUser);
        const validation = await apiService.validateSession();
        if (validation.success && validation.data?.valid) {
          setState({
            user: normalizedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      }
    }
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await apiService.login(username, password);
    if (result.success && result.data) {
      const normalizedUser = normalizeUser(result.data.user);

      localStorage.setItem('dms_user', JSON.stringify(normalizedUser));
      localStorage.setItem('dms_token', result.data.token);
      if (result.data.refreshToken) {
        localStorage.setItem('dms_refresh_token', result.data.refreshToken);
      }
      setState({
        user: normalizedUser,
        token: result.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await apiService.logout();
    localStorage.removeItem('dms_user');
    localStorage.removeItem('dms_token');
    localStorage.removeItem('dms_refresh_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  const getDefaultRoute = useCallback(() => {
    return state.user ? defaultRouteByRole(state.user.role) : '/dashboard';
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole, refreshSession, getDefaultRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
