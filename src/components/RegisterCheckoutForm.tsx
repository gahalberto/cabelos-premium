import { createProfile } from "@/app/_actions/createProfile";
import { registerUser } from "@/app/_actions/register/postRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { loadStripe } from "@stripe/stripe-js";
import { signIn, getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z
    .string()
    .min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const RegisterCheckout = ({ product }: { product: string }) => {
  const { data: sessionData, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Função para usuários logados
  const handleStripeCheckoutForLoggedUser = async () => {
    try {
      const stripe = await stripePromise;

      console.log("[LOG] Criando pedido no banco de dados...");
      const orderResponse: Response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: sessionData?.user.id, // ID do usuário logado
          product: product,
          totalPrice: 100,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("[ERROR] Falha ao criar o pedido no banco de dados");
      }

      const order = await orderResponse.json();
      console.log("[LOG] Pedido criado com sucesso", order);

      console.log("[LOG] Criando sessão de checkout no Stripe...");
      const sessionResponse: Response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: product, orderId: order.id }),
      });

      if (!sessionResponse.ok) {
        throw new Error("[ERROR] Falha ao criar a sessão de checkout");
      }

      const stripeSession = await sessionResponse.json();
      console.log("[LOG] Sessão de checkout criada com sucesso", stripeSession);

      const result = await stripe!.redirectToCheckout({ sessionId: stripeSession.id });
      if (result.error) {
        setError(result.error.message ?? "[ERROR] Ocorreu um erro desconhecido");
      }
    } catch (err) {
      console.error("[ERROR] Erro no processo de checkout", err);
      setError("Ocorreu um erro ao redirecionar para o checkout: " + (err as Error).message);
    }
  };

  // Função para criar usuário e realizar o checkout
  const onSubmit = async (data: FormData) => {
    try {
      console.log("[LOG] Tentando registrar usuário...");
      const response = await registerUser(data);

      if (response) {
        console.log("[LOG] Usuário registrado com sucesso, tentando logar...");
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (!signInResult || signInResult.error) {
          throw new Error("[ERROR] Erro ao fazer login do usuário após registro");
        }

        console.log("[LOG] Login bem-sucedido", signInResult);

        const updatedSession = await getSession();
        console.log("[LOG] Sessão atualizada", updatedSession);

        if (!updatedSession || !updatedSession.user?.id) {
          console.error("[Error] Sessão do usuário não foi atualizada corretamente", updatedSession);
          throw new Error("Sessão do usuário não foi atualizada corretamente");
        }

        const stripe = await stripePromise;

        console.log("CRIANDO PERFIL....");
        const profile = await createProfile({ userId: updatedSession.user.id });

        console.log("PERFIL CRIADO", profile.id);

        console.log("[LOG] Criando pedido no banco de dados...");
        const orderResponse: Response = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileId: profile.id,
            product: product,
            totalPrice: 100,
          }),
        });

        if (!orderResponse.ok) {
          throw new Error("[ERROR] Falha ao criar o pedido no banco de dados");
        }

        const order = await orderResponse.json();
        console.log("[LOG] Pedido criado com sucesso", order);

        console.log("[LOG] Criando sessão de checkout no Stripe...");
        const sessionResponse: Response = await fetch("/api/checkout_sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: product, orderId: order.id }),
        });

        if (!sessionResponse.ok) {
          throw new Error("[ERROR] Falha ao criar a sessão de checkout");
        }

        const stripeSession = await sessionResponse.json();
        console.log("[LOG] Sessão de checkout criada com sucesso", stripeSession);

        const result = await stripe!.redirectToCheckout({ sessionId: stripeSession.id });
        if (result.error) {
          setError(result.error.message ?? "[ERROR] Ocorreu um erro desconhecido");
        }
      }
    } catch (err) {
      console.error("[ERROR] Erro no processo de registro ou checkout", err);
      setError("Ocorreu um erro ao registrar ou redirecionar para o checkout: " + (err as Error).message);
    }
  };

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {sessionData?.user ? (
        <div>
          <div className="p-4 border border-zinc-300 rounded-xl">
            <small className="text-gray-400">Você está logado como:</small>
            <div className="flex items-center gap-2 mt-2">
              <Avatar>
                <AvatarImage
                  className="rounded-full w-10"
                  src={sessionData.user.image || undefined}
                  alt="Avatar do Usuário"
                />
                <AvatarFallback>{sessionData.user.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{sessionData.user.name}</p>
                <p className="text-sm">{sessionData.user.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-10">
            <button
              onClick={handleStripeCheckoutForLoggedUser}
              className="w-full flex text-center justify-center bg-blue-300 text-white p-2 rounded hover:bg-blue-300 transition"
            >
              Continuar com <Image src={"/images/stripe.png"} width={50} height={50} alt="" />
            </button>
          </div>
        </div>
      ) : (
        <form className="p-6 rounded-lg w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
          <p>Você selecionou o produto: {product}</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full p-2 mt-1 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full p-2 mt-1 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

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
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

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
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full flex text-center justify-center bg-blue-300 text-white p-2 rounded hover:bg-blue-300 transition"
            >
              Continuar com <Image src={"/images/stripe.png"} width={50} height={50} alt="" />
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default RegisterCheckout;
