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
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProducts, getCategories } from "@/app/_actions/get-products";
import { createProduct as createProductAction } from "@/app/_actions/admin/create-product";
import { updateProduct as updateProductAction } from "@/app/_actions/admin/update-product";
import { deleteProduct as deleteProductAction } from "@/app/_actions/admin/delete-product";
import { ImageUpload } from "@/components/ImageUpload";
import { AdminLayout } from "@/components/AdminLayout";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  length?: string | null;
  texture?: string | null;
  color?: string | null;
  weight?: string | null;
  origin?: string | null;
  images?: string[];
  category: { name: string; slug: string };
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

type SortField = "name" | "price" | "stock" | "createdAt";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

function SortIcon({ field, current, order }: { field: SortField; current: SortField; order: SortOrder }) {
  if (field !== current) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 inline" />;
  return order === "asc"
    ? <ChevronUp className="h-3.5 w-3.5 text-gray-700 ml-1 inline" />
    : <ChevronDown className="h-3.5 w-3.5 text-gray-700 ml-1 inline" />;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  lowStockThreshold: "",
  category: "",
  length: "",
  texture: "",
  color: "",
  weight: "",
  origin: "",
  isActive: true,
  isFeatured: false,
  isNew: false,
  priceOnRequest: false,
};

const AdminProductsPage = () => {
  const { data: session, status } = useSession();
  const isVendedor = (session?.user as any)?.role === "VENDEDOR";
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [productImages, setProductImages] = useState<Array<{
    id: string; file?: File; preview: string; uploaded: boolean; url?: string;
  }>>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ limit: 500, includeInactive: true }),
        getCategories(),
      ]);
      setProducts(productsData.products as Product[]);
      setCategories(categoriesData);
    } catch {
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") loadData();
  }, [status, loadData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === "all" || p.category.slug === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * dir;
      if (sortField === "price") return (a.price - b.price) * dir;
      if (sortField === "stock") return (a.stock - b.stock) * dir;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const lowStockCount = products.filter(
    (p) => p.lowStockThreshold > 0 && p.stock <= p.lowStockThreshold
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.priceOnRequest ? 0 : parseFloat(formData.price),
        salePrice: (!formData.priceOnRequest && formData.salePrice) ? parseFloat(formData.salePrice) : undefined,
        stock: parseInt(formData.stock),
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 0,
        images: productImages.filter((img) => img.uploaded).map((img) => img.url || img.preview),
      };

      if (editingProduct) {
        await updateProductAction(editingProduct.id, payload);
        toast({ title: "Produto atualizado!" });
      } else {
        await createProductAction(payload);
        toast({ title: "Produto criado!" });
      }

      resetForm();
      loadData();
    } catch {
      toast({ title: "Erro ao salvar produto", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setProductImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold > 0 ? product.lowStockThreshold.toString() : "",
      category: product.category.slug,
      length: product.length || "",
      texture: product.texture || "",
      color: product.color || "",
      weight: product.weight || "",
      origin: product.origin || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      priceOnRequest: (product as any).priceOnRequest ?? false,
    });
    setProductImages(
      product.images?.map((url, i) => ({ id: `existing-${i}`, preview: url, uploaded: true, url })) || []
    );
    setShowForm(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteProductAction(id);
      toast({ title: "Produto excluído!" });
      loadData();
    } catch {
      toast({ title: "Erro ao excluir produto", variant: "destructive" });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600" />
      </div>
    );
  }

  // ── Formulário ─────────────────────────────────────────
  if (showForm) {
    return (
      <AdminLayout
        title={editingProduct ? "Editar Produto" : "Novo Produto"}
        description={editingProduct ? `Editando: ${editingProduct.name}` : "Preencha os dados do novo produto"}
      >
        <Button variant="ghost" onClick={resetForm} className="mb-6 gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </Button>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name" value={formData.name} required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price" type="number" step="0.01"
                    required={!formData.priceOnRequest}
                    disabled={formData.priceOnRequest}
                    value={formData.priceOnRequest ? "" : formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={formData.priceOnRequest ? "Sob consulta" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Preço de Oferta</Label>
                  <Input
                    id="salePrice" type="number" step="0.01"
                    disabled={formData.priceOnRequest}
                    value={formData.priceOnRequest ? "" : formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder={formData.priceOnRequest ? "Sob consulta" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input
                    id="stock" type="number" required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="lowStockThreshold">
                    Alerta de estoque baixo
                    <span className="ml-1 text-xs text-gray-400 font-normal">(alertar abaixo de X unidades — 0 = desativado)</span>
                  </Label>
                  <Input
                    id="lowStockThreshold" type="number" min="0" placeholder="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="length">Comprimento</Label>
                  <Input id="length" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="texture">Textura</Label>
                  <Input id="texture" value={formData.texture} onChange={(e) => setFormData({ ...formData, texture: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Input id="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="weight">Peso</Label>
                  <Input id="weight" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="origin">Origem</Label>
                  <Input id="origin" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description" rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <ImageUpload onImagesChange={setProductImages} maxImages={10} />

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive" checked={formData.isActive}
                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v as boolean })}
                  />
                  <Label htmlFor="isActive">Produto Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured" checked={formData.isFeatured}
                    onCheckedChange={(v) => setFormData({ ...formData, isFeatured: v as boolean })}
                  />
                  <Label htmlFor="isFeatured">Em Destaque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew" checked={formData.isNew}
                    onCheckedChange={(v) => setFormData({ ...formData, isNew: v as boolean })}
                  />
                  <Label htmlFor="isNew">Produto Novo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priceOnRequest" checked={formData.priceOnRequest}
                    onCheckedChange={(v) => setFormData({ ...formData, priceOnRequest: v as boolean, price: v ? "0" : formData.price, salePrice: v ? "" : formData.salePrice })}
                  />
                  <Label htmlFor="priceOnRequest">Preço Sob Consulta</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
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
      </AdminLayout>
    );
  }

  // ── Lista ──────────────────────────────────────────────
  return (
    <AdminLayout
      title="Gerenciar Produtos"
      description="Visualize, edite e gerencie todos os produtos da loja"
    >
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {lowStockCount} produto{lowStockCount > 1 ? "s" : ""} com estoque baixo
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-56">
              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Filtrar por categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Produtos
            <span className="text-gray-400 font-normal text-sm">
              ({filtered.length}{filtered.length !== products.length ? ` de ${products.length}` : ""})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Nenhum produto encontrado
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        <button className="flex items-center hover:text-gray-900" onClick={() => handleSort("name")}>
                          Produto <SortIcon field="name" current={sortField} order={sortOrder} />
                        </button>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoria</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        <button className="flex items-center hover:text-gray-900" onClick={() => handleSort("price")}>
                          Preço <SortIcon field="price" current={sortField} order={sortOrder} />
                        </button>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        <button className="flex items-center hover:text-gray-900" onClick={() => handleSort("stock")}>
                          Estoque <SortIcon field="stock" current={sortField} order={sortOrder} />
                        </button>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((product) => {
                      const isLowStock = product.lowStockThreshold > 0 && product.stock <= product.lowStockThreshold;
                      return (
                        <tr
                          key={product.id}
                          className={`hover:bg-gray-50 transition-colors ${isLowStock ? "bg-orange-50/40" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {product.images && product.images.length > 0 ? (
                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                  <ImageIcon className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-400">{product.slug}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-600">{product.category.name}</td>

                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </div>
                            {product.salePrice && (
                              <div className="text-xs text-red-600">
                                R$ {product.salePrice.toFixed(2).replace(".", ",")}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                product.stock === 0
                                  ? "bg-red-100 text-red-700"
                                  : isLowStock
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {product.stock}
                              </span>
                              {isLowStock && (
                                <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {product.isActive ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Ativo</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">Inativo</span>
                              )}
                              {product.isFeatured && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Destaque</span>
                              )}
                              {product.isNew && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">Novo</span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEdit(product)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {!isVendedor && (
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages} &middot; {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, i) =>
                        item === "..." ? (
                          <span key={`el-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setCurrentPage(item as number)}
                            className={`w-8 h-8 rounded text-sm ${
                              currentPage === item
                                ? "bg-gray-900 text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminProductsPage;
