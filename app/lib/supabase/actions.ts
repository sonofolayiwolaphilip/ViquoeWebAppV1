"use server";

import { createClient } from "./server";

// 1. Define explicit types matching Database & UI contracts
export interface RfqInsertData {
  buyer_id: string;
  title: string;
  category: string;
  delivery_address: string;
  deadline: string;
  status?: string; // Included optional status to match form payload
}

export interface RfqItemInsertData {
  description: string;
  quantity: number;
}

export interface SupplierVerificationData {
  supplier_id: string;
  tin_number: string;
  physical_address: string;
  reg_document_url: string;
  address_proof_url: string;
}

// Action response contract
export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Helper to instantiate server client
const getSupabaseClient = async () => {
  return await createClient();
};

// 2. Insert RFQ with safe error handling
export async function insertNewRfq(
  rfqData: RfqInsertData,
  lineItems: RfqItemInsertData[]
): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await getSupabaseClient();

    // Insert parent RFQ record
    const { data: rfq, error: rfqError } = await supabase
      .from("rfqs")
      .insert([
        {
          ...rfqData,
          status: rfqData.status || "active",
        },
      ])
      .select()
      .single();

    if (rfqError) {
      console.error("RFQ Database Error:", rfqError);
      return { success: false, error: rfqError.message };
    }

    // Map line items to the new RFQ ID
    const formattedItems = lineItems.map((item) => ({
      rfq_id: rfq.id,
      description: item.description,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("rfq_items")
      .insert(formattedItems);

    if (itemsError) {
      console.error("RFQ Items Database Error:", itemsError);
      return { success: false, error: itemsError.message };
    }

    return { success: true, data: rfq };
  } catch (err: unknown) {
    console.error("insertNewRfq Exception:", err);
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    return { success: false, error: errorMsg };
  }
}

// 3. Submit supplier verification
export async function submitSupplierVerification(
  verificationData: SupplierVerificationData
): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from("supplier_verification")
      .upsert([verificationData]);

    if (error) {
      console.error("Supplier Verification Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error("submitSupplierVerification Exception:", err);
    const errorMsg =
      err instanceof Error ? err.message : "Failed to submit verification.";
    return { success: false, error: errorMsg };
  }
}

// 4. Fetch Buyer RFQs
export async function getBuyerRfqs(buyerId: string) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("rfqs")
    .select(`
      id,
      title,
      category,
      delivery_address,
      deadline,
      status,
      created_at,
      rfq_items (
        id,
        description,
        quantity
      )
    `)
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 5. Fetch Active Marketplace RFQs
export async function getActiveMarketplaceRfqs() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("rfqs")
    .select(`
      id,
      title,
      category,
      deadline,
      status,
      created_at,
      profiles (
        company_name
      ),
      rfq_items (
        id,
        description,
        quantity
      )
    `)
    .eq("status", "active")
    .order("deadline", { ascending: true });

  if (error) throw error;
  return data;
}