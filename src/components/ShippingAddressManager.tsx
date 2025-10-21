"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  MapPin,
  Save,
  X
} from "lucide-react";
import {
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  setDefaultShippingAddress,
  getUserShippingAddresses,
  type ShippingAddressData
} from "@/app/_actions/shipping-address";

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ShippingAddressManagerProps {
  userId: string;
}

export function ShippingAddressManager({ userId }: ShippingAddressManagerProps) {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState<ShippingAddressData>({
    name: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  // Carregar endereços
  const loadAddresses = async () => {
    try {
      const data = await getUserShippingAddresses(userId);
      setAddresses(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar os endereços de entrega.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isDefault: checked
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        await updateShippingAddress(editingAddress.id, userId, formData);
        toast({
          title: "Endereço atualizado!",
          description: "O endereço foi atualizado com sucesso.",
        });
      } else {
        await createShippingAddress(userId, formData);
        toast({
          title: "Endereço criado!",
          description: "O novo endereço foi criado com sucesso.",
        });
      }

      resetForm();
      loadAddresses();
    } catch (error) {
      toast({
        title: "Erro ao salvar endereço",
        description: "Não foi possível salvar o endereço. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;

    try {
      await deleteShippingAddress(addressId, userId);
      toast({
        title: "Endereço excluído!",
        description: "O endereço foi removido com sucesso.",
      });
      loadAddresses();
    } catch (error) {
      toast({
        title: "Erro ao excluir endereço",
        description: "Não foi possível excluir o endereço. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultShippingAddress(addressId, userId);
      toast({
        title: "Endereço padrão definido!",
        description: "O endereço foi definido como padrão.",
      });
      loadAddresses();
    } catch (error) {
      toast({
        title: "Erro ao definir endereço padrão",
        description: "Não foi possível definir o endereço padrão. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <MapPin className="w-5 h-5" />
            <span>Endereços de Entrega</span>
          </CardTitle>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Endereço
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Formulário */}
        {showForm && (
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">
                  {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Nome para Entrega *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street" className="text-gray-700">Rua *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number" className="text-gray-700">Número *</Label>
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complement" className="text-gray-700">Complemento</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="Apto, bloco, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood" className="text-gray-700">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="Nome do bairro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-700">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-700">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-gray-700">CEP *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isDefault">Definir como endereço padrão</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/80 text-white"
                  >
                    {loading ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingAddress ? "Atualizar" : "Salvar"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Endereços */}
        {addresses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="pb-2 font-medium text-gray-700">Endereço</th>
                  <th className="pb-2 font-medium text-gray-700">Contato</th>
                  <th className="pb-2 font-medium text-gray-700">Padrão</th>
                  <th className="pb-2 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {addresses.map((address) => (
                  <tr key={address.id} className="border-b border-gray-200">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {address.neighborhood}, {address.city} - {address.state}
                        </p>
                        <p className="text-gray-600 text-xs">{address.zipCode}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{address.name}</p>
                        <p className="text-gray-600 text-xs">{address.phone}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      {address.isDefault ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                          <Star className="w-3 h-3 mr-1" />
                          Padrão
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        >
                          Definir como padrão
                        </Button>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum endereço de entrega cadastrado</p>
            <p className="text-sm">Clique em "Novo Endereço" para adicionar um</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 