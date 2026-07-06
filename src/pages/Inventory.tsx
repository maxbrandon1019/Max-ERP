import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '@/contexts/InventoryContext';
import type { InventoryItem } from '@/types';

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'PRD-001', name: 'Industrial Microcontroller A1', category: 'Electronics', quantity: 450, status: 'In Stock', lastUpdated: '2023-10-25' },
  { id: '2', sku: 'PRD-002', name: 'Copper Wiring Bundle (50m)', category: 'Raw Materials', quantity: 12, status: 'Low Stock', lastUpdated: '2023-10-24' },
  { id: '3', sku: 'PRD-003', name: 'Titanium Casing Model X', category: 'Hardware', quantity: 0, status: 'Out of Stock', lastUpdated: '2023-10-20' },
  { id: '4', sku: 'PRD-004', name: 'Thermal Paste (Bulk)', category: 'Consumables', quantity: 1250, status: 'In Stock', lastUpdated: '2023-10-25' },
  { id: '5', sku: 'PRD-005', name: 'Cooling Fan Unit 120mm', category: 'Components', quantity: 45, status: 'Low Stock', lastUpdated: '2023-10-22' },
];

export function Inventory() {
  const { items } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-sm text-slate-500">Track and manage stock levels across all warehouses.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
              placeholder="Search SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4 text-slate-500" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full",
                      item.status === 'In Stock' ? "bg-green-100 text-green-700" :
                      item.status === 'Low Stock' ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.lastUpdated}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="h-5 w-5 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-500">Showing 1 to 5 of 24 results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
