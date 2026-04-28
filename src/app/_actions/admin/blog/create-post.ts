"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "../log-activity";

interface CreatePostData {
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

function buildSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createPost(data: CreatePostData) {
  const baseSlug = data.slug ? buildSlug(data.slug) : buildSlug(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (await db.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const post = await db.post.create({
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
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");
  await logActivity({ action: "Criou", entity: "Post", entityId: post.id, entityName: post.title });

  return { success: true, post };
}
