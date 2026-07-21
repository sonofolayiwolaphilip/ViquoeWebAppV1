"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import FileDropUpload from "@/components/supplier/FileDropUpload";
import { submitSupplierVerification } from "../../../lib/supabase/actions";

export default function SupplierOnboardingPage() {
  const supabase = createClient();  
  const router = useRouter();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [tinNumber, setTinNumber] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [regDocumentUrl, setRegDocumentUrl] = useState("");
  const [addressProofUrl, setAddressProofUrl] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the logged-in user's ID on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push("/login");
      }
    };
    fetchUser();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!regDocumentUrl || !addressProofUrl) {
      setError("Please upload both your Business Registration Document and Proof of Address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitSupplierVerification({
        supplier_id: userId,
        tin_number: tinNumber,
        physical_address: physicalAddress,
        reg_document_url: regDocumentUrl,
        address_proof_url: addressProofUrl,
      });

      alert("Verification documents submitted successfully!");
      router.push("/dashboard"); // Redirect to Supplier Dashboard
    } catch (err) {
      console.error(err);
      setError("Failed to submit verification profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Step 2: Onboarding
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-3">
            Verify Your Supplier Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit your corporate details to start bidding on active institutional RFQs.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Tax Identification Number (TIN)
              </label>
              <input
                required
                type="text"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                placeholder="e.g., 12345678-0001"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Physical HQ Address
              </label>
              <input
                required
                type="text"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
                placeholder="e.g., 12 Alfred Rewane, Ikoyi, Lagos"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <FileDropUpload
              label="Business Registration (CAC / Certificate)"
              onUploadComplete={(url) => setRegDocumentUrl(url)}
            />
            <FileDropUpload
              label="Utility Bill (Proof of Address)"
              onUploadComplete={(url) => setAddressProofUrl(url)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving Verification Details..." : "Submit Profile for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}