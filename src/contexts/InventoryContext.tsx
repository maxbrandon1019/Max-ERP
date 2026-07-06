import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-error';
import type { InventoryItem } from '@/types';
import { useAudit } from './AuditContext';
import { useAuth } from './AuthContext';

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItemStatus: (id: string, status: InventoryItem['status']) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { logAction } = useAudit();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InventoryItem[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inventory');
    });
    return () => unsub();
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      await addDoc(collection(db, 'inventory'), item);
      logAction('Inventory', 'Add Item', `Added inventory item "${item.name}"`);
    } catch (error) {
      console.error(error);
    }
  };

  const updateItemStatus = async (id: string, status: InventoryItem['status']) => {
    try {
      await updateDoc(doc(db, 'inventory', id), { status });
      logAction('Inventory', 'Update Status', `Updated item ${id} status to ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItemStatus }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
