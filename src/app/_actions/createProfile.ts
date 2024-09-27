"use server"
import { db } from "../_lib/prisma";
import crypto from 'crypto';

// Função para gerar um hash aleatório de 5 letras
const generateSlugHash = () => {
  return crypto.randomBytes(3).toString('hex'); // Gera um hash de 5-6 caracteres (3 bytes em hex)
};

export const createProfile = async (data: {
  userId: string;
}) => {
  // Gera um slug baseado no nome ou um hash aleatório se o nome não for fornecido
  let slug = generateSlugHash();

  // Garante que o slug seja único no banco de dados
  let uniqueSlug = slug;
  let counter = 1;

  // Verifica se o slug já existe e, se existir, incrementa um número no final
  while (await db.memoriaProfiles.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  // Cria o perfil com o slug único
 return await db.memoriaProfiles.create({
    data: {
      userId: data.userId,
      slug: uniqueSlug, // Usa o slug gerado com o hash
      views: 0, // Define views como 0 por padrão
    },
  });
};
