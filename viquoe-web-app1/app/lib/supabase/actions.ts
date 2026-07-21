import { createClient } from "./server";

// 1. Define explicit types matching our Database & UI contracts
export interface RfqInsertData {
  buyer_id: string;
  title: string;
  category: string;
  delivery_address: string;
  deadline: string;
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

// Initialize the server-side client instance
const getSupabaseClient = async () => {
  return await createClient();
};

// 2. Insert RFQ with explicit TypeScript types
export async function insertNewRfq(
  rfqData: RfqInsertData, 
  lineItems: RfqItemInsertData[]
) {
  const supabase = await getSupabaseClient();

  // Insert the parent RFQ record
  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .insert([rfqData])
    .select()
    .single();

  if (rfqError) throw rfqError;

  // Map line items to the new RFQ ID and insert them atomically
  const formattedItems = lineItems.map(item => ({
    rfq_id: rfq.id,
    description: item.description,
    quantity: item.quantity
  }));

  const { error: itemsError } = await supabase
    .from('rfq_items')
    .insert(formattedItems);

  if (itemsError) throw itemsError;
  return rfq;
}

// 3. Submit verification with explicit TypeScript types
export async function submitSupplierVerification(
  verificationData: SupplierVerificationData
) {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("supplier_verification")
    .upsert([verificationData]); 

  if (error) throw error;
  return data;
}

// Add these to app/lib/supabase/actions.ts

// 1. For Buyer Dashboard: Fetch all RFQs published by the logged-in buyer
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

// 2. For Supplier Dashboard: Fetch all active RFQs in the marketplace that they can bid on
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