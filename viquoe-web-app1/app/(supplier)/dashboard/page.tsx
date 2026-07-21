// import React from "react";
// import ActiveRfqList from "@/components/supplier/ActiveRfqList";

// export default function SupplierDashboardPage() {
//   return (
//     <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
//       {/* Top Banner Context */}
//       <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 font-heading">Supplier Portal</h1>
//           <p className="text-sm text-slate-500 mt-0.5">Welcome back. Manage your institutional quotes and pipeline here.</p>
//         </div>
//         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
//           <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
//           <span className="text-xs font-medium text-emerald-800">Account Status: Fully Verified</span>
//         </div>
//       </div>

//       {/* Mini Performance Tracker metrics */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
//         <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//           <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Submitted Bids</p>
//           <p className="text-2xl font-bold text-slate-900 mt-1">4</p>
//         </div>
//         <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//           <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contracts Awarded</p>
//           <p className="text-2xl font-bold text-emerald-600 mt-1">12</p>
//         </div>
//         <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//           <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Win Rate Percentage</p>
//           <p className="text-2xl font-bold text-blue-600 mt-1">68%</p>
//         </div>
//       </div>

//       {/* Primary Feed Layout */}
//       <div className="max-w-5xl mx-auto">
//         <ActiveRfqList />
//       </div>
//     </div>
//   );
// }


import React from "react";
import { createClient } from "../../lib/supabase/server";
import { getActiveMarketplaceRfqs } from "../../lib/supabase/actions";
import Link from "next/link";

export default async function SupplierDashboardPage() {
  const supabase = await createClient();
  
  // 1. Get the current authenticated user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Please log in to view the dashboard.</p>
        <Link href="/login" className="text-blue-600 underline mt-2 inline-block">Go to Login</Link>
      </div>
    );
  }

  // 2. Fetch Supplier Profile Verification Status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_verified, company_name")
    .eq("id", user.id)
    .single();

  // 3. Retrieve Real-Time Active RFQs from the Database
  const activeRfqs = await getActiveMarketplaceRfqs();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Supplier Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <strong className="text-slate-800">{profile?.company_name || "Enterprise"}</strong>
            </p>
          </div>

          {/* Verification Status Badge */}
          {profile?.is_verified ? (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              🟢 Account Verified (Active)
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-amber-200">
                🟡 Pending Verification Approval
              </span>
              <Link 
                href="/dashboard/onboarding" 
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Upload Documents
              </Link>
            </div>
          )}
        </div>

        {/* Real-time RFQs Grid Layout */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Marketplace Opportunities</h2>
          
          {activeRfqs.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
              <span className="text-3xl">📦</span>
              <p className="text-slate-500 text-sm mt-2 font-medium">No open RFQs in the marketplace right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRfqs.map((rfq) => {
                const deadlineDate = new Date(rfq.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div key={rfq.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {rfq.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Deadline: {deadlineDate}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                        {rfq.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        Issued by: {rfq.profiles?.[0]?.company_name || "Verified Buyer"}
                      </p>

                      <div className="border-t border-slate-100 pt-3">
                        <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Requested Items:</h4>
                        <ul className="space-y-1.5">
                          {rfq.rfq_items.map((item: { id: string; description: string; quantity: number }) => (
                            <li key={item.id} className="text-xs text-slate-600 flex justify-between">
                              <span>• {item.description}</span>
                              <strong className="text-slate-800">Qty: {item.quantity}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                      <Link
                        href={`/dashboard/bid/${rfq.id}`}
                        className={`text-xs font-semibold px-4 py-2 rounded-lg transition ${
                          profile?.is_verified
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        {profile?.is_verified ? "Submit Proposal" : "Verify to Bid"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}