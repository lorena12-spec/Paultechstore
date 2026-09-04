"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImageUpload from "@/components/admin/ProductImageUpload";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  price: number;
  stock: number;
  condition: string;
  storage: string | null;
  color: string | null;
  images: string;
};

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    categoryId: "",
    description: "",
    price: "",
    stock: "",
    condition: "",
    storage: "",
    color: ""
  });

  useEffect(() => {
    async function load() {
      const { id } = await params;
      setProductId(id);

      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch("/api/categories")
      ]);

      const product: Product = await productRes.json();
      const cats: Category[] = await categoriesRes.json();
      const parsedImages = (() => {
        try {
          const arr = JSON.parse(product.images || "[]");
          return Array.isArray(arr) && arr.length ? arr : [""];
        } catch {
          return [product.images || ""];
        }
      })();

      setCategories(cats);
      setImages(parsedImages);
      setForm({
        name: product.name,
        brand: product.brand,
        categoryId: product.categoryId,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        condition: product.condition,
        storage: product.storage || "",
        color: product.color || ""
      });
    }

    load();
  }, [params]);

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: images.filter(Boolean)
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Unable to update product");
    router.push("/admin/products");
  }

  return (
    <section className="container py-12">
      <h1 className="text-4xl font-black">Edit product</h1>
      <form onSubmit={submit} className="mt-8 max-w-3xl rounded-2xl border bg-white p-6">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Product name" required />
          <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Brand" required />
          <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="mt-3 w-full rounded-xl border p-3" required>
            <option value="">Choose category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input value={form.condition} onChange={(e) => updateField("condition", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Condition" />
          <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Price" required />
          <input type="number" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Stock" required />
          <input value={form.storage} onChange={(e) => updateField("storage", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Storage" />
          <input value={form.color} onChange={(e) => updateField("color", e.target.value)} className="mt-3 w-full rounded-xl border p-3" placeholder="Color" />
        </div>

        <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-3 w-full rounded-xl border p-3" rows={5} placeholder="Description" />

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-semibold">Images</label>
            <button type="button" onClick={() => setImages((current) => [...current, ""])} className="rounded-lg border px-3 py-2 text-sm font-semibold">Add image</button>
          </div>
          {images.map((image, index) => (
            <input
              key={index}
              value={image}
              onChange={(e) => setImages((current) => current.map((item, i) => i === index ? e.target.value : item))}
              className="mt-2 w-full rounded-xl border p-3"
              placeholder="https://example.com/image.jpg"
            />
          ))}
          <ProductImageUpload onUploaded={(url) => setImages((current) => [...current.filter(Boolean), url])} />
        </div>

        <button type="submit" className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Update product</button>
      </form>
    </section>
  );
}
