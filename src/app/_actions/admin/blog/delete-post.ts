"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "../log-activity";

export async function deletePost(id: string) {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post não encontrado");

  await db.post.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  await logActivity({ action: "Excluiu", entity: "Post", entityId: id, entityName: post.title });

  return { success: true };
}
