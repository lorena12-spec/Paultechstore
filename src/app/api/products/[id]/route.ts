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

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const p=await db.product.findUnique({where:{id}});return p?NextResponse.json(p):NextResponse.json({error:"Not found"},{status:404});}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){const s=await getSession();if(!s||s.role!="ADMIN")return NextResponse.json({error:"Forbidden"},{status:403});const {id}=await params;const existing=await db.product.findUnique({where:{id}});if(!existing)return NextResponse.json({error:"Not found"},{status:404});const d=await req.json();const images=normalizeImages(d.images ?? existing.images);const updateData={name:d.name ?? existing.name,brand:d.brand ?? existing.brand,categoryId:d.categoryId ?? existing.categoryId,description:d.description ?? existing.description,price:Number(d.price ?? existing.price),stock:Number(d.stock ?? existing.stock),condition:d.condition ?? existing.condition,storage:d.storage ?? existing.storage,color:d.color ?? existing.color,images:JSON.stringify(images),slug:(d.name && d.name !== existing.name) ? `${slugify(d.name)}-${id.slice(0,6)}` : existing.slug};const p=await db.product.update({where:{id},data:updateData});return NextResponse.json(p);}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const s=await getSession();if(!s||s.role!="ADMIN")return NextResponse.json({error:"Forbidden"},{status:403});const {id}=await params;const existing=await db.product.findUnique({where:{id},select:{id:true}});if(!existing)return NextResponse.json({error:"Product not found"},{status:404});const orderItemCount=await db.orderItem.count({where:{productId:id}});if(orderItemCount>0)return NextResponse.json({error:"This product is linked to an existing order and cannot be removed."},{status:409});await db.product.delete({where:{id}});return NextResponse.json({ok:true});}
