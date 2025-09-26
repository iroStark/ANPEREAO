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
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Save,
  Users,
  Target,
  Award,
  History
} from "lucide-react";

// Form validation schema
const aboutFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().min(1, "Subtítulo é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  mission: z.string().min(1, "Missão é obrigatória"),
  vision: z.string().min(1, "Visão é obrigatória"),
  values: z.string().min(1, "Valores são obrigatórios"),
  history: z.string().min(1, "História é obrigatória"),
  imageUrl: z.string().optional(),
});

type AboutFormData = z.infer<typeof aboutFormSchema>;

const AdminAbout = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch about data
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["admin", "about"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/about");
      return response.json();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: AboutFormData) => {
      const response = await apiRequest("PUT", "/api/admin/about", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "about"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Informações sobre a ANPERE atualizadas com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar informações",
        variant: "destructive",
      });
    },
  });

  // Form for editing
  const editForm = useForm<AboutFormData>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      mission: "",
      vision: "",
      values: "",
      history: "",
      imageUrl: "",
    },
  });

  // Handle edit
  const handleEdit = () => {
    if (aboutData) {
      editForm.reset({
        title: aboutData.title || "",
        subtitle: aboutData.subtitle || "",
        description: aboutData.description || "",
        mission: aboutData.mission || "",
        vision: aboutData.vision || "",
        values: aboutData.values || "",
        history: aboutData.history || "",
        imageUrl: aboutData.imageUrl || "",
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: AboutFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestão - Sobre Nós</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerir informações da página "Sobre a ANPERE"
          </p>
        </div>
        <Button onClick={handleEdit} data-testid="button-edit-about">
          <Edit2 className="w-4 h-4 mr-2" />
          Editar Informações
        </Button>
      </div>

      {/* Current Content Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Informações Atuais
            </CardTitle>
            <CardDescription>
              Visualização das informações atualmente publicadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {aboutData ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{aboutData.title}</h3>
                  <p className="text-muted-foreground">{aboutData.subtitle}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-muted-foreground">{aboutData.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Missão
                    </h4>
                    <p className="text-muted-foreground">{aboutData.mission}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Visão
                    </h4>
                    <p className="text-muted-foreground">{aboutData.vision}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Valores</h4>
                  <p className="text-muted-foreground">{aboutData.values}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    História
                  </h4>
                  <p className="text-muted-foreground">{aboutData.history}</p>
                </div>

                {aboutData.imageUrl && (
                  <div>
                    <h4 className="font-semibold mb-2">Imagem</h4>
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                      <img
                        src={aboutData.imageUrl}
                        alt="Imagem da ANPERE"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma informação disponível</h3>
                <p className="text-muted-foreground">
                  Clique em "Editar Informações" para adicionar conteúdo
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Informações Sobre a ANPERE</DialogTitle>
            <DialogDescription>
              Atualize as informações que aparecem na página "Sobre Nós"
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sobre a ANPERE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Associação Nacional dos Profissionais..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Geral</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição geral da associação..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Missão</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Missão da associação..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visão</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Visão da associação..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valores</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Valores da associação..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>História</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="História da associação..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
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
                      <Input placeholder="URL da imagem principal" {...field} />
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
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAbout;
