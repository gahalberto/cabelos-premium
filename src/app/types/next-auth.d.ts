import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
      cpf?: string | null;
      birthDate?: Date | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    lastName?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    cpf?: string | null;
    birthDate?: Date | null;
  }
}
