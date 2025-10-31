"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { submitExpertApplication } from "@/app/_actions/expert-application";

interface ExpertFormData {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  document: string;
  socialMedia: string;
}

export default function ExpertApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpertFormData>({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    document: "",
    socialMedia: ""
  });

  const handleInputChange = (field: keyof ExpertFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      // CPF
      return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else {
      // CNPJ
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    if (numbers.length === 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return numbers;
  };

  const validateForm = (): boolean => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName || !formData.document || !formData.socialMedia) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return false;
    }

    const documentNumbers = formData.document.replace(/\D/g, '');
    if (documentNumbers.length !== 11 && documentNumbers.length !== 14) {
      toast({
        title: "CPF/CNPJ inválido",
        description: "Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await submitExpertApplication(formData);
      
      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Redirecionando para o WhatsApp...",
      });

      // Redirecionar para WhatsApp com mensagem
      const phoneNumber = "5511974172074";
      const message = encodeURIComponent("Oi, acabei de me cadastrar como Expert");
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      // Aguarda um momento para mostrar o toast e depois redireciona
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        router.push('/');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao enviar cadastro";
      toast({
        title: "Erro ao enviar cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl text-gray-900">
          Cadastro de Especialista
        </CardTitle>
        <p className="text-gray-600">
          Preencha os dados abaixo para solicitar sua aprovação como especialista
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Nome Completo */}
            <div>
              <Label htmlFor="fullName" className="text-gray-700">Nome Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Seu nome completo"
                className="mt-2"
                required
              />
            </div>

            {/* Nome da Empresa */}
            <div>
              <Label htmlFor="companyName" className="text-gray-700">Nome da Empresa *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nome da sua empresa"
                className="mt-2"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="phone" className="text-gray-700">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="mt-2"
                required
              />
            </div>

            {/* E-mail */}
            <div>
              <Label htmlFor="email" className="text-gray-700">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="mt-2"
                required
              />
            </div>

            {/* CPF/CNPJ */}
            <div>
              <Label htmlFor="document" className="text-gray-700">CPF/CNPJ *</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => handleInputChange('document', formatDocument(e.target.value))}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                className="mt-2"
                maxLength={18}
                required
              />
            </div>

            {/* Rede Social */}
            <div>
              <Label htmlFor="socialMedia" className="text-gray-700">Rede Social *</Label>
              <Input
                id="socialMedia"
                value={formData.socialMedia}
                onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                placeholder="@seuinstagram ou link da rede social"
                className="mt-2"
                required
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="text-center pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Solicitação"
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Após o envio, entraremos em contato via WhatsApp.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
