"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MapPin, Package, Phone, User, FileText, BadgeCheck, Pencil } from "lucide-react";
import Image from "next/image";
import { adminUpdateUser } from "@/app/_actions/admin/update-user";
import { useToast } from "@/hooks/use-toast";

interface UserData {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    cpf: string | null;
    cnpj: string | null;
    role: UserRole;
    createdAt: Date;
    ordersCount: number;
    image: string | null;
}

export function AdminUsersTable({ users: initialUsers }: { users: UserData[] }) {
    const { toast } = useToast();

    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editRole, setEditRole] = useState<UserRole | "">("");
    const [isSaving, setIsSaving] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const openEdit = (user: UserData) => {
        setEditingUser(user);
        setEditEmail(user.email);
        setEditPassword("");
        setEditRole(user.role);
        setEditOpen(true);
    };

    const handleSave = async () => {
        if (!editingUser) return;
        setIsSaving(true);
        try {
            await adminUpdateUser({
                userId: editingUser.id,
                email: editEmail !== editingUser.email ? editEmail : undefined,
                newPassword: editPassword || undefined,
                role: editRole && editRole !== editingUser.role ? editRole as UserRole : undefined,
            });

            // Atualiza a lista localmente
            setUsers(prev => prev.map(u =>
                u.id === editingUser.id
                    ? { ...u, email: editEmail, role: (editRole || u.role) as UserRole }
                    : u
            ));

            toast({ title: "Usuário atualizado com sucesso!" });
            setEditOpen(false);
        } catch (err) {
            toast({
                title: "Erro ao atualizar usuário",
                description: err instanceof Error ? err.message : "Erro desconhecido",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const badges: Record<UserRole, { class: string; label: string }> = {
            CLIENTE: { class: "bg-gray-100 text-gray-800", label: "Cliente" },
            ESPECIALISTA: { class: "bg-purple-100 text-purple-800", label: "Especialista" },
            ADMIN: { class: "bg-indigo-100 text-indigo-800", label: "Admin" },
        };
        const b = badges[role];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.class}`}>{b.label}</span>;
    };

    return (
        <>
            {/* Modal de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md bg-white p-6 sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
                        <DialogDescription>
                            {editingUser?.name} {editingUser?.lastName} — altere o e-mail, senha ou nível de acesso.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div>
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="mt-1"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-password">Nova senha <span className="text-gray-400 font-normal">(deixe em branco para não alterar)</span></Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="mt-1"
                                autoComplete="new-password"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-role">Nível de acesso</Label>
                            <Select value={editRole} onValueChange={(v) => setEditRole(v as UserRole)}>
                                <SelectTrigger id="edit-role" className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENTE">Cliente</SelectItem>
                                    <SelectItem value="ESPECIALISTA">Especialista</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tabela */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Nível</TableHead>
                            <TableHead>Cadastro</TableHead>
                            <TableHead>Pedidos</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name || "Sem nome"} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs text-sm">
                                                    {user.name} {user.lastName || ""}
                                                    {!user.name && !user.lastName && "Sem nome"}
                                                </div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium text-gray-900">{user.phone || "-"}</div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(user.createdAt)}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {user.ordersCount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Botão Editar */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1"
                                                onClick={() => openEdit(user)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Editar
                                            </Button>

                                            {/* Botão Detalhes */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Detalhes
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md bg-white p-6 sm:rounded-xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl">Detalhes do Usuário</DialogTitle>
                                                        <DialogDescription>
                                                            Registrado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(user.createdAt)}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-4 mt-4">
                                                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
                                                                {user.image ? (
                                                                    <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                        <User className="h-8 w-8" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-900">
                                                                    {user.name} {user.lastName || ""}
                                                                    {!user.name && !user.lastName && "Sem nome"}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <BadgeCheck className="w-3.5 h-3.5 text-indigo-500" />
                                                                    {getRoleBadge(user.role)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-3 text-sm text-gray-700 pt-2">
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-4 h-4 text-gray-400" />
                                                                <span><strong className="text-gray-900">E-mail:</strong> {user.email}</span>
                                                            </div>
                                                            {user.phone && (
                                                                <div className="flex items-center gap-3">
                                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                                    <span><strong className="text-gray-900">Telefone:</strong> {user.phone}</span>
                                                                </div>
                                                            )}
                                                            {(user.cpf || user.cnpj) && (
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                                    <span><strong className="text-gray-900">{user.cpf ? "CPF" : "CNPJ"}:</strong> {user.cpf || user.cnpj}</span>
                                                                </div>
                                                            )}
                                                            {(user.city || user.state) && (
                                                                <div className="flex items-center gap-3">
                                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                                    <span><strong className="text-gray-900">Localidade:</strong> {user.city || "-"} - {user.state || "-"}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-3">
                                                                <Package className="w-4 h-4 text-gray-400" />
                                                                <span><strong className="text-gray-900">Total de Pedidos:</strong> {user.ordersCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
