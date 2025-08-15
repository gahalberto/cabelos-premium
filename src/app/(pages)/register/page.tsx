"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/_actions/register/postRegister";
import Image from "next/image";
import { cpf, cnpj } from "cpf-cnpj-validator";

// Esquema de validação usando Zod
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  lastName: z.string().min(1, "Sobrenome é obrigatório").max(50, "Sobrenome muito longo"),
  documentType: z.enum(["CPF", "CNPJ"], {
    required_error: "Selecione o tipo de documento",
  }),
  document: z.string().min(1, "Documento é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    required_error: "Selecione um gênero",
  }),
  zipCode: z.string()
    .min(8, "CEP deve ter 8 dígitos")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido"),
  email: z.string().email("Formato de email inválido"),
  confirmEmail: z.string().email("Formato de email inválido"),
  phone: z.string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone muito longo")
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido (xx) xxxxx-xxxx"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha precisa ter pelo menos 6 caracteres"),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Os emails não coincidem",
  path: ["confirmEmail"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.documentType === "CPF") {
    return cpf.isValid(data.document);
  } else if (data.documentType === "CNPJ") {
    return cnpj.isValid(data.document);
  }
  return false;
}, {
  message: "Documento inválido",
  path: ["document"],
});

// Tipagem dos dados do formulário com base no esquema Zod
type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Use React Hook Form com Zod para validação
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Watch para monitorar mudanças no tipo de documento
  const watchedDocumentType = watch("documentType");

  // Funções para formatação de campos
  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 11) {
      return numericValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2");
    }
    return value;
  };

  const formatCNPJ = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 14) {
      return numericValue
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})/, "$1-$2");
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 8) {
      return numericValue.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 11) {
      if (numericValue.length <= 10) {
        return numericValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        return numericValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
    }
    return value;
  };

  // Handlers para formatação em tempo real
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = watchedDocumentType === "CPF" 
      ? formatCPF(e.target.value) 
      : formatCNPJ(e.target.value);
    setValue("document", formatted);
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setValue("zipCode", formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted);
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "CPF" | "CNPJ";
    setValue("documentType", newType);
    setValue("document", ""); // Limpa o campo quando muda o tipo
  };

  // Função de envio de formulário
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null); // Resetando erro antes do envio
    try {
      const response = await registerUser({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        document: data.document,
        documentType: data.documentType,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        userType: "CLIENTE", // Sempre CLIENTE por padrão
        zipCode: data.zipCode,
        phone: data.phone,
        password: data.password,
      });

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

  return (
    <div className="flex flex-col items-center justify-center bg-[#F5F4F0] w-full min-h-screen py-8">
      <Image src={`/images/logo-cabelos.png`} alt="Logo Cabelos Premium" width={200} height={200} />
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Cliente</h2>
        <p className="text-xs mb-6 text-center">Por favor, preencha os campos abaixo para criar sua conta de cliente na Cabelos Premium.</p>

        {/* Exibir erro */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Nome */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Nome *</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full p-3 mt-1 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder="Seu nome"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Campo Sobrenome */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Sobrenome *</label>
            <input
              type="text"
              {...register("lastName")}
              className={`w-full p-3 mt-1 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder="Seu sobrenome"
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Campo Tipo de Documento */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Tipo de Documento *</label>
            <select
              {...register("documentType")}
              onChange={handleDocumentTypeChange}
              className={`w-full p-3 mt-1 border ${
                errors.documentType ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
            >
              <option value="CPF">CPF (Pessoa Física)</option>
              <option value="CNPJ">CNPJ (Pessoa Jurídica)</option>
            </select>
            {errors.documentType && (
              <span className="text-red-500 text-sm">
                {errors.documentType.message}
              </span>
            )}
          </div>

          {/* Campo Documento (CPF/CNPJ) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              {watchedDocumentType === "CPF" ? "CPF *" : "CNPJ *"}
            </label>
            <input
              type="text"
              {...register("document")}
              onChange={handleDocumentChange}
              className={`w-full p-3 mt-1 border ${
                errors.document ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder={watchedDocumentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
              maxLength={watchedDocumentType === "CPF" ? 14 : 18}
            />
            {errors.document && (
              <span className="text-red-500 text-sm">
                {errors.document.message}
              </span>
            )}
          </div>

          {/* Campo Data de Nascimento */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Data de Nascimento *</label>
            <input
              type="date"
              {...register("birthDate")}
              className={`w-full p-3 mt-1 border ${
                errors.birthDate ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
            />
            {errors.birthDate && (
              <span className="text-red-500 text-sm">
                {errors.birthDate.message}
              </span>
            )}
          </div>

          {/* Campo Gênero */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Gênero *</label>
            <select
              {...register("gender")}
              className={`w-full p-3 mt-1 border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
            >
              <option value="">Selecione seu gênero</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              <option value="OTHER">Outro</option>
              <option value="PREFER_NOT_TO_SAY">Prefiro não informar</option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">
                {errors.gender.message}
              </span>
            )}
          </div>

          {/* Campo CEP */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">CEP *</label>
            <input
              type="text"
              {...register("zipCode")}
              onChange={handleCEPChange}
              className={`w-full p-3 mt-1 border ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder="00000-000"
              maxLength={9}
            />
            {errors.zipCode && (
              <span className="text-red-500 text-sm">
                {errors.zipCode.message}
              </span>
            )}
          </div>
        </div>

        {/* Campos de email em linha completa */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email *</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full p-3 mt-1 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded focus:border-[#8a7d5c] focus:outline-none`}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Confirme seu Email *</label>
          <input
            type="email"
            {...register("confirmEmail")}
            className={`w-full p-3 mt-1 border ${
              errors.confirmEmail ? "border-red-500" : "border-gray-300"
            } rounded focus:border-[#8a7d5c] focus:outline-none`}
            placeholder="confirme seu email"
          />
          {errors.confirmEmail && (
            <span className="text-red-500 text-sm">
              {errors.confirmEmail.message}
            </span>
          )}
        </div>

        {/* Campo Telefone */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Telefone *</label>
          <input
            type="text"
            {...register("phone")}
            onChange={handlePhoneChange}
            className={`w-full p-3 mt-1 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded focus:border-[#8a7d5c] focus:outline-none`}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Campos de senha em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Senha *</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full p-3 mt-1 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Confirme a Senha *</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`w-full p-3 mt-1 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded focus:border-[#8a7d5c] focus:outline-none`}
              placeholder="Confirme sua senha"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          className="w-full bg-[#8a7d5c] text-white p-3 rounded hover:bg-[#6d6247] transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando Conta..." : "Criar Conta"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <a href="/login" className="text-[#8a7d5c] hover:underline font-medium">
              Faça login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
