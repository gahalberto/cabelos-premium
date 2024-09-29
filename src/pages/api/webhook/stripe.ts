import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import stripe from '@/app/_lib/stripe';
import { db } from '@/app/_lib/prisma';

// Desabilitar bodyParser para capturar buffer bruto
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`Erro ao verificar o webhook: ${err}`);
      return res.status(400).send(`Webhook error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Processa os eventos recebidos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Pagamento realizado com sucesso: ${paymentIntent.id}`);

        // Atualize o perfil no banco de dados após o pagamento
        const profile = await db.memoriaProfiles.findFirst({
          where: { paymentId: paymentIntent.id },
        });

        if (profile) {
          await db.memoriaProfiles.update({
            where: { id: profile.id }, // Agora você usa o id do Profile encontrado
            data: { isApproved: true },
          });
          console.log(`Perfil ${profile.id} aprovado com sucesso.`);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Fatura paga com sucesso: ${invoice.id}`);

        // Primeiro, busque a assinatura usando stripeInvoiceId
        const subscription = await db.subscription.findFirst({
          where: { stripeInvoiceId: invoice.id }, // Usando stripeInvoiceId para encontrar a assinatura
        });

        if (subscription) {
          // Se a assinatura for encontrada, atualize-a
          await db.subscription.update({
            where: { id: subscription.id }, // Use o campo id da assinatura encontrada
            data: { active: true, startDate: new Date() },
          });
          console.log(`Assinatura ${subscription.id} ativada com sucesso.`);
        }

        // Atualizar o status do pedido correspondente no banco de dados para "Paid"
        if (invoice.metadata?.orderId) {
          const orderId = invoice.metadata.orderId;
          await db.order.update({
            where: { id: Number(orderId) },
            data: { status: 'Paid' },
          });
          console.log(`Pedido ${orderId} atualizado para "Paid".`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Falha no pagamento: ${failedIntent.id}`);
        break;

      default:
        console.warn(`Evento desconhecido: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

