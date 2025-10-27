"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Trash2,
  Eye
} from "lucide-react";
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
  maxImages = 10 
}: ImageUploadProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar imagens iniciais se existirem
  useEffect(() => {
    if (initialImages.length > 0) {
      const initialImageFiles = initialImages.map((url, index) => ({
        id: `initial-${index}`,
        file: undefined,
        preview: url,
        uploaded: true,
        url: url
      }));
      setImages(initialImageFiles);
      onImagesChange(initialImageFiles);
    }
  }, [initialImages, onImagesChange]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem válida`,
          variant: "destructive"
        });
        continue;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de 5MB`,
          variant: "destructive"
        });
        continue;
      }

      // Verificar limite de imagens
      if (images.length + newImages.length >= maxImages) {
        toast({
          title: "Limite de imagens",
          description: `Máximo de ${maxImages} imagens permitidas`,
          variant: "destructive"
        });
        break;
      }

      // Verificar se o arquivo é válido
      if (!file || file.size === 0) {
        continue;
      }

      const imageFile: ImageFile = {
        id: `temp-${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        uploaded: false
      };

      newImages.push(imageFile);
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const uploadImages = async () => {
    if (images.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    // Adicionar apenas as imagens não enviadas que têm arquivo
    const newImages = images.filter(img => !img.uploaded && img.file);
    console.log('Imagens para upload:', newImages);
    
    if (newImages.length === 0) {
      toast({
        title: "Nenhuma imagem para enviar",
        description: "Selecione imagens antes de fazer o upload",
        variant: "destructive"
      });
      setUploading(false);
      return;
    }
    
    newImages.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
        console.log('Adicionando imagem ao FormData:', img.file.name);
      }
    });

    try {
      console.log('Enviando FormData para API...');
      const response = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formData,
      });

      console.log('Resposta da API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        throw new Error(`Erro no upload: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Resultado do upload:', result);
      
      // Atualizar URLs das imagens enviadas
      const updatedImages = images.map(img => {
        if (!img.uploaded && img.file) {
          const uploadedImage = result.images.find((uploaded: any) => 
            uploaded.originalName === img.file?.name
          );
          if (uploadedImage) {
            return {
              ...img,
              uploaded: true,
              url: uploadedImage.url
            };
          }
        }
        return img;
      });

      setImages(updatedImages);
      onImagesChange(updatedImages);

      toast({
        title: "Upload realizado!",
        description: `${newImages.length} imagem(ns) enviada(s) com sucesso`,
      });
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar as imagens",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Imagens do Produto</Label>
        <p className="text-sm text-gray-600 mb-2">
          Adicione até {maxImages} imagens (máximo 5MB cada)
        </p>
      </div>

      {/* Área de Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-2">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <Button
              type="button"
              variant="outline"
              onClick={openFileSelector}
              disabled={images.length >= maxImages}
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Imagens
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF até 5MB
          </p>
        </div>
      </div>

      {/* Lista de Imagens */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Imagens Selecionadas ({images.length}/{maxImages})</h4>
            {images.some(img => !img.uploaded) && (
              <Button
                onClick={uploadImages}
                disabled={uploading}
                size="sm"
              >
                {uploading ? "Enviando..." : "Enviar Imagens"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <Image
                      src={image.preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-md"
                    />
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(image.preview, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Status de upload */}
                    {image.uploaded && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600 truncate">
                      {image.file?.name || 'Imagem carregada'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 