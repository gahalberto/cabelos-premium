"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/app/_lib/utils";
import { Icons } from "@/components/icons";
import {
  HomeIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { LogInIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function NavigationMenuDemo() {
  const { data } = useSession();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="bg-[#F5E8DD] shadow w-full z-50">
      {/* Container flex para alinhar logotipo à esquerda e menu ao centro */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logotipo à esquerda */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={"/images/logo-cabelos.png"}
              alt="Logotipo"
              width={220}
              height={50}
            />
          </Link>
        </div>

        {/* Ícone de menu hambúrguer em dispositivos móveis */}
        <div className="md:hidden">
          <Sheet>
            {/* Botão do ícone do menu como SheetTrigger */}
            <SheetTrigger asChild>
              <button className="text-gray-600 focus:outline-none">
                <Icons.menu className="h-6 w-6" />{" "}
                {/* Ícone de menu hambúrguer */}
              </button>
            </SheetTrigger>

            {/* Conteúdo do menu lateral */}
            <SheetContent className="bg-white w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Image
                      src={"/images/logo.png"}
                      alt="Logotipo"
                      width={180}
                      height={50}
                    />
                  </div>
                </SheetTitle>
                <SheetDescription>Menu de navegação</SheetDescription>
              </SheetHeader>
              <div className="flex items-center justify-between gap-3 border-b border-gray-300 py-5">
                {" "}
                {data?.user ? (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={data.user.image || undefined} />
                    </Avatar>

                    <div className="">
                      <p className="font-bold">{data.user.name}</p>
                      <p className="text-sm">{data.user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogInIcon className="text-blue-600" />
                    <Link href={"/login"}>
                      <h2 className="text-lg font-bold text-blue-600">
                        Faça o seu login
                      </h2>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 mt-5">
                {data?.user.id && (
                  <div>
                    <Link
                      href="/dashboard"
                      className="p-3 text-blue-600 hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboardIcon className="w-5 h-5" />
                      Seus perfis
                    </Link>
                  </div>
                )}

                <Link
                  href="/"
                  className="p-3 text-black hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                >
                  <HomeIcon className="w-5 h-5" />
                  Início
                </Link>
                <Link
                  href="/about"
                  className="p-3 text-blue-600 hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                >
                  <InfoIcon className="w-5 h-5" />
                  Lançamentos
                </Link>
                <Link
                  href="/contact"
                  className="p-3 text-blue-600 hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                >
                  <MailIcon className="w-5 h-5" />
                  Coleção
                </Link>

                <div
                  className="cursor-pointer p-3 text-blue-600 hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                  onClick={() => signOut()}
                >
                  <LogOutIcon /> Sair
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Menu para telas maiores */}
        <div className={`flex-1 justify-end hidden md:flex`}>
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              {/* Links do menu */}
              {data?.user.id && (
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2 font-raleway text-black"
                      )}
                    >
                      Seus perfis
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 font-raleway text-black"
                    )}
                  >
                   Início
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 font-raleway text-black"
                    )}
                  >
                    Lançamentos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 font-raleway text-black"
                    )}
                  >
                    Coleção
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2 font-raleway text-black cursor-pointer"
                      )}
                    >
                      Torne-se um expert
                    </NavigationMenuLink>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Cadastre seu salão</DialogTitle>
                      <DialogDescription>
                        Preencha as informações abaixo para se tornar um expert.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Nome do salão" />
                      <Input placeholder="CNPJ" />
                      <Input placeholder="CPF" />
                      <Input placeholder="Instagram" />
                      <Input placeholder="Endereço completo" />
                      <Input placeholder="Email" />
                      <Input placeholder="Telefone" />
                    </div>
                    <Button className="w-full mt-4">Enviar</Button>
                  </DialogContent>
                </Dialog>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 font-raleway text-black"
                    )}
                  >
                    Produtos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>


              {/* Botão de Sair ou Login */}
              {data?.user ? (
                <NavigationMenuItem>
                  <div
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "cursor-pointer flex items-center gap-2 text-black"
                    )}
                    onClick={() => signOut()}
                  >
                    <LogOutIcon className="w-5 h-5" />
                    Sair
                  </div>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem className="">
                  <Link href="/login"  className=""legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2 font-raleway text-black"
                      )}
                    >
                      Contato
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}