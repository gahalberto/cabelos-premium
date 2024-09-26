import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "./providers/auth"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/Footer"
import { NavigationMenuDemo } from "@/components/Menu"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'InMemorian',
  description: 'Eternize as memórias de quem você ama',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} style={{ paddingTop: '60px' }}> {/* Adicione padding-top aqui */}
        <AuthProvider>
          <NavigationMenuDemo />
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <Footer />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
