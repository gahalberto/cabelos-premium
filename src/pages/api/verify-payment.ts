import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@/app/_lib/stripe';
import { db } from '@/app/_lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  try {
    // Recuperar a sessão de pagamento do Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    // Verificar se a sessão tem metadata com orderId
    if (!session.metadata || !session.metadata.orderId) {
      return res.status(400).json({ error: 'Metadata do pedido não encontrado na sessão' });
    }

    // Obter orderId como string
    const orderId = session.metadata.orderId;

    // Verificar se o orderId foi fornecido
    if (!orderId) {
      return res.status(400).json({ error: 'ID do pedido não fornecido' });
    }

    // Buscar o pedido no banco de dados
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Obter o valor total da sessão e tratar se for null
    const amountTotal = session.amount_total !== null ? session.amount_total / 100 : 0;

    // Verificar o status do pagamento no Stripe
    let paymentStatus;
    if (session.payment_status === 'paid') {
      paymentStatus = 'Paid';

      // Atualizar o status do pedido no banco de dados para "CONFIRMED"
      await db.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      // Transação registrada com sucesso

    } else if (session.payment_status === 'unpaid' || session.payment_status === 'no_payment_required') {
      paymentStatus = 'Pending';
    } else if (session.payment_status === 'pending') {
      paymentStatus = 'Pending';
    } else {
      paymentStatus = 'Failed';

      // Transação falhou
    }

    // Responder com o status do pagamento
    return res.status(200).json({ paymentStatus });

  } catch (err) {
    console.error('Erro ao verificar pagamento:', err);
    return res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}
