"use client";

import { usePathname } from "next/navigation";
import { NavigationMenuDemo } from "@/components/Menu";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isOffline = pathname === "/offline";
  const isAuth = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"].includes(pathname ?? "");

  if (isAdmin || isOffline || isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenuDemo />
      <main className="flex-1 pt-[116px] md:pt-[120px]">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
