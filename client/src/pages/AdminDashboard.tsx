import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPublications from "@/components/AdminPublications";
import AdminEvents from "@/components/AdminEvents";
import AdminLegislation from "@/components/AdminLegislation";
import AdminGallery from "@/components/AdminGallery";
import AdminAbout from "@/components/AdminAbout";
import { 
  BarChart3,
  Users,
  FileText,
  Calendar,
  ImageIcon,
  BookOpen,
  Database,
  TrendingUp,
  Activity,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSeedData = async () => {
    try {
      toast({
        title: "Iniciando Seed",
        description: "Criando dados de exemplo...",
      });

      const response = await fetch("/api/seed-sample-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao executar seed dos dados");
      }

      const result = await response.json();
      
      toast({
        title: "Seed Concluído",
        description: `${result.message} Criados: ${result.eventsCount} eventos, ${result.publicationsCount} publicações, ${result.galleryCount} itens de galeria.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro no Seed",
        description: error.message || "Erro ao criar dados de exemplo.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      label: "Total de Membros",
      value: "1,234",
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      change: "+12%",
      trend: "up"
    },
    {
      label: "Publicações",
      value: "89",
      icon: FileText,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      change: "+5%",
      trend: "up"
    },
    {
      label: "Eventos",
      value: "24",
      icon: Calendar,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      change: "+18%",
      trend: "up"
    },
    {
      label: "Documentos",
      value: "156",
      icon: BookOpen,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      change: "+8%",
      trend: "up"
    }
  ];

  const recentActivities = [
    {
      action: "Publicação criada",
      item: "Relatório Anual 2024",
      time: "há 2 horas",
      type: "create"
    },
    {
      action: "Evento atualizado",
      item: "Conferência de Telecomunicações",
      time: "há 4 horas",
      type: "update"
    },
    {
      action: "Legislação adicionada",
      item: "Decreto Lei nº 45/2024",
      time: "há 6 horas",
      type: "create"
    },
    {
      action: "Galeria atualizada",
      item: "Fotos do Workshop",
      time: "ontem",
      type: "update"
    }
  ];

  const quickActions = [
    {
      label: "Nova Publicação",
      icon: FileText,
      action: () => setLocation("/admin/publications"),
      description: "Criar novo documento"
    },
    {
      label: "Criar Evento",
      icon: Calendar,
      action: () => setLocation("/admin/events"),
      description: "Agendar novo evento"
    },
    {
      label: "Adicionar Legislação",
      icon: BookOpen,
      action: () => setLocation("/admin/legislation"),
      description: "Incluir documento legal"
    },
    {
      label: "Galeria",
      icon: ImageIcon,
      action: () => setLocation("/admin/gallery"),
      description: "Gerenciar imagens"
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Dashboard" 
        description="Visão geral do sistema administrativo da ANPERE"
        action={
          <Button onClick={handleSeedData} className="gap-2" data-testid="button-seed-data">
            <Database className="w-4 h-4" />
            Criar Dados de Exemplo
          </Button>
        }
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover-elevate">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {stat.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas alterações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.item} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Operações frequentes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto p-4"
                    onClick={action.action}
                    data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <action.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Informações sobre o estado atual da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
                <p className="text-sm font-medium">Sistema Online</p>
                <p className="text-xs text-muted-foreground">Funcionando normalmente</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2" />
                <p className="text-sm font-medium">Base de Dados</p>
                <p className="text-xs text-muted-foreground">Conectada e estável</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2" />
                <p className="text-sm font-medium">Backup</p>
                <p className="text-xs text-muted-foreground">Última: hoje 03:00</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2" />
                <p className="text-sm font-medium">Segurança</p>
                <p className="text-xs text-muted-foreground">SSL ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;