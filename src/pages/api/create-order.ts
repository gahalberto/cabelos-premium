import { db } from '@/app/_lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, product, totalPrice } = req.body;

    try {
      // Log para capturar os dados recebidos na requisição
      console.log("Dados recebidos na criação do pedido:", { userId, product, totalPrice });

      // Verifica se todos os campos obrigatórios estão presentes
      if (!userId || !product || !totalPrice) {
        console.error("Campos obrigatórios ausentes");
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }

      // Busca o produto pelo nome, usando ProductWhereInput
      const productData = await db.product.findFirst({
        where: { name: product }, // Busca o produto pelo nome
      });

      // Verifica se o produto foi encontrado
      if (!productData) {
        console.error("Produto não encontrado");
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Criação do pedido no banco de dados
      const order = await db.order.create({
        data: {
          userId,
          products: {
            connect: [{ id: productData.id }], // Conecta o pedido ao produto pelo seu id
          },
          totalPrice,
          status: 'Pending',  // Status inicial do pedido
        },
      });

      // Log para capturar o pedido criado
      console.log("Pedido criado com sucesso:", order);

      // Retorna o pedido criado
      res.status(200).json(order);
    } catch (error) {
      console.error("Erro ao criar o pedido no banco de dados:", error);
      res.status(500).json({ error: 'Erro ao criar o pedido no banco de dados' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
