"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/_actions/register/postRegister";
import Image from "next/image";

// Esquema de validação usando Zod
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Tipagem dos dados do formulário com base no esquema Zod
type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Controle para o botão de envio
  const router = useRouter();

  // Use React Hook Form com Zod para validação
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Função de envio de formulário
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null); // Resetando erro antes do envio
    try {
      const response = await registerUser(data);

      if (response) {
        // Loga o usuário após o registro
        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        router.push("/dashboard"); // Redireciona para o dashboard após o login
      }
    } catch (err) {
      setError("Ocorreu um erro ao registrar. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para login com Google
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const res = await signIn("google", { redirect: false });
    if (res?.error) {
      setError("Ocorreu um erro ao tentar registrar com Google.");
    } else {
      router.push("/dashboard"); // Redireciona para o dashboard após o registro/login com Google
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#F5F4F0] w-full h-screen">
      <Image src={`/images/logo.png`} alt="Logo" width={200} height={200} />
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Crie a sua conta</h2>

        {/* Exibir erro */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Campo Nome */}
        <div className="mb-4">
          <label className="block text-gray-700">Nome</label>
          <input
            type="text"
            {...register("name")}
            className={`w-full p-2 mt-1 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full p-2 mt-1 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Campo Senha */}
        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full p-2 mt-1 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Campo Confirmação de Senha */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirmar Senha</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={`w-full p-2 mt-1 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={isSubmitting} // Desabilitar botão durante submissão
        >
          {isSubmitting ? "Criando Conta..." : "Criar Conta"}
        </button>

        <button
          type="button"
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition mt-4 flex items-center justify-center"
          onClick={handleGoogleLogin}
          disabled={isSubmitting} // Desabilitar botão durante submissão
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          {isSubmitting ? "Conectando..." : "Criar Conta com Google"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
