"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { insertNewRfq } from "@/lib/supabase/actions";

export default function SyncPendingRfqPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState("Finalizing your account and publishing your RFQ...");

  useEffect(() => {
    async function publishStoredDraft() {
      const savedDraft = sessionStorage.getItem("pending_rfq_draft");

      if (!savedDraft) {
        router.replace("/dashboard/rfqs");
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/register");
          return;
        }

        const parsedPayload = JSON.parse(savedDraft);
        const rfqDataWithBuyer = {
          ...parsedPayload.rfqData,
          buyer_id: user.id,
        };

        const result = await insertNewRfq(
          rfqDataWithBuyer,
          parsedPayload.lineItems
        );

        if (result.success) {
          sessionStorage.removeItem("pending_rfq_draft");
          router.replace("/dashboard/rfqs");
        } else {
          setStatus("Draft sync failed. Redirecting to your dashboard...");
          setTimeout(() => router.replace("/dashboard/rfqs"), 2000);
        }
      } catch (err) {
        console.error("Error auto-publishing RFQ draft:", err);
        router.replace("/dashboard/rfqs");
      }
    }

    publishStoredDraft();
  }, [router, supabase]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-lg font-semibold text-slate-800">{status}</h2>
      <p className="text-xs text-slate-500 mt-1">
        Your RFQ details are preserved and being linked to your new account.
      </p>
    </div>
  );
}