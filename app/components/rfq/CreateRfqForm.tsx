"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { insertNewRfq } from "@/lib/supabase/actions";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
}

export default function CreateRfqForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", quantity: 1 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setIsSubmitting(true);
    setErrorMessage(null);

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const deadline = formData.get("deadline") as string;

    const formattedLineItems = items
      .filter((item) => item.description.trim() !== "")
      .map(({ description, quantity }) => ({
        description,
        quantity: Number(quantity),
      }));

    if (formattedLineItems.length === 0) {
      setErrorMessage("Please enter at least one item description.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Check user authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        // Unauthenticated Flow
        const draftPayload = {
          rfqData: {
            title,
            category,
            delivery_address: deliveryAddress,
            deadline,
            status: "active",
          },
          lineItems: formattedLineItems,
        };

        sessionStorage.setItem(
          "pending_rfq_draft",
          JSON.stringify(draftPayload)
        );

        router.push(
          "/register?intent=publish_rfq&redirect=/dashboard/rfqs/sync"
        );
        return;
      }

      // 2. Authenticated Flow
      const rfqData = {
        buyer_id: user.id,
        title,
        category,
        delivery_address: deliveryAddress,
        deadline,
        status: "active",
      };

      const result = await insertNewRfq(rfqData, formattedLineItems);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to submit RFQ.");
        setIsSubmitting(false);
        return;
      }

      // 3. Reset state & trigger non-blocking transition
      formElement.reset();
      setItems([{ id: crypto.randomUUID(), description: "", quantity: 1 }]);

      startTransition(() => {
        router.push("/dashboard/rfqs");
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (typeof err === "string") {
        setErrorMessage(err);
      } else {
        setErrorMessage("Failed to submit RFQ. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm"
    >
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 font-heading">
          Create New Request for Quote
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill out the details below to broadcast your requirements to verified suppliers.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          ❌ {errorMessage}
        </div>
      )}

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            RFQ Title
          </label>
          <input
            required
            type="text"
            name="title"
            placeholder="e.g., Procurement of Office Laptops"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            name="category"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-600 text-slate-900"
          >
            <option value="it-hardware">IT Hardware & Equipment</option>
            <option value="stationery">Office Stationery & Supplies</option>
            <option value="facility">Facility Management</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Physical Address
          </label>
          <input
            required
            type="text"
            name="deliveryAddress"
            placeholder="e.g., 42 Marina, Lagos Island"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bidding Deadline
          </label>
          <input
            required
            type="datetime-local"
            name="deadline"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900"
          />
        </div>
      </div>

      {/* Dynamic Line Items Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-slate-900">
            Required Line Items
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            + Add Row
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-3 w-3/5">Item Description & Specifications</th>
                <th className="p-3 w-1/5">Quantity</th>
                <th className="p-3 w-1/5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="p-2">
                    <input
                      required
                      type="text"
                      placeholder="e.g., Core i7 16GB RAM, 512GB SSD"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-600 text-slate-800 text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      required
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-600 text-slate-800 text-sm"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      disabled={items.length === 1}
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Submission Controls */}
      <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50"
        >
          {isLoading ? "Publishing & Redirecting..." : "Publish RFQ"}
        </button>
      </div>
    </form>
  );
}