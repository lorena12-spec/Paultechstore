import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

function normalizeImages(images: unknown) {
  if (Array.isArray(images)) return images.filter(Boolean).map(String);
  if (typeof images === "string") {
    const trimmed = images.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {
      // fall through to newline/comma split
    }
    return trimmed.split(/[\r\n,]+/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(){const products=await db.product.findMany({include:{category:true},orderBy:{createdAt:"desc"}});return NextResponse.json(products);}
export async function POST(req:Request){const s=await getSession();if(!s||s.role!="ADMIN")return NextResponse.json({error:"Forbidden"},{status:403});const d=await req.json();if(!d.name||!d.categoryId||!d.price)return NextResponse.json({error:"Missing fields"},{status:400});const images=normalizeImages(d.images);const p=await db.product.create({data:{name:d.name,slug:slugify(d.name)+"-"+Date.now(),brand:d.brand||"Other",categoryId:d.categoryId,description:d.description||"",price:Number(d.price),stock:Number(d.stock||0),condition:d.condition||"New",storage:d.storage||null,color:d.color||null,images:JSON.stringify(images)}});return NextResponse.json(p,{status:201});}
