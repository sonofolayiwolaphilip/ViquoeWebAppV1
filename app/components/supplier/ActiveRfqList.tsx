"use client";

import React from "react";

interface RfqMarketplaceItem {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  deliveryHub: string;
  deadline: string;
  isClosingSoon: boolean;
}

export default function ActiveRfqList() {
  // Mock data representing what we will pull from Supabase real-time
  const activeRfqs: RfqMarketplaceItem[] = [
    {
      id: "vq-9842",
      title: "Procurement of Office Laptops & 4K Monitors",
      category: "IT Hardware & Equipment",
      itemCount: 2,
      deliveryHub: "Lagos Island, LA",
      deadline: "July 05, 2026",
      isClosingSoon: true,
    },
    {
      id: "vq-9711",
      title: "Bulk Supply of Premium A4 Copier Paper",
      category: "Office Stationery & Supplies",
      itemCount: 1,
      deliveryHub: "Ikeja, LA",
      deadline: "July 12, 2026",
      isClosingSoon: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-slate-900 font-heading">Open Opportunities</h3>
        <span className="text-xs text-slate-500">{activeRfqs.length} jobs matching your profile</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeRfqs.map((rfq) => (
          <div 
            key={rfq.id} 
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl transition duration-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  {rfq.category}
                </span>
                {rfq.isClosingSoon && (
                  <span className="px-2.5 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium animate-pulse">
                    ⚠️ Closes Soon
                  </span>
                )}
              </div>
              <h4 className="text-md font-medium text-slate-900 hover:text-blue-600 cursor-pointer">
                {rfq.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>📦 <strong>{rfq.itemCount} distinct lines</strong> required</span>
                <span>📍 Hub: {rfq.deliveryHub}</span>
              </p>
            </div>

            <div className="flex sm:items-center justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 gap-6">
              <div className="text-left md:text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Deadline</p>
                <p className="text-sm font-medium text-slate-800">{rfq.deadline}</p>
              </div>
              <button 
                type="button"
                className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition shadow-sm"
              >
                Submit Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}