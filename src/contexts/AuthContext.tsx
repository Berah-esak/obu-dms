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
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  'admin': { password: 'admin', user: { id: 'usr_001', username: 'admin', fullName: 'System Administrator', email: 'admin@obu.edu.et', role: 'system_admin', status: 'active' } },
  'dormadmin': { password: 'admin', user: { id: 'usr_002', username: 'dormadmin', fullName: 'Dorm Administrator', email: 'dorm.admin@obu.edu.et', role: 'dorm_admin', status: 'active' } },
  'student': { password: 'student', user: { id: 'usr_005', username: 'student', fullName: 'Alemu Bekele', email: 'alemu.bekele@obu.edu.et', role: 'student', status: 'active', studentId: 'OBU12345' } },
  'maintenance': { password: 'maint', user: { id: 'usr_003', username: 'maintenance', fullName: 'Abdi Musa', email: 'abdi@obu.edu.et', role: 'maintenance', status: 'active' } },
  'management': { password: 'mgmt', user: { id: 'usr_004', username: 'management', fullName: 'Management User', email: 'mgmt@obu.edu.et', role: 'management', status: 'active' } },
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
        setState({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
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
    const account = DEMO_ACCOUNTS[username];
    if (account && account.password === password) {
      const mockToken = 'demo-jwt-token';
      localStorage.setItem('dms_user', JSON.stringify(account.user));
      localStorage.setItem('dms_token', mockToken);
      setState({
        user: account.user,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('dms_user');
    localStorage.removeItem('dms_token');
    localStorage.removeItem('dms_refresh_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
