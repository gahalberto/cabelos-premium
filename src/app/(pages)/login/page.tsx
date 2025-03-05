"use client";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const verifySession = async () => {
    const  session = await getSession();
    if (session) {
      // Se o usuário já estiver logado, redirecionar para a página inicial
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    verifySession()
  }, []);

  // Função para login com email e senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpar erro anterior

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Verifique seu email e senha.");
    }
    
    if (res?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#F5F4F0] w-full h-screen">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-8"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Exibir erro */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Campo Email e Senha */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Botão de Login Padrão */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
