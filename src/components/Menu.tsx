"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/app/_lib/utils";
import { Icons } from "@/components/icons";
import { HomeIcon, InfoIcon, LayoutDashboardIcon, LogOutIcon, MailIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function NavigationMenuDemo() {
  const { data } = useSession();
  const handleLoginWithGoogleClick = async () => await signIn("google");

  return (
    <div className="bg-gray-200 shadow fixed top-0 left-0 w-full z-50">
      {/* Container flex para alinhar logotipo à esquerda e menu ao centro */}
      <div className="flex items-center justify-between p-4">
        {/* Logotipo à esquerda */}
        <div className="flex items-center">
          <Image src={"/images/logo.png"} alt="Logotipo" width={180} height={50} />
        </div>

        {/* Ícone de menu hambúrguer em dispositivos móveis */}
        <div className="md:hidden">
          <Sheet>
            {/* Botão do ícone do menu como SheetTrigger */}
            <SheetTrigger asChild>
              <button className="text-gray-600 focus:outline-none">
                <Icons.menu className="h-6 w-6" /> {/* Ícone de menu hambúrguer */}
              </button>
            </SheetTrigger>

            {/* Conteúdo do menu lateral */}
            <SheetContent className="bg-white w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>MENU</SheetTitle>
                <SheetDescription>
                  Sua conta
                </SheetDescription>
              </SheetHeader>
              <div className="flex items-center justify-between gap-3 border-b border-gray-300 py-5">                {data?.user ? (
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
                <>
                  <h2 className="text-lg font-bold">Olá, faça o seu login!</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size={"icon"}>
                        <LogInIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Faça seu login na plataforma</DialogTitle>
                        <DialogDescription>
                          Conecte-se usando sua conta do Google.
                        </DialogDescription>
                      </DialogHeader>
                      <Button
                        variant={"outline"}
                        className="gap-1 font-bold"
                        onClick={handleLoginWithGoogleClick}
                      >
                        Google
                      </Button>
                    </DialogContent>
                  </Dialog>
                </>
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
                  Sobre
                </Link>
                <Link
                  href="/contact"
                  className="p-3 text-blue-600 hover:text-gray-800 hover:bg-gray-300 rounded transition-colors flex items-center gap-2"
                >
                  <MailIcon className="w-5 h-5" />
                  Contato
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

        {/* Menu centralizado para telas maiores */}
        <div className={`flex-1 justify-center md:flex hidden`}>
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Icons.logo className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components that you can copy and
                            paste into your apps. Accessible. Customizable. Open Source.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Re-usable components built using Radix UI and Tailwind CSS.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Typography">
                      Styles for headings, paragraphs, lists...etc
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-300 focus:bg-gray-300",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
