"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Search,
  Filter
} from "lucide-react";
import { 
  getExpertApplications, 
  updateExpertApplicationStatus, 
  deleteExpertApplication 
} from "@/app/_actions/expert-application";
import { AdminLayout } from "@/components/AdminLayout";

interface ExpertApplication {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cnpj: string;
  companyName: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string | null;
  instagram?: string | null;
  experience: string;
  specialties: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  isApproved: boolean;
  notes?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ExpertApplicationsPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ExpertApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadApplications = useCallback(async () => {
    try {
      const data = await getExpertApplications();
      setApplications(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar aplicações",
        description: "Não foi possível carregar as aplicações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      loadApplications();
    }
  }, [status, loadApplications]);

  const handleStatusUpdate = async (applicationId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(applicationId);
    try {
      await updateExpertApplicationStatus(applicationId, status, notes);
      toast({
        title: "Status atualizado",
        description: `Aplicação ${status === "APPROVED" ? "aprovada" : "rejeitada"} com sucesso`,
      });
      setNotes("");
      await loadApplications();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da aplicação",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aplicação?")) return;

    setActionLoading(applicationId);
    try {
      await deleteExpertApplication(applicationId);
      toast({
        title: "Aplicação removida",
        description: "Aplicação removida com sucesso",
      });
      await loadApplications();
    } catch (error) {
      toast({
        title: "Erro ao remover aplicação",
        description: "Não foi possível remover a aplicação",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Aprovada</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Filtrar aplicações
  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      title="Aplicações de Especialistas" 
      description="Gerencie as solicitações de cadastro como especialista"
    >

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === "PENDING").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === "APPROVED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejeitadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === "REJECTED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar aplicações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os status</option>
                <option value="PENDING">Pendentes</option>
                <option value="APPROVED">Aprovadas</option>
                <option value="REJECTED">Rejeitadas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Aplicações */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma aplicação encontrada
                </h3>
                <p className="text-gray-600">
                  Ainda não há solicitações de cadastro como especialista.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Informações principais */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.name} {application.lastName}
                          </h3>
                          <p className="text-gray-600">{application.companyName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(application.status)}
                          <span className="text-sm text-gray-500">
                            {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{application.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{application.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>CNPJ: {application.cnpj}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{application.city} - {application.state}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Especialidades:</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {application.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {application.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Notas:</strong>
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {application.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowModal(true);
                        }}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>

                      {application.status === "PENDING" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, "APPROVED")}
                            disabled={actionLoading === application.id}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === application.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aprovar
                              </>
                            )}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, "REJECTED")}
                            disabled={actionLoading === application.id}
                            className="w-full"
                          >
                            {actionLoading === application.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeitar
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
                        disabled={actionLoading === application.id}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {actionLoading === application.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalhes da Aplicação
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dados Pessoais</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nome:</span>
                      <p className="font-medium">{selectedApplication.name} {selectedApplication.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">E-mail:</span>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Telefone:</span>
                      <p className="font-medium">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">CNPJ:</span>
                      <p className="font-medium">{selectedApplication.cnpj}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Empresa</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nome da Empresa:</span>
                      <p className="font-medium">{selectedApplication.companyName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Descrição do Negócio:</span>
                      <p className="font-medium">{selectedApplication.businessDescription}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
                  <div className="text-sm">
                    <p className="font-medium">
                      {selectedApplication.address}, {selectedApplication.city} - {selectedApplication.state}, {selectedApplication.zipCode}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experiência</h3>
                  <p className="text-sm text-gray-700">{selectedApplication.experience}</p>
                </div>

                {selectedApplication.website && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                    <a 
                      href={selectedApplication.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {selectedApplication.website}
                    </a>
                  </div>
                )}

                {selectedApplication.instagram && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instagram</h3>
                    <p className="text-sm text-gray-700">{selectedApplication.instagram}</p>
                  </div>
                )}

                {selectedApplication.status === "PENDING" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Notas para Aprovação/Rejeição</h3>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicione notas sobre a análise desta aplicação..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Fechar
                </Button>
                
                {selectedApplication.status === "PENDING" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, "APPROVED");
                        setShowModal(false);
                      }}
                      disabled={actionLoading === selectedApplication.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, "REJECTED");
                        setShowModal(false);
                      }}
                      disabled={actionLoading === selectedApplication.id}
                      className="flex-1"
                    >
                      Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 