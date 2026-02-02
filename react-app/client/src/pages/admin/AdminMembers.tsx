import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { MemberViewDialog } from '@/components/admin/MemberViewDialog';
import { MemberDialog } from '@/components/admin/MemberDialog';
import { useMembers, useDeleteMember, Member } from '@/hooks/useMembers';
import jsPDF from 'jspdf';
import {
  UserGroupIcon as Users,
  Search01Icon as Search,
  FilterHorizontalIcon as Filter,
  ViewIcon as Eye,
  CheckmarkCircle02Icon as CheckCircle,
  CancelCircleIcon as XCircle,
  Delete02Icon as Trash2,
  Calendar03Icon as Calendar,
  Call02Icon as Phone,
  Mail01Icon as Mail,
  Location01Icon as MapPin,
  UserIcon as User,
  File02Icon as FileText,
  Download01Icon as Download,
  RefreshIcon as RefreshCw,
  Clock01Icon as Clock,
  Edit02Icon as Edit2
} from "hugeicons-react";

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: members = [], isLoading, error, refetch } = useMembers();
  const deleteMember = useDeleteMember();

  // Filtrar membros
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (memberId: string, newStatus: 'active' | 'inactive' | 'pending', sendEmail: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, sendEmail }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do membro');
      }

      const updatedMember = await response.json();
      
      toast({
        title: newStatus === 'active' ? 'Candidatura Aprovada!' : newStatus === 'inactive' ? 'Candidatura Rejeitada' : 'Status atualizado',
        description: newStatus === 'active' 
          ? `A candidatura foi aprovada${sendEmail ? ' e o email foi enviado ao candidato' : ''}.`
          : newStatus === 'inactive'
          ? 'A candidatura foi rejeitada.'
          : `Status do membro atualizado para ${newStatus === 'pending' ? 'Pendente' : 'Ativo'}`,
      });

      // Refetch members
      refetch();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do membro',
        variant: 'destructive',
      });
    }
  };

  const handleApproveMember = async (member: Member) => {
    await handleStatusUpdate(member.id, 'active', true);
  };

  const handleRejectMember = async (member: Member) => {
    await handleStatusUpdate(member.id, 'inactive', false);
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMember.mutateAsync(memberId);
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o membro',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const generateMembersListPDF = () => {
    if (members.length === 0) {
      toast({
        title: 'Nenhum membro encontrado',
        description: 'Não há membros para gerar o PDF.',
        variant: 'destructive',
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = 20;

    // Função para adicionar header em cada página
    const addHeader = () => {
      doc.setFillColor(30, 58, 138); // Dark blue
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ANPERE", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("ASSOCIAÇÃO NACIONAL DOS EX-PROFISSIONAIS", pageWidth / 2, 22, { align: "center" });
      doc.text("DO ESPECTRO RÁDIO ELECTRÓNICO", pageWidth / 2, 28, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("LISTA DE MEMBROS", pageWidth / 2, 35, { align: "center" });
      doc.setTextColor(0, 0, 0);
      yPos = 50;
    };

    // Adicionar header inicial
    addHeader();

    // Informações do relatório
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`Data de geração: ${dateStr}`, margin, yPos);
    doc.text(`Total de membros: ${members.length}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 10;

    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Função para verificar quebra de página
    const checkPageBreak = (additionalHeight = 10) => {
      if (yPos + additionalHeight > pageHeight - 20) {
        doc.addPage();
        addHeader();
        // Re-adicionar linha divisória após header
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
      }
    };

    // Cabeçalho da tabela
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, maxWidth, 8, 'F');
    doc.setTextColor(0, 0, 0);
    
    const colWidths = [25, 50, 40, 35, 30]; // Número, Nome, Email, Telefone, Status
    const colPositions = [margin];
    for (let i = 1; i < colWidths.length; i++) {
      colPositions.push(colPositions[i - 1] + colWidths[i - 1]);
    }

    doc.text("Nº", colPositions[0], yPos);
    doc.text("Nome", colPositions[1], yPos);
    doc.text("Email", colPositions[2], yPos);
    doc.text("Telefone", colPositions[3], yPos);
    doc.text("Status", colPositions[4], yPos);
    
    yPos += 10;

    // Adicionar membros
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    members.forEach((member, index) => {
      checkPageBreak(10);

      // Alternar cor de fundo para melhor legibilidade
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPos - 4, maxWidth, 8, 'F');
      }

      // Status color
      let statusColor = [100, 100, 100];
      if (member.status === 'active') {
        statusColor = [34, 197, 94]; // Green
      } else if (member.status === 'pending') {
        statusColor = [234, 179, 8]; // Yellow
      } else if (member.status === 'inactive') {
        statusColor = [239, 68, 68]; // Red
      }

      // Número do membro
      doc.setTextColor(0, 0, 0);
      doc.text(member.memberNumber || `#${index + 1}`, colPositions[0], yPos);

      // Nome (truncado se muito longo)
      const name = doc.splitTextToSize(member.fullName || 'N/A', colWidths[1] - 2);
      doc.text(name[0], colPositions[1], yPos);

      // Email (truncado se muito longo)
      const email = doc.splitTextToSize(member.email || 'N/A', colWidths[2] - 2);
      doc.text(email[0], colPositions[2], yPos);

      // Telefone
      doc.text(member.phone || 'N/A', colPositions[3], yPos);

      // Status
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      const statusText = member.status === 'active' ? 'Ativo' : 
                        member.status === 'pending' ? 'Pendente' : 'Inativo';
      doc.text(statusText, colPositions[4], yPos);

      yPos += 8;
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      doc.text(
        `ANPERE - Lista de Membros`,
        margin,
        pageHeight - 10
      );
    }

    // Salvar PDF
    const filename = `lista-membros-${dateStr.replace(/\//g, '-')}.pdf`;
    doc.save(filename);

    toast({
      title: 'PDF gerado com sucesso',
      description: `Lista de ${members.length} membros exportada.`,
    });
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar membros</h3>
            <p className="text-muted-foreground mb-4">Não foi possível carregar a lista de membros</p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Membros</h1>
            <p className="text-muted-foreground">
              Gerir candidaturas e dados dos membros da ANPERE
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={generateMembersListPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button 
              onClick={() => {
                setEditingMember(null);
                setIsEditDialogOpen(true);
              }} 
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Novo Membro
            </Button>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Membros</p>
                  <p className="text-3xl font-bold text-foreground">{members.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {members.filter(m => m.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {members.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {members.filter(m => m.status === 'inactive').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar por nome, email ou número de membro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Carregando membros...</p>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum membro encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa' 
                    : 'Ainda não há membros registrados'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Member Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary/20 bg-primary/5 relative">
                          {member.photoUrl && member.photoUrl.trim() !== '' ? (
                            <img 
                              src={member.photoUrl} 
                              alt={member.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Se a imagem falhar ao carregar, mostra o ícone
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.fallback-icon')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full flex items-center justify-center bg-primary/10 fallback-icon';
                                  fallback.innerHTML = '<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <User className="w-8 h-8 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {member.fullName}
                            </h3>
                            {getStatusBadge(member.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{member.memberNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(member.registrationDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                          data-testid={`button-view-member-${member.id}`}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingMember(member);
                            setIsEditDialogOpen(true);
                          }}
                          title="Editar membro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        {/* Status Actions */}
                        {member.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveMember(member)}
                              className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Aceitar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectMember(member)}
                              className="gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeitar
                            </Button>
                          </>
                        )}

                        {member.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(member.id, 'inactive', false)}
                            className="gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Desativar
                          </Button>
                        )}

                        {member.status === 'inactive' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(member.id, 'active', false)}
                            className="gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Reativar
                          </Button>
                        )}

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o membro {member.fullName}? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        <MemberViewDialog
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
        />

        <MemberDialog
          member={editingMember || undefined}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingMember(null);
            }
          }}
          onSubmit={async (data, photoFile) => {
            try {
              const formData = new FormData();
              
              // Add all text fields
              Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  // Format dates to DD/MM/YYYY if they are Date objects or ISO strings
                  if ((key === 'birthDate' || key === 'idIssueDate') && value) {
                    let dateStr = value.toString();
                    // If it's an ISO string, convert to DD/MM/YYYY
                    if (dateStr.includes('T') || dateStr.includes('-')) {
                      const date = new Date(dateStr);
                      dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                    }
                    formData.append(key, dateStr);
                  } else {
                    formData.append(key, value.toString());
                  }
                }
              });

              // IMPORTANTE: Se está editando e não há novo arquivo, preservar a foto existente
              if (editingMember && !photoFile && editingMember.photoUrl) {
                formData.append('photoUrl', editingMember.photoUrl);
              }

              // Add photo file if exists (novo upload)
              if (photoFile) {
                formData.append('photo', photoFile);
              }

              const url = editingMember 
                ? `/api/admin/members/${editingMember.id}`
                : '/api/admin/members';
              
              const method = editingMember ? 'PUT' : 'POST';

              const response = await fetch(url, {
                method,
                credentials: 'include',
                body: formData,
              });

              if (!response.ok) {
                throw new Error('Erro ao salvar membro');
              }

              toast({
                title: editingMember ? 'Membro atualizado' : 'Membro criado',
                description: `Os dados do membro foram ${editingMember ? 'atualizados' : 'criados'} com sucesso.`,
              });

              setIsEditDialogOpen(false);
              setEditingMember(null);
              refetch();
            } catch (error) {
              toast({
                title: 'Erro',
                description: 'Não foi possível salvar os dados do membro',
                variant: 'destructive',
              });
            }
          }}
          isLoading={false}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminMembers;
