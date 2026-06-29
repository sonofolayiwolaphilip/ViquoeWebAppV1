import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
        Viquoe Platform Staging
      </span>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-heading sm:text-5xl max-w-2xl">
        Revolutionizing Institutional Procurement
      </h1>
      <p className="mt-4 text-base text-slate-500 max-w-lg">
        Fast, lightweight, and resilient RFQ pipelines connecting corporate buyers with verified regional suppliers.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link 
          href="/rfq/new" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
        >
          Access Buyer Form
        </Link>
        <Link 
          href="/dashboard" 
          className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition shadow-sm"
        >
          Access Supplier Portal
        </Link>
      </div>
    </div>
  );
}