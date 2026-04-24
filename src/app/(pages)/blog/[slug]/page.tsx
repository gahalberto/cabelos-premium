import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug } from "@/app/_actions/admin/blog/get-posts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

// ─── SEO dinâmico via banco de dados ────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) return { title: "Post não encontrado" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.summary || "";
  // URL canônica: usa o campo do banco se preenchido, senão monta com siteUrl
  const canonicalUrl = post.canonicalUrl || `https://cabelospremium.com.br/blog/${post.slug}`;
  // Imagem OG: URL relativa é suficiente pois metadataBase está no root layout
  const ogImage = post.coverImage
    ? { url: post.coverImage, width: 1200, height: 630, alt: title }
    : { url: "/images/logoouro.png", width: 1200, height: 630, alt: "Cabelos Premium" };

  return {
    // Só o título — o template `%s | Cabelos Premium` do root layout completa
    title,
    description,
    keywords: post.keywords || undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Cabelos Premium",
      locale: "pt_BR",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

// ─── Estimativa de tempo de leitura ─────────────────────────────────────────
function readingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Componente JSON-LD (Schema.org BlogPosting) ────────────────────────────
function BlogPostingJsonLd({ post }: { post: Awaited<ReturnType<typeof getPostBySlug>> & {} }) {
  if (!post) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary || post.metaDescription || "",
    image: post.coverImage ? [post.coverImage] : [],
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Cabelos Premium",
      logo: {
        "@type": "ImageObject",
        url: "https://cabelospremium.com.br/favicon.png",
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonicalUrl || `https://cabelospremium.com.br/blog/${post.slug}`,
    },
    keywords: post.keywords || "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Página do Post ───────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.published) notFound();

  const minutes = readingTime(post.content);

  return (
    <>
      <BlogPostingJsonLd post={post} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#8a7d5c] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>
        </div>

        {/* Hero do Artigo */}
        <header className="max-w-3xl mx-auto px-4 mb-10">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min de leitura
            </span>
          </div>

          {/* Título */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            style={{ fontFamily: "var(--font-raleway, sans-serif)" }}
          >
            {post.title}
          </h1>

          {/* Resumo */}
          {post.summary && (
            <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-[#8a7d5c] pl-4">
              {post.summary}
            </p>
          )}
        </header>

        {/* Imagem de Capa */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </div>
        )}

        {/* Conteúdo do Artigo */}
        <article className="max-w-3xl mx-auto px-4 pb-20">
          <div
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-snug
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-[#8a7d5c] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-[#8a7d5c] prose-blockquote:text-gray-500
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700 prose-li:mb-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Divisor */}
          <hr className="my-12 border-gray-100" />

          {/* Autor */}
          <div className="flex items-center gap-4 p-6 bg-[#f9f7f4] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#8a7d5c] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Escrito por</p>
              <p className="font-semibold text-gray-900">{post.author}</p>
            </div>
          </div>

          {/* CTA voltar */}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#8a7d5c] text-[#8a7d5c] rounded-full text-sm font-semibold hover:bg-[#8a7d5c] hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver todos os artigos
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
