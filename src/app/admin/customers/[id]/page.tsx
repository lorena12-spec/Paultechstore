import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { naira } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminCustomerOrders({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");
  const { id } = await params;
  const customer = await db.user.findFirst({ where: { id, role: "CUSTOMER" }, include: { orders: { include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } } } });
  if (!customer) notFound();

  return <section className="container py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/admin/customers" className="text-sm font-semibold text-blue-600">← All customers</Link><p className="mt-5 font-semibold text-blue-600">CUSTOMER ORDER HISTORY</p><h1 className="text-4xl font-black">{customer.name}</h1><p className="mt-2 text-slate-600">{customer.email} · {customer.phone || "No phone added"}</p></div><Link href="/admin/orders" className="rounded-xl border px-5 py-3 font-bold text-blue-700">All orders</Link></div><div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Orders from this customer ({customer.orders.length})</h2>{customer.orders.length ? <div className="mt-5 space-y-5">{customer.orders.map(order=><article key={order.id} className="rounded-xl border p-5"><div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><div><h3 className="font-black">Order #{order.id.slice(-8)}</h3><p className="mt-1 text-sm text-slate-500">{order.createdAt.toLocaleString()} · {order.paymentMethod === "OPAY" ? "OPay transfer" : "Paystack"}</p></div><div className="text-right"><p className="text-xl font-black text-blue-700">{naira(order.total)}</p><OrderStatusSelect orderId={order.id} status={order.status}/></div></div><div className="mt-4"><p className="text-sm font-bold">Products purchased</p><div className="mt-2 space-y-2">{order.items.map(item=><div key={item.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{item.product.name} × {item.quantity}</span><b>{naira(item.price * item.quantity)}</b></div>)}</div></div><div className="mt-4 border-t pt-4 text-sm text-slate-600"><b>Payment:</b> {order.paymentRef || "Awaiting payment confirmation"}<br/><b>Delivery:</b> {order.shippingPhone}, {order.address}, {order.city}, {order.state}</div></article>)}</div> : <p className="mt-5 text-slate-500">This customer has not placed any orders.</p>}</div></section>;
}
