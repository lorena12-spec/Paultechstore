import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = loginSchema.parse(await req.json());
    const user = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.json({ ok: true, session: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch { return NextResponse.json({ error: "Invalid login data" }, { status: 400 }); }
}
