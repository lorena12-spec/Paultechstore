import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
    const extension = allowedTypes.get(file.type);
    if (!extension) return NextResponse.json({ error: "Only JPG, PNG, and WebP images are supported." }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDirectory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/products/${filename}` });
  } catch {
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}