import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { UserRole } from "@prisma/client";
import { Settings } from "lucide-react";
import { StoreConfigForm } from "./store-config-form";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login?callbackUrl=/admin/configuracao");

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== UserRole.ADMIN) redirect("/");

  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    create: { id: "default", freeShippingThreshold: 0 },
    update: {},
  });

  return (
    <AdminLayout
      title="Configurações da Loja"
      description="Gerencie as configurações gerais da loja"
    >
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-100 rounded-lg">
          <Settings className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Configurações Gerais</h2>
          <p className="text-sm text-gray-500">Configure frete, WhatsApp e outros parâmetros da loja.</p>
        </div>
      </div>

      <StoreConfigForm
        initialThreshold={config.freeShippingThreshold}
        initialWhatsapp={{
          whatsappMain:    config.whatsappMain    ?? "",
          whatsappSP:      config.whatsappSP      ?? "",
          whatsappRJ:      config.whatsappRJ      ?? "",
          whatsappMessage: config.whatsappMessage ?? "",
          phoneSP:         config.phoneSP         ?? "",
        }}
      />
    </AdminLayout>
  );
}
