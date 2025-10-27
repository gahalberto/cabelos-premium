import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.colecao;

export default function ColecaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

