"use server";

import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface LogActivityParams {
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  details?: string;
}

export async function logActivity({ action, entity, entityId, entityName, details }: LogActivityParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;

    await db.activityLog.create({
      data: {
        userId: (session.user as any).id || "unknown",
        userName: session.user.name || "Desconhecido",
        userEmail: session.user.email,
        action,
        entity,
        entityId,
        entityName,
        details,
      },
    });
  } catch {
    // Silently fail — don't break the main action if logging fails
  }
}
