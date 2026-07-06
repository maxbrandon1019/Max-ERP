import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-error';
import type { Department, Employee, Task } from '@/types';
import { useAudit } from './AuditContext';
import { useAuth } from './AuthContext';

interface HRContextType {
  departments: Department[];
  employees: Employee[];
  tasks: Task[];
  addDepartment: (name: string, headId: string | null) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  updateTaskProgress: (id: string, progress: number) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export function HRProvider({ children }: { children: ReactNode }) {
  const { logAction } = useAudit();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
      setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Department[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'departments');
    });
    const unsubEmps = onSnapshot(collection(db, 'employees'), (snapshot) => {
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'employees');
    });
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });
    return () => {
      unsubDepts();
      unsubEmps();
      unsubTasks();
    };
  }, []);

  const addDepartment = async (name: string, headId: string | null) => {
    try {
      await addDoc(collection(db, 'departments'), { name, headId });
      logAction('HR', 'Add Department', `Created department "${name}"`);
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async (emp: Omit<Employee, 'id'>) => {
    try {
      await addDoc(collection(db, 'employees'), emp);
      logAction('HR', 'Add Employee', `Added employee ${emp.name} to department ${emp.departmentId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      await addDoc(collection(db, 'tasks'), task);
      logAction('HR', 'Assign Task', `Assigned task "${task.title}" to employee ${task.assigneeId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      await updateDoc(doc(db, 'tasks', id), { status });
      logAction('HR', 'Update Task Status', `Updated task ${id} status to ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskProgress = async (id: string, progress: number) => {
    try {
      await updateDoc(doc(db, 'tasks', id), { progress });
      logAction('HR', 'Update Task Progress', `Updated task ${id} progress to ${progress}%`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HRContext.Provider value={{ departments, employees, tasks, addDepartment, addEmployee, addTask, updateTaskStatus, updateTaskProgress }}>
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
}
