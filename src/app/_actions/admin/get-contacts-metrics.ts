"use server";

import { db } from "@/app/_lib/prisma";

export async function getContactsMetrics() {
  try {
    const unreadCount = await db.contact.count({ where: { read: false } });
    return { success: true, unreadCount };
  } catch {
    return { success: false, unreadCount: 0 };
  }
}
