import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
export async function GET(){return NextResponse.json(await db.category.findMany({orderBy:{name:"asc"}}));}
