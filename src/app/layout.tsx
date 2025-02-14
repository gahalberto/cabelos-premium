import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { NavigationMenuDemo } from "@/components/Menu";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InMemorian",
  description: "Eternize as memórias de quem você ama",
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
          {!hideFooter && <Footer />} {/* Renderiza o Footer apenas se hideFooter for false */}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}