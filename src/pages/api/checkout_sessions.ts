// src/pages/api/checkout_sessions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@/app/_lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.body;  // Agora recebemos o orderId também

  // Substitua pelos Price IDs reais do Stripe
  // const priceMap: Record<string, string> = {
  //   basic: 'price_1Qp7ymHuFaJMNSgMfynMaZEr',  // Substitua pelo ID real do preço do plano Básico
  // };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: `price_1Qp7ymHuFaJMNSgMfynMaZEr`,
          quantity: 1,
        },
      ],
      mode: 'payment',
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
