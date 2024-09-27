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

    // Converter orderId de string para número
    const orderId = parseInt(session.metadata.orderId, 10);

    // Verificar se a conversão foi bem-sucedida
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'ID do pedido inválido' });
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

      // Atualizar o status do pedido no banco de dados para "Paid"
      await db.order.update({
        where: { id: orderId },
        data: { status: 'Paid' },
      });

      // Registrar a transação no banco de dados
      await db.transaction.create({
        data: {
          orderId: orderId,
          amount: amountTotal, // Usar o valor tratado
          status: 'Success',
        },
      });

    } else if (session.payment_status === 'unpaid' || session.payment_status === 'no_payment_required') {
      paymentStatus = 'Pending';
    } else if (session.payment_status === 'pending') {
      paymentStatus = 'Pending';
    } else {
      paymentStatus = 'Failed';

      // Registrar a transação como "Failed"
      await db.transaction.create({
        data: {
          orderId: orderId,
          amount: amountTotal,
          status: 'Failed',
        },
      });
    }

    // Responder com o status do pagamento
    return res.status(200).json({ paymentStatus });

  } catch (err) {
    console.error('Erro ao verificar pagamento:', err);
    return res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}
