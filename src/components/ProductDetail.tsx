"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { naira } from "@/lib/utils";
import { useCart } from "./cart/CartProvider";

export default function ProductDetail({ product }: { product: any }) {
  const { add } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const images = JSON.parse(product.images);
  const [selected, setSelected] = useState(0);

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

  return <section className="container py-12"><div className="grid gap-10 md:grid-cols-2"><div><div className="rounded-3xl bg-white p-8 shadow-sm"><img src={images[selected]} alt={product.name} className="h-[480px] w-full object-contain"/></div><div className="mt-4 flex gap-3">{images.map((x:string,i:number)=><button key={x} onClick={()=>setSelected(i)} className="rounded-xl border bg-white p-2"><img src={x} className="h-20 w-20 object-contain"/></button>)}</div></div><div><p className="font-semibold text-blue-600">{product.brand}</p><h1 className="mt-2 text-4xl font-black">{product.name}</h1><p className="mt-4 text-3xl font-black">{naira(product.price)}</p><p className="mt-6 leading-7 text-slate-600">{product.description}</p><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-white p-4"><b>Condition</b><br/>{product.condition}</div><div className="rounded-xl bg-white p-4"><b>Stock</b><br/>{product.stock} available</div></div><button disabled={!product.stock||checkingAccount} onClick={addToCart} className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white disabled:bg-slate-300">{!product.stock ? "Out of stock" : checkingAccount ? "Checking account..." : "Add to cart"}</button></div></div></section>;
}
