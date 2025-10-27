import HeaderBanner from "@/components/HeaderBanner";
import WhoIsUs from "@/components/WhoIsUs";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.home;

export default function Home() {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="LocalBusiness" />
      <main>
        <HeaderBanner />
        <WhoIsUs />
      </main>
    </>
  );
}
