"use server";

import { db } from "@/app/_lib/prisma";

export async function getStoreConfig() {
  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    create: { id: "default", freeShippingThreshold: 0 },
    update: {},
  });

  return config;
}
