"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus: string) {
    setValue(nextStatus);
    setMessage("");
    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
      if (!response.ok) {
        setValue(status);
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Update failed");
      } else {
        const data = await response.json().catch(() => ({}));
        setMessage(data.notificationSent ? "Customer notified" : "Updated; email not configured");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return <div className="flex flex-col items-end gap-1"><select value={value} disabled={saving} onChange={(event) => updateStatus(event.target.value)} aria-label="Update order status" className="rounded-lg border px-2 py-1 text-sm font-semibold"><option value="">Status</option>{statuses.map(item => <option key={item} value={item}>{item}</option>)}</select>{message&&<span className={`text-[11px] ${message === "Customer notified" ? "text-green-600" : "text-amber-600"}`}>{message}</span>}</div>;
}
