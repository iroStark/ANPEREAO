import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  useAllOrgaosSociais, 
  useCreateOrgaoSocial, 
  useUpdateOrgaoSocial, 
  useDeleteOrgaoSocial,
  type OrgaoSocial 
} from '@/hooks/useOrgaosSociais';
import { Add01Icon as Plus, Search01Icon as Search, Edit02Icon as Edit2, Delete02Icon as Trash2, ViewIcon as Eye, UserIcon as User, Building04Icon as Building2, Mail01Icon as Mail, Call02Icon as Phone, Upload01Icon as Upload, Cancel01Icon as X } from "hugeicons-react";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const orgaoSocialSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  organType: z.string().min(1, 'Tipo de órgão é obrigatório'),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  orderIndex: z.number().min(0),
  isActive: z.boolean(),
});

type OrgaoSocialFormData = z.infer<typeof orgaoSocialSchema>;

const AdminOrgaosSociais = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrgao, setEditingOrgao] = useState<OrgaoSocial | null>(null);
  const [viewingOrgao, setViewingOrgao] = useState<OrgaoSocial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Hooks para gerenciar dados
  const { data: orgaos = [], isLoading, error } = useAllOrgaosSociais();
  const createOrgao = useCreateOrgaoSocial();
  const updateOrgao = useUpdateOrgaoSocial();
  const deleteOrgao = useDeleteOrgaoSocial();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<OrgaoSocialFormData>({
    resolver: zodResolver(orgaoSocialSchema),
    defaultValues: {
      name: '',
      position: '',
      organType: '',
      bio: '',
      photoUrl: '',
      email: '',
      phone: '',
      orderIndex: 0,
      isActive: true,
    },
  });

  const filteredOrgaos = orgaos.filter(orgao => {
    const matchesSearch = orgao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orgao.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || orgao.organType === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedOrgaos = [...filteredOrgaos].sort((a, b) => a.orderIndex - b.orderIndex);

  const uploadPhoto = async (file: File): Promise<string> => {
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
      throw new Error('Erro ao fazer upload da foto');
    }
    
    const uploadResult = await uploadResponse.json();
    return uploadResult.url;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setValue('photoUrl', '');
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleCreateOrgao = async (data: OrgaoSocialFormData) => {
    try {
      let photoUrl = data.photoUrl;
      
      // Se há um arquivo selecionado, fazer upload
      if (selectedPhotoFile) {
        photoUrl = await uploadPhoto(selectedPhotoFile);
      }
      
      await createOrgao.mutateAsync({ ...data, photoUrl });
      setIsCreateDialogOpen(false);
      reset();
      setSelectedPhotoFile(null);
      setPhotoPreview(null);
      toast.success('Órgão social criado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar órgão social', { description: error.message });
    }
  };

  const handleUpdateOrgao = async (data: OrgaoSocialFormData) => {
    if (!editingOrgao) return;
    
    try {
      let photoUrl = data.photoUrl;
      
      // Se há um arquivo selecionado, fazer upload
      if (selectedPhotoFile) {
        photoUrl = await uploadPhoto(selectedPhotoFile);
      }
      
      await updateOrgao.mutateAsync({ id: editingOrgao.id, ...data, photoUrl });
      setEditingOrgao(null);
      reset();
      setSelectedPhotoFile(null);
      setPhotoPreview(null);
      toast.success('Órgão social atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar órgão social', { description: error.message });
    }
  };

  const handleDeleteOrgao = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este órgão social?')) return;
    
    try {
      await deleteOrgao.mutateAsync(id);
      toast.success('Órgão social excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir órgão social');
    }
  };

  const openEditDialog = (orgao: OrgaoSocial) => {
    setEditingOrgao(orgao);
    setValue('name', orgao.name);
    setValue('position', orgao.position);
    setValue('organType', orgao.organType);
    setValue('bio', orgao.bio || '');
    setValue('photoUrl', orgao.photoUrl || '');
    setValue('email', orgao.email || '');
    setValue('phone', orgao.phone || '');
    setValue('orderIndex', orgao.orderIndex);
    setValue('isActive', orgao.isActive);
    setSelectedPhotoFile(null);
    setPhotoPreview(orgao.photoUrl || null);
  };

  const closeDialogs = () => {
    setIsCreateDialogOpen(false);
    setEditingOrgao(null);
    setViewingOrgao(null);
    reset();
    setSelectedPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-500">Erro ao carregar órgãos sociais: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Órgãos Sociais</h1>
            <p className="text-muted-foreground">Gerencie os membros dos órgãos sociais da ANPERE</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Órgão Social
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Assembleia Geral">Assembleia Geral</SelectItem>
                  <SelectItem value="Direcção">Direcção</SelectItem>
                  <SelectItem value="Conselho Fiscal">Conselho Fiscal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orgaos List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Carregando órgãos sociais...</p>
            </CardContent>
          </Card>
        ) : sortedOrgaos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum órgão social encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrgaos.map((orgao, index) => (
              <motion.div
                key={orgao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {orgao.photoUrl ? (
                        <img
                          src={orgao.photoUrl}
                          alt={orgao.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{orgao.name}</CardTitle>
                        <CardDescription className="mt-1">{orgao.position}</CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{orgao.organType}</Badge>
                          {!orgao.isActive && (
                            <Badge variant="outline">Inativo</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingOrgao(orgao)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(orgao)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrgao(orgao.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen || !!editingOrgao} onOpenChange={closeDialogs}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrgao ? 'Editar Órgão Social' : 'Novo Órgão Social'}
              </DialogTitle>
              <DialogDescription>
                {editingOrgao ? 'Atualize as informações do órgão social' : 'Preencha os dados do novo órgão social'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(editingOrgao ? handleUpdateOrgao : handleCreateOrgao)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="position">Cargo/Posição *</Label>
                  <Input id="position" {...register('position')} placeholder="Ex: Presidente" />
                  {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="organType">Tipo de Órgão *</Label>
                <Select value={watch('organType')} onValueChange={(value) => setValue('organType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assembleia Geral">Assembleia Geral</SelectItem>
                    <SelectItem value="Direcção">Direcção</SelectItem>
                    <SelectItem value="Conselho Fiscal">Conselho Fiscal</SelectItem>
                  </SelectContent>
                </Select>
                {errors.organType && <p className="text-sm text-red-500 mt-1">{errors.organType.message}</p>}
              </div>

              <div>
                <Label htmlFor="bio">Biografia / Currículo</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Descreva a biografia e currículo do membro..."
                  rows={6}
                />
                {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
              </div>

              <div>
                <Label htmlFor="photo">Foto</Label>
                <div className="space-y-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    ref={photoInputRef}
                    className="cursor-pointer"
                  />
                  {(photoPreview || watch('photoUrl')) && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={photoPreview || watch('photoUrl') || ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={handleRemovePhoto}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.photoUrl && <p className="text-sm text-red-500 mt-1">{errors.photoUrl.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="email@exemplo.com" />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...register('phone')} placeholder="+244 923 456 789" />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderIndex">Ordem de Exibição</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    {...register('orderIndex', { valueAsNumber: true })}
                    min={0}
                  />
                  {errors.orderIndex && <p className="text-sm text-red-500 mt-1">{errors.orderIndex.message}</p>}
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Ativo</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialogs}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOrgao ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={!!viewingOrgao} onOpenChange={() => setViewingOrgao(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingOrgao?.name}</DialogTitle>
              <DialogDescription>{viewingOrgao?.position}</DialogDescription>
            </DialogHeader>
            {viewingOrgao && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{viewingOrgao.organType}</Badge>
                  {!viewingOrgao.isActive && <Badge variant="outline">Inativo</Badge>}
                </div>
                {viewingOrgao.bio && (
                  <div>
                    <Label>Biografia / Currículo</Label>
                    <div className="mt-2 p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">{viewingOrgao.bio}</p>
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingOrgao.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${viewingOrgao.email}`} className="text-primary hover:underline">
                        {viewingOrgao.email}
                      </a>
                    </div>
                  )}
                  {viewingOrgao.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${viewingOrgao.phone}`} className="text-primary hover:underline">
                        {viewingOrgao.phone}
                      </a>
                    </div>
                  )}
                </div>
                {viewingOrgao.photoUrl && (
                  <div>
                    <Label>Foto</Label>
                    <img
                      src={viewingOrgao.photoUrl}
                      alt={viewingOrgao.name}
                      className="mt-2 w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrgaosSociais;

