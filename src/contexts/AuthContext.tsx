import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import type { User, Organization } from '@/types';

interface AuthContextType {
  user: User | null;
  activeOrganization: Organization | null;
  organizations: Organization[];
  setActiveOrganization: (orgId: string) => void;
  login: (role: User['role']) => void;
  logout: () => void;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'ORG-1', name: 'Max Foods Sdn Bhd' },
  { id: 'ORG-2', name: 'Max Semiconductor Bhd' }
];

const MOCK_USERS: Record<User['role'], User> = {
  admin: { id: 'U-1', name: 'System Admin', email: 'admin@nexus.local', role: 'admin', organizationIds: ['ORG-1', 'ORG-2'] },
  manager: { id: 'U-2', name: 'Operations Manager', email: 'manager@nexus.local', role: 'manager', departmentId: 'D-2', organizationIds: ['ORG-1'] },
  employee: { id: 'U-3', name: 'Staff Member', email: 'staff@nexus.local', role: 'employee', departmentId: 'D-2', organizationIds: ['ORG-1'] },
};

const ROLE_PERMISSIONS: Record<User['role'], string[]> = {
  admin: ['dashboard', 'inventory', 'hr', 'finance', 'settings'],
  manager: ['dashboard', 'inventory', 'hr'],
  employee: ['dashboard', 'inventory'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS.admin);
  const [activeOrganization, setActiveOrganizationState] = useState<Organization | null>(MOCK_ORGANIZATIONS[0]);

  const setActiveOrganization = (orgId: string) => {
    const org = MOCK_ORGANIZATIONS.find(o => o.id === orgId);
    if (org) {
      setActiveOrganizationState(org);
    }
  };

  const login = (role: User['role']) => {
    const newUser = MOCK_USERS[role];
    setUser(newUser);
    const userOrgs = MOCK_ORGANIZATIONS.filter(o => newUser.organizationIds.includes(o.id));
    if (userOrgs.length > 0) {
      setActiveOrganizationState(userOrgs[0]);
    } else {
      setActiveOrganizationState(null);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveOrganizationState(null);
  };

  const hasPermission = (module: string) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(module);
  };

  const organizations = user ? MOCK_ORGANIZATIONS.filter(o => user.organizationIds.includes(o.id)) : [];

  return (
    <AuthContext.Provider value={{ user, activeOrganization, organizations, setActiveOrganization, login, logout, hasPermission }}>
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
