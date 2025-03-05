import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenuDemo } from "@/components/Menu";
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
  hideFooter = false, // Valor padrão para hideFooter, será usado em implementação futura
}: Readonly<{
  children: React.ReactNode;
  hideFooter?: boolean; // Prop opcional
}>) {
  return (
    <html lang="en" className={`dark ${unna.variable}`}>
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <AuthProvider>
          <NavigationMenuDemo />
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            {!hideFooter && (
              <div className="hidden">
                {/* Aqui será implementado o footer no futuro */}
              </div>
            )}
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}