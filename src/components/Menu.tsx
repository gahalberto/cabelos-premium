"use client";
import * as React from "react";
import Link from "next/link";
import {
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  MenuIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { useCart } from "@/contexts/CartContext";
import { CartSheet } from "./CartSheet";

export function NavigationMenuDemo() {
  const { data } = useSession();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* Barra superior com informações sobre os cabelos */}
      <div className="w-full bg-[#8a7d5c]/60 backdrop-blur-md py-2 text-center">
        <p className="text-white font-montserrat text-[14px] font-light flex items-center justify-center">
          <Image 
            src="/images/bandeira.png" 
            alt="Bandeira do Brasil" 
            width={20} 
            height={20} 
            className="mr-2"
          />
          A marca da sua extensão. Os legítimos cabelos brasileiros do sul.
          <Image 
            src="/images/bandeira.png" 
            alt="Bandeira do Brasil" 
            width={20} 
            height={20} 
            className="ml-2"
          />
        </p>
      </div>
      
      {/* Menu principal */}
      <div className="bg-[#8a7d5c]/60 backdrop-blur-md py-4">
        <div className="max-w-6xl min-h-12 mx-auto px-4 flex items-center justify-between">
          {/* Logo - visível apenas no mobile */}
          <Link href="/" className="md:hidden flex-shrink-0">
            <Image
              src="/images/logoouro.png"
              alt="Cabelos Premium"
              width={100}
              height={30}
              className="object-contain"
            />
          </Link>

          {/* Links de navegação - Desktop */}
          <nav className="hidden md:flex items-center justify-center gap-16 w-full">
            <Link href="/" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              HOME
            </Link>
            <Link href="/lancamento" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              LANÇAMENTO
            </Link>
            <Link href="/colecao" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              COLEÇÃO
            </Link>
            <Link href="/torne-se-expert" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              TORNE-SE EXPERT
            </Link>
            <Link href="/shop" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              SHOP
            </Link>
            <Link href="/contato" className="uppercase font-bold text-[13px] tracking-wide text-white hover:text-[#f0efdb] transition-colors">
              CONTATO
            </Link>
          </nav>

          {/* Ícones de ação - Desktop e Mobile */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Favoritos - Oculto no mobile, visível no desktop */}
            <Link href="/wishlist" className="hidden md:block text-white hover:text-[#f0efdb] transition-colors">
              <HeartIcon className="h-5 w-5" />
            </Link>
            
            {/* Carrinho */}
            <CartSheet>
              <button className="text-white hover:text-[#f0efdb] transition-colors relative">
                <ShoppingCartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </CartSheet>
            
            {/* Conta - Desktop */}
            {data?.user ? (
              <div className="hidden md:block relative group">
                <UserIcon className="h-5 w-5 text-white cursor-pointer" />
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
              <Link href="/login" className="hidden md:block text-white hover:text-[#f0efdb] transition-colors">
                <UserIcon className="h-5 w-5" />
              </Link>
            )}

            {/* Menu hambúrguer - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden text-white focus:outline-none">
                  <MenuIcon className="h-6 w-6" />
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

                  {/* Links de conta no menu mobile */}
                  <div className="border-t border-gray-300 mt-4 pt-4">
                    {data?.user ? (
                      <>
                        <div className="p-3 bg-white rounded-md mb-2">
                          <p className="font-medium text-sm text-gray-900">{data.user.name}</p>
                          <p className="text-xs text-gray-500">{data.user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors block"
                        >
                          Minha Conta
                        </Link>
                        <Link
                          href="/orders"
                          className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors block"
                        >
                          Meus Pedidos
                        </Link>
                        <Link
                          href="/wishlist"
                          className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors block"
                        >
                          Lista de Desejos
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full text-left p-3 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors block"
                        >
                          Entrar
                        </Link>
                        <Link
                          href="/wishlist"
                          className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors block"
                        >
                          Lista de Desejos
                        </Link>
                      </>
                    )}
                  </div>
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