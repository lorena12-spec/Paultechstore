"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";

type Session = { id: string; email: string; name: string; role: "CUSTOMER" | "ADMIN" } | null;
type SessionEvent = CustomEvent<{ session: Session }>;

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const res = await fetch("/api/me", { 
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error("No session");
        const data = await res.json();
        if (active) setSession(data.session ?? null);
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSession();
    function handleSessionChange(event: Event) {
      const session = (event as SessionEvent).detail?.session;
      if (session !== undefined) {
        setSession(session);
        setLoading(false);
      } else {
        loadSession();
      }
    }

    window.addEventListener("pt-session-changed", handleSessionChange);
    return () => {
      active = false;
      window.removeEventListener("pt-session-changed", handleSessionChange);
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      window.dispatchEvent(new CustomEvent("pt-session-changed", { detail: { session: null } }));
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function navClass(path: string) {
    return `transition-colors ${pathname === path ? "font-bold text-blue-700" : "hover:text-blue-600"}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container flex min-h-16 flex-wrap items-center gap-2 py-2 md:h-16 md:flex-nowrap md:gap-6 md:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-black text-blue-700" aria-label="PaulTech Store home">
          <span className="flex h-12 w-20 items-center justify-center overflow-hidden rounded-lg bg-blue-950">
            <img src="/logo.png.jpeg" alt="PaulTech Store" className="h-full w-full object-contain mix-blend-screen" />
          </span>
          <span className="hidden sm:inline">PaulTech Store</span>
        </Link>
        <nav className="hidden gap-5 md:flex">
          <Link href="/" className={navClass("/")}>Home</Link>
          <Link href="/products" className={navClass("/products")}>Shop</Link>
          <Link href="/about" className={navClass("/about")}>About</Link>
          <details className="group relative">
            <summary className="cursor-pointer list-none transition-colors hover:text-blue-600">Phones &amp; Tablets</summary>
            <div className="absolute left-0 top-full z-10 mt-3 grid min-w-44 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <Link href="/products?category=iphone" className="rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600">iPhone</Link>
              <Link href="/products?category=samsung" className="rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600">Samsung</Link>
              <Link href="/products?category=google-pixel" className="rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600">Pixel</Link>
              <Link href="/products?category=ipad" className="rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600">iPad</Link>
            </div>
          </details>
          {!loading && session?.role === "ADMIN" && (
            <Link href="/admin" className="font-semibold text-amber-600">Admin</Link>
          )}
        </nav>
        <form action="/products" method="get" className="order-last flex basis-full items-center gap-2 md:order-none md:ml-auto md:max-w-xs md:flex-1">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search products"
            className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <button type="submit" className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Search
          </button>
        </form>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {!loading && session?.role === "ADMIN" && (
            <Link href="/admin" className="hidden rounded-full bg-amber-500 px-3 py-2 text-sm font-bold text-white sm:inline-flex">Admin</Link>
          )}
          {loading ? <span className="hidden text-xs text-slate-400 sm:inline">Checking account...</span> : session ? <><span className="hidden text-xs font-semibold text-blue-700 lg:inline">Logged in as {session.name}</span><Link href="/account" className={`${navClass("/account")} hidden sm:block`}>Account</Link><button type="button" onClick={logout} disabled={loggingOut} className="hidden text-sm font-semibold text-slate-600 hover:text-blue-700 disabled:opacity-50 sm:block">{loggingOut ? "Logging out..." : "Log out"}</button></> : <span className="hidden text-xs font-semibold text-slate-500 lg:inline">Logged out</span>}
          {!loading && !session && <Link href="/login" className="hidden font-semibold text-blue-700 hover:text-blue-900 sm:block">Login</Link>}
          <Link href="/cart" className="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white sm:px-4 sm:text-base">Cart ({count})</Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="text-xl leading-none">{mobileMenuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
          <div className="container grid gap-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-700">Home</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-700">Products / Shop</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-700">About PaulTech</Link>
            <details className="group">
              <summary className="cursor-pointer list-none rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-700">Phones &amp; Tablets</summary>
              <div className="grid gap-1 border-l-2 border-blue-100 pl-3">
                <Link href="/products?category=iphone" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-blue-50 hover:text-blue-700">iPhone</Link>
                <Link href="/products?category=samsung" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-blue-50 hover:text-blue-700">Samsung</Link>
                <Link href="/products?category=google-pixel" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-blue-50 hover:text-blue-700">Pixel</Link>
                <Link href="/products?category=ipad" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-blue-50 hover:text-blue-700">iPad</Link>
              </div>
            </details>
            {!loading && session ? (
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-700">Account</Link>
            ) : !loading ? (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-blue-600 px-3 py-3 font-bold text-white hover:bg-blue-700">Login / Sign in</Link>
            ) : null}
            {!loading && !session && <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-blue-700 hover:bg-blue-50">Register</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
