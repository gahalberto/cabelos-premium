"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Trash2, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts: initialContacts }: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error();
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, read: true } : prev);
    } catch {
      toast.error("Erro ao marcar como lida");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Mensagem excluída");
    } catch {
      toast.error("Erro ao excluir mensagem");
    } finally {
      setDeleting(null);
    }
  };

  const openModal = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.read) {
      await handleMarkRead(contact.id);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-16 text-center">
        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Nenhuma mensagem recebida ainda</p>
        <p className="text-gray-400 text-sm mt-1">As mensagens do formulário de contato aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Nome</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Telefone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Mensagem</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Data</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className={`hover:bg-gray-50 transition-colors ${!contact.read ? "bg-amber-50/40" : ""}`}
              >
                <td className="px-6 py-4">
                  <span className={`font-medium ${!contact.read ? "text-gray-900" : "text-gray-700"}`}>
                    {contact.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {contact.phone}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="truncate text-gray-600">{contact.content}</p>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {format(new Date(contact.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </td>
                <td className="px-6 py-4">
                  {contact.read ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3" /> Lida
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Não lida
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(contact)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver mensagem"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deleting === contact.id}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de visualização */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <Phone className="h-3.5 w-3.5" />
                    {selected.phone}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mensagem</p>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.content}</p>
            </div>
            <div className="px-6 pb-6 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {format(new Date(selected.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={deleting === selected.id}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
