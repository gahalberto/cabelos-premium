"use server";

import { db } from "@/app/_lib/prisma";

export async function getPosts(publishedOnly = false) {
  return db.post.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      coverImage: true,
      author: true,
      published: true,
      createdAt: true,
    },
  });
}

export async function getPostBySlug(slug: string) {
  return db.post.findUnique({ where: { slug } });
}
