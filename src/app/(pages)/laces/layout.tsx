import { createMetadata } from "@/config/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Laces Hiper-Realistas | Cabelos Premium",
  description:
    "Conheça nossas Laces confeccionadas com cabelos brasileiros do Sul, garantindo realismo, conforto e sofisticação.",
  canonical: "/laces",
});

export default function LacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
