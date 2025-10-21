import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('API de upload iniciada');
    
    // Verificar se é uma requisição POST
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Método não permitido' },
        { status: 405 }
      );
    }
    
    const formData = await request.formData();
    console.log('FormData recebido');
    
    const files = formData.getAll('images') as File[];
    console.log('Arquivos encontrados:', files.length);

    if (!files || files.length === 0) {
      console.log('Nenhum arquivo encontrado');
      return NextResponse.json(
        { error: 'Nenhuma imagem foi enviada' },
        { status: 400 }
      );
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', 'products');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedImages = [];

    for (const file of files) {
      console.log('Processando arquivo:', file.name, 'Tipo:', file.type, 'Tamanho:', file.size);
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        console.log('Arquivo rejeitado - não é imagem:', file.name);
        continue;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('Arquivo rejeitado - muito grande:', file.name);
        continue;
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const fileName = `product-${timestamp}-${randomString}.${extension}`;
      const filePath = join(uploadDir, fileName);
      
      console.log('Salvando arquivo:', fileName, 'em:', filePath);

      // Converter File para Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Salvar arquivo
      await writeFile(filePath, buffer);
      console.log('Arquivo salvo com sucesso:', fileName);

      // Adicionar à lista de imagens enviadas
      uploadedImages.push({
        originalName: file.name,
        fileName: fileName,
        url: `/products/${fileName}`,
        size: file.size,
        type: file.type
      });
    }

    console.log('Upload concluído. Total de imagens:', uploadedImages.length);
    
    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} imagem(ns) enviada(s) com sucesso`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Erro no upload de imagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 