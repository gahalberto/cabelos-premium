import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from "@/app/_lib/prisma";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  // Adaptador Prisma para armazenar sessões e usuários no banco de dados
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais ausentes');
          return null;
        }

        const identifier = credentials.email; // Pode ser email, CPF ou CNPJ
        
        // Remove formatação de CPF/CNPJ para busca no banco
        const cleanIdentifier = identifier.replace(/\D/g, "");
        
        let user = null;

        // Primeiro, tenta buscar por email
        if (identifier.includes("@")) {
          user = await prisma.user.findUnique({
            where: { email: identifier }
          });
        } else {
          // Se não é email, busca por CPF ou CNPJ
          if (cleanIdentifier.length === 11) {
            // É um CPF
            user = await prisma.user.findUnique({
              where: { cpf: cleanIdentifier }
            });
          } else if (cleanIdentifier.length === 14) {
            // É um CNPJ
            user = await prisma.user.findUnique({
              where: { cnpj: cleanIdentifier }
            });
          }
        }

        // Verifica se a senha é válida
        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          console.log('Usuário autorizado:', user);
          return {
            id: user.id.toString(),
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            cpf: user.cpf,
            birthDate: user.birthDate,
          };
        }

        console.log('Credenciais inválidas');
        return null;
      }
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string | null,
          lastName: token.lastName as string | null,
          email: token.email as string | null,
          image: token.image as string | null,
          phone: token.phone as string | null,
          address: token.address as string | null,
          city: token.city as string | null,
          state: token.state as string | null,
          zipCode: token.zipCode as string | null,
          cpf: token.cpf as string | null,
          birthDate: token.birthDate as Date | null,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.lastName = user.lastName;
        token.email = user.email;
        token.image = user.image;
        token.phone = user.phone;
        token.address = user.address;
        token.city = user.city;
        token.state = user.state;
        token.zipCode = user.zipCode;
        token.cpf = user.cpf;
        token.birthDate = user.birthDate;
      }
      return token;
    },
  },


  pages: {
    signIn: '/login', // Página de login personalizada
  },
};

export default NextAuth(authOptions);
