import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/app/_actions/admin/blog/get-posts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Cabelos Premium",
  description: "Dicas, tutoriais e tendências do mundo dos cabelos humanos. Aprenda com especialistas.",
  openGraph: {
    title: "Blog | Cabelos Premium",
    description: "Dicas, tutoriais e tendências do mundo dos cabelos humanos.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getPosts(true);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#f9f7f4] border-b border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8a7d5c] mb-3">
            Nosso Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-raleway, sans-serif)" }}>
            Conhecimento &amp; Inspiração
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Tutoriais, tendências e cuidados para quem vive o universo dos cabelos humanos.
          </p>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Nenhum artigo publicado ainda. Volte em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col">
                <Link href={`/blog/${post.slug}`} className="block mb-4 overflow-hidden rounded-2xl">
                  {post.coverImage ? (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-[#f9f7f4] rounded-2xl flex items-center justify-center">
                      <span className="text-4xl">✍️</span>
                    </div>
                  )}
                </Link>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8a7d5c] transition-colors leading-snug" style={{ fontFamily: "var(--font-raleway, sans-serif)" }}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.summary && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{post.summary}</p>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a7d5c] hover:gap-3 transition-all duration-200 mt-auto"
                >
                  Ler artigo <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
