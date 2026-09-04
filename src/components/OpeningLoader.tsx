"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function OpeningLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading && pathname !== "/products") {
    return (
      <div className="flex min-h-[100vh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.25),_transparent_30%),linear-gradient(135deg,_#020817_0%,_#0f172a_32%,_#1d4ed8_100%)] text-white">
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(96,165,250,0.18),_transparent_50%)]" />
          <div className="absolute h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute h-96 w-96 rounded-full border border-white/10" />

          <div className="relative animate-[pulse_2s_ease-in-out_infinite]">
            <div className="absolute -inset-7 rounded-full border border-cyan-300/40" />
            <div className="absolute -inset-14 rounded-full border border-white/10" />
            <div className="relative flex h-40 w-56 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_0_60px_rgba(125,211,252,0.35)] backdrop-blur-md">
              <div className="absolute inset-2 rounded-[1.5rem] border border-white/20" />
              <img src="/logo.png.jpeg" alt="PaulTech Store" className="relative h-32 w-48 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]" />
            </div>
          </div>

          <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.6em] text-blue-100">Welcome to</p>
          <h1 className="relative mt-3 text-5xl font-black tracking-[-0.08em] md:text-7xl">PaulTech Store</h1>
          <p className="relative mt-3 text-sm font-medium text-cyan-100/90 md:text-base">Premium devices, beautifully delivered.</p>

          <div className="relative mt-7 h-1.5 w-64 overflow-hidden rounded-full bg-white/10 shadow-inner shadow-black/20">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-200 via-white to-blue-300 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-[loadingBar_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
