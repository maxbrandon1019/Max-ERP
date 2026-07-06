import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-error';
import type { Transaction, Invoice } from '@/types';
import { useAudit } from './AuditContext';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  transactions: Transaction[];
  invoices: Invoice[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { logAction } = useAudit();
  const { activeOrganization } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!activeOrganization) {
      setTransactions([]);
      setInvoices([]);
      return;
    }
    const unsubTrx = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      let trxs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
      trxs = trxs.filter(t => t.organizationId === activeOrganization.id);
      setTransactions(trxs.sort((a, b) => b.date.localeCompare(a.date)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });

    const unsubInv = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      let invs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[];
      invs = invs.filter(i => i.organizationId === activeOrganization.id);
      setInvoices(invs.sort((a, b) => b.date.localeCompare(a.date)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'invoices');
    });

    return () => {
      unsubTrx();
      unsubInv();
    };
  }, [activeOrganization]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!activeOrganization) return;
    try {
      await addDoc(collection(db, 'transactions'), { ...transaction, organizationId: activeOrganization.id });
      logAction('Finance', 'Add Transaction', `Added ${transaction.type} transaction of $${transaction.amount}`);
    } catch (error) {
      console.error(error);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    if (!activeOrganization) return;
    try {
      await addDoc(collection(db, 'invoices'), { ...invoice, organizationId: activeOrganization.id });
      logAction('Finance', 'Create Invoice', `Created invoice ${invoice.invoiceNumber} for ${invoice.customerName}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FinanceContext.Provider value={{ transactions, invoices, addTransaction, addInvoice }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
