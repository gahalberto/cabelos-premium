"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerUser } from "@/app/_actions/register/postRegister";
import Image from "next/image";
import Link from "next/link";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  lastName: z.string().min(1, "Sobrenome é obrigatório").max(50, "Sobrenome muito longo"),
  document: z.string().min(1, "Documento é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], { required_error: "Selecione um gênero" }),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos").max(9).regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  email: z.string().email("E-mail inválido"),
  confirmEmail: z.string().email("E-mail inválido"),
  phone: z.string().min(10).max(15).regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Formato: (11) 99999-9999"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
})
  .refine((d) => d.email === d.confirmEmail, { message: "Os e-mails não coincidem", path: ["confirmEmail"] })
  .refine((d) => d.password === d.confirmPassword, { message: "As senhas não coincidem", path: ["confirmPassword"] })
  .refine((d) => {
    const clean = d.document.replace(/\D/g, "");
    return clean.length === 11 ? cpf.isValid(d.document) : clean.length === 14 ? cnpj.isValid(d.document) : false;
  }, { message: "CPF ou CNPJ inválido", path: ["document"] });

type FormData = z.infer<typeof schema>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fmtDoc = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.length <= 11) return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2");
    return d.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})/, "$1-$2");
  };
  const fmtCep = (v: string) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  const fmtPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const clean = data.document.replace(/\D/g, "");
      await registerUser({
        name: data.name, lastName: data.lastName, email: data.email,
        document: data.document, documentType: clean.length === 11 ? "CPF" : "CNPJ",
        birthDate: new Date(data.birthDate), gender: data.gender,
        userType: "CLIENTE", zipCode: data.zipCode, phone: data.phone, password: data.password,
      });
      setRegisteredEmail(data.email);
      setRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `bg-white border-gray-200 focus-visible:ring-[#8a7d5c] focus-visible:border-[#8a7d5c] h-11 ${hasError ? "border-red-400" : ""}`;

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F4F0] px-6">
        <div className="max-w-md w-full text-center">
          <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={80} height={80} className="mx-auto mb-6" />
          <CheckCircle2 className="w-16 h-16 text-[#8a7d5c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1611] mb-2">Conta criada!</h2>
          <p className="text-sm text-gray-500 mb-2">
            Enviamos um e-mail de confirmação para <strong>{registeredEmail}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Acesse sua caixa de entrada e clique no link para ativar sua conta antes de fazer login.
          </p>
          <Link href="/login" className="text-[#8a7d5c] hover:text-[#6d6247] font-medium text-sm hover:underline transition-colors">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-[340px] xl:w-[380px] flex-shrink-0 relative flex-col items-center justify-center bg-[#1a1611] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #8a7d5c 1.5px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative z-10 text-center px-10">
          <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={130} height={130} className="mx-auto drop-shadow-2xl" />
          <h1 className="text-white text-2xl font-light mt-8 tracking-[0.2em] uppercase">Cabelos Premium</h1>
          <div className="w-10 h-px bg-[#8a7d5c] mx-auto mt-4 mb-4" />
          <p className="text-[#a89870] text-xs tracking-widest uppercase">Crie sua conta</p>
          <p className="text-[#6d6247] text-xs mt-4 leading-relaxed">
            Após o cadastro, enviaremos um e-mail para confirmar sua conta.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 overflow-y-auto bg-[#F5F4F0]">
        <div className="max-w-2xl mx-auto px-6 py-12 sm:px-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Image src="/images/logo-cabelos.png" alt="Cabelos Premium" width={70} height={70} className="mx-auto" />
            <p className="text-[#8a7d5c] text-xs tracking-widest uppercase mt-2">Cabelos Premium</p>
          </div>

          <h2 className="text-2xl font-bold text-[#1a1611] mb-1">Criar conta</h2>
          <p className="text-sm text-gray-500 mb-8">Preencha seus dados para se cadastrar</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados pessoais */}
            <div>
              <h3 className="text-xs font-semibold text-[#8a7d5c] uppercase tracking-widest mb-4">Dados Pessoais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Nome *</Label>
                  <Input {...register("name")} placeholder="Seu nome" className={`mt-1.5 ${inputClass(!!errors.name)}`} />
                  <FieldError msg={errors.name?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Sobrenome *</Label>
                  <Input {...register("lastName")} placeholder="Seu sobrenome" className={`mt-1.5 ${inputClass(!!errors.lastName)}`} />
                  <FieldError msg={errors.lastName?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">CPF ou CNPJ *</Label>
                  <Input
                    {...register("document")}
                    onChange={(e) => setValue("document", fmtDoc(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={18}
                    className={`mt-1.5 ${inputClass(!!errors.document)}`}
                  />
                  <FieldError msg={errors.document?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Data de Nascimento *</Label>
                  <Input type="date" {...register("birthDate")} className={`mt-1.5 ${inputClass(!!errors.birthDate)}`} />
                  <FieldError msg={errors.birthDate?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Gênero *</Label>
                  <select
                    {...register("gender")}
                    className={`mt-1.5 w-full h-11 px-3 rounded-md border bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#8a7d5c] ${errors.gender ? "border-red-400" : "border-gray-200"}`}
                  >
                    <option value="">Selecione</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                    <option value="OTHER">Outro</option>
                    <option value="PREFER_NOT_TO_SAY">Prefiro não informar</option>
                  </select>
                  <FieldError msg={errors.gender?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">CEP *</Label>
                  <Input
                    {...register("zipCode")}
                    onChange={(e) => setValue("zipCode", fmtCep(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`mt-1.5 ${inputClass(!!errors.zipCode)}`}
                  />
                  <FieldError msg={errors.zipCode?.message} />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-xs font-semibold text-[#8a7d5c] uppercase tracking-widest mb-4">Contato</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1a1611] text-sm font-medium">E-mail *</Label>
                    <Input type="email" {...register("email")} placeholder="seu@email.com" className={`mt-1.5 ${inputClass(!!errors.email)}`} />
                    <FieldError msg={errors.email?.message} />
                  </div>
                  <div>
                    <Label className="text-[#1a1611] text-sm font-medium">Confirmar E-mail *</Label>
                    <Input type="email" {...register("confirmEmail")} placeholder="confirme seu e-mail" className={`mt-1.5 ${inputClass(!!errors.confirmEmail)}`} />
                    <FieldError msg={errors.confirmEmail?.message} />
                  </div>
                </div>
                <div className="sm:w-1/2">
                  <Label className="text-[#1a1611] text-sm font-medium">Telefone *</Label>
                  <Input
                    {...register("phone")}
                    onChange={(e) => setValue("phone", fmtPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className={`mt-1.5 ${inputClass(!!errors.phone)}`}
                  />
                  <FieldError msg={errors.phone?.message} />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <h3 className="text-xs font-semibold text-[#8a7d5c] uppercase tracking-widest mb-4">Senha</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Senha *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Mínimo 6 caracteres"
                      className={`pr-10 ${inputClass(!!errors.password)}`}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError msg={errors.password?.message} />
                </div>
                <div>
                  <Label className="text-[#1a1611] text-sm font-medium">Confirmar Senha *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirme a senha"
                      className={`pr-10 ${inputClass(!!errors.confirmPassword)}`}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError msg={errors.confirmPassword?.message} />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#8a7d5c] hover:bg-[#6d6247] text-white font-medium tracking-wide transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#8a7d5c] hover:text-[#6d6247] font-medium hover:underline transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
