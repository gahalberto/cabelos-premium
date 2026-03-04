import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";

interface RouteParams {
  params: { id: string };
}

// PATCH – marcar como lida
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const contact = await db.contact.update({
      where: { id: params.id },
      data: { read: body.read ?? true },
    });
    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    return NextResponse.json({ success: false, message: "Erro ao atualizar" }, { status: 500 });
  }
}

// DELETE – excluir mensagem
export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await db.contact.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir contato:", error);
    return NextResponse.json({ success: false, message: "Erro ao excluir" }, { status: 500 });
  }
}
