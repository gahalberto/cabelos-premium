"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Minus,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, ImageIcon, Highlighter,
  Undo, Redo, Upload, X, Check,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Extensão de imagem customizada com suporte a alt
const ImageWithAlt = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: null },
      title: { default: null },
    };
  },
});

function ToolbarButton({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-[#8a7d5c] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageWithAlt.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#8a7d5c] underline" } }),
      Placeholder.configure({ placeholder: placeholder || "Escreva o conteúdo do artigo..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[420px] px-6 py-5 focus:outline-none text-gray-800 " +
          "prose-headings:font-bold prose-headings:text-gray-900 " +
          "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl " +
          "prose-a:text-[#8a7d5c] prose-blockquote:border-l-[#8a7d5c] " +
          "prose-img:rounded-xl prose-img:shadow-md",
      },
    },
  });

  // Sincroniza quando o valor externo muda (ex: abrir edição de outro post / reset do form)
  const isInternalChange = useRef(false);
  useEffect(() => {
    if (!editor || isInternalChange.current) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  // Marca mudanças vindas do próprio editor para não fazer loop
  useEffect(() => {
    if (!editor) return;
    const handler = () => { isInternalChange.current = true; setTimeout(() => { isInternalChange.current = false; }, 0); };
    editor.on("update", handler);
    return () => { editor.off("update", handler); };
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!linkUrl || !editor) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (!imgUrl || !editor) return;
    editor.chain().focus().setImage({ src: imgUrl, alt: imgAlt || undefined }).run();
    setImgUrl("");
    setImgAlt("");
    setImgDialogOpen(false);
  }, [editor, imgUrl, imgAlt]);

  const compressImage = (file: File, maxWidth = 1280, quality = 0.82): Promise<Blob> =>
    new Promise((resolve, reject) => {
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("image", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
      const res = await fetch("/api/admin/upload-blog-image", { method: "POST", body: fd });
      const text = await res.text();
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = JSON.parse(text);
      if (data.url) setImgUrl(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
        {/* Histórico */}
        <ToolbarButton title="Desfazer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Refazer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton title="Título 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Título 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Título 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Inline */}
        <ToolbarButton title="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Sublinhado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Tachado" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Destaque" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Código inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Alinhamento */}
        <ToolbarButton title="Alinhar esquerda" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Centralizar" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Alinhar direita" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Listas */}
        <ToolbarButton title="Lista com marcadores" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Citação" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Linha divisória" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton title="Inserir link" active={editor.isActive("link")} onClick={() => { setLinkUrl(editor.getAttributes("link").href || ""); setLinkDialogOpen((v) => !v); }}>
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          {linkDialogOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72 flex gap-2">
              <input
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertLink()}
                placeholder="https://..."
                className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#8a7d5c]"
              />
              <button type="button" onClick={insertLink} className="p-1.5 bg-[#8a7d5c] text-white rounded hover:bg-[#7a6d4c]">
                <Check className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setLinkDialogOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Imagem */}
        <div className="relative">
          <ToolbarButton title="Inserir imagem" onClick={() => setImgDialogOpen((v) => !v)}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          {imgDialogOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inserir imagem</p>

              {/* Upload */}
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#8a7d5c] hover:text-[#8a7d5c] transition-colors">
                <Upload className="h-4 w-4 flex-shrink-0" />
                {uploading ? "Enviando..." : "Fazer upload de imagem"}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-200" />
                ou
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* URL */}
              <input
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="URL da imagem"
                className="w-full text-sm border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#8a7d5c]"
              />

              {/* Alt text */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Alt Text <span className="text-gray-400">(acessibilidade + SEO)</span></label>
                <input
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  placeholder="Descrição da imagem..."
                  className="w-full text-sm border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#8a7d5c]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={insertImage}
                  disabled={!imgUrl}
                  className="flex-1 py-1.5 bg-[#8a7d5c] text-white text-sm rounded-lg hover:bg-[#7a6d4c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Inserir
                </button>
                <button
                  type="button"
                  onClick={() => { setImgDialogOpen(false); setImgUrl(""); setImgAlt(""); }}
                  className="px-3 py-1.5 border border-gray-200 text-sm rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Editor ──────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Contagem ────────────────────────────────────── */}
      <div className="flex justify-end px-4 py-1.5 border-t border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-400">
          {editor.storage.characterCount?.characters?.() ?? editor.getText().length} caracteres
        </span>
      </div>
    </div>
  );
}
