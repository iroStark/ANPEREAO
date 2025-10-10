import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { GalleryDialog } from '@/components/admin/GalleryDialog';
import { GalleryViewDialog } from '@/components/admin/GalleryViewDialog';
import { 
  useGallery, 
  useCreateGalleryItem, 
  useUpdateGalleryItem, 
  useDeleteGalleryItem,
  type GalleryItem 
} from '@/hooks/useGallery';
import { Plus, Search, Filter, Edit2, Trash2, Eye, ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AdminGallery = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Hooks para gerenciar dados
  const { data: galleryItems = [], isLoading, error } = useGallery();
  const createGalleryItem = useCreateGalleryItem();
  const updateGalleryItem = useUpdateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateGalleryItem = async (data: any, file?: File) => {
    try {
      console.log('handleCreateGalleryItem called with:', { data, file });
      let uploadedFileUrl = '';
      
      // Se há um arquivo, fazer upload primeiro
      if (file) {
        console.log('Uploading file:', file.name, file.type, file.size);
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include', // Incluir cookies de autenticação
          body: formData,
        });
        
        console.log('Upload response status:', uploadResponse.status);
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload error:', errorText);
          throw new Error('Erro ao fazer upload do arquivo');
        }
        
        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
        uploadedFileUrl = uploadResult.url;
        
        // Atualizar os dados com a URL do arquivo
        data.mediaUrl = uploadedFileUrl;
        if (file.type.startsWith('image/')) {
          data.thumbnailUrl = uploadedFileUrl;
        }
      }
      
      console.log('Final data before create:', data);
      await createGalleryItem.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Item da galeria criado com sucesso!');
    } catch (error: any) {
      console.error('Error creating gallery item:', error);
      toast.error('Erro ao criar item da galeria', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleUpdateGalleryItem = async (data: any) => {
    if (!editingGalleryItem) return;
    
    try {
      await updateGalleryItem.mutateAsync({ id: editingGalleryItem.id, ...data });
      setEditingGalleryItem(null);
      toast.success('Item da galeria atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar item da galeria', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item da galeria?')) {
      try {
        await deleteGalleryItem.mutateAsync(id);
        toast.success('Item da galeria excluído com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao excluir item da galeria', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar galeria: {error.message}</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Galeria</h1>
            <p className="text-muted-foreground">
              Gerir imagens e vídeos da galeria da ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-gallery-item"
          >
            <Plus className="w-4 h-4" />
            Novo Item
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
                    placeholder="Pesquisar itens da galeria..."
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
                  variant={filterType === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('image')}
                >
                  Imagens
                </Button>
                <Button
                  variant={filterType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('video')}
                >
                  Vídeos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando galeria...</p>
          </div>
        )}

        {/* Gallery Items List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredGalleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold truncate">
                            {item.title}
                          </h3>
                          <Badge variant="outline">
                            {item.type === 'image' ? 'Imagem' : 'Vídeo'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          <span>Categoria: {item.category}</span>
                          <span>Data: {item.date}</span>
                          {item.views && <span>Visualizações: {item.views}</span>}
                          {item.duration && <span>Duração: {item.duration}</span>}
                          {item.publishedAt && (
                            <span>Publicado: {new Date(item.publishedAt).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingItem(item)}
                          data-testid={`button-view-gallery-${item.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditGalleryItem(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          disabled={deleteGalleryItem.isPending}
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
        {!isLoading && filteredGalleryItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
                <p className="mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece adicionando um novo item à galeria.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Item
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <GalleryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateGalleryItem}
          isLoading={createGalleryItem.isPending}
        />

        <GalleryDialog
          open={!!editingGalleryItem}
          onOpenChange={(open) => !open && setEditingGalleryItem(null)}
          galleryItem={editingGalleryItem}
          onSubmit={handleUpdateGalleryItem}
          isLoading={updateGalleryItem.isPending}
        />

        <GalleryViewDialog
          item={viewingItem}
          open={!!viewingItem}
          onOpenChange={(open) => !open && setViewingItem(null)}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;