import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.cart;

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

