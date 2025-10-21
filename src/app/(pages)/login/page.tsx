"use client";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState<string>(""); // CPF, CNPJ ou email
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    const verifySession = async () => {
      const session = await getSession();
      if (session) {
        // Se o usuário já estiver logado, redirecionar para a página inicial
        router.push("/");
      }
    }
    
    verifySession()
  }, [router]);

  // Função para detectar o tipo de identificador
  const detectIdentifierType = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    
    if (value.includes("@")) {
      return "email";
    } else if (cleanValue.length === 11) {
      return "cpf";
    } else if (cleanValue.length === 14) {
      return "cnpj";
    }
    return "email"; // padrão
  };

  // Função para formatar CPF/CNPJ durante a digitação
  const formatIdentifier = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    
    // Se contém @ é email, retorna sem formatação
    if (value.includes("@") || value.includes(".")) {
      return value;
    }
    
    // Formatação de CPF
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2");
    }
    
    // Formatação de CNPJ
    if (cleanValue.length <= 14) {
      return cleanValue
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})/, "$1-$2");
    }
    
    return value;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatIdentifier(e.target.value);
    setIdentifier(formattedValue);
  };

  // Função para login com email e senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: identifier, // O backend vai tratar se é email, CPF ou CNPJ
        password,
      });

      if (res?.error) {
        setError("Credenciais inválidas. Verifique seus dados e tente novamente.");
      }
      
      if (res?.ok) {
        router.push("/"); // Redireciona para a home após login
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderText = () => {
    const type = detectIdentifierType(identifier);
    switch (type) {
      case "cpf":
        return "000.000.000-00";
      case "cnpj":
        return "00.000.000/0000-00";
      default:
        return "Email, CPF ou CNPJ";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#F5F4F0] w-full min-h-screen py-8">
      <Image src={`/images/logo-cabelos.png`} alt="Logo Cabelos Premium" width={200} height={200} />
      
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Entrar</h2>
        <p className="text-sm mb-6 text-center text-gray-600">
          Faça login com seu email, CPF ou CNPJ
        </p>

        {/* Exibir erro */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Campo Email, CPF ou CNPJ */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email, CPF ou CNPJ</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded focus:border-[#8a7d5c] focus:outline-none transition-colors"
            placeholder={getPlaceholderText()}
            value={identifier}
            onChange={handleIdentifierChange}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite seu email, CPF ou CNPJ para acessar sua conta
          </p>
        </div>

        {/* Campo Senha */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Senha</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded focus:border-[#8a7d5c] focus:outline-none transition-colors"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botão de Login */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8a7d5c] text-white p-3 rounded hover:bg-[#6d6247] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        {/* Link para cadastro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a href="/register" className="text-[#8a7d5c] hover:underline font-medium">
              Cadastre-se
            </a>
          </p>
        </div>

        {/* Link para recuperar senha */}
        <div className="mt-2 text-center">
          <a href="/forgot-password" className="text-xs text-gray-500 hover:text-[#8a7d5c] transition-colors">
            Esqueceu sua senha?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
