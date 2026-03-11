import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { UserRole } from "@prisma/client";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ActivityLogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login?callbackUrl=/admin/activity-log");
  }

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    redirect("/admin");
  }

  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <AdminLayout title="Histórico de Atividades">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-[#8a7d5c]" />
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Atividades</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Data/Hora</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Usuário</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ação</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Entidade</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Nome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Nenhuma atividade registrada.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{log.userName}</div>
                        <div className="text-xs text-gray-400">{log.userEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          log.action === "Excluiu"
                            ? "bg-red-100 text-red-700"
                            : log.action === "Criou"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{log.entity}</td>
                      <td className="px-4 py-3 text-gray-700">{log.entityName ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
