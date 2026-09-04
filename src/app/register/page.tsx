"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Register() {
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""}),[error,setError]=useState("");
  const router=useRouter();
  const searchParams=useSearchParams();
  async function submit(e:React.FormEvent){e.preventDefault();const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const d=await r.json();if(!r.ok)return setError(d.error);window.dispatchEvent(new CustomEvent("pt-session-changed",{detail:{session:d.session}}));const next=searchParams.get("next");router.push(next?.startsWith("/")?next:"/account");}
  return <section className="container flex min-h-[70vh] items-center justify-center py-12"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-3xl font-black">Create account</h1>{error&&<p className="mt-3 text-red-600">{error}</p>}{(["name","email","phone","password"] as const).map(k=><input key={k} className="mt-4 w-full rounded-xl border p-3" placeholder={k[0].toUpperCase()+k.slice(1)} type={k==="password"?"password":"text"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}<button className="mt-5 w-full rounded-xl bg-blue-600 p-3 font-bold text-white">Create account</button><p className="mt-5 text-sm">Already registered? <Link className="font-semibold text-blue-600" href="/login">Login</Link></p></form></section>;
}
