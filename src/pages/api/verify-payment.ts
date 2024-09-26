// src/pages/api/verify-payment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@/app/_lib/stripe';
import { db } from '@/app/_lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    // Verifique se metadata não é nulo
    if (!session.metadata || !session.metadata.orderId) {
      return res.status(400).json({ error: 'Metadata do pedido não encontrado na sessão' });
    }

    // Converter o orderId de string para número, se necessário
    const orderId = parseInt(session.metadata.orderId, 10);

    // Verifique se a conversão foi bem-sucedida
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'ID do pedido inválido' });
    }

    // Verifique o status do pedido no banco de dados
    const order = await db.order.findUnique({
      where: { id: orderId }, // Certifique-se de que o `id` está correto
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (order.status === 'Paid') {
      res.status(200).json({ paymentStatus: 'Paid' });
    } else {
      res.status(200).json({ paymentStatus: 'Pending' });
    }
  } catch (err) {
    console.error('Erro ao verificar pagamento:', err);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}
