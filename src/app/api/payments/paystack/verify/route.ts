import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendOrderEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!process.env.PAYSTACK_SECRET_KEY) return NextResponse.json({ error: "Payment is not configured." }, { status: 503 });
  try {
    const { reference } = await req.json();
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    const data = await response.json();
    if (!response.ok || !data.status || data.data.status !== "success") return NextResponse.json({ error: "Payment was not successful." }, { status: 400 });
    const order = await db.order.findFirst({ where: { id: reference, userId: session.id } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (data.data.reference !== order.id || data.data.amount !== order.total * 100) return NextResponse.json({ error: "Payment details do not match this order." }, { status: 400 });
    if (order.status === "PENDING") {
      const updated = await db.$transaction(async tx => {
        const current = await tx.order.findUnique({ where: { id: order.id }, include: { items: true } });
        if (!current || current.status !== "PENDING") return current;
        for (const item of current.items) {
          const result = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
          if (result.count !== 1) throw new Error("Stock unavailable");
        }
        return tx.order.update({ where: { id: order.id }, data: { status: "PAID", paymentRef: String(data.data.reference) } });
      });
      if (updated) await sendOrderEmail(order.shippingEmail, "Payment received for your PaulTech Store order", `We received your payment for order #${order.id.slice(-8)}. Your order is now being processed. Track it from your PaulTech Store account.`);
    }
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch { return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 }); }
}