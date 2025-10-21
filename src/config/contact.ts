// Configurações de contato para o botão flutuante do WhatsApp
export const contactConfig = {
  whatsapp: {
    phoneNumber: "5511999999999", // Substitua pelo número real (formato: 55 + DDD + número)
    message: "Olá! Gostaria de saber mais sobre os produtos de cabelos premium.",
    businessHours: "Seg-Sex 8h às 18h",
    responseTime: "Resposta em até 2 horas"
  },
  phone: {
    number: "5511999999999", // Substitua pelo número real
    businessHours: "Seg-Sex 8h às 18h"
  },
  email: {
    address: "contato@cabelospremium.com",
    businessHours: "Seg-Sex 8h às 18h"
  }
};

// Função para gerar URL do WhatsApp
export const getWhatsAppUrl = (phoneNumber: string, message: string) => {
  // Remove caracteres especiais do número
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};



// Função para gerar URL de telefone
export const getPhoneUrl = (phoneNumber: string) => {
  return `tel:+${phoneNumber}`;
}; 