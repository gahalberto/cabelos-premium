// src/pages/api/checkout_sessions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@/app/_lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { plan, orderId } = req.body;  // Agora recebemos o orderId também

  // Substitua pelos Price IDs reais do Stripe
  const priceMap: Record<string, string> = {
    basic: 'price_1PzQxlAPi1RoFAXHbwR52LRs',  // Substitua pelo ID real do preço do plano Básico
    silver: 'price_1Pzd4fAPi1RoFAXHzoOw6yyk', // Substitua pelo ID real do preço do plano Silver
    premium: 'price_1Pzd5NAPi1RoFAXHjTD8Ily8', // Substitua pelo ID real do preço do plano Premium
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        orderId: orderId,  // Adicionando o orderId como metadata
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Tratamento seguro do erro
      console.error('Erro ao criar a sessão de checkout:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      // Caso o erro não seja do tipo `Error`
      console.error('Erro desconhecido ao criar a sessão de checkout:', err);
      res.status(500).json({ error: 'Erro desconhecido ao criar a sessão de checkout' });
    }
  }
}
