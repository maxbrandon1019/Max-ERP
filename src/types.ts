export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  departmentId?: string;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: 'admin' | 'manager' | 'employee';
  position: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  progress?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'Completed' | 'Pending' | 'Failed';
}

