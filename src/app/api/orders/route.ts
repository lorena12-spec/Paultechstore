import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in before checkout." }, { status: 401 });
  try {
    const data = orderSchema.parse(await req.json());
    const products = await db.product.findMany({ where: { id: { in: data.items.map(i => i.productId) } } });
    const map = new Map(products.map(p => [p.id, p]));
    let total = 0;
    for (const item of data.items) {
      const p = map.get(item.productId);
      if (!p || p.stock < item.quantity) return NextResponse.json({ error: "One or more items are unavailable." }, { status: 400 });
      total += p.price * item.quantity;
    }
    const order = await db.order.create({ data: { userId: session.id, total, paymentMethod: data.paymentMethod, shippingName: data.shippingName, shippingPhone: data.shippingPhone, shippingEmail: data.shippingEmail, address: data.address, city: data.city, state: data.state, items: { create: data.items.map(i => ({ productId: i.productId, quantity: i.quantity, price: map.get(i.productId)!.price })) } } });
    return NextResponse.json({ orderId: order.id });
  } catch { return NextResponse.json({ error: "Invalid order data." }, { status: 400 }); }
}
