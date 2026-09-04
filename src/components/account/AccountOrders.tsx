"use client";

import { useState } from "react";
import { naira } from "@/lib/utils";
import CancelOrderButton from "./CancelOrderButton";

type AccountOrder = { id: string; total: number; status: string; createdAt: string };
const stages = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AccountOrders({ orders }: { orders: AccountOrder[] }) {
  const [currentOrders, setCurrentOrders] = useState(orders);

  function markCancelled(orderId: string) {
    setCurrentOrders((items) => items.map((item) => item.id === orderId ? { ...item, status: "CANCELLED" } : item));
  }

  if (!currentOrders.length) return <p className="mt-4 text-slate-500">You have no orders yet.</p>;

  return <>{currentOrders.map((order) => { const currentStage = stages.indexOf(order.status); return <div key={order.id} className="border-b py-5 last:border-0"><div className="flex flex-wrap justify-between gap-3"><span className="font-bold">Order #{order.id.slice(-8)}</span><b>{naira(order.total)}</b></div><p className="mt-1 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleDateString()} · {order.status}</p>{order.status !== "CANCELLED" && <div className="mt-4 grid grid-cols-5 gap-1 text-center text-[10px] font-semibold text-slate-400">{stages.map((stage, index) => <div key={stage} className={index <= currentStage ? "text-blue-700" : ""}><div className={index <= currentStage ? "mb-1 h-2 rounded-full bg-blue-600" : "mb-1 h-2 rounded-full bg-slate-200"} />{stage}</div>)}</div>}{order.status === "CANCELLED" ? <p className="mt-4 font-semibold text-red-600">Order cancelled</p> : ["PENDING", "PAID", "PROCESSING"].includes(order.status) && <CancelOrderButton orderId={order.id} onCancelled={() => markCancelled(order.id)} />}</div>; })}</>;
}
