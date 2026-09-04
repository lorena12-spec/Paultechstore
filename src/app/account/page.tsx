import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import AccountOrders from "@/components/account/AccountOrders";

export default async function Account() {
  const session = await getSession(); if (!session) redirect("/login");
  const orders = await db.order.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" }, take: 10 });
  return <section className="container py-12"><h1 className="text-4xl font-black">Hi, {session.name}</h1><p className="mt-2 text-slate-600">Track your PaulTech Store orders and payment status here.</p><div className="mt-8 rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">Your orders</h2><AccountOrders orders={orders.map(order => ({ ...order, createdAt: order.createdAt.toISOString() }))} /></div></section>;
}
