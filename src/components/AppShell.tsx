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

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <NavigationMenuDemo />
      <div className="flex h-full flex-col pt-[88px]">
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
