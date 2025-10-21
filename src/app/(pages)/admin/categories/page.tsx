"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Search,
  Filter
} from "lucide-react";
import { getAdminCategories } from "@/app/_actions/admin/get-categories";
import { createCategoryAction } from "@/app/_actions/admin/create-category";
import { updateCategoryAction } from "@/app/_actions/admin/update-category";
import { deleteCategoryAction } from "@/app/_actions/admin/delete-category";
import { AdminLayout } from "@/components/AdminLayout";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

const CategoriesPage = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  const loadCategories = useCallback(async () => {
    try {
      console.log('Carregando categorias...');
      const categoriesData = await getAdminCategories();
      console.log('Categorias carregadas:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      loadCategories();
    }
  }, [status, loadCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Enviando formulário:', formData);
    
    try {
      if (editingCategory) {
        // Atualizar categoria existente
        console.log('Atualizando categoria:', editingCategory.id);
        const result = await updateCategory(editingCategory.id, formData);
        console.log('Resultado da atualização:', result);
        
        toast({
          title: "Categoria atualizada!",
          description: "A categoria foi atualizada com sucesso",
        });
      } else {
        // Criar nova categoria
        console.log('Criando nova categoria');
        const result = await createCategory(formData);
        console.log('Resultado da criação:', result);
        
        toast({
          title: "Categoria criada!",
          description: "A categoria foi criada com sucesso",
        });
      }
      
      resetForm();
      await loadCategories();
    } catch (error) {
      console.error('Erro no submit:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível salvar a categoria",
        variant: "destructive"
      });
    }
  };

  const createCategory = async (data: any) => {
    console.log('Chamando createCategoryAction com:', data);
    const result = await createCategoryAction(data);
    console.log('Resultado do createCategoryAction:', result);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.category;
  };

  const updateCategory = async (id: string, data: any) => {
    console.log('Chamando updateCategoryAction com:', id, data);
    const result = await updateCategoryAction(id, data);
    console.log('Resultado do updateCategoryAction:', result);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.category;
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        console.log('Chamando deleteCategoryAction com:', id);
        const result = await deleteCategoryAction(id);
        console.log('Resultado do deleteCategoryAction:', result);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        toast({
          title: "Categoria excluída!",
          description: "A categoria foi excluída com sucesso",
        });
        await loadCategories();
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Não foi possível excluir a categoria",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    console.log('Resetando formulário');
    setFormData({
      name: "",
      description: "",
      isActive: true
    });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const editCategory = (category: Category) => {
    console.log('Editando categoria:', category);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive
    });
    setShowAddForm(true);
  };

  // Filtrar categorias
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      title="Gerenciar Categorias" 
      description="Crie e gerencie as categorias dos produtos"
    >

      {/* Card de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Categorias cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.filter(c => c.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Visíveis na loja
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias Inativas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.filter(c => !c.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Ocultas da loja
              </p>
            </CardContent>
          </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Categoria */}
      {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Categoria *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="isActive">Status</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, isActive: checked as boolean})
                        }
                      />
                      <Label htmlFor="isActive">Categoria Ativa</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingCategory ? "Atualizar" : "Criar"} Categoria
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      )}

      {/* Lista de Categorias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Categorias ({filteredCategories.length})
            </CardTitle>
          </div>
        </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Slug</th>
                      <th className="text-left py-2">Descrição</th>
                      <th className="text-left py-2">Produtos</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Criada em</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                          <div className="font-medium">{category.name}</div>
                        </td>
                        <td className="py-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </td>
                        <td className="py-2">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {category.description || "Sem descrição"}
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="text-sm text-gray-600">
                            {category._count.products} produto(s)
                          </div>
                        </td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            category.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="py-2">
                          <div className="text-sm text-gray-600">
                            {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => editCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CategoriesPage; 