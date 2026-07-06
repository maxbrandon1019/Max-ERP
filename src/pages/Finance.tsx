import React from 'react';
import { Download, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-1092', date: '2023-10-25', description: 'Client Invoice - TechCorp', amount: 15400.00, type: 'income', status: 'Completed' },
  { id: 'TRX-1091', date: '2023-10-24', description: 'Server Hosting (AWS)', amount: 2150.00, type: 'expense', status: 'Completed' },
  { id: 'TRX-1090', date: '2023-10-24', description: 'Office Supplies', amount: 345.50, type: 'expense', status: 'Completed' },
  { id: 'TRX-1089', date: '2023-10-23', description: 'Client Invoice - Globex', amount: 8900.00, type: 'income', status: 'Pending' },
  { id: 'TRX-1088', date: '2023-10-22', description: 'Software Licenses', amount: 1200.00, type: 'expense', status: 'Completed' },
];

export function Finance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & Accounting</h1>
          <p className="text-sm text-slate-500">Monitor cash flow, transactions, and financial reports.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Create Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">$428,500.00</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +2.4%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Monthly Income</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">$84,320.00</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12.1%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Monthly Expenses</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">$32,150.00</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -1.5%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Transaction ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="bg-white hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{trx.id}</td>
                  <td className="px-6 py-4 text-slate-600">{trx.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{trx.description}</td>
                  <td className={cn(
                    "px-6 py-4 text-right font-medium",
                    trx.type === 'income' ? "text-green-600" : "text-slate-900"
                  )}>
                    {trx.type === 'income' ? '+' : '-'}${trx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-md",
                      trx.status === 'Completed' ? "bg-slate-100 text-slate-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileText className="h-5 w-5 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
