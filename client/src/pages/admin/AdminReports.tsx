import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { ReportDialog } from '@/components/admin/ReportDialog';
import { 
  useReports, 
  useCreateReport, 
  useUpdateReport, 
  useDeleteReport,
  type Report 
} from '@/hooks/useReports';
import { Plus, Search, Filter, Edit2, Trash2, Download, FileText, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const AdminReports = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Hooks para gerenciar dados
  const { data: reports = [], isLoading, error } = useReports();
  const createReport = useCreateReport();
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateReport = async (data: any) => {
    try {
      await createReport.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Relatório criado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar relatório', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleUpdateReport = async (data: any) => {
    if (!editingReport) return;
    
    try {
      await updateReport.mutateAsync({ id: editingReport.id, ...data });
      setEditingReport(null);
      toast.success('Relatório atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar relatório', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      try {
        await deleteReport.mutateAsync(id);
        toast.success('Relatório excluído com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao excluir relatório', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
  };

  const handleDownloadReport = (report: Report) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    } else {
      toast.error('Arquivo do relatório não disponível');
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar relatórios: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'monthly':
        return <Badge variant="default" className="gap-1"><Calendar className="w-3 h-3" />Mensal</Badge>;
      case 'quarterly':
        return <Badge variant="secondary" className="gap-1"><BarChart3 className="w-3 h-3" />Trimestral</Badge>;
      case 'annual':
        return <Badge variant="destructive" className="gap-1"><FileText className="w-3 h-3" />Anual</Badge>;
      case 'special':
        return <Badge variant="outline" className="gap-1"><FileText className="w-3 h-3" />Especial</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Publicado</Badge>;
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'archived':
        return <Badge variant="outline">Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Gerir relatórios e documentos da ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Relatório
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Relatórios</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publicados</p>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'published').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rascunhos</p>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'draft').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => {
                      const reportDate = new Date(r.createdAt);
                      const now = new Date();
                      return reportDate.getMonth() === now.getMonth() && 
                             reportDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('monthly')}
                >
                  Mensais
                </Button>
                <Button
                  variant={filterType === 'quarterly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('quarterly')}
                >
                  Trimestrais
                </Button>
                <Button
                  variant={filterType === 'annual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('annual')}
                >
                  Anuais
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando relatórios...</p>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold truncate">
                            {report.title}
                          </h3>
                          {getTypeBadge(report.type)}
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {report.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          <span>Período: {report.period}</span>
                          <span>Criado: {new Date(report.createdAt).toLocaleDateString('pt-PT')}</span>
                          {report.fileUrl && <span>Arquivo disponível</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.fileUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditReport(report)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteReport(report.id)}
                          disabled={deleteReport.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredReports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
                <p className="mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece adicionando um novo relatório.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Relatório
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <ReportDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateReport}
          isLoading={createReport.isPending}
        />

        <ReportDialog
          open={!!editingReport}
          onOpenChange={(open) => !open && setEditingReport(null)}
          report={editingReport}
          onSubmit={handleUpdateReport}
          isLoading={updateReport.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
