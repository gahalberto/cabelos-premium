"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AdminLayout } from "@/components/AdminLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Upload,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { getPosts, getPostBySlug } from "@/app/_actions/admin/blog/get-posts";
import { createPost } from "@/app/_actions/admin/blog/create-post";
import { updatePost } from "@/app/_actions/admin/blog/update-post";
import { deletePost } from "@/app/_actions/admin/blog/delete-post";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  coverImage?: string | null;
  author: string;
  published: boolean;
  createdAt: Date;
}

interface FormValues {
  title: string;
  content: string;
  summary: string;
  author: string;
  published: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
}

export default function AdminBlogPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      author: "",
      published: false,
      slug: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      canonicalUrl: "",
    },
  });

  const metaTitleValue = watch("metaTitle");
  const metaDescValue = watch("metaDescription");
  const titleValue = watch("title");

  // Auto-preencher slug a partir do título
  useEffect(() => {
    if (!editingPost) {
      const slug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [titleValue, editingPost, setValue]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data as Post[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function openCreate() {
    setEditingPost(null);
    setCoverPreview("");
    setSeoOpen(false);
    reset();
    setShowForm(true);
  }

  async function openEdit(post: Post) {
    setShowForm(true);
    setEditingPost(post);
    setCoverPreview(post.coverImage || "");
    setSeoOpen(false);

    // Busca o post completo (getPosts não retorna content para economizar banda)
    const full = await getPostBySlug(post.slug);
    if (!full) return;

    reset({
      title: full.title,
      content: full.content || "",
      summary: full.summary || "",
      author: full.author,
      published: full.published,
      slug: full.slug,
      metaTitle: full.metaTitle || "",
      metaDescription: full.metaDescription || "",
      keywords: full.keywords || "",
      canonicalUrl: full.canonicalUrl || "",
    });
  }

  function compressCover(file: File, maxWidth = 1280, quality = 0.82): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas não suportado"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Compressão falhou"))),
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressCover(file);
      const fd = new FormData();
      fd.append("image", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
      const res = await fetch("/api/admin/upload-blog-image", { method: "POST", body: fd });
      const text = await res.text();
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = JSON.parse(text);
      setCoverPreview(data.url);
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (err) {
      toast({ title: "Erro ao enviar imagem", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      if (editingPost) {
        await updatePost({
          id: editingPost.id,
          ...values,
          coverImage: coverPreview || undefined,
        });
        toast({ title: "Post atualizado com sucesso!" });
      } else {
        await createPost({
          ...values,
          coverImage: coverPreview || undefined,
        });
        toast({ title: "Post criado com sucesso!" });
      }
      setShowForm(false);
      loadPosts();
    } catch (err) {
      toast({ title: "Erro ao salvar post", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deletePost(id);
      toast({ title: "Post excluído" });
      loadPosts();
    } catch {
      toast({ title: "Erro ao excluir post", variant: "destructive" });
    }
  }

  if (status === "loading") return null;

  return (
    <AdminLayout title="Blog" description="Gerencie os artigos do blog">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{posts.length} artigo{posts.length !== 1 ? "s" : ""}</p>
          <Button onClick={openCreate} className="bg-[#8a7d5c] hover:bg-[#7a6d4c] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                {editingPost ? "Editar Artigo" : "Novo Artigo"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Título */}
                <div className="space-y-1.5">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" {...register("title", { required: true })} placeholder="Título do artigo" />
                </div>

                {/* Resumo */}
                <div className="space-y-1.5">
                  <Label htmlFor="summary">Resumo</Label>
                  <Textarea id="summary" {...register("summary")} rows={2} placeholder="Breve descrição exibida na listagem..." />
                </div>

                {/* Conteúdo */}
                <div className="space-y-1.5">
                  <Label>Conteúdo *</Label>
                  <RichTextEditor
                    value={watch("content")}
                    onChange={(val) => setValue("content", val, { shouldValidate: true })}
                    placeholder="Escreva o conteúdo do artigo..."
                  />
                </div>

                {/* Autor + Publicado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="author">Autor *</Label>
                    <Input id="author" {...register("author", { required: true })} placeholder="Nome do autor" />
                  </div>
                  <div className="flex items-end gap-3 pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-gray-300 text-[#8a7d5c]" />
                      <span className="text-sm font-medium text-gray-700">Publicado</span>
                    </label>
                  </div>
                </div>

                {/* Imagem de Capa */}
                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploading ? "Enviando..." : "Selecionar imagem"}
                      <input type="file" accept="image/*" onChange={handleUploadCover} className="hidden" disabled={uploading} />
                    </label>
                    {coverPreview && (
                      <div className="relative w-24 h-16 rounded overflow-hidden border border-gray-200">
                        <Image src={coverPreview} alt="Capa" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setCoverPreview("")}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-black/50 rounded text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO Avançado */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSeoOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#8a7d5c]" />
                      SEO Avançado
                    </span>
                    {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {seoOpen && (
                    <div className="p-4 space-y-4 bg-white">
                      {/* Slug */}
                      <div className="space-y-1.5">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 whitespace-nowrap">/blog/</span>
                          <Input id="slug" {...register("slug")} placeholder="meu-artigo-incrivel" className="flex-1" />
                        </div>
                      </div>

                      {/* Meta Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="metaTitle">Meta Title</Label>
                          <span className={`text-xs font-mono ${(metaTitleValue?.length || 0) > 60 ? "text-red-500" : "text-gray-400"}`}>
                            {metaTitleValue?.length || 0}/60
                          </span>
                        </div>
                        <Input
                          id="metaTitle"
                          {...register("metaTitle", { maxLength: 60 })}
                          placeholder="Título para Google (máx. 60 chars)"
                        />
                        {(metaTitleValue?.length || 0) > 60 && (
                          <p className="text-xs text-red-500">O Meta Title está acima do limite recomendado.</p>
                        )}
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="metaDescription">Meta Description</Label>
                          <span className={`text-xs font-mono ${(metaDescValue?.length || 0) > 160 ? "text-red-500" : "text-gray-400"}`}>
                            {metaDescValue?.length || 0}/160
                          </span>
                        </div>
                        <Textarea
                          id="metaDescription"
                          {...register("metaDescription", { maxLength: 160 })}
                          rows={2}
                          placeholder="Descrição para resultados de busca (máx. 160 chars)"
                        />
                        {(metaDescValue?.length || 0) > 160 && (
                          <p className="text-xs text-red-500">A Meta Description está acima do limite recomendado.</p>
                        )}
                      </div>

                      {/* Keywords */}
                      <div className="space-y-1.5">
                        <Label htmlFor="keywords">Palavras-chave</Label>
                        <Input id="keywords" {...register("keywords")} placeholder="cabelo, extensão, loiro, tutorial" />
                      </div>

                      {/* Canonical URL */}
                      <div className="space-y-1.5">
                        <Label htmlFor="canonicalUrl">URL Canônica</Label>
                        <Input id="canonicalUrl" {...register("canonicalUrl")} placeholder="https://cabelospremium.com.br/blog/..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="bg-[#8a7d5c] hover:bg-[#7a6d4c] text-white">
                    {submitting ? "Salvando..." : editingPost ? "Atualizar Artigo" : "Publicar Artigo"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Posts */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">Nenhum artigo criado ainda.</p>
            <Button onClick={openCreate} variant="outline" className="mt-4">
              Criar primeiro artigo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {post.coverImage ? (
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {post.published ? "Publicado" : "Rascunho"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(post.createdAt), "d MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                      {post.summary && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{post.summary}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Por {post.author} · /blog/{post.slug}</p>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(post)}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
