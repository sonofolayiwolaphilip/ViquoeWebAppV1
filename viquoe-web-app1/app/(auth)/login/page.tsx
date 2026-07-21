"use client";

import React, { useState } from "react";
// import { createClient } from "@/app/lib/supabase/client";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "An unexpected error occurred.");
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Query the user's role to determine where to redirect them
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
      // Explicitly grab the message from the Postgres error object!
      setError(`Database Profile Error: ${profileError.message} (Code: ${profileError.code})`);
      setLoading(false);
      return;
    }

    if (!profile) {
      setError("Account authenticated successfully, but no matching database profile row was found.");
      setLoading(false);
      return;
    }

      // Role-based routing redirection
      if (profile.role === "buyer_admin") {
        router.push("/rfq/new");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Welcome to Viquoe</h2>
          <p className="text-sm text-slate-500 mt-1">Log in to manage your procurement pipeline</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-lg mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Email Address</label>
            <input
              required
              type="email"
              name="email"
              placeholder="you@company.com"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Password</label>
            <input
              required
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          New to the platform?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Register your business
          </Link>
        </div>
      </div>
    </div>
  );
}