import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-error';
import type { AuditLog } from '@/types';
import { useAuth } from './AuthContext';

interface AuditContextType {
  logs: AuditLog[];
  logAction: (module: string, action: string, details: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user, activeOrganization } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!activeOrganization) {
      setLogs([]);
      return;
    }
    const q = query(
      collection(db, 'audit_logs'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditLog[];
      // Client-side filtering if missing index, though better is where() but we keep it simple
      logsData = logsData.filter(l => l.organizationId === activeOrganization.id);
      setLogs(logsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'audit_logs');
    });
    return () => unsubscribe();
  }, [activeOrganization]);

  const logAction = async (module: string, action: string, details: string) => {
    if (!user || !activeOrganization) return;
    try {
      await addDoc(collection(db, 'audit_logs'), {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        action,
        module,
        details,
        organizationId: activeOrganization.id
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'audit_logs');
    }
  };

  return (
    <AuditContext.Provider value={{ logs, logAction }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
