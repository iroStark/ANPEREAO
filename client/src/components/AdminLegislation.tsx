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
  BookOpen, 
  Calendar,
  ExternalLink,
  Search,
  Filter,
  FileText
} from "lucide-react";

// Form validation schema
const legislationFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  fileUrl: z.string().min(1, "URL do arquivo é obrigatória"),
  imageUrl: z.string().optional(),
  publishedAt: z.string().min(1, "Data de publicação é obrigatória"),
});

type LegislationFormData = z.infer<typeof legislationFormSchema>;

const AdminLegislation = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLegislation, setEditingLegislation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch legislation data
  const { data: legislation = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin", "legislation"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/legislation");
      return response.json();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: LegislationFormData) => {
      const response = await apiRequest("POST", "/api/admin/legislation", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legislation"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Legislação criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar legislação",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LegislationFormData }) => {
      const response = await apiRequest("PUT", `/api/admin/legislation/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legislation"] });
      setIsEditDialogOpen(false);
      setEditingLegislation(null);
      toast({
        title: "Sucesso",
        description: "Legislação atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar legislação",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/legislation/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "legislation"] });
      toast({
        title: "Sucesso",
        description: "Legislação eliminada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao eliminar legislação",
        variant: "destructive",
      });
    },
  });

  // Form for creating
  const createForm = useForm<LegislationFormData>({
    resolver: zodResolver(legislationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      fileUrl: "",
      imageUrl: "",
      publishedAt: new Date().toISOString().split('T')[0],
    },
  });

  // Form for editing
  const editForm = useForm<LegislationFormData>({
    resolver: zodResolver(legislationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      fileUrl: "",
      imageUrl: "",
      publishedAt: "",
    },
  });

  // Handle create
  const handleCreate = (data: LegislationFormData) => {
    createMutation.mutate(data);
  };

  // Handle edit
  const handleEdit = (legislation: any) => {
    setEditingLegislation(legislation);
    editForm.reset({
      title: legislation.title,
      description: legislation.description,
      category: legislation.category,
      fileUrl: legislation.fileUrl,
      imageUrl: legislation.imageUrl || "",
      publishedAt: legislation.publishedAt ? new Date(legislation.publishedAt).toISOString().split('T')[0] : "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: LegislationFormData) => {
    if (editingLegislation) {
      updateMutation.mutate({ id: editingLegislation.id, data });
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filter and search
  const filteredLegislation = legislation.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(legislation.map((item: any) => item.category).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Legislação</h1>
          <p className="text-muted-foreground">
            Gerir documentos legais e regulamentações
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Legislação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Legislação</DialogTitle>
              <DialogDescription>
                Adicione um novo documento legal ao sistema
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da legislação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição da legislação" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
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
                    control={createForm.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Publicação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createForm.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Arquivo</FormLabel>
                      <FormControl>
                        <Input placeholder="URL do documento PDF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="URL da imagem de capa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Criando..." : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar legislação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todas as Categorias</option>
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

      {/* Legislation List */}
      <div className="grid gap-4">
        {filteredLegislation.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma legislação encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterCategory !== "all" 
                  ? "Tente ajustar os filtros de pesquisa"
                  : "Comece criando sua primeira legislação"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLegislation.map((legislation: any) => (
            <motion.div
              key={legislation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{legislation.title}</h3>
                        <Badge variant="secondary">{legislation.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {legislation.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(legislation.publishedAt).toLocaleDateString('pt-AO')}
                        </div>
                        {legislation.fileUrl && (
                          <a
                            href={legislation.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Ver Documento
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(legislation)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja eliminar esta legislação? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(legislation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Legislação</DialogTitle>
            <DialogDescription>
              Atualize as informações da legislação
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da legislação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição da legislação" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Publicação</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Arquivo</FormLabel>
                    <FormControl>
                      <Input placeholder="URL do documento PDF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem de capa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Atualizando..." : "Atualizar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLegislation;
