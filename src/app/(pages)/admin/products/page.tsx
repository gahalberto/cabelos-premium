"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Image as ImageIcon,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { getProducts, getCategories } from "@/app/_actions/get-products";
import { createProduct as createProductAction } from "@/app/_actions/admin/create-product";
import { updateProduct as updateProductAction } from "@/app/_actions/admin/update-product";
import { deleteProduct as deleteProductAction } from "@/app/_actions/admin/delete-product";
import { ImageUpload } from "@/components/ImageUpload";
import { AdminLayout } from "@/components/AdminLayout";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  length?: string | null;
  texture?: string | null;
  color?: string | null;
  weight?: string | null;
  origin?: string | null;
  images?: string[];
  category: {
    name: string;
    slug: string;
  };
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminProductsPage = () => {
  const { status } = useSession();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "",
    length: "",
    texture: "",
    color: "",
    weight: "",
    origin: "",
    isActive: true,
    isFeatured: false,
    isNew: false
  });
  const [productImages, setProductImages] = useState<Array<{
    id: string;
    file?: File;
    preview: string;
    uploaded: boolean;
    url?: string;
  }>>([]);

  const loadData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories()
      ]);
      
      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar produtos e categorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast({
          title: "Produto atualizado!",
          description: "O produto foi atualizado com sucesso",
        });
      } else {
        await createProduct(formData);
        toast({
          title: "Produto criado!",
          description: "O produto foi criado com sucesso",
        });
      }
      
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive"
      });
    }
  };

  const createProduct = async (data: typeof formData) => {
    const productData = {
      ...data,
      price: parseFloat(data.price),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
      stock: parseInt(data.stock),
      images: productImages.filter(img => img.uploaded).map(img => img.url || img.preview)
    };
    
    await createProductAction(productData);
  };

  const updateProduct = async (id: string, data: typeof formData) => {
    const productData = {
      ...data,
      price: parseFloat(data.price),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
      stock: parseInt(data.stock),
      images: productImages.filter(img => img.uploaded).map(img => img.url || img.preview)
    };
    
    await updateProductAction(id, productData);
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProductAction(id);
        toast({
          title: "Produto excluído!",
          description: "O produto foi excluído com sucesso",
        });
        loadData();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o produto",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      stock: "",
      category: "",
      length: "",
      texture: "",
      color: "",
      weight: "",
      origin: "",
      isActive: true,
      isFeatured: false,
      isNew: false
    });
    setProductImages([]);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock.toString(),
      category: product.category.slug,
      length: product.length || "",
      texture: product.texture || "",
      color: product.color || "",
      weight: product.weight || "",
      origin: product.origin || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNew: product.isNew
    });
    
    if (product.images && product.images.length > 0) {
      const existingImages = product.images.map((url: string, index: number) => ({
        id: `existing-${index}`,
        preview: url,
        uploaded: true,
        url: url
      }));
      setProductImages(existingImages);
    } else {
      setProductImages([]);
    }
    
    setShowAddForm(true);
  };

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || !selectedCategory || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
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
      title="Gerenciar Produtos" 
      description="Visualize, edite e gerencie todos os produtos da loja"
    >
      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Produto */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Preço de Oferta</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="length">Comprimento</Label>
                  <Input
                    id="length"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="texture">Textura</Label>
                  <Input
                    id="texture"
                    value={formData.texture}
                    onChange={(e) => setFormData({...formData, texture: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="origin">Origem</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  />
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

              {/* Upload de Imagens */}
              <div>
                <ImageUpload
                  onImagesChange={setProductImages}
                  maxImages={10}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isActive: checked as boolean})
                    }
                  />
                  <Label htmlFor="isActive">Produto Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isFeatured: checked as boolean})
                    }
                  />
                  <Label htmlFor="isFeatured">Em Destaque</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isNew: checked as boolean})
                    }
                  />
                  <Label htmlFor="isNew">Produto Novo</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? "Atualizar" : "Criar"} Produto
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos ({filteredProducts.length})
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
                    <th className="text-left py-3 px-2">Produto</th>
                    <th className="text-left py-3 px-2">Categoria</th>
                    <th className="text-left py-3 px-2">Preço</th>
                    <th className="text-left py-3 px-2">Estoque</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.slug}</div>
                            {product.images && (
                              <div className="text-xs text-gray-400">
                                {product.images.length} imagem(ns)
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">{product.category.name}</td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">
                            R$ {product.price.toFixed(2)}
                          </div>
                          {product.salePrice && (
                            <div className="text-sm text-red-600">
                              R$ {product.salePrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1 flex-wrap">
                          {product.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Ativo
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Destaque
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Novo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id)}
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

export default AdminProductsPage;
