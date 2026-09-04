"use client";

import { useRef, useState } from "react";

export default function ProductImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/products/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Unable to upload image.");
        return;
      }
      onUploaded(result.url);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return <div className="mt-3"><div className="flex flex-wrap items-center gap-2"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={uploading} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700" />{uploading&&<span className="text-sm text-slate-500">Uploading...</span>}</div>{error&&<p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}<p className="mt-2 text-xs text-slate-500">JPG, PNG, or WebP up to 5MB.</p></div>;
}