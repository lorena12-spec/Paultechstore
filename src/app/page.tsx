import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await db.product.findMany({ where: { featured: true }, take: 8, orderBy: { createdAt: "desc" } });
  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="container grid min-h-[520px] items-center gap-10 py-16 md:grid-cols-2">
          <div><div className="flex items-center gap-3"><img src="/logo.png.jpeg" alt="PaulTech Store logo" className="h-16 w-28 object-contain mix-blend-screen" /><p className="font-bold uppercase tracking-[.2em] text-blue-100">PaulTech Store</p></div><h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">Your next phone is waiting.</h1><p className="mt-5 max-w-xl text-lg text-blue-50">Shop iPhones, Samsung Galaxy, Google Pixel and iPads in one place.</p><Link href="/products" className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-blue-700">Shop now</Link></div>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/20 bg-blue-950/40 shadow-2xl shadow-blue-950/20"><img src="/Iphone%2017pm%20bg.png" alt="iPhone 17 Pro Max models in navy, silver, orange, and black" className="absolute inset-0 h-full w-full object-cover opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent" /><div className="absolute bottom-0 left-0 p-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">New arrival showcase</p><p className="mt-2 text-2xl font-black">iPhone 17 Pro Max</p><p className="mt-1 text-blue-100">Premium devices. Simple shopping.</p></div></div>
        </div>
      </section>
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between"><div><p className="font-semibold text-blue-600">SHOP BY BRAND</p><h2 className="text-3xl font-black">Find your device</h2></div><Link href="/products" className="font-semibold text-blue-600">View all →</Link></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["iPhone","Samsung","Google Pixel","iPad"].map(x => <Link key={x} href={`/products?category=${x.toLowerCase().replaceAll(" ","-")}`} className="rounded-2xl border bg-white p-8 text-center text-xl font-bold shadow-sm hover:-translate-y-1">{x}</Link>)}
        </div>
      </section>
      <section className="container pb-16"><h2 className="mb-7 text-3xl font-black">Featured products</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div></section>
    </>
  );
}
