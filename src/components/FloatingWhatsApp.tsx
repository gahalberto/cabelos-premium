"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { contactConfig, getWhatsAppUrl } from "@/config/contact";

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar o botão após 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const { phoneNumber, message } = contactConfig.whatsapp;

  const handleWhatsAppClick = () => {
    try {
      console.log('🟢 Botão WhatsApp clicado!');
      console.log('📱 Número:', phoneNumber);
      console.log('💬 Mensagem:', message);
      
      // Gerar URL do WhatsApp
      const url = getWhatsAppUrl(phoneNumber, message);
      console.log('🔗 URL gerada:', url);
      
      // Abrir diretamente no WhatsApp
      window.open(url, '_blank');
      console.log('✅ WhatsApp aberto com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao abrir WhatsApp:', error);
      // Fallback: tentar abrir no navegador
      const url = getWhatsAppUrl(phoneNumber, message);
      window.open(url, '_blank');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Botão principal do WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
          aria-label="Falar no WhatsApp"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Falar no WhatsApp
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>

        {/* Indicador de notificação */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold">1</span>
        </div>
        
        {/* Badge de status online */}
        <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full h-4 w-4"></div>
      </div>
    </div>
  );
} 