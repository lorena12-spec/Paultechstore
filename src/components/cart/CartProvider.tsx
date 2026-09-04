"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type CartItem = { id: string; name: string; price: number; images: string; stock: number; quantity: number };
const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const activeStorageKey = accountId ? `pt_cart_${accountId}` : null;
  const ready = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadAccountCart() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        const nextAccountId = data.session?.id ?? null;
        setAccountId(nextAccountId);
        const key = nextAccountId ? `pt_cart_${nextAccountId}` : null;
        const saved = key ? localStorage.getItem(key) : null;
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        if (active) {
          setAccountId(null);
          setItems([]);
        }
      } finally {
        if (active) ready.current = true;
      }
    }

    function handleSessionChange(event: Event) {
      setAccountId(null);
      setItems([]);
      const session = (event as CustomEvent<{ session?: { id: string } | null }>).detail?.session;
      if (session === undefined) {
        loadAccountCart();
        return;
      }
      setAccountId(session?.id ?? null);
      const saved = session ? localStorage.getItem(`pt_cart_${session.id}`) : null;
      setItems(saved ? JSON.parse(saved) : []);
    }

    loadAccountCart();
    window.addEventListener("pt-session-changed", handleSessionChange);
    return () => {
      active = false;
      window.removeEventListener("pt-session-changed", handleSessionChange);
    };
  }, []);

  useEffect(() => {
    if (ready.current && activeStorageKey) localStorage.setItem(activeStorageKey, JSON.stringify(items));
  }, [items, activeStorageKey]);

  const add = (p: any) => setItems(current => {
    const found = current.find(i => i.id === p.id);
    if (found) return current.map(i => i.id === p.id ? { ...i, quantity: Math.min(i.quantity + 1, p.stock) } : i);
    return [...current, { id: p.id, name: p.name, price: p.price, images: p.images, stock: p.stock, quantity: 1 }];
  });
  const remove = (id: string) => setItems(current => current.filter(i => i.id !== id));
  const update = (id: string, quantity: number) => setItems(current => current.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  return <CartContext.Provider value={{ items, add, remove, update, clear, total, count: items.reduce((s,i)=>s+i.quantity,0) }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
