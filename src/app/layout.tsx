import { Inter } from "next/font/google";
import { Unna } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./providers/auth";
import { ThemeProvider } from "./providers/theme";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { AppShell } from "@/components/AppShell";
import { siteConfig } from "@/config/metadata";
import { db } from "@/app/_lib/prisma";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const inter = Inter({ subsets: ["latin"] });
const unna = Unna({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-unna",
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/logoouro.png" },
      { url: "/images/logoouro.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/logoouro.png",
    apple: "/images/logoouro.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@cabelospremium",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

async function getTrackingConfig() {
  try {
    return await db.storeConfig.findUnique({
      where: { id: "default" },
      select: {
        gtmId: true,
        ga4Id: true,
        metaPixelId: true,
        customHeadScripts: true,
        customBodyScripts: true,
      },
    });
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tracking = await getTrackingConfig();

  return (
    <html lang="pt-BR" className={unna.variable}>
      <head>
        {/* Google Tag Manager */}
        {tracking?.gtmId && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${tracking.gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics 4 (sem GTM) */}
        {tracking?.ga4Id && !tracking?.gtmId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${tracking.ga4Id}`}
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tracking.ga4Id}');`,
              }}
            />
          </>
        )}

        {/* Meta Pixel */}
        {tracking?.metaPixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${tracking.metaPixelId}');fbq('track','PageView');`,
            }}
          />
        )}

        {/* Scripts customizados no <head> definidos pela agência */}
        {tracking?.customHeadScripts && (
          <Script
            id="custom-head-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: tracking.customHeadScripts }}
          />
        )}
      </head>

      <body className={inter.className} style={{ overflowX: "hidden" }}>
        {/* GTM noscript fallback */}
        {tracking?.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${tracking.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>

        <Toaster />

        {/* Scripts customizados no <body> definidos pela agência */}
        {tracking?.customBodyScripts && (
          <Script
            id="custom-body-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: tracking.customBodyScripts }}
          />
        )}
      </body>
    </html>
  );
}
