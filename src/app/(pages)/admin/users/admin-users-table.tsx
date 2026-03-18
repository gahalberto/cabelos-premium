"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MapPin, Package, Phone, User, FileText, BadgeCheck, Pencil, UserPlus, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { adminUpdateUser } from "@/app/_actions/admin/update-user";
import { adminCreateUser } from "@/app/_actions/admin/create-user";
import { adminDeleteUser } from "@/app/_actions/admin/delete-user";
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

    // Create user state
    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createLastName, setCreateLastName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createPhone, setCreatePhone] = useState("");
    const [createRole, setCreateRole] = useState<UserRole>("VENDEDOR");
    const [isCreating, setIsCreating] = useState(false);

    // Delete user state
    const [deleteUser, setDeleteUser] = useState<UserData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const result = await adminCreateUser({
                name: createName,
                lastName: createLastName,
                email: createEmail,
                password: createPassword,
                role: createRole,
                phone: createPhone,
            });

            const newUser: UserData = {
                id: result.userId,
                name: createName,
                lastName: createLastName || null,
                email: createEmail.trim().toLowerCase(),
                phone: createPhone || null,
                city: null,
                state: null,
                cpf: null,
                cnpj: null,
                role: createRole,
                createdAt: new Date(),
                ordersCount: 0,
                image: null,
            };
            setUsers(prev => [newUser, ...prev]);

            toast({ title: "Usuário criado com sucesso!" });
            setCreateOpen(false);
            setCreateName(""); setCreateLastName(""); setCreateEmail("");
            setCreatePassword(""); setCreatePhone(""); setCreateRole("VENDEDOR");
        } catch (err) {
            toast({
                title: "Erro ao criar usuário",
                description: err instanceof Error ? err.message : "Erro desconhecido",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUser) return;
        setIsDeleting(true);
        try {
            await adminDeleteUser(deleteUser.id);
            setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
            toast({ title: "Usuário excluído com sucesso." });
            setDeleteUser(null);
        } catch (err) {
            toast({
                title: "Erro ao excluir usuário",
                description: err instanceof Error ? err.message : "Erro desconhecido",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const badges: Record<UserRole, { class: string; label: string }> = {
            CLIENTE: { class: "bg-gray-100 text-gray-800", label: "Cliente" },
            ESPECIALISTA: { class: "bg-purple-100 text-purple-800", label: "Especialista" },
            ADMIN: { class: "bg-indigo-100 text-indigo-800", label: "Admin" },
            VENDEDOR: { class: "bg-orange-100 text-orange-800", label: "Vendedor" },
        };
        const b = badges[role];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.class}`}>{b.label}</span>;
    };

    return (
        <>
            {/* Dialog de Confirmação de Exclusão */}
            <Dialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
                <DialogContent className="max-w-md bg-white p-6 sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 text-xl">
                            <AlertTriangle className="w-5 h-5" />
                            Excluir Usuário
                        </DialogTitle>
                        <DialogDescription>
                            Esta ação é <strong>permanente e irreversível</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-2 space-y-3">
                        <p className="text-sm text-gray-700">
                            Você está prestes a excluir o usuário:
                        </p>
                        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
                            <p className="font-semibold text-gray-900">{deleteUser?.name} {deleteUser?.lastName}</p>
                            <p className="text-gray-500">{deleteUser?.email}</p>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-1.5">
                            <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" /> Consequências desta ação:
                            </p>
                            <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                                <li>Todos os dados do usuário serão removidos do sistema</li>
                                <li>O histórico de pedidos vinculado será perdido</li>
                                <li>O usuário perderá acesso imediato à plataforma</li>
                                <li>Carrinho, favoritos e endereços serão deletados</li>
                                <li><strong>Não é possível desfazer esta operação</strong></li>
                            </ul>
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                            <Button variant="outline" onClick={() => setDeleteUser(null)} disabled={isDeleting}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Excluindo...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Sim, excluir permanentemente
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Criação */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md bg-white p-6 sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Criar Novo Usuário</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um acesso de Vendedor ou outro nível.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="create-name">Nome *</Label>
                                <Input id="create-name" value={createName} onChange={(e) => setCreateName(e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="create-lastname">Sobrenome</Label>
                                <Input id="create-lastname" value={createLastName} onChange={(e) => setCreateLastName(e.target.value)} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="create-email">E-mail *</Label>
                            <Input id="create-email" type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} className="mt-1" autoComplete="off" />
                        </div>

                        <div>
                            <Label htmlFor="create-phone">Telefone</Label>
                            <Input id="create-phone" value={createPhone} onChange={(e) => setCreatePhone(e.target.value)} className="mt-1" />
                        </div>

                        <div>
                            <Label htmlFor="create-password">Senha * <span className="text-gray-400 font-normal">(mínimo 6 caracteres)</span></Label>
                            <Input id="create-password" type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} className="mt-1" autoComplete="new-password" />
                        </div>

                        <div>
                            <Label htmlFor="create-role">Nível de acesso</Label>
                            <Select value={createRole} onValueChange={(v) => setCreateRole(v as UserRole)}>
                                <SelectTrigger id="create-role" className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                                    <SelectItem value="CLIENTE">Cliente</SelectItem>
                                    <SelectItem value="ESPECIALISTA">Especialista</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isCreating}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreate} disabled={isCreating}>
                                {isCreating ? "Criando..." : "Criar Usuário"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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
                                    <SelectItem value="VENDEDOR">Vendedor</SelectItem>
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

            {/* Botão Criar */}
            <div className="flex justify-end mb-4">
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Criar Usuário
                </Button>
            </div>

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

                                            {/* Botão Excluir */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400"
                                                onClick={() => setDeleteUser(user)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Excluir
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
