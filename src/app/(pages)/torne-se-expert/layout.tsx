import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.torneseExpert;

export default function TorneSeExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

