"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { 
  Star, 
  Heart, 
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { getProductBySlug, type ProductDetails } from "@/app/_actions/get-product-by-slug";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { toast } = useToast();
  const { data: session } = useSession();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      const productData = await getProductBySlug(slug);
      if (!productData) {
        notFound();
      }
      
      setProduct(productData);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      toast({
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os detalhes do produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive"
      });
      return;
    }

    if (!product || product.stock === 0) {
      toast({
        title: "Produto indisponível",
        description: "Este produto não está disponível em estoque",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
      });
      setQuantity(1);
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-gray-700">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images[selectedImage] || "/images/no-image.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              {/* Badges removidos conforme solicitado */}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Categoria */}
            <div className="flex items-center gap-2">
              {/* Badge de categoria removido conforme solicitado */}
            </div>

            {/* Nome e SKU */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500">
                SKU: {product.sku}
              </p>
            </div>

            {/* Rating */}
            {product.averageRating && product.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(product.averageRating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} avaliações)
                </span>
              </div>
            )}

            {/* Preços */}
            <div className="space-y-2">
              {hasDiscount && (
                <p className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </p>
              )}
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(currentPrice)}
              </p>
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  Economia de {formatPrice(product.price - product.salePrice!)} ({discountPercentage}% de desconto)
                </p>
              )}
            </div>

            {/* Estoque */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    Em estoque ({product.stock} unidades)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-medium">
                    Fora de estoque
                  </span>
                </>
              )}
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-4">
              {product.length && (
                <div>
                  <span className="text-sm text-gray-500">Comprimento:</span>
                  <p className="font-medium">{product.length}</p>
                </div>
              )}
              {product.texture && (
                <div>
                  <span className="text-sm text-gray-500">Textura:</span>
                  <p className="font-medium">{product.texture}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="text-sm text-gray-500">Cor:</span>
                  <p className="font-medium">{product.color}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-sm text-gray-500">Peso:</span>
                  <p className="font-medium">{product.weight}</p>
                </div>
              )}
              {product.origin && (
                <div>
                  <span className="text-sm text-gray-500">Origem:</span>
                  <p className="font-medium">{product.origin}</p>
                </div>
              )}
            </div>

            {/* Descrição */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="space-y-4">
              {/* Quantidade */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Quantidade:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsInWishlist(!isInWishlist)}
                  className="px-6 py-3"
                  size="lg"
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  Favorito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 