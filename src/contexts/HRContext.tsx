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
  const { activeOrganization } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!activeOrganization) {
      setDepartments([]);
      setEmployees([]);
      setTasks([]);
      return;
    }
    const unsubDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
      let depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Department[];
      depts = depts.filter(d => d.organizationId === activeOrganization.id);
      setDepartments(depts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'departments');
    });
    const unsubEmps = onSnapshot(collection(db, 'employees'), (snapshot) => {
      let emps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
      emps = emps.filter(e => e.organizationId === activeOrganization.id);
      setEmployees(emps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'employees');
    });
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      let tsks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
      tsks = tsks.filter(t => t.organizationId === activeOrganization.id);
      setTasks(tsks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });
    return () => {
      unsubDepts();
      unsubEmps();
      unsubTasks();
    };
  }, [activeOrganization]);

  const addDepartment = async (name: string, headId: string | null) => {
    if (!activeOrganization) return;
    try {
      await addDoc(collection(db, 'departments'), { name, headId, organizationId: activeOrganization.id });
      logAction('HR', 'Add Department', `Created department "${name}"`);
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async (emp: Omit<Employee, 'id'>) => {
    if (!activeOrganization) return;
    try {
      await addDoc(collection(db, 'employees'), { ...emp, organizationId: activeOrganization.id });
      logAction('HR', 'Add Employee', `Added employee ${emp.name} to department ${emp.departmentId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!activeOrganization) return;
    try {
      await addDoc(collection(db, 'tasks'), { ...task, organizationId: activeOrganization.id });
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
