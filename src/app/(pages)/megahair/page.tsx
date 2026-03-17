import MegaHairHero from "@/components/MegaHairHero";
import MegaHairB2B from "@/components/MegaHairB2B";
import MegaHairFooterSection from "@/components/MegaHairFooterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mega Hair Brasileiro do Sul | Cabelos Premium",
  description:
    "Cabelos para Mega Hair 100% brasileiros do Sul com cutículas alinhadas, brilho natural e alta durabilidade. Atacado para salões e profissionais da beleza.",
  keywords: [
    "mega hair",
    "cabelos brasileiros do sul",
    "extensão capilar",
    "cabelos premium",
    "atacado salões",
    "mega hair loiro",
    "mega hair castanho",
  ],
};

export default function MegaHairPage() {
  return (
    <main>
      <MegaHairHero />
      <MegaHairB2B />
      <MegaHairFooterSection />
    </main>
  );
}
