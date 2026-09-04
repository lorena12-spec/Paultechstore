import { createHash } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { destroySession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = resetPasswordSchema.parse(await req.json());
    const tokenHash = createHash("sha256").update(data.token).digest("hex");
    const resetToken = await db.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    await db.$transaction(async (tx) => {
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: resetToken.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() }
      });
      if (consumed.count !== 1) throw new Error("Reset token is no longer valid.");
      await tx.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
      await tx.passwordResetToken.deleteMany({ where: { userId: resetToken.userId, id: { not: resetToken.id } } });
    });
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }
}
