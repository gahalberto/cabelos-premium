"use client";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };
    verifySession();
  }, [router]);

  // Retorna true se o valor parece ser email (contém letra ou @)
  const isEmail = (value: string) => /[a-zA-Z@]/.test(value);

  // Formata CPF ou CNPJ apenas quando o input é puramente numérico
  const formatIdentifier = (value: string): string => {
    if (isEmail(value)) return value;

    const digits = value.replace(/\D/g, "");

    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(formatIdentifier(e.target.value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: identifier,
        password,
      });

      if (res?.error) {
        setError("Credenciais inválidas. Verifique seus dados e tente novamente.");
      }

      if (res?.ok) {
        router.push("/");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = (): string => {
    if (!identifier || isEmail(identifier)) return "Email, CPF ou CNPJ";
    const digits = identifier.replace(/\D/g, "");
    if (digits.length <= 11) return "000.000.000-00";
    return "00.000.000/0000-00";
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#F5F4F0] w-full min-h-screen py-8">
      <Image
        src="/images/logo-cabelos.png"
        alt="Logo Cabelos Premium"
        width={200}
        height={200}
      />

      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8"
        onSubmit={handleLogin}
        noValidate
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Entrar</h2>
        <p className="text-sm mb-6 text-center text-gray-500">
          Faça login com seu email, CPF ou CNPJ
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded p-3 mb-4 text-center">
            {error}
          </div>
        )}

        {/* Identificador */}
        <div className="mb-4">
          <label htmlFor="identifier" className="block text-gray-700 font-medium mb-2">
            Email, CPF ou CNPJ
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            className="w-full p-3 border border-gray-300 rounded focus:border-[#8a7d5c] focus:outline-none transition-colors"
            placeholder={getPlaceholder()}
            value={identifier}
            onChange={handleIdentifierChange}
            required
          />
        </div>

        {/* Senha */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full p-3 pr-10 border border-gray-300 rounded focus:border-[#8a7d5c] focus:outline-none transition-colors"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs select-none"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8a7d5c] text-white p-3 rounded hover:bg-[#6d6247] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a href="/register" className="text-[#8a7d5c] hover:underline font-medium">
              Cadastre-se
            </a>
          </p>
        </div>

        <div className="mt-2 text-center">
          <a
            href="/forgot-password"
            className="text-xs text-gray-500 hover:text-[#8a7d5c] transition-colors"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
