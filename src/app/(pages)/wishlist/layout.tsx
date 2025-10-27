import { pageMetadata } from "@/config/metadata";
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata.wishlist;

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

