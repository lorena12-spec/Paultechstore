"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPrimaryProductImage } from "@/lib/product-images";
import { naira } from "@/lib/utils";
import { useCart } from "./cart/CartProvider";

export default function ProductCard({ product }: { product: any }) {
  const { add } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const image = getPrimaryProductImage(product.images) ?? "/images/placeholder-product.jpg";

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" }).then(response => response.json()).then(data => setLoggedIn(Boolean(data.session))).catch(() => setLoggedIn(false)).finally(() => setCheckingAccount(false));
  }, []);

  function addToCart() {
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    add(product);
  }

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block bg-slate-50 p-5">
        <img src={image} alt={product.name} className="h-56 w-full object-contain" />
      </Link>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase text-blue-600">{product.brand}</p>
        <h3 className="mt-1 min-h-12 font-bold">{product.name}</h3>
        <p className="mt-3 text-xl font-black">{naira(product.price)}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={addToCart} disabled={checkingAccount} className="flex-1 rounded-xl bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{checkingAccount ? "Checking account..." : "Add to cart"}</button>
          <Link href={`/products/${product.slug}`} className="rounded-xl border px-3 py-2">View</Link>
        </div>
      </div>
    </article>
  );
}
