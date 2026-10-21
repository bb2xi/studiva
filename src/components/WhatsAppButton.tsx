"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function WhatsAppButton({ message, label }: { message: string; label: string }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clay text-white shadow-elevated transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-clay-dark active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={26} />
    </a>
  );
}
