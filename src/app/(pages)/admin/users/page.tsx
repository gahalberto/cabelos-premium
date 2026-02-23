import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminUsersTable } from "./admin-users-table";
import { Users } from "lucide-react";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login?callbackUrl=/admin/users");
    }

    const currentUser = await db.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        redirect("/");
    }

    const users = await db.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: { orders: true }
            }
        }
    });

    // Mapear dados para Client Component
    const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        cpf: user.cpf,
        cnpj: user.cnpj,
        role: user.role,
        createdAt: user.createdAt,
        ordersCount: user._count.orders,
        image: user.image
    }));

    return (
        <AdminLayout
            title="Gerenciar Usuários"
            description="Visualize os clientes e administradores da loja"
        >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                        <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Todos os Usuários</h2>
                        <p className="text-sm text-gray-500">Listagem completa com os {users.length} usuários cadastrados.</p>
                    </div>
                </div>
            </div>

            <AdminUsersTable users={formattedUsers} />
        </AdminLayout>
    );
}
