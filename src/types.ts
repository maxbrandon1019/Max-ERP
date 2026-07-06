export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  departmentId?: string;
  organizationIds: string[]; // Organizations the user has access to
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
  organizationId: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string | null;
  organizationId: string;
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
  organizationId: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  progress?: number;
  organizationId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  organizationId: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'Completed' | 'Pending' | 'Failed';
  organizationId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  organizationId: string;
}


