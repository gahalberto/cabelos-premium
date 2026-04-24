import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { UserRole } from "@prisma/client";
import { SEOAdminForm } from "./seo-admin-form";

export const dynamic = "force-dynamic";

const MANAGED_PAGES = [
  { id: "home",     label: "Home" },
  { id: "shop",     label: "Loja / Shop" },
  { id: "sobre",    label: "Sobre" },
  { id: "contato",  label: "Contato" },
  { id: "blog",     label: "Blog (listagem)" },
  { id: "colecao",  label: "Coleção" },
  { id: "laces",    label: "Laces" },
  { id: "megahair", label: "Mega Hair" },
  { id: "topo-capilar", label: "Topo Capilar" },
];

export default async function AdminSEOPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login?callbackUrl=/admin/seo");

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (!currentUser || currentUser.role !== UserRole.ADMIN) redirect("/");

  const [seoConfigs, storeConfig, products] = await Promise.all([
    db.sEOConfig.findMany(),
    db.storeConfig.findUnique({
      where: { id: "default" },
      select: {
        gtmId: true,
        ga4Id: true,
        metaPixelId: true,
        customHeadScripts: true,
        customBodyScripts: true,
        robotsContent: true,
      },
    }),
    db.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        keywords: true,
        ogImage: true,
        canonicalUrl: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const seoConfigMap = Object.fromEntries(seoConfigs.map((c) => [c.id, c]));

  return (
    <AdminLayout
      title="Painel de SEO"
      description="Configure metadados, scripts de rastreamento e dados estruturados"
    >
      <SEOAdminForm
        pages={MANAGED_PAGES}
        seoConfigMap={seoConfigMap}
        storeConfig={storeConfig}
        products={products}
      />
    </AdminLayout>
  );
}
