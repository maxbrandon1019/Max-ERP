import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<User['role'], User> = {
  admin: { id: 'U-1', name: 'System Admin', email: 'admin@nexus.local', role: 'admin' },
  manager: { id: 'U-2', name: 'Operations Manager', email: 'manager@nexus.local', role: 'manager', departmentId: 'D-2' },
  employee: { id: 'U-3', name: 'Staff Member', email: 'staff@nexus.local', role: 'employee', departmentId: 'D-2' },
};

const ROLE_PERMISSIONS: Record<User['role'], string[]> = {
  admin: ['dashboard', 'inventory', 'hr', 'finance', 'settings'],
  manager: ['dashboard', 'inventory', 'hr'],
  employee: ['dashboard', 'inventory'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS.admin);

  const login = (role: User['role']) => {
    setUser(MOCK_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (module: string) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(module);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
