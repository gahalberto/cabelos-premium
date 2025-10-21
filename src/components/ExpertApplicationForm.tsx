"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { submitExpertApplication } from "@/app/_actions/expert-application";
import { 
  Building2, 
  UserCheck, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ExpertFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cnpj: string;
  companyName: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  instagram?: string;
  experience: string;
  specialties: string[];
}

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const specialties = [
  "Cabelos Naturais",
  "Cabelos Sintéticos",
  "Extensões",
  "Perucas",
  "Tranças",
  "Penteado",
  "Coloração",
  "Tratamentos",
  "Consultoria",
  "Vendas B2B",
  "Distribuição"
];

export default function ExpertApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpertFormData>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    cnpj: "",
    companyName: "",
    businessDescription: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    instagram: "",
    experience: "",
    specialties: []
  });

  const handleInputChange = (field: keyof ExpertFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
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

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.cnpj || formData.cnpj.replace(/\D/g, '').length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido com 14 dígitos",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.companyName || !formData.businessDescription || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Dados da empresa",
        description: "Preencha todos os dados da empresa",
        variant: "destructive"
      });
      return false;
    }

    if (formData.specialties.length === 0) {
      toast({
        title: "Especialidades",
        description: "Selecione pelo menos uma especialidade",
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
        description: "Sua solicitação será analisada e você receberá um retorno em breve.",
      });

      // Redirecionar para uma página de confirmação
      router.push('/expert-application-success');
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-600" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Seu nome"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700">Sobrenome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Seu sobrenome"
                  className="mt-2"
                  required
                />
              </div>
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
            </div>
          </div>

          {/* Dados da Empresa */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              Dados da Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="cnpj" className="text-gray-700">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  className="mt-2"
                  maxLength={18}
                  required
                />
              </div>
              <div className="md:col-span-2">
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
              <div className="md:col-span-2">
                <Label htmlFor="businessDescription" className="text-gray-700">Descrição do Negócio *</Label>
                <Textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder="Descreva seu negócio, público-alvo e como atua no mercado..."
                  className="mt-2"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-700">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número e complemento"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-700">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Sua cidade"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-700">Estado *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-gray-700">CEP *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', formatCEP(e.target.value))}
                  placeholder="00000-000"
                  className="mt-2"
                  maxLength={9}
                  required
                />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              Redes Sociais e Website
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-gray-700">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://seusite.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-gray-700">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="@seuinstagram"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-600" />
              Especialidades *
            </h3>
            <p className="text-gray-600 mb-4">
              Selecione as áreas em que você atua:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor={specialty} className="text-sm text-gray-700 cursor-pointer">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experiência */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Experiência no Mercado
            </h3>
            <Textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Conte-nos sobre sua experiência no mercado de cabelos, clientes atendidos, anos de atuação..."
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Botão de Envio */}
          <div className="text-center pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
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
              Sua solicitação será analisada e você receberá um retorno em até 48 horas.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
