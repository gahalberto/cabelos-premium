import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.lancamento;

export default function LancamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

