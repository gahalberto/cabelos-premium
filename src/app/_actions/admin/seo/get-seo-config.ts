"use server";

import { db } from "@/app/_lib/prisma";

export async function getSEOConfig(pageId: string) {
  return db.sEOConfig.findUnique({ where: { id: pageId } });
}

export async function getAllSEOConfigs() {
  return db.sEOConfig.findMany({ orderBy: { id: "asc" } });
}

export async function getTrackingConfig() {
  return db.storeConfig.findUnique({
    where: { id: "default" },
    select: {
      gtmId: true,
      ga4Id: true,
      metaPixelId: true,
      customHeadScripts: true,
      customBodyScripts: true,
      robotsContent: true,
    },
  });
}
