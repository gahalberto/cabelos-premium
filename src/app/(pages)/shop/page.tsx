"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  X,
  SlidersHorizontal
} from "lucide-react";
import { getProducts, getCategories, getAvailableFilters, type ProductFilters } from "@/app/_actions/get-products";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  length?: string | null;
  texture?: string | null;
  color?: string | null;
  weight?: string | null;
  origin?: string | null;
  category: {
    name: string;
    slug: string;
  };
  averageRating?: number;
  reviewCount?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count: { products: number };
}

export default function ShopPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableFilters, setAvailableFilters] = useState<{
    textures: (string | null)[];
    colors: (string | null)[];
    lengths: (string | null)[];
  }>({
    textures: [],
    colors: [],
    lengths: []
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filtros
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
    isFeatured: false,
    isNew: false,
    texture: "all",
    color: "all",
    length: "all"
  });

  // Ordenação
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'createdAt' | 'popularity'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Carregar produtos quando filtros mudarem
  useEffect(() => {
    loadProducts();
  }, [filters, sortBy, sortOrder, currentPage]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, filtersData] = await Promise.all([
        getCategories(),
        getAvailableFilters()
      ]);
      
      setCategories(categoriesData);
      setAvailableFilters(filtersData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as categorias e filtros",
        variant: "destructive"
      });
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts({
        page: currentPage,
        limit: 12,
        filters,
        sortBy,
        sortOrder
      });

      setProducts(result.products);
      setTotalPages(result.pagination.totalPages);
      setTotalProducts(result.pagination.totalCount);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset para primeira página
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      isFeatured: false,
      isNew: false,
      texture: "all",
      color: "all",
      length: "all"
    });
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossa Coleção</h1>
          <p className="text-gray-600">
            Descubra os melhores cabelos brasileiros do sul, selecionados com cuidado para você
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-80">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">Filtros</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                </Button>
              </CardHeader>
              
              <CardContent className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Busca */}
                <div>
                  <Label htmlFor="search" className="text-gray-700">Buscar produtos</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nome, cor, textura..."
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Categorias */}
                <div>
                  <Label className="text-gray-700">Categorias</Label>
                  <div className="mt-2 space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.category === category.slug}
                          onCheckedChange={(checked) => 
                            handleFilterChange('category', checked ? category.slug : '')
                          }
                        />
                        <Label 
                          htmlFor={`category-${category.id}`} 
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {category.name} ({category._count.products})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <Label className="text-gray-700">Faixa de Preço</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Mín"
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="border-primary focus:border-primary"
                    />
                    <Input
                      placeholder="Máx"
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="border-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Filtros especiais */}
                <div>
                  <Label className="text-gray-700">Filtros Especiais</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={filters.isFeatured}
                        onCheckedChange={(checked) => handleFilterChange('isFeatured', checked)}
                      />
                      <Label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer">
                        Produtos em Destaque
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new"
                        checked={filters.isNew}
                        onCheckedChange={(checked) => handleFilterChange('isNew', checked)}
                      />
                      <Label htmlFor="new" className="text-sm text-gray-600 cursor-pointer">
                        Produtos Novos
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Textura */}
                {availableFilters.textures.length > 0 && (
                  <div>
                    <Label className="text-gray-700">Textura</Label>
                    <Select value={filters.texture} onValueChange={(value) => handleFilterChange('texture', value)}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Selecione a textura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as texturas</SelectItem>
                        {availableFilters.textures
                          .filter((texture): texture is string => texture !== null)
                          .map((texture) => (
                            <SelectItem key={texture} value={texture}>
                              {texture}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Cor */}
                {availableFilters.colors.length > 0 && (
                  <div>
                    <Label className="text-gray-700">Cor</Label>
                    <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Selecione a cor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as cores</SelectItem>
                        {availableFilters.colors
                          .filter((color): color is string => color !== null)
                          .map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Comprimento */}
                {availableFilters.lengths.length > 0 && (
                  <div>
                    <Label className="text-gray-700">Comprimento</Label>
                    <Select value={filters.length} onValueChange={(value) => handleFilterChange('length', value)}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Selecione o comprimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os comprimentos</SelectItem>
                        {availableFilters.lengths
                          .filter((length): length is string => length !== null)
                          .map((length) => (
                            <SelectItem key={length} value={length}>
                              {length}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Botão limpar filtros */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {/* Barra superior */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Produtos ({totalProducts})
                </h2>
                
                {/* Ordenação */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600">Ordenar por:</Label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 border-gray-300 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Mais recentes</SelectItem>
                      <SelectItem value="price">Preço</SelectItem>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="popularity">Popularidade</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>

              {/* Controles de visualização */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-white text-black border border-black' : 'bg-white text-black border border-gray-300'}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white text-black border border-black' : 'bg-white text-black border border-gray-300'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Produtos */}
            {!loading && products.length > 0 && (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Sem produtos */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 