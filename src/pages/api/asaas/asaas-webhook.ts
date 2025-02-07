import { NextApiRequest, NextApiResponse } from "next";


// pages/api/asaas-webhook.js
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse  
) {
    if (req.method === 'POST') {
      const event = req.body;
  
      // Verifique o tipo de evento recebido
      switch (event.event) {
        case 'PAYMENT_RECEIVED':
          const payment = event.payment;
          // Lógica para processar o pagamento recebido
          console.log(`Pagamento recebido: ${payment.id}`);
          break;
        // Adicione outros casos conforme necessário
        default:
          console.log(`Evento não tratado: ${event.event}`);
      }
  
      // Responda com status 200 para confirmar o recebimento
      res.status(200).json({ received: true });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Método ${req.method} não permitido`);
    }
  }
  