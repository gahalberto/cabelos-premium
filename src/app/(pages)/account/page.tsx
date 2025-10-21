"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { 
  User, 
  Save, 
  Camera,
  Shield,
  Bell,
  CreditCard,
  MapPin
} from "lucide-react";
import { updateUserProfile } from "@/app/_actions/update-user-profile";
import { updateUserAvatar } from "@/app/_actions/update-user-avatar";
import { deleteUserAvatar } from "@/app/_actions/delete-user-avatar";
import { ShippingAddressManager } from "@/components/ShippingAddressManager";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";



export default function AccountPage() {
  const { status, update } = useSession();
  const { toast } = useToast();
  const { profile, loading: profileLoading, error: profileError, refreshProfile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cpf: "",
    birthDate: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        cpf: profile.cpf || "",
        birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : ""
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      await updateUserProfile({
        userId: profile.id,
        data: {
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          cpf: formData.cpf,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null
        }
      });

      // Atualizar a sessão e o perfil
      await update();
      refreshProfile();

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas informações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setIsPhotoLoading(true);
    try {
      // Por enquanto, vamos apenas simular o upload
      // Em uma implementação real, você precisaria fazer o upload para um serviço como AWS S3, Cloudinary, etc.
      const imageUrl = URL.createObjectURL(file);
      
      await updateUserAvatar(profile.id, imageUrl);
      await update(); // Atualizar sessão
      refreshProfile(); // Atualizar perfil

      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar foto",
        description: "Não foi possível atualizar sua foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!profile?.id) return;

    setIsPhotoLoading(true);
    try {
      await deleteUserAvatar(profile.id);
      await update(); // Atualizar sessão
      refreshProfile(); // Atualizar perfil

      toast({
        title: "Foto removida!",
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover foto",
        description: "Não foi possível remover sua foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsPhotoLoading(false);
    }
  };

  if (status === "loading" || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-700 text-xl">Carregando...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center text-gray-700">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="mb-4">Você precisa estar logado para acessar esta página.</p>
          <Button asChild>
            <a href="/login">Fazer Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Minha Conta</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
            
            {profileError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  Erro ao carregar perfil: {profileError}
                </p>
                <Button 
                  onClick={refreshProfile} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                >
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={profile?.image || undefined} />
                      <AvatarFallback className="text-2xl bg-gray-200 text-gray-700">
                        {profile?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isPhotoLoading}
                      />
                    </label>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{profile?.name || "Usuário"}</CardTitle>
                  <p className="text-gray-600 text-sm">{profile?.email || ""}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={handleDeletePhoto}
                    disabled={isPhotoLoading || !profile?.image}
                    className="w-full mb-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {isPhotoLoading ? "Processando..." : "Remover Foto"}
                  </Button>
                </CardContent>
              </Card>

              {/* Menu de navegação */}
              <Card className="bg-white border-gray-200 shadow-sm mt-4">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <a href="#profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                      <User className="w-5 h-5" />
                      <span>Perfil</span>
                    </a>
                    <a href="#security" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                      <Shield className="w-5 h-5" />
                      <span>Segurança</span>
                    </a>
                    <a href="#notifications" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                      <Bell className="w-5 h-5" />
                      <span>Notificações</span>
                    </a>
                    <a href="#shipping" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                      <MapPin className="w-5 h-5" />
                      <span>Endereços de Entrega</span>
                    </a>
                    <a href="#billing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                      <CreditCard className="w-5 h-5" />
                      <span>Pagamentos</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-2 space-y-6">
                            {/* Seção de Perfil */}
              <Card id="profile" className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    <User className="w-5 h-5" />
                    <span>Informações Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700">Sobrenome</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          placeholder="Seu sobrenome"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700">Email</Label>
                      <Input
                        id="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-gray-100 border-gray-300 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="birthDate" className="text-gray-700">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      />
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <Label htmlFor="address" className="text-gray-700">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        placeholder="Rua, número, complemento"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-700">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          placeholder="Sua cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-gray-700">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          placeholder="SP"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-gray-700">CEP</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/80 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Save className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Seção de Segurança */}
              <Card id="security" className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    <Shield className="w-5 h-5" />
                    <span>Segurança</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Senha</h4>
                        <p className="text-sm text-gray-600">Última alteração há 30 dias</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowChangePasswordModal(true)}
                      >
                        Alterar
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Autenticação de dois fatores</h4>
                        <p className="text-sm text-gray-600">Não ativado</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Ativar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seção de Notificações */}
              <Card id="notifications" className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    <Bell className="w-5 h-5" />
                    <span>Notificações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Emails de marketing</h4>
                        <p className="text-sm text-gray-600">Receber ofertas e novidades</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificações de pedidos</h4>
                        <p className="text-sm text-gray-600">Atualizações sobre seus pedidos</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seção de Endereços de Entrega */}
              <div id="shipping">
                <ShippingAddressManager userId={profile?.id || ""} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alterar Senha */}
      <ChangePasswordModal
        userId={profile?.id || ""}
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
} 