"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setSaving(true);
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await response.json();
      if (!response.ok) return setError(data.error || "Unable to reset password.");
      router.push("/login?reset=success");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="container flex min-h-[70vh] items-center justify-center py-12"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-3xl font-black">Create a new password</h1><p className="mt-2 text-sm text-slate-500">Use at least 8 characters, including uppercase, lowercase, and a number.</p>{error&&<p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="mt-6 block text-sm font-semibold" htmlFor="password">New password</label><input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={event=>setPassword(event.target.value)} className="mt-2 w-full rounded-xl border p-3"/><label className="mt-4 block text-sm font-semibold" htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border p-3"/><button disabled={saving||!token} className="mt-5 w-full rounded-xl bg-blue-600 p-3 font-bold text-white disabled:opacity-60">{saving?"Updating password...":"Update password"}</button>{!token&&<p className="mt-4 text-sm text-red-600">This reset link is missing or invalid.</p>}<p className="mt-5 text-sm"><Link href="/login" className="font-semibold text-blue-600">Back to login</Link></p></form></section>;
}
