import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  CircleDollarSign, 
  Settings, 
  Menu, 
  X,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Inventory', path: '/inventory', icon: Package, id: 'inventory' },
  { name: 'Human Resources', path: '/hr', icon: Users, id: 'hr' },
  { name: 'Finance', path: '/finance', icon: CircleDollarSign, id: 'finance' },
  { name: 'Settings', path: '/settings', icon: Settings, id: 'settings' },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">Nexus ERP</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-1">
          {navItems.filter(item => hasPermission(item.id)).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          {user && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
