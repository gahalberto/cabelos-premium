"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Trash2, Eye, GripVertical, Star } from "lucide-react";
import Image from "next/image";

interface ImageFile {
  id: string;
  file?: File;
  preview: string;
  uploaded: boolean;
  url?: string;
}

interface ImageUploadProps {
  onImagesChange: (images: ImageFile[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export function ImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (initialImages.length > 0) {
      initialized.current = true;
      const initial = initialImages.map((url, i) => ({
        id: `initial-${i}-${url}`,
        preview: url,
        uploaded: true,
        url,
      }));
      setImages(initial);
      onImagesChange(initial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImages]);

  const update = useCallback(
    (next: ImageFile[]) => {
      setImages(next);
      onImagesChange(next);
    },
    [onImagesChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast({ title: "Arquivo inválido", description: `${file.name} não é uma imagem`, variant: "destructive" });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Arquivo muito grande", description: `${file.name} excede 5MB`, variant: "destructive" });
        continue;
      }
      if (images.length + newImages.length >= maxImages) {
        toast({ title: "Limite atingido", description: `Máximo de ${maxImages} imagens`, variant: "destructive" });
        break;
      }
      newImages.push({ id: `temp-${Date.now()}-${i}`, file, preview: URL.createObjectURL(file), uploaded: false });
    }

    if (newImages.length > 0) update([...images, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => update(images.filter((img) => img.id !== id));

  // Drag & drop reorder
  const onDragStart = (index: number) => { dragItem.current = index; };
  const onDragEnter = (index: number) => { dragOver.current = index; };
  const onDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, moved);
    dragItem.current = null;
    dragOver.current = null;
    update(reordered);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    update(reordered);
  };

  const uploadImages = async () => {
    const newImages = images.filter((img) => !img.uploaded && img.file);
    if (newImages.length === 0) {
      toast({ title: "Nenhuma imagem para enviar", variant: "destructive" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    newImages.forEach((img) => { if (img.file) formData.append("images", img.file); });

    try {
      const res = await fetch("/api/admin/upload-images", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const result = await res.json();

      const updated = images.map((img) => {
        if (!img.uploaded && img.file) {
          const found = result.images.find((u: { originalName: string; url: string }) => u.originalName === img.file?.name);
          if (found) return { ...img, uploaded: true, url: found.url };
        }
        return img;
      });

      update(updated);
      toast({ title: "Upload realizado!", description: `${newImages.length} imagem(ns) enviada(s)` });
    } catch (err) {
      toast({ title: "Erro no upload", description: err instanceof Error ? err.message : "Tente novamente", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const hasPending = images.some((img) => !img.uploaded);

  return (
    <div className="space-y-4">
      <div>
        <Label>Imagens do Produto</Label>
        <p className="text-sm text-gray-500 mt-0.5">
          Até {maxImages} imagens (máx. 5 MB cada). Arraste para reordenar — a primeira é a foto principal.
        </p>
      </div>

      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {images.length}/{maxImages} imagem{images.length !== 1 ? "ns" : ""}
            </span>
            {hasPending && (
              <Button onClick={uploadImages} disabled={uploading} size="sm" type="button">
                {uploading ? "Enviando…" : "Enviar imagens"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="relative group rounded-lg border border-gray-200 overflow-hidden bg-gray-50 cursor-grab active:cursor-grabbing select-none"
              >
                {/* Badge principal */}
                {index === 0 && (
                  <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    Principal
                  </div>
                )}

                {/* Badge upload pendente */}
                {!image.uploaded && (
                  <div className="absolute top-1.5 right-1.5 z-10 bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    Pendente
                  </div>
                )}

                {/* Badge enviado */}
                {image.uploaded && index !== 0 && (
                  <div className="absolute top-1.5 right-1.5 z-10 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    ✓
                  </div>
                )}

                {/* Imagem */}
                <div className="aspect-square relative">
                  <Image src={image.preview} alt={`Foto ${index + 1}`} fill className="object-cover" unoptimized />

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => window.open(image.preview, "_blank")}
                      className="p-1.5 bg-white/90 rounded hover:bg-white transition-colors"
                      title="Ver em tamanho real"
                    >
                      <Eye className="h-3.5 w-3.5 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-1.5 bg-white/90 rounded hover:bg-red-50 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  </div>

                  {/* Handle drag */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white drop-shadow" />
                  </div>
                </div>

                {/* Controles de ordem */}
                <div className="flex items-center justify-between px-1.5 py-1 bg-white border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">#{index + 1}</span>
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Mover para esquerda"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Mover para direita"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de upload */}
      {images.length < maxImages && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          <ImageIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <div className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 text-gray-700 font-medium">
              <Upload className="h-3.5 w-3.5" />
              Selecionar imagens
            </span>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 5 MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
