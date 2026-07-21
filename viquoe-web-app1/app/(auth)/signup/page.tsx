"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyName = formData.get("companyName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const role = formData.get("role") as string;

    try {
      // Sign up inside Supabase Auth Engine
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Pass extra application context directly to our Postgres database trigger
          data: {
            company_name: companyName,
            phone_number: phoneNumber,
            role: role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        alert("Registration initiated! Check your email for verification link.");
        router.push("/login");
      }
    } catch (networkError: unknown) {
      console.error("Caught Local Fetch Block:", networkError);
      setError(
        "Network Connection to Supabase was blocked. Please ensure no Ad-blockers, extension shields, or custom local network configurations are filtering outbound requests."
      );
      setLoading(false);
    }
  }; // Braces match up perfectly here now

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Join Viquoe Hub</h2>
          <p className="text-sm text-slate-500 mt-1">Register your institutional business profile</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-lg mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Business Account Type</label>
            <select name="role" className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white text-sm">
              <option value="buyer_admin">Corporate Buyer (Procure Goods)</option>
              <option value="supplier_admin">Regional Supplier (Bid on RFQs)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Registered Company Name</label>
            <input required type="text" name="companyName" placeholder="e.g., Acme Industrial Ltd" className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Contact Phone (WhatsApp Ready)</label>
            <input required type="tel" name="phoneNumber" placeholder="e.g., +2348012345678" className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Work Email Address</label>
            <input required type="email" name="email" placeholder="you@company.com" className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Password</label>
            <input required type="password" name="password" placeholder="••••••••" className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}