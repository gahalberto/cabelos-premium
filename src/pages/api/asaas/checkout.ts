"use server";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const token = `$${process.env.PAGASAAS_KEY}`;
      console.log("Token carregado:", token); // Deve exibir o token no console

      const { name, cpfCnpj, email, order } = req.body;

      if (!name || !cpfCnpj || !email) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      // Criar cliente no ASAAS
      const customerResponse = await axios.post(
        "https://api-sandbox.asaas.com/v3/customers",
        { name, cpfCnpj, email },
        {
          headers: {
            access_token: token, // Sem `$`
          },
        }
      );

      const customerId = customerResponse.data.id;

      console.log(`CLIENTE CRIADO NO ASAAS: ${customerId}`);

      // Definir data de vencimento no formato YYYY-MM-DD
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      const formattedDueDate = dueDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD

      // Criar pagamento
      const paymentResponse = await axios.post(
        "https://api-sandbox.asaas.com/v3/payments",
        {
          billingType: "CREDIT_CARD",
          value: 5.00, // Usa o valor enviado no body
          dueDate: formattedDueDate,
          customer: customerId,
          description: `Pedido ${order}`,
          callback: {successUrl: `https://inmemorian.com.br/success/${order}`, autoRedirect: true}
        },
        {
          headers: {
            access_token: token,
          },
        }
      );

      console.log(`PAGAMENTO CRIADO: ${paymentResponse.data.id}`);

      res.status(200).json({ clientId: customerId, paymentId: paymentResponse.data.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: true, // Certifique-se de que o bodyParser está ativado
  },
};
