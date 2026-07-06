import React, { useState } from 'react';
import { UserPlus, Search, Filter, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHR } from '@/contexts/HRContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Employee, Task, Department } from '@/types';

export function HumanResources() {
  const { departments, employees, tasks, addDepartment, addEmployee, addTask, updateTaskStatus } = useHR();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // Form states
  const [newEmp, setNewEmp] = useState({ name: '', email: '', position: '', role: 'employee' as const, departmentId: '' });
  const [newDept, setNewDept] = useState({ name: '', headId: '' });
  const [newTask, setNewTask] = useState({ title: '', assigneeId: '' });

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  // Filter employees based on role
  const visibleEmployees = employees.filter(emp => {
    if (isAdmin) return true;
    if (isManager) return emp.departmentId === user?.departmentId;
    return emp.id === user?.id; // employee sees only themselves? or maybe employees shouldn't even be here. AuthContext says 'employee' doesn't have HR permission, so they won't reach this page!
  }).filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      ...newEmp,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      departmentId: isAdmin ? newEmp.departmentId : user?.departmentId || ''
    });
    setShowAddEmployee(false);
    setNewEmp({ name: '', email: '', position: '', role: 'employee', departmentId: '' });
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment(newDept.name, newDept.headId || null);
    setShowAddDept(false);
    setNewDept({ name: '', headId: '' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...newTask,
      status: 'Pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +7 days
    });
    setShowAddTask(false);
    setNewTask({ title: '', assigneeId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Human Resources</h1>
          <p className="text-sm text-slate-500">Manage employee records, departments, and onboarding.</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button 
              onClick={() => setShowAddDept(true)}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Building className="h-4 w-4" />
              Add Department
            </button>
          )}
          <button 
            onClick={() => setShowAddEmployee(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {showAddDept && isAdmin && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">New Department</h3>
          <form onSubmit={handleAddDept} className="flex gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department Name</label>
              <input required type="text" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department Head</label>
              <select value={newDept.headId} onChange={e => setNewDept({...newDept, headId: e.target.value})} className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none">
                <option value="">None</option>
                {employees.filter(e => e.role === 'manager' || e.role === 'admin').map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
            <button type="button" onClick={() => setShowAddDept(false)} className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
          </form>
        </div>
      )}

      {showAddEmployee && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">New Employee</h3>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input required type="text" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input required type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Position</label>
              <input required type="text" value={newEmp.position} onChange={e => setNewEmp({...newEmp, position: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            {isAdmin && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <select required value={newEmp.departmentId} onChange={e => setNewEmp({...newEmp, departmentId: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none">
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
              <select value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value as any})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                {isAdmin && <option value="admin">Admin</option>}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
              <button type="button" onClick={() => setShowAddEmployee(false)} className="flex-1 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Employee List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-900">Employee Directory</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search name..." 
                  className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {visibleEmployees.map(emp => {
                const dept = departments.find(d => d.id === emp.departmentId);
                return (
                  <div key={emp.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 shrink-0 uppercase">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-slate-900">{emp.name} <span className="text-xs text-slate-400 ml-1">({emp.role})</span></p>
                      <p className="text-xs text-slate-500">{emp.position} • {dept?.name || 'No Dept'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
                        emp.status === 'Active' ? "bg-green-100 text-green-700" :
                        emp.status === 'On Leave' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {emp.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{emp.id}</span>
                    </div>
                  </div>
                );
              })}
              {visibleEmployees.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No employees found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Employee Details / Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Department Overview</h3>
            <div className="space-y-4">
              {departments.map(dept => {
                const count = employees.filter(e => e.departmentId === dept.id).length;
                const total = employees.length || 1;
                const percent = (count / total) * 100;
                return (
                  <div key={dept.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{dept.name}</span>
                      <span className="font-medium text-slate-900">{count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                Tasks
              </h3>
              {(isAdmin || isManager) && (
                <button 
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {showAddTask ? 'Cancel' : '+ Assign Task'}
                </button>
              )}
            </div>
            
            {showAddTask && (
              <form onSubmit={handleAddTask} className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Task Title</label>
                  <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assignee</label>
                  <select required value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})} className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 outline-none">
                    <option value="">Select Employee</option>
                    {visibleEmployees.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Assign</button>
              </form>
            )}

            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {tasks.filter(t => visibleEmployees.some(e => e.id === t.assigneeId)).map(task => {
                const assignee = employees.find(e => e.id === task.assigneeId);
                return (
                  <div key={task.id} className="text-sm border border-slate-100 rounded-lg p-3 shadow-sm">
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">For: {assignee?.name || 'Unknown'}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        task.status === 'Completed' ? "bg-green-100 text-green-700" :
                        task.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
