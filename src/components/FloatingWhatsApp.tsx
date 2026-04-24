"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useContactConfig } from "@/contexts/ContactConfigContext";
import { getWhatsAppUrl } from "@/config/contact";

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const { whatsappMain, whatsappMessage } = useContactConfig();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const url = getWhatsAppUrl(whatsappMain, whatsappMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
          aria-label="Falar no WhatsApp"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />

          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Falar no WhatsApp
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-gray-900" />
          </div>
        </a>

        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold">1</span>
        </div>

        <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full h-4 w-4" />
      </div>
    </div>
  );
}
