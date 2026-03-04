import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { UserRole } from "@prisma/client";
import { ContactsTable } from "./contacts-table";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login?callbackUrl=/admin/contacts");
  }

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    redirect("/");
  }

  const contacts = await db.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedContacts = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    content: c.content,
    read: c.read,
    createdAt: c.createdAt,
  }));

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <AdminLayout
      title="Mensagens de Contato"
      description="Visualize as mensagens enviadas pelo formulário de contato"
    >
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Todas as Mensagens</h2>
            <p className="text-sm text-gray-500">
              {contacts.length} mensagem{contacts.length !== 1 ? "s" : ""} recebida
              {contacts.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <ContactsTable contacts={formattedContacts} />
    </AdminLayout>
  );
}
