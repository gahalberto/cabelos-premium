"use client";
import * as React from "react";
import Link from "next/link";
import {
  HomeIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
  MenuIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { Input } from "./ui/input";

export function NavigationMenuDemo() {
  const { data } = useSession();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="w-full z-50">
      {/* Barra superior com informações sobre os cabelos */}
      <div className="w-full bg-[#8a7d5c] py-2 text-center">
        <p className="text-white font-montserrat text-[11.5px] flex items-center justify-center">
          <span className="mr-2">🇧🇷</span> A marca da sua extensão. Os legítimos cabelos brasileiros do sul. <span className="ml-2">🇧🇷</span>
        </p>
      </div>
      
      {/* Menu principal */}
      <div className="bg-[#f0efdb] py-4">
        <div className="max-w-6xl min-h-12 mx-auto px-4 flex items-center justify-between">
          {/* Links de navegação */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              HOME
            </Link>
            <Link href="/lancamento" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              LANÇAMENTO
            </Link>
            <Link href="/colecao" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              COLEÇÃO
            </Link>
            <Link href="/torne-se-expert" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              TORNE-SE EXPERT
            </Link>
            <Link href="/shop" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              SHOP
            </Link>
            <Link href="/contato" className="uppercase font-bold text-[11.5px] tracking-wide hover:text-[#8a7d5c]">
              CONTATO
            </Link>
          </nav>

          {/* Ícones de ação */}
          <div className="flex items-center gap-6">
            {/* Favoritos */}
            <Link href="/wishlist" className="text-black hover:text-[#b08c4f] transition-colors">
              <HeartIcon className="h-5 w-5 text-black" />
            </Link>
            
            {/* Carrinho */}
            <Link href="/cart" className="text-black hover:text-[#b08c4f] transition-colors">
              <ShoppingBagIcon className="h-5 w-5 text-black" />
            </Link>
            
            {/* Conta */}
            {data?.user ? (
              <div className="relative group">
                <Avatar className="h-6 w-6 border border-[#8a7d5c] cursor-pointer">
                  <AvatarImage src={data.user.image || undefined} />
                </Avatar>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-sm">{data.user.name}</p>
                    <p className="text-xs text-gray-500">{data.user.email}</p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50">Minha Conta</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">Meus Pedidos</Link>
                  <button 
                    onClick={() => signOut()} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-black hover:text-[#b08c4f] transition-colors">
                <UserIcon className="h-5 w-5 text-black" />
              </Link>
            )}
          </div>

          {/* Menu hambúrguer em dispositivos móveis */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-black focus:outline-none">
                  <MenuIcon className="h-6 w-6 text-black" />
                </button>
              </SheetTrigger>

              <SheetContent className="bg-[#F0EFDB] w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center justify-center">
                      <Image
                        src={"/images/logoouro.png"}
                        alt="Logotipo"
                        width={150}
                        height={40}
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-1 mt-6">
                  <Link
                    href="/"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    HOME
                  </Link>
                  
                  <Link
                    href="/lancamento"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    LANÇAMENTO
                  </Link>
                  
                  <Link
                    href="/colecao"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    COLEÇÃO
                  </Link>
                  
                  <Link
                    href="/torne-se-expert"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    TORNE-SE EXPERT
                  </Link>
                  
                  <Link
                    href="/shop"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    SHOP
                  </Link>
                  
                  <Link
                    href="/contato"
                    className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors"
                  >
                    CONTATO
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Modal de busca */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Buscar produtos</h3>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <Input 
                placeholder="Digite o que você procura..." 
                className="pr-10 border-[#e6d7c9] focus:border-[#b08c4f] focus:ring-[#b08c4f]"
                autoFocus
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b08c4f]">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}