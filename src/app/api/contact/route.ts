import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/app/_lib/prisma";

// Esquema de validação com Zod
const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar dados com Zod
    const validatedData = contactSchema.parse(body);
    
    // Salvar no banco de dados usando Prisma
    const contact = await db.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });
    
    // Retornar resposta de sucesso
    return NextResponse.json({ 
      success: true, 
      message: "Mensagem enviada com sucesso!",
      contactId: contact.id 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Erro ao processar contato:", error);
    
    // Verificar se é um erro de validação do Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Dados inválidos", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar sua solicitação" 
    }, { status: 500 });
  }
}

// Rota GET para obter todos os contatos (apenas para fins administrativos)
export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao buscar contatos" 
    }, { status: 500 });
  }
} 