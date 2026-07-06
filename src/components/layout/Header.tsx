import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User as UserIcon, CheckSquare, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHR } from '@/contexts/HRContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { user, login, activeOrganization, organizations, setActiveOrganization } = useAuth();
  const { employees, tasks } = useHR();
  const { items: inventory } = useInventory();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  const hasResults = filteredEmployees.length > 0 || filteredTasks.length > 0 || filteredInventory.length > 0;

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-slate-200">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="hidden sm:flex max-w-md w-full relative" ref={searchRef}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search across all modules..."
            />
            {isSearchOpen && searchTerm.length > 1 && (
              <div className="absolute top-full mt-2 w-full max-w-md bg-white rounded-md shadow-lg border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                {hasResults ? (
                  <div className="py-2">
                    {filteredEmployees.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Employees</h3>
                        <ul className="space-y-1">
                          {filteredEmployees.map(emp => (
                            <li key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer" onClick={() => { navigate('/hr'); setIsSearchOpen(false); }}>
                              <UserIcon className="h-4 w-4 text-indigo-500" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                                <p className="text-xs text-slate-500">{emp.position}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {filteredTasks.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tasks</h3>
                        <ul className="space-y-1">
                          {filteredTasks.map(task => (
                            <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer" onClick={() => { navigate('/hr'); setIsSearchOpen(false); }}>
                              <CheckSquare className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                                <p className="text-xs text-slate-500">Status: {task.status}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {filteredInventory.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inventory Items</h3>
                        <ul className="space-y-1">
                          {filteredInventory.map(item => (
                            <li key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer" onClick={() => { navigate('/inventory'); setIsSearchOpen(false); }}>
                              <Package className="h-4 w-4 text-amber-500" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-500">SKU: {item.sku} &middot; Qty: {item.quantity}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          <div className="hidden md:flex items-center gap-2 border-r border-slate-200 pr-4">
            <span className="text-xs font-medium text-slate-500">Org:</span>
            <select
              value={activeOrganization?.id || ''}
              onChange={(e) => setActiveOrganization(e.target.value)}
              className="text-sm border-0 bg-slate-50 rounded-md py-1 pl-2 pr-8 text-slate-700 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex items-center gap-2 border-r border-slate-200 pr-4">
            <span className="text-xs font-medium text-slate-500">View as:</span>
            <select 
              value={user?.role}
              onChange={(e) => login(e.target.value as User['role'])}
              className="text-sm border-0 bg-slate-50 rounded-md py-1 pl-2 pr-8 text-slate-700 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button
            type="button"
            className="relative rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
