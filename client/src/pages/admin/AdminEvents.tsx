import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { EventDialog } from '@/components/admin/EventDialog';
import { 
  useEvents, 
  useCreateEvent, 
  useUpdateEvent, 
  useDeleteEvent,
  type Event 
} from '@/hooks/useEvents';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminEvents = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Hooks para gerenciar dados
  const { data: events = [], isLoading, error } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = async (data: any) => {
    try {
      await createEvent.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Evento criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar evento');
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!editingEvent) return;
    
    try {
      await updateEvent.mutateAsync({ id: editingEvent.id, ...data });
      setEditingEvent(null);
      toast.success('Evento atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar evento');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await deleteEvent.mutateAsync(id);
        toast.success('Evento excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir evento');
      }
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar eventos: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default">Próximo</Badge>;
      case 'completed':
        return <Badge variant="secondary">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="text-muted-foreground">
              Gerir eventos, conferências e workshops da ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-event"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
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
                    placeholder="Pesquisar eventos..."
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
                  variant={filterType === 'Conferência' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Conferência')}
                >
                  Conferências
                </Button>
                <Button
                  variant={filterType === 'Workshop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Workshop')}
                >
                  Workshops
                </Button>
                <Button
                  variant={filterType === 'Seminário' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('Seminário')}
                >
                  Seminários
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        )}

        {/* Events List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold truncate">
                            {event.title}
                          </h3>
                          <Badge variant="outline">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString('pt-PT')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          {event.capacity && (
                            <span>Capacidade: {event.capacity}</span>
                          )}
                          {event.publishedAt && (
                            <span>Publicado: {new Date(event.publishedAt).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deleteEvent.isPending}
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
        {!isLoading && filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
                <p className="mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece criando um novo evento.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Evento
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <EventDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateEvent}
          isLoading={createEvent.isPending}
        />

        <EventDialog
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          event={editingEvent}
          onSubmit={handleUpdateEvent}
          isLoading={updateEvent.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;

