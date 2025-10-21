import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <Package className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 mb-2">
            Produto não encontrado
          </CardTitle>
          <p className="text-gray-600">
            O produto que você está procurando não existe ou foi removido.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link href="/shop">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Ver Todos os Produtos
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Se você acredita que isso é um erro,</p>
            <p>entre em contato conosco.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 