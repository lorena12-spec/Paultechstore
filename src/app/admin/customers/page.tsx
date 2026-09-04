import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

import { db } from "@/lib/prisma";

export default async function AdminCustomers() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");
  const customers = await db.user.findMany({ where: { role: "CUSTOMER" }, include: { _count: { select: { orders: true } } }, orderBy: { createdAt: "desc" } });

  return <section className="container py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-semibold text-blue-600">ADMIN DATABASE</p><h1 className="text-4xl font-black">Customers</h1><p className="mt-2 text-slate-600">View customer accounts and their order history.</p></div><Link href="/admin/orders" className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">View orders</Link></div><div className="mt-8 overflow-x-auto rounded-2xl border bg-white shadow-sm"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b bg-slate-50"><th className="p-4">Customer</th><th className="p-4">Contact</th><th className="p-4">Orders</th><th className="p-4">Joined</th></tr></thead><tbody>{customers.map(customer=><tr key={customer.id} className="border-b last:border-0"><td className="p-4"><Link href={`/admin/customers/${customer.id}`} className="font-bold text-blue-700 hover:underline">{customer.name}</Link><p className="text-xs text-slate-500">ID: {customer.id}</p></td><td className="p-4"><p>{customer.email}</p><p className="text-slate-500">{customer.phone || "No phone added"}</p></td><td className="p-4 font-semibold"><Link href={`/admin/customers/${customer.id}`} className="text-blue-700 hover:underline">{customer._count.orders} view orders</Link></td><td className="p-4 text-slate-600">{customer.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table>{!customers.length&&<p className="p-8 text-center text-slate-500">No customer accounts yet.</p>}</div></section>;
}
