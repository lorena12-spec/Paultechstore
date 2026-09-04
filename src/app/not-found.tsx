import Link from "next/link";
export default function NotFound(){return <section className="container py-24 text-center"><h1 className="text-5xl font-black">404</h1><p className="mt-3">Product not found.</p><Link href="/products" className="mt-6 inline-block text-blue-600 font-bold">Back to shop</Link></section>}
