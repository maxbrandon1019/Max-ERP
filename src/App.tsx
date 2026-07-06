/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { HumanResources } from './pages/HumanResources';
import { Finance } from './pages/Finance';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HRProvider } from './contexts/HRContext';
import { AuditProvider } from './contexts/AuditContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { FinanceProvider } from './contexts/FinanceContext';

function ProtectedRoute({ module }: { module: string }) {
  const { user, hasPermission } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;
  if (!hasPermission(module)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Access Denied</h2>
        <p>Your current role ({user.role}) does not have permission to access the {module} module.</p>
      </div>
    );
  }
  
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <HRProvider>
          <InventoryProvider>
            <FinanceProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="inventory" element={<ProtectedRoute module="inventory" />}>
                      <Route index element={<Inventory />} />
                    </Route>
                    <Route path="hr" element={<ProtectedRoute module="hr" />}>
                      <Route index element={<HumanResources />} />
                    </Route>
                    <Route path="finance" element={<ProtectedRoute module="finance" />}>
                      <Route index element={<Finance />} />
                    </Route>
                    <Route path="settings" element={<ProtectedRoute module="settings" />}>
                      <Route index element={<div className="p-6 text-slate-500">Settings module under construction.</div>} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </FinanceProvider>
          </InventoryProvider>
        </HRProvider>
      </AuditProvider>
    </AuthProvider>
  );
}
