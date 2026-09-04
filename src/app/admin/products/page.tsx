import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { naira } from "@/lib/utils";
import ProductDeleteButton from "@/components/admin/ProductDeleteButton";

export default async function AdminProducts(){const s=await getSession();if(!s||s.role!=="ADMIN")redirect("/login");const products=await db.product.findMany({orderBy:{createdAt:"desc"},include:{category:true}});return <section className="container py-12"><div className="flex items-center justify-between"><h1 className="text-4xl font-black">Products</h1><Link href="/admin/products/new" className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Add product</Link></div><div className="mt-8 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map(p=><tr key={p.id} className="border-b last:border-0"><td className="p-4 font-semibold">{p.name}</td><td className="p-4">{p.category.name}</td><td className="p-4">{naira(p.price)}</td><td className="p-4">{p.stock}</td><td className="flex gap-3 p-4"><Link href={`/admin/products/${p.id}`} className="font-semibold text-blue-600 hover:text-blue-800">Edit</Link><ProductDeleteButton productId={p.id} productName={p.name} /></td></tr>)}</tbody></table></div></section>}
