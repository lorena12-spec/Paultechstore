"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductDeleteButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function removeProduct() {
    if (!window.confirm(`Remove ${productName}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        window.alert(data.error || "Unable to remove this product. Please try again.");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return <button type="button" onClick={removeProduct} disabled={deleting} className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50">{deleting ? "Removing..." : "Remove"}</button>;
}