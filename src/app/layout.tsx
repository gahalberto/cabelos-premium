import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenuDemo } from "@/components/Menu";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Cinzel } from "next/font/google";
import { Raleway } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cabelos Premium",
  description: "A melhor loja de cabelos do Brasil",
  icons: {
    icon: "/images/favcon.png", // Caminho do favicon na pasta public/
    shortcut: "/images/favcon.png", // Ícone de atalho
    apple: "/images/favcon.png", // Ícone para dispositivos Apple
  },

};

export default function RootLayout({
  children,
  hideFooter = false, // Valor padrão para hideFooter
}: Readonly<{
  children: React.ReactNode;
  hideFooter?: boolean; // Prop opcional
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <AuthProvider>
          <NavigationMenuDemo />
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}