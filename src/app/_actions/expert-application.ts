"use server";

import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

interface ExpertApplicationData {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  document: string;
  socialMedia: string;
}

export async function submitExpertApplication(data: ExpertApplicationData) {
  try {
    // Verificar se já existe uma aplicação com este documento
    const existingApplication = await db.expertApplication.findFirst({
      where: { 
        OR: [
          { cnpj: data.document },
          { email: data.email }
        ]
      }
    });

    if (existingApplication) {
      if (existingApplication.cnpj === data.document) {
        throw new Error("Já existe uma aplicação com este CPF/CNPJ");
      }
      if (existingApplication.email === data.email) {
        throw new Error("Já existe uma aplicação com este e-mail");
      }
    }

    // Separar o nome completo em nome e sobrenome
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Criar a aplicação
    const application = await db.expertApplication.create({
      data: {
        name: firstName,
        lastName: lastName,
        email: data.email,
        phone: data.phone,
        cnpj: data.document,
        companyName: data.companyName,
        businessDescription: `Rede Social: ${data.socialMedia}`,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        website: null,
        instagram: data.socialMedia,
        experience: '',
        specialties: [],
        status: "PENDING", // PENDING, APPROVED, REJECTED
        isApproved: false
      }
    });

    revalidatePath("/admin/expert-applications");

    return { 
      success: true, 
      message: "Aplicação enviada com sucesso",
      applicationId: application.id
    };
  } catch (error) {
    console.error("Erro ao enviar aplicação:", error);
    throw error;
  }
}

export async function getExpertApplications() {
  try {
    const applications = await db.expertApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return applications;
  } catch (error) {
    console.error("Erro ao buscar aplicações:", error);
    throw error;
  }
}

export async function updateExpertApplicationStatus(
  applicationId: string, 
  status: "APPROVED" | "REJECTED",
  notes?: string
) {
  try {
    const application = await db.expertApplication.update({
      where: { id: applicationId },
      data: {
        status,
        isApproved: status === "APPROVED",
        notes: notes || null,
        reviewedAt: new Date()
      }
    });

    // Se aprovado, criar usuário com role ESPECIALISTA
    if (status === "APPROVED") {
      // Aqui você pode implementar a lógica para criar o usuário
      // ou enviar um e-mail com instruções para criar a conta
      console.log("Aplicação aprovada:", application.email);
    }

    revalidatePath("/admin/expert-applications");

    return { 
      success: true, 
      message: `Aplicação ${status === "APPROVED" ? "aprovada" : "rejeitada"} com sucesso` 
    };
  } catch (error) {
    console.error("Erro ao atualizar status da aplicação:", error);
    throw error;
  }
}

export async function deleteExpertApplication(applicationId: string) {
  try {
    await db.expertApplication.delete({
      where: { id: applicationId }
    });

    revalidatePath("/admin/expert-applications");

    return { 
      success: true, 
      message: "Aplicação removida com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao remover aplicação:", error);
    throw error;
  }
} 