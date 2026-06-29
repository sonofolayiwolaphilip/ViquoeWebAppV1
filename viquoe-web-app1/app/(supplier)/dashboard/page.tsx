import React from "react";
import ActiveRfqList from "@/components/supplier/ActiveRfqList";

export default function SupplierDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Context */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Supplier Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Manage your institutional quotes and pipeline here.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-xs font-medium text-emerald-800">Account Status: Fully Verified</span>
        </div>
      </div>

      {/* Mini Performance Tracker metrics */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Submitted Bids</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">4</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contracts Awarded</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">12</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Win Rate Percentage</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">68%</p>
        </div>
      </div>

      {/* Primary Feed Layout */}
      <div className="max-w-5xl mx-auto">
        <ActiveRfqList />
      </div>
    </div>
  );
}