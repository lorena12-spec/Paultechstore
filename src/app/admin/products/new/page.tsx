"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImageUpload from "@/components/admin/ProductImageUpload";

type Category = { id: string; name: string };

type ProductForm = {
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  price: string;
  stock: string;
  image: string;
};

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>({ name: "", brand: "Apple", categoryId: "", description: "", price: "", stock: "", image: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then(response => response.json()).then(setCategories).catch(() => setError("Unable to load categories."));
  }, []);

  function updateField(field: keyof ProductForm, value: string) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), images: JSON.stringify(form.image ? [form.image] : []) }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Unable to save product.");
        return;
      }
      router.push("/admin/products");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="container py-12"><h1 className="text-4xl font-black">Add product</h1><form onSubmit={submit} className="mt-8 max-w-2xl rounded-2xl border bg-white p-6">{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<input required className="mt-3 w-full rounded-xl border p-3" placeholder="Product name" value={form.name} onChange={event => updateField("name", event.target.value)} /><input required className="mt-3 w-full rounded-xl border p-3" placeholder="Brand" value={form.brand} onChange={event => updateField("brand", event.target.value)} /><select required className="mt-3 w-full rounded-xl border p-3" value={form.categoryId} onChange={event => updateField("categoryId", event.target.value)}><option value="">Choose category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select><textarea required className="mt-3 w-full rounded-xl border p-3" placeholder="Description" rows={5} value={form.description} onChange={event => updateField("description", event.target.value)} /><input required type="number" min="1" className="mt-3 w-full rounded-xl border p-3" placeholder="Price" value={form.price} onChange={event => updateField("price", event.target.value)} /><input required type="number" min="0" className="mt-3 w-full rounded-xl border p-3" placeholder="Stock" value={form.stock} onChange={event => updateField("stock", event.target.value)} /><label className="mt-5 block font-semibold">Product image</label><p className="mt-1 text-sm text-slate-500">Upload from your computer or paste a URL if you prefer.</p><input type="text" className="mt-3 w-full rounded-xl border p-3" placeholder="Optional image URL" value={form.image} onChange={event => updateField("image", event.target.value)} /><ProductImageUpload onUploaded={url => updateField("image", url)} /><button disabled={saving || !categories.length} className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save product"}</button></form></section>;
}
