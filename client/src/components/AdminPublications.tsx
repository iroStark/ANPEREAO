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
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Calendar,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";

// Form validation schema
const publicationFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  fileUrl: z.string().url("URL do ficheiro deve ser válida").optional().or(z.literal("")),
  downloadUrl: z.string().url("URL de download deve ser válida").optional().or(z.literal("")),
});

type PublicationFormData = z.infer<typeof publicationFormSchema>;

interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  fileUrl?: string;
  downloadUrl?: string;
}

const AdminPublications = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch publications query
  const { data: publications = [], isLoading, error } = useQuery<Publication[]>({
    queryKey: ["admin", "publications"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/publications");
      return response.json();
    },
  });

  // Create publication mutation
  const createPublicationMutation = useMutation({
    mutationFn: async (data: PublicationFormData) => {
      const response = await apiRequest("POST", "/api/admin/publications", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "publications"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Publicação criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar publicação.",
        variant: "destructive",
      });
    },
  });

  // Update publication mutation
  const updatePublicationMutation = useMutation({
    mutationFn: async ({ id, ...data }: PublicationFormData & { id: string }) => {
      const response = await apiRequest("PUT", `/api/admin/publications/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "publications"] });
      setIsEditDialogOpen(false);
      setEditingPublication(null);
      toast({
        title: "Sucesso",
        description: "Publicação atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar publicação.",
        variant: "destructive",
      });
    },
  });

  // Delete publication mutation
  const deletePublicationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/publications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "publications"] });
      toast({
        title: "Sucesso",
        description: "Publicação eliminada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao eliminar publicação.",
        variant: "destructive",
      });
    },
  });

  // Form for create/edit
  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      fileUrl: "",
      downloadUrl: "",
    },
  });

  const handleCreateSubmit = (data: PublicationFormData) => {
    createPublicationMutation.mutate(data);
  };

  const handleEditSubmit = (data: PublicationFormData) => {
    if (editingPublication) {
      updatePublicationMutation.mutate({ ...data, id: editingPublication.id });
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    form.reset({
      title: publication.title,
      description: publication.description,
      category: publication.category,
      date: publication.date,
      fileUrl: publication.fileUrl || "",
      downloadUrl: publication.downloadUrl || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePublicationMutation.mutate(id);
  };

  // Filter publications
  const filteredPublications = publications.filter((publication) => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publication.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || publication.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(publications.map(p => p.category))).filter(Boolean);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar publicações. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold truncate">Gestão de Publicações</h2>
          <p className="text-sm sm:text-base text-muted-foreground truncate">
            Gerir documentos, relatórios e publicações da ANPERE
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" data-testid="button-create-publication">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Publicação</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle>Nova Publicação</DialogTitle>
              <DialogDescription>
                Criar uma nova publicação no sistema ANPERE
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da publicação" {...field} data-testid="input-title" />
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
                          placeholder="Descrição da publicação" 
                          {...field} 
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Categoria" {...field} data-testid="input-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Ficheiro (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://exemplo.com/ficheiro.pdf" 
                          {...field} 
                          data-testid="input-file-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Download (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://exemplo.com/download/ficheiro.pdf" 
                          {...field} 
                          data-testid="input-download-url"
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
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPublicationMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createPublicationMutation.isPending ? "A Criar..." : "Criar Publicação"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Procurar publicações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto min-w-0"
                data-testid="select-category"
              >
                <option value="">Todas as Categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publications List */}
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
        ) : filteredPublications.length > 0 ? (
          <div className="space-y-4">
            {filteredPublications.map((publication, index) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                          <h3 className="font-semibold text-base sm:text-lg truncate">{publication.title}</h3>
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2">
                          {publication.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(publication.date).toLocaleDateString('pt-PT')}
                          </div>
                          <Badge variant="secondary" className="text-xs">{publication.category}</Badge>
                        </div>
                        
                        {(publication.fileUrl || publication.downloadUrl) && (
                          <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            {publication.fileUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-xs sm:text-sm"
                                onClick={() => window.open(publication.fileUrl, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="hidden sm:inline">Ver Ficheiro</span>
                                <span className="sm:hidden">Ver</span>
                              </Button>
                            )}
                            {publication.downloadUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-xs sm:text-sm"
                                onClick={() => window.open(publication.downloadUrl, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Download
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                          onClick={() => handleEdit(publication)}
                          data-testid={`button-edit-${publication.id}`}
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="ml-1 sm:hidden">Editar</span>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-none"
                              data-testid={`button-delete-${publication.id}`}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                              <span className="ml-1 sm:hidden">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem a certeza que deseja eliminar a publicação "{publication.title}"?
                                Esta ação não pode ser revertida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(publication.id)}
                                className="bg-destructive hover:bg-destructive/90"
                                data-testid={`button-confirm-delete-${publication.id}`}
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
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma publicação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory 
                  ? "Tente ajustar os filtros de pesquisa." 
                  : "Comece por criar a primeira publicação."}
              </p>
              {!searchTerm && !selectedCategory && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Primeira Publicação
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
            <DialogTitle>Editar Publicação</DialogTitle>
            <DialogDescription>
              Atualizar os detalhes da publicação
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da publicação" {...field} />
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
                      <Textarea placeholder="Descrição da publicação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Ficheiro (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/ficheiro.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="downloadUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Download (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/download/ficheiro.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updatePublicationMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updatePublicationMutation.isPending ? "A Guardar..." : "Guardar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPublications;