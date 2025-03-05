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
    <div className="bg-[#F0EFDB] w-full z-50 border-b border-[#e6d7c9]">
      {/* Barra superior com informações sobre os cabelos */}
      <div className="w-full bg-[#f5f5f5] py-4 text-center">
        <p className="text font-bold text-[#2f5233] flex items-center justify-center">
          <span className="mr-2">🇧🇷</span> Os Legitimos Cabelos Brasileiros do Sul 
        </p>
      </div>
      

      {/* Container principal do menu */}
      <div className="max-w-6xl mx-auto flex items-center justify-center py-4 px-4">
        {/* Logotipo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={"/images/logoouro.png"}
              alt="Logotipo"
              width={400}
              height={50}
              className="h-auto"
            />
          </Link>
        </div>

        {/* Ícones de ação para desktop */}
        <div className="hidden md:flex items-center gap-6 absolute right-4">
          {/* Busca */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#b08c4f] hover:text-[#8a6d3b] transition-colors"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          
          {/* Favoritos */}
          <Link href="/wishlist" className="text-[#b08c4f] hover:text-[#8a6d3b] transition-colors">
            <HeartIcon className="h-5 w-5" />
          </Link>
          
          {/* Carrinho */}
          <Link href="/cart" className="text-[#b08c4f] hover:text-[#8a6d3b] transition-colors relative">
            <ShoppingBagIcon className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-[#b08c4f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
          
          {/* Conta */}
          {data?.user ? (
            <div className="relative group">
              <Avatar className="h-8 w-8 border-2 border-[#b08c4f] cursor-pointer">
                <AvatarImage src={data.user.image || undefined} />
              </Avatar>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-sm font-unna">{data.user.name}</p>
                  <p className="text-xs text-gray-500 font-unna">{data.user.email}</p>
                </div>
                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50 font-unna">Minha Conta</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 font-unna">Meus Pedidos</Link>
                <button 
                  onClick={() => signOut()} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 font-unna"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-[#b08c4f] hover:text-[#8a6d3b] transition-colors">
              <UserIcon className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Ícone de menu hambúrguer em dispositivos móveis */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="text-[#b08c4f] relative">
            <ShoppingBagIcon className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-[#b08c4f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-[#b08c4f] focus:outline-none">
                <MenuIcon className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent className="bg-[#f9f3ee] w-[300px] sm:w-[350px] overflow-y-auto">
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
              
              <div className="mt-6 px-2">
                <Input 
                  placeholder="Buscar produtos..." 
                  className="bg-white border-[#e6d7c9] focus:border-[#b08c4f] focus:ring-[#b08c4f]"
                />
              </div>
              
              <div className="flex flex-col space-y-1 mt-6">
                <Link
                  href="/"
                  className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors flex items-center gap-2 text-base font-unna"
                >
                  <HomeIcon className="w-4 h-4" />
                  Início
                </Link>
                
                <div className="p-3 text-gray-800 font-medium text-base font-unna">Produtos</div>
                
                <Link
                  href="/category/perucas"
                  className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Perucas
                </Link>
                
                <Link
                  href="/category/extensoes"
                  className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Extensões
                </Link>
                
                <Link
                  href="/category/apliques"
                  className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Apliques
                </Link>
                
                <Link
                  href="/category/acessorios"
                  className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Acessórios
                </Link>
                
                <Link
                  href="/category/cosmeticos"
                  className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Cosméticos
                </Link>
                
                <div className="border-t border-[#e6d7c9] my-2"></div>
                
                <Link
                  href="/about"
                  className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Sobre Nós
                </Link>
                
                <Link
                  href="/contato"
                  className="p-3 text-gray-800 hover:bg-[#e6d7c9] rounded-md transition-colors text-base font-unna"
                >
                  Contato
                </Link>
                
                {data?.user ? (
                  <>
                    <div className="border-t border-[#e6d7c9] my-2"></div>
                    <div className="p-3 flex items-center gap-2">
                      <Avatar className="h-8 w-8 border-2 border-[#b08c4f]">
                        <AvatarImage src={data.user.image || undefined} />
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{data.user.name}</p>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors font-unna"
                    >
                      Minha Conta
                    </Link>
                    <Link
                      href="/orders"
                      className="p-3 pl-6 text-gray-700 hover:bg-[#e6d7c9] rounded-md transition-colors font-unna"
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      className="p-3 pl-6 text-left w-full text-red-500 hover:bg-[#e6d7c9] rounded-md transition-colors font-unna"
                      onClick={() => signOut()}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="p-3 text-[#b08c4f] hover:bg-[#e6d7c9] rounded-md transition-colors flex items-center gap-2 text-base font-unna"
                  >
                    <UserIcon className="w-4 h-4" />
                    Entrar / Cadastrar
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Menu de navegação principal - apenas desktop */}
      <div className="hidden md:block border-t bg-[#8a7d5c] border-[#e6d7c9]">
        <div className="max-w-4xl mx-auto flex justify-center">
          <NavigationMenu className="justify-center">
            <NavigationMenuList className="flex space-x-10">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-12 w-max items-center justify-center rounded-md px-4 py-2 text-2xl font-unna text-[#F0EFDB] transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/category/perucas" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-2xl text-[#F0EFDB] font-medium transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-unna"
                  >
                    Lançamento
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/category/extensoes" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-2xl text-[#F0EFDB] font-medium transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-unna"
                  >
                    Coleção
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/category/apliques" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-medium text-2xl text-[#F0EFDB] transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-unna"
                  >
                    Torne-se Expert
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/category/acessorios" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-medium text-2xl text-[#F0EFDB] transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-unna"
                  >
                    Cosméticos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contato" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-medium text-2xl text-[#F0EFDB] transition-colors hover:text-[#b08c4f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-unna"
                  >
                    Contato
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      
      {/* Modal de busca */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium font-unna">Buscar produtos</h3>
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
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-unna">Sugestões:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="px-3 py-1 bg-[#f9f3ee] text-sm rounded-full hover:bg-[#e6d7c9] font-unna">
                  Perucas loiras
                </button>
                <button className="px-3 py-1 bg-[#f9f3ee] text-sm rounded-full hover:bg-[#e6d7c9] font-unna">
                  Extensões de cabelo
                </button>
                <button className="px-3 py-1 bg-[#f9f3ee] text-sm rounded-full hover:bg-[#e6d7c9] font-unna">
                  Apliques naturais
                </button>
                <button className="px-3 py-1 bg-[#f9f3ee] text-sm rounded-full hover:bg-[#e6d7c9] font-unna">
                  Shampoo para perucas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}