import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  MapPin,
  Clock,
  Users,
  Search,
  Filter
} from "lucide-react";

// Form validation schema
const eventFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  location: z.string().min(1, "Local é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  capacity: z.string().optional(),
  registrationUrl: z.string().url("URL de inscrição deve ser válida").optional().or(z.literal("")),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  capacity?: string;
  registrationUrl?: string;
}

const AdminEvents = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events query
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/events");
      return response.json();
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/admin/events", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar evento.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...data }: EventFormData & { id: string }) => {
      const response = await apiRequest("PUT", `/api/admin/events/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar evento.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast({
        title: "Sucesso",
        description: "Evento eliminado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao eliminar evento.",
        variant: "destructive",
      });
    },
  });

  // Form for create/edit
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: "",
      location: "",
      type: "",
      capacity: "",
      registrationUrl: "",
    },
  });

  const handleCreateSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const handleEditSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateEventMutation.mutate({ ...data, id: editingEvent.id });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      capacity: event.capacity || "",
      registrationUrl: event.registrationUrl || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const types = Array.from(new Set(events.map(e => e.type))).filter(Boolean);

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar eventos. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  const EventForm = ({ onSubmit, buttonText, isLoading }: { 
    onSubmit: (data: EventFormData) => void; 
    buttonText: string; 
    isLoading: boolean 
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do evento" {...field} data-testid="input-event-title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição do evento" 
                  {...field} 
                  data-testid="input-event-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-event-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type="time" {...field} data-testid="input-event-time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="Local do evento" {...field} data-testid="input-event-location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo do evento" {...field} data-testid="input-event-type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Número de participantes" {...field} data-testid="input-event-capacity" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="registrationUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Inscrição (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://exemplo.com/inscricao" 
                  {...field} 
                  data-testid="input-event-registration-url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            data-testid="button-submit-event"
          >
            {isLoading ? "A Processar..." : buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold truncate">Gestão de Eventos</h2>
          <p className="text-sm sm:text-base text-muted-foreground truncate">
            Gerir conferências, workshops e atividades da ANPERE
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" data-testid="button-create-event">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Evento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle>Novo Evento</DialogTitle>
              <DialogDescription>
                Criar um novo evento no sistema ANPERE
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onSubmit={handleCreateSubmit} 
              buttonText="Criar Evento" 
              isLoading={createEventMutation.isPending} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Procurar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                  data-testid="input-search-events"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm flex-1 sm:flex-none min-w-0"
                data-testid="select-event-type"
              >
                <option value="">Todos os Tipos</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge variant="secondary">{event.type}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString('pt-PT')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          {event.capacity && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.capacity} participantes
                            </div>
                          )}
                        </div>
                        
                        {event.registrationUrl && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => window.open(event.registrationUrl, '_blank')}
                              data-testid={`button-register-${event.id}`}
                            >
                              <Users className="w-3 h-3" />
                              Inscrição
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(event)}
                          data-testid={`button-edit-event-${event.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              data-testid={`button-delete-event-${event.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem a certeza que deseja eliminar o evento "{event.title}"?
                                Esta ação não pode ser revertida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id)}
                                className="bg-destructive hover:bg-destructive/90"
                                data-testid={`button-confirm-delete-event-${event.id}`}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedType 
                  ? "Tente ajustar os filtros de pesquisa." 
                  : "Comece por criar o primeiro evento."}
              </p>
              {!searchTerm && !selectedType && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Evento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Atualizar os detalhes do evento
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            onSubmit={handleEditSubmit} 
            buttonText="Guardar Alterações" 
            isLoading={updateEventMutation.isPending} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;