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

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const RegisterCheckout = ({ product }: { product: string }) => {
  const { data: sessionData, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  // Estado para armazenar o método de pagamento selecionado.
  // Neste exemplo, usamos "stripe" ou "pagseguro".
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  console.log(`USERID: ${sessionData?.user.id}`)
  // Função para checkout com Stripe (usuário logado)
  const handleStripeCheckoutForLoggedUser = async () => {
    try {
      const stripe = await stripePromise;

      console.log("[LOG] Criando pedido no banco de dados...");
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: sessionData?.user.id,
          product,
          totalPrice: 100,
        }),
      });
      if (!orderResponse.ok) {
        throw new Error("[ERROR] Falha ao criar o pedido no banco de dados");
      }
      const order = await orderResponse.json();
      console.log("[LOG] Pedido criado com sucesso", order);

      console.log("[LOG] Criando sessão de checkout no Stripe...");
      const sessionResponse = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: product, orderId: order.id }),
      });
      if (!sessionResponse.ok) {
        throw new Error("[ERROR] Falha ao criar a sessão de checkout");
      }
      const stripeSession = await sessionResponse.json();
      console.log("[LOG] Sessão de checkout criada com sucesso", stripeSession);

      const result = await stripe!.redirectToCheckout({
        sessionId: stripeSession.id,
      });
      if (result.error) {
        setError(result.error.message ?? "[ERROR] Ocorreu um erro desconhecido");
      }
    } catch (err) {
      console.error("[ERROR] Erro no processo de checkout", err);
      setError("Erro ao redirecionar para o checkout: " + (err as Error).message);
    }
  };

  // Função para checkout com Pagseguro (usuário logado)
  const handlePagseguroCheckoutForLoggedUser = async () => {
    try {
      console.log("[LOG] Criando pedido no banco de dados...");
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: sessionData?.user.id,
          product,
          totalPrice: 100,
        }),
      });
      if (!orderResponse.ok) {
        throw new Error("[ERROR] Falha ao criar o pedido no banco de dados");
      }
      const order = await orderResponse.json();
      console.log("[LOG] Pedido criado com sucesso", order);
  
      console.log("[LOG] Criando sessão de checkout no Pagseguro...");
      const sessionResponse = await fetch("/api/checkout_sessions_pagseguro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: product, orderId: order.id }),
      });
      if (!sessionResponse.ok) {
        throw new Error("[ERROR] Falha ao criar a sessão de checkout do Pagseguro");
      }
      const pagseguroSession = await sessionResponse.json();
      console.log("[LOG] Sessão de checkout do Pagseguro criada com sucesso", pagseguroSession);
      window.location.href = pagseguroSession.url;
    } catch (err) {
      console.error("[ERROR] Erro no processo de checkout com Pagseguro", err);
      setError("Erro ao redirecionar para o checkout: " + (err as Error).message);
    }
  };
  

  // Função que verifica o método selecionado (usuário logado)
  const handleCheckoutForLoggedUser = async () => {
    if (paymentMethod === "stripe") {
      await handleStripeCheckoutForLoggedUser();
    } else if (paymentMethod === "pagseguro") {
      await handlePagseguroCheckoutForLoggedUser();
    }
  };

  // Função para registro e checkout (usuário não logado)
  const onSubmit = async (data: FormData) => {
    try {
      console.log("[LOG] Registrando usuário...");
      const response = await registerUser(data);
      if (response) {
        console.log("[LOG] Usuário registrado com sucesso, tentando logar...");
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (!signInResult || signInResult.error) {
          throw new Error(
            "[ERROR] Erro ao fazer login do usuário após registro"
          );
        }
        console.log("[LOG] Login bem-sucedido", signInResult);

        const updatedSession = await getSession();
        if (!updatedSession || !updatedSession.user?.id) {
          throw new Error("Sessão do usuário não foi atualizada corretamente");
        }
        console.log("[LOG] Sessão atualizada", updatedSession);

        console.log("CRIANDO PERFIL...");
        const profile = await createProfile({ userId: updatedSession.user.id });
        console.log("PERFIL CRIADO", profile.id);

        console.log("[LOG] Criando pedido no banco de dados...");
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
        const order = await orderResponse.json();
        console.log("[LOG] Pedido criado com sucesso", order);

        if (paymentMethod === "stripe") {
          console.log("[LOG] Criando sessão de checkout no Stripe...");
          const sessionResponse = await fetch("/api/checkout_sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: product, orderId: order.id }),
          });
          if (!sessionResponse.ok) {
            throw new Error("[ERROR] Falha ao criar a sessão de checkout");
          }
          const stripeSession = await sessionResponse.json();
          console.log("[LOG] Sessão de checkout criada com sucesso", stripeSession);
          const stripe = await stripePromise;
          const result = await stripe!.redirectToCheckout({
            sessionId: stripeSession.id,
          });
          if (result.error) {
            setError(
              result.error.message ?? "[ERROR] Ocorreu um erro desconhecido"
            );
          }
        } else if (paymentMethod === "pagseguro") {
          console.log("[LOG] Criando sessão de checkout no Pagseguro...");
          const sessionResponse = await fetch("/api/checkout_sessions_pagseguro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: product, orderId: order.id }),
          });
          if (!sessionResponse.ok) {
            throw new Error(
              "[ERROR] Falha ao criar a sessão de checkout do Pagseguro"
            );
          }
          const pagseguroSession = await sessionResponse.json();
          console.log(
            "[LOG] Sessão de checkout do Pagseguro criada com sucesso",
            pagseguroSession
          );
          window.location.href = pagseguroSession.url;
        }
      }
    } catch (err) {
      console.error(
        "[ERROR] Erro no processo de registro ou checkout",
        err
      );
      setError(
        "Erro ao registrar ou redirecionar para o checkout: " +
          (err as Error).message
      );
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
            <small className="text-gray-400">
              Você está logado como:
            </small>
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

          {/* Seção de seleção de método de pagamento */}
          <div className="mt-10">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Selecione o método de pagamento:
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="stripe" className="ml-2">
                  Stripe
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pagseguro"
                  name="paymentMethod"
                  value="pagseguro"
                  checked={paymentMethod === "pagseguro"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="pagseguro" className="ml-2">
                  Pagseguro
                </label>
              </div>
            </div>

            <button
              onClick={handleCheckoutForLoggedUser}
              className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Continuar com{" "}
              {paymentMethod === "stripe" ? (
                <Image
                  src={"/images/stripe.png"}
                  width={50}
                  height={50}
                  alt="Stripe"
                />
              ) : (
                <Image
                  src={"/images/pagbank.png"}
                  width={50}
                  height={50}
                  alt="Pagseguro"
                />
              )}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      ) : (
        // Usuário não logado – formulário de registro
        <form
          className="p-6 rounded-lg w-full max-w-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>Você selecionou o produto: {product}</p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

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

          <div className="mb-4">
            <label className="block text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`w-full p-2 mt-1 border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Seção de seleção de método de pagamento */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Selecione o método de pagamento:
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="stripe" className="ml-2">
                Stripe
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="pagseguro"
                name="paymentMethod"
                value="pagseguro"
                checked={paymentMethod === "pagseguro"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="pagseguro" className="ml-2">
                Pagseguro
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-200 border border-black shadow-black shadow font-bold text-black p-2 rounded hover:bg-blue-600 transition"
          >
            Continuar com{" "}
            {paymentMethod === "stripe" ? (
              <Image
                src={"/images/stripe.png"}
                width={100}
                height={100}
                alt="Stripe"
              />
            ) : (
              <Image
                src={"/images/pagbank.png"}
                width={100}
                height={100}
                alt="Pagseguro"
              />
            )}
          </button>
        </form>
      )}
    </>
  );
};

export default RegisterCheckout;
