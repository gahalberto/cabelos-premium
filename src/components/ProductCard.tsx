"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Plus,
  Minus
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive"
      });
      return;
    }

    if (product.stock === 0) {
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
      setQuantity(1);
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <Card className="group bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0 relative">
        {/* Imagem do produto */}
        <Link href={`/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={product.images[0] || "/images/no-image.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
          
        {/* Badges */}
  {/* Badges removidos conforme solicitado */}

        {/* Botão de favorito */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          onClick={() => setIsInWishlist(!isInWishlist)}
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>

        {/* Botão de visualizar */}
        <Link href={`/${product.slug}`}>
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="text-xs font-medium">Ver</span>
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        {/* Categoria */}
        <div className="mb-2">
          {/* Badge de categoria removido conforme solicitado */}
        </div>

        {/* Nome do produto */}
        <Link href={`/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Características */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.length && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.length}
            </span>
          )}
          {product.texture && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.texture}
            </span>
          )}
          {product.color && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.color}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.averageRating && product.reviewCount && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.averageRating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Preços */}
        <div className="mb-3">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
          )}
        </div>

        {/* Estoque */}
        <div className="mb-3">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">
              Em estoque ({product.stock} unidades)
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium">
              Fora de estoque
            </span>
          )}
        </div>

        {/* Controles de quantidade */}
        {product.stock > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Qtd:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-2 py-1 min-w-[2rem] text-center text-sm">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Botão de adicionar ao carrinho */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adicionando...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 