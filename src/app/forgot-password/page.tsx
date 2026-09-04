"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("We could not process that request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="container flex min-h-[70vh] items-center justify-center py-12"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-3xl font-black">Reset your password</h1><p className="mt-2 text-sm text-slate-500">Enter the email you used to create your PaulTech Store account. If an account exists, we will send a reset link.</p>{message&&<p role="status" className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{message}</p>}<label className="mt-6 block text-sm font-semibold" htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="you@example.com"/><button disabled={loading} className="mt-5 w-full rounded-xl bg-blue-600 p-3 font-bold text-white disabled:opacity-60">{loading?"Sending reset link...":"Send reset link"}</button><p className="mt-5 text-sm"><Link href="/login" className="font-semibold text-blue-600">Back to login</Link></p></form></section>;
}
