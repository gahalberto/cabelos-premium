"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "../log-activity";

interface UpdatePostData {
  id: string;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  author: string;
  published: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
}

function buildSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function updatePost(data: UpdatePostData) {
  const desiredSlug = data.slug ? buildSlug(data.slug) : buildSlug(data.title);
  const existing = await db.post.findFirst({
    where: { slug: desiredSlug, NOT: { id: data.id } },
  });

  const slug = existing ? `${desiredSlug}-${Date.now().toString().slice(-4)}` : desiredSlug;

  const post = await db.post.update({
    where: { id: data.id },
    data: {
      title: data.title,
      slug,
      content: data.content,
      summary: data.summary,
      coverImage: data.coverImage,
      author: data.author,
      published: data.published,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
      canonicalUrl: data.canonicalUrl,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  await logActivity({ action: "Editou", entity: "Post", entityId: post.id, entityName: post.title });

  return { success: true, post };
}
