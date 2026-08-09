import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBuyerRfqs } from "@/lib/supabase/actions";

export const revalidate = 0; // Disable static caching so fresh RFQs show immediately

export default async function BuyerDashboardPage() {
  const supabase = await createClient();

  // 1. Verify user authentication session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/rfqs");
  }

  // 2. Fetch buyer's RFQs using server action
  const rfqs = (await getBuyerRfqs(user.id)) || [];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
              Viquoe Hub
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
              Buyer Procurement Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage your active Requests for Quotation (RFQs) and review incoming supplier bids.
            </p>
          </div>
          <Link
            href="/rfq/new"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm self-start sm:self-auto"
          >
            + Create New RFQ
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Published</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{rfqs.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase">Active Bidding</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {rfqs.filter((r) => r.status === "active").length}
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase">Closed / Completed</span>
            <p className="text-2xl font-bold text-slate-400 mt-1">
              {rfqs.filter((r) => r.status !== "active").length}
            </p>
          </div>
        </div>

        {/* RFQs List Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-900">Your RFQs</h2>
            <span className="text-xs font-medium text-slate-500">
              Showing {rfqs.length} {rfqs.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {rfqs.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                ?
              </div>
              <h3 className="text-base font-semibold text-slate-900">No RFQs created yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Start by creating your first Request for Quote to receive competitive bids from verified marketplace suppliers.
              </p>
              <Link
                href="/rfq/new"
                className="mt-5 inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Create First RFQ
              </Link>
            </div>
          ) : (
            /* RFQ Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="p-4">RFQ Title & Category</th>
                    <th className="p-4">Line Items</th>
                    <th className="p-4">Delivery Address</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rfqs.map((rfq) => {
                    const itemCount = rfq.rfq_items ? rfq.rfq_items.length : 0;
                    const formattedDeadline = new Date(rfq.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={rfq.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-medium text-slate-900 text-sm">{rfq.title}</p>
                          <span className="inline-block mt-0.5 text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                            {rfq.category.replace("-", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-600">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </td>
                        <td className="p-4 text-xs text-slate-600 max-w-xs truncate">
                          {rfq.delivery_address}
                        </td>
                        <td className="p-4 text-xs text-slate-600 whitespace-nowrap">
                          {formattedDeadline}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              rfq.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {rfq.status === "active" ? "Active" : rfq.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/dashboard/rfqs/${rfq.id}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}