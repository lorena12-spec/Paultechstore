import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = registerSchema.parse(await req.json());
    const exists = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const user = await db.user.create({ data: { name: data.name, email: data.email.toLowerCase(), phone: data.phone, passwordHash: await bcrypt.hash(data.password, 12) } });
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.json({ ok: true, session: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch { return NextResponse.json({ error: "Invalid registration data" }, { status: 400 }); }
}
