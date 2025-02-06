// /pages/api/checkout_sessions_pagseguro.ts
import type { NextApiRequest, NextApiResponse } from "next";

interface Customer {
  Name: string;
  email: string;
  tax_id: string;
}

interface CheckoutItem {
  reference_id: string;
  name: string;
  description: string;
  quantity: number;
  unit_amount: number;
}

async function createPagSeguroCheckout(
  customer: Customer,
  items: CheckoutItem[],
  redirectUrl: string
): Promise<string> {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization:
        'Bearer 44106d74-5c33-437e-8e4d-c92bd43f5974b22d319d48aca283cad38492403b701a0987-6e7e-496c-98c4-5d5ee24c7153', // substitua pelo seu token real
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer, // objeto com Name, email e tax_id
      customer_modifiable: true,
      items, // array de itens do checkout (nesse caso, somente um item)
      payment_methods: [
        { type: 'DEBIT_CARD' },
        { type: 'BOLETO' },
        { type: 'PIX' },
      ],
      redirect_url: redirectUrl,
    }),
  };

  const response = await fetch('https://sandbox.api.pagseguro.com/checkouts', options);
  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.error_messages && data.error_messages.length > 0
        ? data.error_messages[0].description
        : 'Erro ao criar o checkout';
    throw new Error(errorMessage);
  }

  // Procura pelo link de pagamento com rel "PAY"
  const payLink = data.links.find((link: { rel: string; href: string }) => link.rel === 'PAY');
  if (!payLink) {
    throw new Error('Link de pagamento não encontrado na resposta.');
  }

  return payLink.href;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Recebemos do body: customer (opcional), plan (deve ser "basic" ou "silver") e, opcionalmente, redirectUrl
    const { customer, plan, redirectUrl } = req.body;

    const checkoutCustomer: Customer = customer || {
      Name: 'Gabriel',
      email: 'gabriel@teste.com',
      tax_id: '41285305817',
    };

    // Monta o item com base no plano selecionado.
    // Se for "silver" (Perfil Premium) usa valor 49; caso contrário, assume o plano básico com 29.
    let checkoutItem: CheckoutItem;
    if (plan === 'silver') {
      checkoutItem = {
        reference_id: 'PLANO2',
        name: 'Perfil Premium',
        description: 'Plano na plataforma InMemorian',
        quantity: 1,
        unit_amount: 4900,
      };
    } else {
      checkoutItem = {
        reference_id: 'basic1',
        name: 'Perfil Básico',
        description: 'Plano na plataforma InMemorian',
        quantity: 1,
        unit_amount: 2900,
      };
    }

    // Prepara o array com somente o item selecionado
    const checkoutItems: CheckoutItem[] = [checkoutItem];

    const checkoutRedirectUrl: string =
      redirectUrl || 'https://inmemorian.com.br/success/pagseguro';

    // Cria o checkout e obtém a URL para redirecionamento
    const url = await createPagSeguroCheckout(checkoutCustomer, checkoutItems, checkoutRedirectUrl);

    // Retorna a URL para o front-end redirecionar o usuário
    return res.status(200).json({ url });
  } catch (error: any) {
    console.error('Erro ao criar checkout no Pagseguro:', error);
    return res.status(400).json({ error: error.message });
  }
}
