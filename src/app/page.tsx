import CheckoutSection from "@/components/CheckoutSection";
import { AppleCardsCarouselDemo } from "@/components/Depoimentos";
import HeaderBanner from "@/components/HeaderBanner";
import WhoIsUs from "@/components/WhoIsUs";

export default function Home() {
  return (
    <>
      <HeaderBanner />
      <CheckoutSection />
      <WhoIsUs />
      <AppleCardsCarouselDemo />
    </>
  );
}
