import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  cpf: string | null;
  birthDate: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useUserProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile();
    }
  }, [status, session?.user?.id]);

  const refreshProfile = () => {
    fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  };
} 