import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in before payment." }, { status: 401 });
  if (!process.env.PAYSTACK_SECRET_KEY) return NextResponse.json({ error: "Payment is not configured yet. Please contact support." }, { status: 503 });
  try {
    const { orderId } = await req.json();
    const order = await db.order.findFirst({ where: { id: orderId, userId: session.id, status: "PENDING" } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ email: session.email, amount: order.total * 100, reference: order.id, callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin}/order-success?orderId=${order.id}` }) });
    const data = await response.json();
    if (!response.ok || !data.status) return NextResponse.json({ error: "Unable to start payment. Please try again." }, { status: 502 });
    await db.order.update({ where: { id: order.id }, data: { paymentRef: order.id } });
    return NextResponse.json({ authorizationUrl: data.data.authorization_url });
  } catch { return NextResponse.json({ error: "Unable to start payment." }, { status: 400 }); }
}