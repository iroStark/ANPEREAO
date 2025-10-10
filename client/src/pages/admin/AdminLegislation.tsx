import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { LegislationDialog } from '@/components/admin/LegislationDialog';
import { LegislationViewDialog } from '@/components/admin/LegislationViewDialog';
import { 
  useLegislation, 
  useCreateLegislation, 
  useUpdateLegislation, 
  useDeleteLegislation,
  type Legislation 
} from '@/hooks/useLegislation';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Download, Scale, FileText, Gavel, BookOpen, Building, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AdminLegislation = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLegislation, setEditingLegislation] = useState<Legislation | null>(null);
  const [viewingLegislation, setViewingLegislation] = useState<Legislation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Hooks para gerenciar dados
  const { data: legislations = [], isLoading, error } = useLegislation();
  const createLegislation = useCreateLegislation();
  const updateLegislation = useUpdateLegislation();
  const deleteLegislation = useDeleteLegislation();

  // Função para obter ícone baseado no nome
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Scale,
      FileText,
      Gavel,
      BookOpen,
      Building,
      Calendar,
    };
    return icons[iconName] || Scale;
  };

  const filteredLegislations = legislations.filter(legislation => {
    const matchesSearch = legislation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legislation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || legislation.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateLegislation = async (data: any) => {
    try {
      await createLegislation.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Legislação criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar legislação');
    }
  };

  const handleUpdateLegislation = async (data: any) => {
    if (!editingLegislation) return;
    
    try {
      await updateLegislation.mutateAsync({ id: editingLegislation.id, ...data });
      setEditingLegislation(null);
      toast.success('Legislação atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar legislação');
    }
  };

  const handleDeleteLegislation = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta legislação?')) {
      try {
        await deleteLegislation.mutateAsync(id);
        toast.success('Legislação excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir legislação');
      }
    }
  };

  const handleEditLegislation = (legislation: Legislation) => {
    setEditingLegislation(legislation);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar legislações: {error.message}</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Legislação</h1>
            <p className="text-muted-foreground">
              Gerir documentos legais e regulamentações
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-legislation"
          >
            <Plus className="w-4 h-4" />
            Nova Legislação
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar legislação..."
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
                  Todas
                </Button>
                <Button
                  variant={filterType === 'Lei Principal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Lei Principal')}
                >
                  Leis
                </Button>
                <Button
                  variant={filterType === 'Regulamento' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Regulamento')}
                >
                  Regulamentos
                </Button>
                <Button
                  variant={filterType === 'Decreto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Decreto')}
                >
                  Decretos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando legislações...</p>
          </div>
        )}

        {/* Legislation List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredLegislations.map((legislation, index) => {
              const IconComponent = getIcon(legislation.icon);
              return (
                <motion.div
                  key={legislation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold truncate">
                              {legislation.title}
                            </h3>
                            <Badge variant="outline">
                              {legislation.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">
                            {legislation.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Ano: {legislation.year}</span>
                            <span>Categoria: {legislation.category}</span>
                            {legislation.publishedAt && (
                              <span>Publicado: {new Date(legislation.publishedAt).toLocaleDateString('pt-PT')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingLegislation(legislation)}
                            data-testid={`button-view-legislation-${legislation.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditLegislation(legislation)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteLegislation(legislation.id)}
                            disabled={deleteLegislation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredLegislations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma legislação encontrada</h3>
                <p className="mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece criando uma nova legislação.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Legislação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <LegislationDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateLegislation}
          isLoading={createLegislation.isPending}
        />

        <LegislationDialog
          open={!!editingLegislation}
          onOpenChange={(open) => !open && setEditingLegislation(null)}
          legislation={editingLegislation}
          onSubmit={handleUpdateLegislation}
          isLoading={updateLegislation.isPending}
        />

        <LegislationViewDialog
          legislation={viewingLegislation}
          open={!!viewingLegislation}
          onOpenChange={(open) => !open && setViewingLegislation(null)}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminLegislation;

