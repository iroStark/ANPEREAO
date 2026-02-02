import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  useSlideshow, 
  useCreateSlideshow, 
  useUpdateSlideshow, 
  useDeleteSlideshow,
  type SlideshowItem 
} from '@/hooks/useSlideshow';
import { Add01Icon as Plus, Search01Icon as Search, Edit02Icon as Edit2, Delete02Icon as Trash2, ViewIcon as Eye, Image01Icon as ImageIcon, Upload01Icon as Upload, ArrowUp01Icon as ArrowUp, ArrowDown01Icon as ArrowDown } from "hugeicons-react";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const slideSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  imageUrl: z.string().optional(), // Opcional porque pode vir do upload
  order: z.number().min(0),
  isActive: z.boolean(),
});

type SlideFormData = z.infer<typeof slideSchema>;

const AdminSlideshow = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideshowItem | null>(null);
  const [viewingSlide, setViewingSlide] = useState<SlideshowItem | null>(null);
  const [deleteSlideId, setDeleteSlideId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Hooks para gerenciar dados
  const { data: slides = [], isLoading, error } = useSlideshow();
  const createSlideshow = useCreateSlideshow();
  const updateSlideshow = useUpdateSlideshow();
  const deleteSlideshow = useDeleteSlideshow();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      order: 0,
      isActive: true,
    },
  });

  const filteredSlides = slides.filter(slide => 
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSlides = [...filteredSlides].sort((a, b) => a.order - b.order);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // We'll upload the file when submitting the form
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const uploadResponse = await fetch(`${baseUrl}/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
      },
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Erro ao fazer upload do arquivo');
    }
    
    const uploadResult = await uploadResponse.json();
    return uploadResult.url;
  };

  const onSubmit = async (data: SlideFormData) => {
    try {
      let imageUrl = data.imageUrl;
      
      // If a new file was selected, upload it (required for new slides)
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      } else if (!editingSlide && !imageUrl) {
        // For new slides, image is required
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      const slideData = {
        ...data,
        imageUrl: imageUrl || editingSlide?.imageUrl || '',
      };

      if (editingSlide) {
        await updateSlideshow.mutateAsync({ id: editingSlide.id, ...slideData });
        toast.success('Slide atualizado com sucesso!');
      } else {
        await createSlideshow.mutateAsync(slideData);
        toast.success('Slide criado com sucesso!');
      }

      // Reset form
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsCreateDialogOpen(false);
      setEditingSlide(null);
    } catch (error: any) {
      toast.error('Erro ao salvar slide', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleEdit = (slide: SlideshowItem) => {
    setEditingSlide(slide);
    setValue('title', slide.title);
    setValue('subtitle', slide.subtitle || '');
    setValue('description', slide.description);
    setValue('imageUrl', slide.imageUrl);
    setValue('order', slide.order);
    setValue('isActive', slide.isActive);
    setPreviewUrl(slide.imageUrl);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteSlideId(id);
  };

  const confirmDelete = async () => {
    if (!deleteSlideId) return;
    try {
      await deleteSlideshow.mutateAsync(deleteSlideId);
      toast.success('Slide excluído com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir slide', { description: error.message || 'Tente novamente.' });
    } finally {
      setDeleteSlideId(null);
    }
  };

  const handleOrderChange = async (slide: SlideshowItem, direction: 'up' | 'down') => {
    const currentIndex = sortedSlides.findIndex(s => s.id === slide.id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sortedSlides.length) return;

    const targetSlide = sortedSlides[newIndex];
    
    try {
      // Swap orders
      await Promise.all([
        updateSlideshow.mutateAsync({ id: slide.id, order: targetSlide.order }),
        updateSlideshow.mutateAsync({ id: targetSlide.id, order: slide.order }),
      ]);
      toast.success('Ordem atualizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar ordem', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingSlide(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    reset();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando slides...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-destructive font-semibold">Erro ao carregar slides</div>
          <div className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </div>
          <div className="text-xs text-muted-foreground">
            Verifique se está autenticado e se o servidor está funcionando corretamente.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Slideshow</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as imagens e informações do slideshow da página inicial
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Slide
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Pesquisar slides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Slides Grid */}
        {sortedSlides.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum slide encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {slide.isActive ? (
                          <Badge variant="default">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline">Ordem: {slide.order}</Badge>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-1">{slide.title}</CardTitle>
                    {slide.subtitle && (
                      <CardDescription className="line-clamp-1">{slide.subtitle}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {slide.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingSlide(slide)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(slide)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(slide.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOrderChange(slide, 'up')}
                        disabled={index === 0}
                        className="flex-1"
                      >
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Subir
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOrderChange(slide, 'down')}
                        disabled={index === sortedSlides.length - 1}
                        className="flex-1"
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Descer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? 'Editar Slide' : 'Adicionar Novo Slide'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do slide que aparecerá no slideshow da página inicial
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Título do slide"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  {...register('subtitle')}
                  placeholder="Subtítulo (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descrição do slide"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  className="cursor-pointer"
                  required={!editingSlide}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {editingSlide && editingSlide.imageUrl && !previewUrl && (
                  <div className="mt-2">
                    <img
                      src={editingSlide.imageUrl}
                      alt="Preview atual"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isActive"
                      checked={watch('isActive')}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {watch('isActive') ? 'Ativo' : 'Inativo'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createSlideshow.isPending || updateSlideshow.isPending}>
                  {editingSlide ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={!!viewingSlide} onOpenChange={() => setViewingSlide(null)}>
          <DialogContent className="max-w-3xl">
            {viewingSlide && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewingSlide.title}</DialogTitle>
                  {viewingSlide.subtitle && (
                    <DialogDescription>{viewingSlide.subtitle}</DialogDescription>
                  )}
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {viewingSlide.imageUrl ? (
                      <img
                        src={viewingSlide.imageUrl}
                        alt={viewingSlide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{viewingSlide.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant={viewingSlide.isActive ? "default" : "secondary"}>
                      {viewingSlide.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <span>Ordem: {viewingSlide.order}</span>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteSlideId} onOpenChange={() => setDeleteSlideId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este slide? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSlideshow;

