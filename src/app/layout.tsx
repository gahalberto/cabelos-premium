import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { ThemeProvider } from "./providers/theme";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenuDemo } from "@/components/Menu";
import { CartProvider } from "@/contexts/CartContext";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/metadata";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Unna } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });
const unna = Unna({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-unna',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/images/logoouro.png' },
      { url: '/images/logoouro.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/logoouro.png',
    apple: '/images/logoouro.png',
  },

  manifest: '/manifest.json',

  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@cabelospremium',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={unna.variable}>
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <NavigationMenuDemo />
              <div className="flex h-full flex-col pt-[88px]">
                <div className="flex-1">{children}</div>
              </div>
              <Footer />
              <FloatingWhatsApp />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}