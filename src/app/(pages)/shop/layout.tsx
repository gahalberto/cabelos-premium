import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.shop;

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

