"use client";
import { FormEvent, useState } from "react";
import { CartProvider } from "./cart/CartProvider";

type ChatMessage = { from: "bot" | "customer"; text: string };

const quickQuestions = ["What phones do you sell?", "Do you deliver nationwide?", "How can I contact support?"];

function getBotReply(question: string) {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes("deliver") || normalizedQuestion.includes("ship")) {
    return "Yes, we offer nationwide delivery. Delivery details are confirmed during checkout.";
  }
  if (normalizedQuestion.includes("contact") || normalizedQuestion.includes("support") || normalizedQuestion.includes("help")) {
    return "Our support team is available on WhatsApp. Tap the WhatsApp button below to start a chat.";
  }
  if (normalizedQuestion.includes("phone") || normalizedQuestion.includes("sell") || normalizedQuestion.includes("device")) {
    return "We stock iPhones, Samsung Galaxy, Google Pixel phones and iPads. Visit Shop to browse the current products.";
  }
  return "I can help with products, delivery, and support. Choose a question below or message us on WhatsApp for personal assistance.";
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);

  function askQuestion(text: string) {
    const trimmedQuestion = text.trim();
    if (!trimmedQuestion) return;
    setMessages((currentMessages) => [
      ...currentMessages,
      { from: "customer", text: trimmedQuestion },
      { from: "bot", text: getBotReply(trimmedQuestion) }
    ]);
    setQuestion("");
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(question);
  }

  return (
    <CartProvider>
      {children}
      {open && (
        <section className="fixed bottom-24 right-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:right-6" aria-label="PaulTech Store chat">
          <div className="flex items-center justify-between bg-blue-700 px-4 py-3 text-white">
            <div>
              <p className="font-bold">PaulTech Assistant</p>
              <p className="text-xs text-blue-100">Usually replies instantly</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 text-xl leading-none hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white">&times;</button>
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((message, index) => (
              <p key={`${message.from}-${index}`} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.from === "customer" ? "ml-auto bg-blue-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="border-t bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((quickQuestion) => (
                <button key={quickQuestion} type="button" onClick={() => askQuestion(quickQuestion)} className="rounded-full border border-blue-200 px-2.5 py-1 text-left text-xs font-medium text-blue-700 hover:bg-blue-50">{quickQuestion}</button>
              ))}
            </div>
            <form onSubmit={submitQuestion} className="flex gap-2">
              <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Type a question..." aria-label="Type a question" className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <button type="submit" aria-label="Send message" className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white hover:bg-blue-800">Send</button>
            </form>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((isOpen) => !isOpen)} aria-expanded={open} aria-label={open ? "Close customer chat" : "Open customer chat"} title="Chat with PaulTech Assistant" className="fixed bottom-5 right-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-900/25 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:right-21">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-current stroke-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 18.5 4 21v-4.5A8.5 8.5 0 0 1 3 12a9 9 0 1 1 3 6.5H7Z" />
          <path strokeLinecap="round" d="M8 10.5h8M8 14h5" />
        </svg>
      </button>
      <a
        href="https://wa.me/2348086394208?text=Hello%20PaulTech%20Store%2C%20I%27d%20like%20some%20help."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with PaulTech Store on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/25 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 sm:bottom-6 sm:right-6"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
          <path d="M12.04 2a9.91 9.91 0 0 0-8.55 15l-1.02 3.72 3.81-1a9.91 9.91 0 1 0 5.76-17.72Zm0 18a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-2.26.59.6-2.2-.19-.3A8.06 8.06 0 1 1 12.04 20Zm4.42-6.04c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.57 6.57 0 0 1-1.93-1.19 7.24 7.24 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.01.4 1.35.51.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </CartProvider>
  );
}
