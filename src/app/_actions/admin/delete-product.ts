"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { logActivity } from "./log-activity";

export async function deleteProduct(id: string) {
  // VENDEDOR não pode excluir produtos
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role === "VENDEDOR") {
    throw new Error("Sem permissão para excluir produtos");
  }

  try {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) throw new Error("Produto não encontrado");

    const productName = product.name;

    await db.$transaction([
      db.cartItem.deleteMany({ where: { productId: id } }),
      db.wishlistItem.deleteMany({ where: { productId: id } }),
      db.review.deleteMany({ where: { productId: id } }),
      db.orderItem.deleteMany({ where: { productId: id } }),
      db.product.delete({ where: { id } }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/shop");
    await logActivity({ action: "Excluiu", entity: "Produto", entityId: id, entityName: productName });

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw new Error("Não foi possível excluir o produto");
  }
} 