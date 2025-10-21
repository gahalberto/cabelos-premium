"use server";

import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

interface ExpertApplicationData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cnpj: string;
  companyName: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  instagram?: string;
  experience: string;
  specialties: string[];
}

export async function submitExpertApplication(data: ExpertApplicationData) {
  try {
    // Verificar se já existe uma aplicação com este CNPJ
    const existingApplication = await db.expertApplication.findUnique({
      where: { cnpj: data.cnpj }
    });

    if (existingApplication) {
      throw new Error("Já existe uma aplicação com este CNPJ");
    }

    // Verificar se já existe uma aplicação com este e-mail
    const existingEmailApplication = await db.expertApplication.findUnique({
      where: { email: data.email }
    });

    if (existingEmailApplication) {
      throw new Error("Já existe uma aplicação com este e-mail");
    }

    // Criar a aplicação
    const application = await db.expertApplication.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cnpj: data.cnpj,
        companyName: data.companyName,
        businessDescription: data.businessDescription,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        website: data.website || null,
        instagram: data.instagram || null,
        experience: data.experience,
        specialties: data.specialties,
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