"use client";
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

// Verifica se a chave pública do Stripe está definida
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const CheckoutComponent = () => {
  const [error, setError] = useState<string | null | undefined>(null);

  const handleCheckout = async (plan: string) => {
    const stripe = await stripePromise;

    if (!stripe) {
      setError('Chave pública do Stripe não encontrada.');
      return;
    }

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar a sessão de checkout');
      }

      const session = await response.json();

      // Redireciona o usuário para o Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro inesperado');
      }
      console.error('Erro ao redirecionar para o checkout:', error);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <button onClick={() => handleCheckout('basic')}>Plano Básico - R$19,90</button>
      <button onClick={() => handleCheckout('silver')}>Plano Silver - R$34,90</button>
      <button onClick={() => handleCheckout('premium')}>Plano Premium - R$49,90</button>
    </div>
  );
};

export default CheckoutComponent;
