import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Edit02Icon as Edit2, 
  FloppyDiskIcon as Save, 
  Cancel01Icon as X, 
  InformationCircleIcon as Info, 
  Add01Icon as Plus, 
  Delete02Icon as Trash2, 
  Clock01Icon as History,
  Target01Icon as Target,
  ViewIcon as Eye,
  FavouriteIcon as Heart,
  Upload01Icon as Upload,
  Image01Icon as ImageIcon
} from "hugeicons-react";
import { useAboutContent, useCreateAboutContent, useUpdateAboutContent } from '@/hooks/useAboutContent';
import { 
  useTimelineEventsAdmin, 
  useCreateTimelineEvent, 
  useUpdateTimelineEvent, 
  useDeleteTimelineEvent,
  type TimelineEvent 
} from '@/hooks/useTimelineEvents';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminAbout = () => {
  const { toast } = useToast();
  const { data: aboutContent = [], isLoading: isLoadingAbout } = useAboutContent();
  const { data: timelineEvents = [], isLoading: isLoadingTimeline } = useTimelineEventsAdmin();
  
  const createAboutContent = useCreateAboutContent();
  const updateAboutContent = useUpdateAboutContent();
  const createTimelineEvent = useCreateTimelineEvent();
  const updateTimelineEvent = useUpdateTimelineEvent();
  const deleteTimelineEvent = useDeleteTimelineEvent();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<TimelineEvent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get content by section
  const missionContent = aboutContent.find(c => c.section === 'mission');
  const visionContent = aboutContent.find(c => c.section === 'vision');
  const valuesContent = aboutContent.find(c => c.section === 'values');

  const [formData, setFormData] = useState({
    mission: { title: '', content: '' },
    vision: { title: '', content: '' },
    values: { title: '', content: '' },
  });

  const [timelineFormData, setTimelineFormData] = useState({
    year: '',
    event: '',
    description: '',
    details: '',
    order: 0,
    isActive: true,
  });

  const handleSaveSection = async (section: 'mission' | 'vision' | 'values') => {
    try {
      const content = aboutContent.find(c => c.section === section);
      const data = {
        section,
        title: formData[section].title,
        content: formData[section].content,
      };

      if (content) {
        await updateAboutContent.mutateAsync({ id: content.id, ...data });
        toast({
          title: 'Sucesso!',
          description: `${section === 'mission' ? 'Missão' : section === 'vision' ? 'Visão' : 'Valores'} atualizado com sucesso.`,
        });
      } else {
        await createAboutContent.mutateAsync(data);
        toast({
          title: 'Sucesso!',
          description: `${section === 'mission' ? 'Missão' : section === 'vision' ? 'Visão' : 'Valores'} criado com sucesso.`,
        });
      }
      setEditingSection(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenTimelineDialog = (event?: TimelineEvent) => {
    if (event) {
      setEditingTimelineEvent(event);
      setTimelineFormData({
        year: event.year,
        event: event.event,
        description: event.description,
        details: event.details || '',
        order: event.order || 0,
        isActive: event.isActive ?? true,
      });
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      }
    } else {
      setEditingTimelineEvent(null);
      setTimelineFormData({
        year: '',
        event: '',
        description: '',
        details: '',
        order: timelineEvents.length,
        isActive: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsTimelineDialogOpen(true);
  };

  const handleSaveTimelineEvent = async () => {
    try {
      if (editingTimelineEvent) {
        // Update: use FormData if image is being uploaded, otherwise use JSON
        if (imageFile) {
          const formDataToSend = new FormData();
          formDataToSend.append('year', timelineFormData.year);
          formDataToSend.append('event', timelineFormData.event);
          formDataToSend.append('description', timelineFormData.description);
          formDataToSend.append('details', timelineFormData.details);
          formDataToSend.append('order', String(timelineFormData.order));
          formDataToSend.append('isActive', String(timelineFormData.isActive));
          formDataToSend.append('image', imageFile);
          
          const baseUrl = import.meta.env.VITE_API_URL || '/api';
          const response = await fetch(`${baseUrl}/admin/timeline-events/${editingTimelineEvent.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
            },
            body: formDataToSend,
          });
          
          if (!response.ok) throw new Error('Failed to update event');
        } else {
          await updateTimelineEvent.mutateAsync({
            id: editingTimelineEvent.id,
            year: timelineFormData.year,
            event: timelineFormData.event,
            description: timelineFormData.description,
            details: timelineFormData.details,
            order: timelineFormData.order,
            isActive: timelineFormData.isActive,
            imageUrl: editingTimelineEvent.imageUrl,
          });
        }
        toast({
          title: 'Sucesso!',
          description: 'Evento atualizado com sucesso.',
        });
      } else {
        // Create: use FormData if image is provided, otherwise use JSON
        if (imageFile) {
          const formDataToSend = new FormData();
          formDataToSend.append('year', timelineFormData.year);
          formDataToSend.append('event', timelineFormData.event);
          formDataToSend.append('description', timelineFormData.description);
          formDataToSend.append('details', timelineFormData.details);
          formDataToSend.append('order', String(timelineFormData.order));
          formDataToSend.append('isActive', String(timelineFormData.isActive));
          formDataToSend.append('image', imageFile);
          
          const baseUrl = import.meta.env.VITE_API_URL || '/api';
          const response = await fetch(`${baseUrl}/admin/timeline-events`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
            },
            body: formDataToSend,
          });
          
          if (!response.ok) throw new Error('Failed to create event');
        } else {
          await createTimelineEvent.mutateAsync({
            year: timelineFormData.year,
            event: timelineFormData.event,
            description: timelineFormData.description,
            details: timelineFormData.details,
            order: timelineFormData.order,
            isActive: timelineFormData.isActive,
          });
        }
        toast({
          title: 'Sucesso!',
          description: 'Evento criado com sucesso.',
        });
      }
      setIsTimelineDialogOpen(false);
      setEditingTimelineEvent(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar evento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTimelineEvent = async (id: string) => {
    try {
      await deleteTimelineEvent.mutateAsync(id);
      toast({
        title: 'Sucesso!',
        description: 'Evento removido com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao remover evento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sobre Nós</h1>
            <p className="text-muted-foreground">
              Gerir informações da página "Sobre a ANPERE"
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['mission', 'vision', 'values'] as const).map((section) => {
            const content = aboutContent.find(c => c.section === section);
            const isEditing = editingSection === section;
            const sectionLabels = {
              mission: { label: 'Missão', icon: Target },
              vision: { label: 'Visão', icon: Eye },
              values: { label: 'Valores', icon: Heart },
            };
            const { label, icon: Icon } = sectionLabels[section];

            return (
              <Card key={section}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={formData[section].title || content?.title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [section]: { ...formData[section], title: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Conteúdo</Label>
                        <Textarea
                          value={formData[section].content || content?.content || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [section]: { ...formData[section], content: e.target.value },
                            })
                          }
                          className="mt-1 min-h-[120px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveSection(section)}
                          disabled={createAboutContent.isPending || updateAboutContent.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingSection(null);
                            setFormData({
                              ...formData,
                              [section]: {
                                title: content?.title || '',
                                content: content?.content || '',
                              },
                            });
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">{content?.title || `Título da ${label}`}</h3>
                        <p className="text-muted-foreground text-sm">
                          {content?.content || `Conteúdo da ${label} ainda não definido.`}
            </p>
          </div>
          <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingSection(section);
                          setFormData({
                            ...formData,
                            [section]: {
                              title: content?.title || '',
                              content: content?.content || '',
                            },
                          });
                        }}
          >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
          </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline Events Section */}
          <Card>
            <CardHeader>
            <div className="flex items-center justify-between">
              <div>
              <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Eventos da Timeline
              </CardTitle>
              <CardDescription>
                  Gerir os eventos históricos exibidos na página "Nossa História"
              </CardDescription>
              </div>
              <Button onClick={() => handleOpenTimelineDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>
            </CardHeader>
          <CardContent>
            {isLoadingTimeline ? (
              <p className="text-muted-foreground">Carregando eventos...</p>
            ) : timelineEvents.length === 0 ? (
              <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {timelineEvents.map((event) => (
                  <Card key={event.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                              {event.year}
                            </span>
                            <h4 className="font-semibold">{event.event}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          {event.details && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{event.details}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenTimelineDialog(event)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
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
                                  Tem certeza que deseja remover o evento "{event.event}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTimelineEvent(event.id)}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline Event Dialog */}
        <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTimelineEvent ? 'Editar Evento' : 'Novo Evento'}
              </DialogTitle>
              <DialogDescription>
                {editingTimelineEvent ? 'Atualize os dados do evento.' : 'Adicione um novo evento à timeline.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ano *</Label>
                  <Input
                    value={timelineFormData.year}
                    onChange={(e) => setTimelineFormData({ ...timelineFormData, year: e.target.value })}
                    placeholder="2023"
                  />
                </div>
              <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={timelineFormData.order}
                    onChange={(e) => setTimelineFormData({ ...timelineFormData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label>Evento *</Label>
                <Input
                  value={timelineFormData.event}
                  onChange={(e) => setTimelineFormData({ ...timelineFormData, event: e.target.value })}
                  placeholder="Título do evento"
                  />
              </div>
              <div>
                <Label>Descrição *</Label>
                  <Textarea
                  value={timelineFormData.description}
                  onChange={(e) => setTimelineFormData({ ...timelineFormData, description: e.target.value })}
                  placeholder="Breve descrição do evento"
                  rows={3}
                />
              </div>
              <div>
                <Label>Detalhes</Label>
                  <Textarea
                  value={timelineFormData.details}
                  onChange={(e) => setTimelineFormData({ ...timelineFormData, details: e.target.value })}
                  placeholder="Detalhes expandidos do evento (exibidos no modal)"
                  rows={5}
                />
              </div>
              <div>
                <Label>Imagem</Label>
                <div className="flex items-center gap-4 mt-2">
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={timelineFormData.isActive}
                  onChange={(e) => setTimelineFormData({ ...timelineFormData, isActive: e.target.checked })}
                  className="rounded"
                  />
                <Label htmlFor="isActive">Evento ativo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTimelineDialogOpen(false)}>
                Cancelar
              </Button>
                <Button
                  onClick={handleSaveTimelineEvent}
                  disabled={createTimelineEvent.isPending || updateTimelineEvent.isPending}
                >
                  {editingTimelineEvent ? 'Atualizar' : 'Criar'}
              </Button>
              </div>
        </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAbout;
