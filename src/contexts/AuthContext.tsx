import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  'admin': { password: 'admin123', user: { id: 'usr_001', username: 'admin', fullName: 'System Administrator', email: 'admin@obu.edu.et', role: 'system_admin', status: 'active' } },
  'dorm.admin': { password: 'admin123', user: { id: 'usr_002', username: 'dorm.admin', fullName: 'Dorm Administrator', email: 'dorm.admin@obu.edu.et', role: 'dorm_admin', status: 'active' } },
  'student': { password: 'student123', user: { id: 'usr_005', username: 'student', fullName: 'Alemu Bekele', email: 'alemu.bekele@obu.edu.et', role: 'student', status: 'active', studentId: 'OBU12345' } },
  'maintenance': { password: 'maint123', user: { id: 'usr_003', username: 'maintenance', fullName: 'Abdi Musa', email: 'abdi@obu.edu.et', role: 'maintenance', status: 'active' } },
  'management': { password: 'mgmt123', user: { id: 'usr_004', username: 'management', fullName: 'Management User', email: 'mgmt@obu.edu.et', role: 'management', status: 'active' } },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const login = useCallback(async (username: string, password: string) => {
    const account = DEMO_ACCOUNTS[username];
    if (account && account.password === password) {
      setState({
        user: account.user,
        token: 'mock-jwt-token',
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
