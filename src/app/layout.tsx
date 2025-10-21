import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { ThemeProvider } from "./providers/theme";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenuDemo } from "@/components/Menu";
import { CartProvider } from "@/contexts/CartContext";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Unna } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const unna = Unna({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-unna',
});

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={unna.variable}>
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <NavigationMenuDemo />
              <div className="flex h-full flex-col">
                <div className="flex-1">{children}</div>
              </div>
              <FloatingWhatsApp />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}