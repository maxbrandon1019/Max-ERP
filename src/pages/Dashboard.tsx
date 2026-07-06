import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Activity,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudit } from '@/contexts/AuditContext';
import { useAuth } from '@/contexts/AuthContext';
import { useHR } from '@/contexts/HRContext';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { logs } = useAudit();
  const { user } = useAuth();
  const { tasks, updateTaskProgress } = useHR();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const myTasks = tasks.filter(t => t.assigneeId === user?.id);

  const handleDownloadCSV = () => {
    const headers = ['Task ID', 'Title', 'Assignee ID', 'Status', 'Due Date', 'Progress'];
    const rows = tasks.map(t => [
      t.id, 
      `"${t.title.replace(/"/g, '""')}"`, 
      t.assigneeId, 
      t.status, 
      t.dueDate, 
      `${t.progress || 0}%`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'departmental_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Departmental Performance & Task Summary', 14, 15);
    
    const tableData = tasks.map(t => [
      t.id, 
      t.title, 
      t.assigneeId, 
      t.status, 
      t.dueDate, 
      `${t.progress || 0}%`
    ]);
    
    autoTable(doc, {
      startY: 20,
      head: [['Task ID', 'Title', 'Assignee ID', 'Status', 'Due Date', 'Progress']],
      body: tableData,
    });
    
    doc.save('departmental_report.pdf');
  };

  const [kpiData, setKpiData] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      time: i,
      inventory: 42 + (Math.random() - 0.5) * 2,
      payroll: 124500 + (Math.random() - 0.5) * 1000,
      employees: 842 + Math.floor((Math.random() - 0.5) * 2),
      revenue: 124563 + (Math.random() - 0.5) * 500,
    }));
  });

  useEffect(() => {
    const kpiInterval = setInterval(() => {
      setKpiData(prev => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        newData.push({
          time: last.time + 1,
          inventory: Math.max(10, last.inventory + (Math.random() - 0.5) * 1.5),
          payroll: Math.max(50000, last.payroll + (Math.random() - 0.5) * 800),
          employees: Math.max(100, last.employees + Math.floor((Math.random() - 0.5) * 2.5)),
          revenue: Math.max(10000, last.revenue + (Math.random() - 0.5) * 600)
        });
        return newData;
      });
    }, 2500);
    return () => clearInterval(kpiInterval);
  }, []);

  const [realTimeData, setRealTimeData] = useState(
    Array.from({ length: 20 }, (_, i) => {
      const time = new Date(Date.now() - (20 - i) * 2000);
      return {
        time: time.toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
        load: Math.floor(Math.random() * 40) + 30,
        requests: Math.floor(Math.random() * 1000) + 5000,
      };
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev.slice(1)];
        const lastLoad = prev[prev.length - 1].load;
        const lastReqs = prev[prev.length - 1].requests;
        
        newData.push({
          time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
          load: Math.max(10, Math.min(95, lastLoad + (Math.random() - 0.5) * 15)),
          requests: Math.max(1000, lastReqs + (Math.random() - 0.5) * 800),
        });
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your enterprise metrics and operations.</p>
        </div>
        <div className="flex gap-2">
          {isManager || isAdmin ? (
            <>
              <button 
                onClick={handleDownloadCSV}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> CSV Report
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> PDF Report
              </button>
            </>
          ) : null}
          <button 
            onClick={() => navigate('/finance')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            New Transaction
          </button>
        </div>
      </div>

      {/* Real-time KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <div className="p-2 bg-slate-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">
              ${kpiData[kpiData.length - 1].revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-12 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiData}>
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Active Employees</p>
            <div className="p-2 bg-slate-50 rounded-lg">
              <Users className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">
              {Math.round(kpiData[kpiData.length - 1].employees)}
            </p>
          </div>
          <div className="h-12 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData}>
                <Bar dataKey="employees" fill="#0ea5e9" radius={[2, 2, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payroll Costs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Payroll Costs</p>
            <div className="p-2 bg-slate-50 rounded-lg">
              <Activity className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">
              ${kpiData[kpiData.length - 1].payroll.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="h-12 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData}>
                <defs>
                  <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="payroll" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorPayroll)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Turnover */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Inventory Turnover</p>
            <div className="p-2 bg-slate-50 rounded-lg">
              <Package className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">
              {kpiData[kpiData.length - 1].inventory.toFixed(1)} <span className="text-sm text-slate-500 font-normal">units/day</span>
            </p>
          </div>
          <div className="h-12 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiData}>
                <Line type="stepAfter" dataKey="inventory" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Revenue Overview</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-900">Real-Time System Load</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realTimeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="load" name="CPU Load %" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity / Audit Logs */}
      {isAdmin ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Security Audit Logs</h3>
              <p className="text-sm text-slate-500">System-wide record of key administrative actions.</p>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Timestamp</th>
                  <th scope="col" className="px-6 py-3 font-medium">User</th>
                  <th scope="col" className="px-6 py-3 font-medium">Module</th>
                  <th scope="col" className="px-6 py-3 font-medium">Action</th>
                  <th scope="col" className="px-6 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{log.userName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">{log.module}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-slate-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">My Assigned Tasks</h3>
            <p className="text-sm text-slate-500">Update your progress on assigned items.</p>
          </div>
          <div className="overflow-x-auto">
            {myTasks.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                You have no assigned tasks.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">Task ID</th>
                    <th scope="col" className="px-6 py-3 font-medium">Title</th>
                    <th scope="col" className="px-6 py-3 font-medium">Due Date</th>
                    <th scope="col" className="px-6 py-3 font-medium">Status</th>
                    <th scope="col" className="px-6 py-3 font-medium w-64">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myTasks.map((task) => (
                    <tr key={task.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{task.id}</td>
                      <td className="px-6 py-4 text-slate-900">{task.title}</td>
                      <td className="px-6 py-4 text-slate-600">{task.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-full",
                          task.status === 'Completed' ? "bg-green-100 text-green-700" :
                          task.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress || 0}
                            onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-xs font-medium text-slate-600 w-8">{task.progress || 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
