"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Unable to sign in. Please check your details.");
        return;
      }
      window.dispatchEvent(new CustomEvent("pt-session-changed", { detail: { session: data.session } }));
      const next = searchParams.get("next");
      router.push(next?.startsWith("/") ? next : data.session?.role === "ADMIN" ? "/admin" : "/account");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const next = searchParams.get("next");
  return <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-8 sm:py-12"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-900/10 lg:grid-cols-[1.05fr_.95fr]"><div className="relative hidden min-h-[580px] overflow-hidden bg-blue-700 p-10 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(125,211,252,0.45),transparent_30%),linear-gradient(145deg,#1d4ed8,#0f3d9e)]" /><div className="relative"><img src="/logo.png.jpeg" alt="PaulTech Store" className="h-28 w-48 object-contain mix-blend-screen" /><p className="mt-10 max-w-sm text-4xl font-black leading-tight">Your trusted place for premium devices.</p><p className="mt-5 max-w-sm text-blue-100">Sign in to manage your account, keep your cart, and track every order.</p></div><div className="relative grid grid-cols-3 gap-3 text-center text-xs font-semibold text-blue-100"><div className="rounded-xl border border-white/15 bg-white/10 p-3">Secure account</div><div className="rounded-xl border border-white/15 bg-white/10 p-3">Order tracking</div><div className="rounded-xl border border-white/15 bg-white/10 p-3">Fast support</div></div></div><form onSubmit={submit} className="w-full p-6 sm:p-10 lg:p-12"><div className="mb-8 lg:hidden"><img src="/logo.png.jpeg" alt="PaulTech Store" className="h-20 w-32 rounded-lg bg-blue-950 object-contain" /></div><p className="text-sm font-bold uppercase tracking-[.2em] text-blue-600">Customer account</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Welcome back</h1><p className="mt-3 text-sm leading-6 text-slate-500">Sign in securely to continue shopping and manage your orders.</p>{searchParams.get("reset")==="success"&&<p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">Your password has been updated. Please sign in.</p>}{error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="mt-7 block text-sm font-semibold" htmlFor="email">Email address</label><input id="email" name="email" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)}/><label className="mt-5 block text-sm font-semibold" htmlFor="password">Password</label><input id="password" name="password" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Enter your password" type="password" autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)}/><div className="mt-3 text-right"><Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Forgot password?</Link></div><button disabled={loading} className="mt-6 min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading?"Signing in...":"Sign in"}</button><p className="mt-7 text-center text-sm text-slate-600">New customer? <Link className="font-bold text-blue-600 hover:text-blue-800" href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}>Create an account</Link></p></form></div></main>;
}
