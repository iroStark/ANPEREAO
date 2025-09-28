import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { PublicationDialog } from '@/components/admin/PublicationDialog';
import { 
  usePublications, 
  useCreatePublication, 
  useUpdatePublication, 
  useDeletePublication,
  type Publication 
} from '@/hooks/usePublications';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const AdminPublications = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Hooks para gerenciar dados
  const { data: publications = [], isLoading, error } = usePublications();
  const createPublication = useCreatePublication();
  const updatePublication = useUpdatePublication();
  const deletePublication = useDeletePublication();

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publication.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || publication.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreatePublication = async (data: any) => {
    try {
      await createPublication.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Publicação criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar publicação');
    }
  };

  const handleUpdatePublication = async (data: any) => {
    if (!editingPublication) return;
    
    try {
      await updatePublication.mutateAsync({ id: editingPublication.id, ...data });
      setEditingPublication(null);
      toast.success('Publicação atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar publicação');
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      try {
        await deletePublication.mutateAsync(id);
        toast.success('Publicação excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir publicação');
      }
    }
  };

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar publicações: {error.message}</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Publicações</h1>
            <p className="text-muted-foreground">
              Gerir documentos, relatórios e publicações da ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-publication"
          >
            <Plus className="w-4 h-4" />
            Nova Publicação
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
                    placeholder="Pesquisar publicações..."
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
                  variant={filterType === 'Relatório' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Relatório')}
                >
                  Relatórios
                </Button>
                <Button
                  variant={filterType === 'Plano' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Plano')}
                >
                  Planos
                </Button>
                <Button
                  variant={filterType === 'Comunicado' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Comunicado')}
                >
                  Comunicados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando publicações...</p>
          </div>
        )}

        {/* Publications List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredPublications.map((publication, index) => (
              <motion.div
                key={publication.id}
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
                            {publication.title}
                          </h3>
                          <Badge variant="outline">
                            {publication.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {publication.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Categoria: {publication.category}</span>
                          <span>Data: {publication.date}</span>
                          {publication.publishedAt && (
                            <span>Publicado: {new Date(publication.publishedAt).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPublication(publication)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePublication(publication.id)}
                          disabled={deletePublication.isPending}
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
        {!isLoading && filteredPublications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma publicação encontrada</h3>
                <p className="mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece criando uma nova publicação.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Publicação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <PublicationDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePublication}
          isLoading={createPublication.isPending}
        />

        <PublicationDialog
          open={!!editingPublication}
          onOpenChange={(open) => !open && setEditingPublication(null)}
          publication={editingPublication}
          onSubmit={handleUpdatePublication}
          isLoading={updatePublication.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPublications;

