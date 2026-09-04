"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId, onCancelled }: { orderId: string; onCancelled: () => void }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  async function cancelOrder() {
    if (!window.confirm("Cancel this order? This action cannot be undone.")) return;
    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error || "Unable to cancel this order.");
        return;
      }
      onCancelled();
      router.refresh();
    } finally {
      setCancelling(false);
    }
  }

  return <button type="button" onClick={cancelOrder} disabled={cancelling} className="mt-4 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">{cancelling ? "Cancelling..." : "Cancel order"}</button>;
}