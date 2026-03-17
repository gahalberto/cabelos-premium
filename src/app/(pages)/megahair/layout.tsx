import { pageMetadata } from "@/config/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata.megahair;

export default function MegaHairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
