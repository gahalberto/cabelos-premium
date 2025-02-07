import { createProfile } from "@/app/_actions/createProfile";
import { registerUser } from "@/app/_actions/register/postRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    email: z.string().email("Formato de email inválido"),
    cpfCnpj: z.string().min(10, "Insira o seu CPF e/ou CNPJ, seus dados estão protegidos conosco!"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD", "BOLETO"], {
      errorMap: () => ({ message: "Selecione um método de pagamento" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const RegisterCheckout = ({ product, amount }: { product: string, amount: number }) => {
  console.log(amount)
  const { data: sessionData, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Função para registro e checkout para usuários não logados
  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser(data);
      if (response) {

      const profile = await createProfile({ userId: response.user.id });
        console.log(profile)
        const orderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile.id,
            product,
            totalPrice: 100,
          }),
        });
        if (!orderResponse.ok) {
          throw new Error("[ERROR] Falha ao criar o pedido no banco de dados");
        }
        // const order = await orderResponse.json();

        await axios.post("/api/asaas/checkout", {
            name: data.name, email: data.email, cpfCnpj: data.cpfCnpj, paymentMethod: data.paymentMethod, amount, order: orderResponse, 
        });
      }
    } catch (err) {
      console.error("[ERROR] Erro no processo de registro ou checkout", err);
      setError("Erro ao registrar ou redirecionar para o checkout: " + (err as Error).message);
    }
  };

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {sessionData?.user ? (
        // Usuário logado
        <div className="mt-4">
          <div className="p-4 border border-zinc-300 rounded-xl">
            <small className="text-gray-400">Você está logado como:</small>
            <div className="flex items-center gap-2 mt-2">
              <Avatar>
                <AvatarImage
                  className="rounded-full w-10"
                  src={sessionData.user.image || undefined}
                  alt="Avatar do Usuário"
                />
                <AvatarFallback>
                  {sessionData.user.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{sessionData.user.name}</p>
                <p className="text-sm">{sessionData.user.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Continuar com ASAAS
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        // Usuário não logado – formulário de registro
        <form className="p-6 rounded-lg w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
          <p>Você selecionou o produto: {product}</p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full p-2 mt-1 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full p-2 mt-1 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CPF/CNPJ:</label>
            <input
              type="text"
              {...register("cpfCnpj")}
              className={`w-full p-2 mt-1 border ${errors.cpfCnpj ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.cpfCnpj && (
              <span className="text-red-500 text-sm">{errors.cpfCnpj.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full p-2 mt-1 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`w-full p-2 mt-1 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded`}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>
          <div className="mb-4">
  <label className="block text-gray-700 font-bold mb-2">Método de Pagamento</label>

  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" value="PIX" {...register("paymentMethod")} />
      PIX
    </label>

    <label className="flex items-center gap-2">
      <input type="radio" value="CREDIT_CARD" {...register("paymentMethod")} />
      Cartão de Crédito
    </label>

    <label className="flex items-center gap-2">
      <input type="radio" value="BOLETO" {...register("paymentMethod")} />
      Boleto
    </label>
  </div>

  {errors.paymentMethod && (
    <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>
  )}
</div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-200 border border-black shadow-black shadow font-bold text-black p-2 rounded hover:bg-blue-600 transition"
          >
            Continuar com ASAAS
          </button>
        </form>
      )}
    </>
  );
};

export default RegisterCheckout;
