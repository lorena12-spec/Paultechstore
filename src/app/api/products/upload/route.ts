import { randomUUID } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

const hasCloudinaryConfig = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

function getCloudinaryErrorMessage() {
  return "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Render.";
}

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

    if (!hasCloudinaryConfig) {
      return NextResponse.json({ error: getCloudinaryErrorMessage() }, { status: 500 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "paultech-store/products",
          resource_type: "image",
          public_id: `${randomUUID()}`
        },
        (error, uploaded) => {
          if (error) return reject(error);
          if (!uploaded) return reject(new Error("Cloudinary upload failed."));
          resolve({ secure_url: uploaded.secure_url });
        }
      );

      uploadStream.end(fileBuffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Product image upload failed:", error);
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}