import React, { useState } from 'react';
import { Download, ArrowUpRight, ArrowDownRight, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction, Invoice } from '@/types';
import { useFinance } from '@/contexts/FinanceContext';

export function Finance() {
  const { transactions, invoices, addTransaction, addInvoice } = useFinance();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = 428500 + totalIncome - totalExpense;

  const handleCreateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addTransaction({
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      type: formData.get('type') as 'income' | 'expense',
      status: 'Completed',
    });
    setShowTransactionModal(false);
  };

  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addInvoice({
      invoiceNumber: formData.get('invoiceNumber') as string,
      customerName: formData.get('customerName') as string,
      date: formData.get('date') as string,
      dueDate: formData.get('dueDate') as string,
      amount: parseFloat(formData.get('amount') as string),
      status: 'Draft',
    });
    setShowInvoiceModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & Accounting</h1>
          <p className="text-sm text-slate-500">Monitor cash flow, transactions, and financial reports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTransactionModal(true)}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Transaction
          </button>
          <button 
            onClick={() => setShowInvoiceModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Create Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +2.4%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12.1%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -1.5%
            </span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto h-96">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-500">No transactions</td></tr>
                ) : (
                  transactions.map((trx) => (
                    <tr key={trx.id} className="bg-white hover:bg-slate-50 transition-colors">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-900">Invoices</h3>
          </div>
          <div className="overflow-x-auto h-96">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Inv #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-slate-500">No invoices</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{inv.customerName}</td>
                      <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-md",
                          inv.status === 'Paid' ? "bg-green-100 text-green-700" :
                          inv.status === 'Overdue' ? "bg-red-100 text-red-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showTransactionModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">New Transaction</h3>
            </div>
            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" name="date" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input type="text" name="description" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input type="number" step="0.01" name="amount" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select name="type" className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowTransactionModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Create Invoice</h3>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
                <input type="text" name="invoiceNumber" required placeholder="INV-001" className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input type="text" name="customerName" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" name="date" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" name="dueDate" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input type="number" step="0.01" name="amount" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
