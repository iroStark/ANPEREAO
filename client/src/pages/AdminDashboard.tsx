import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdminPublications from "@/components/AdminPublications";
import AdminEvents from "@/components/AdminEvents";
import AdminLegislation from "@/components/AdminLegislation";
import AdminGallery from "@/components/AdminGallery";
import AdminAbout from "@/components/AdminAbout";
import { 
  Shield, 
  LogOut, 
  Users, 
  FileText, 
  Calendar, 
  Image,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  Database
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default
  const [activeSection, setActiveSection] = useState("dashboard");
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sessão Terminada",
        description: "Logout realizado com sucesso.",
      });
      setLocation("/admin/login");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

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

  const sidebarItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: BarChart3, 
      description: "Visão geral do sistema",
      badge: null
    },
    { 
      id: "about", 
      label: "Quem Somos", 
      icon: Users, 
      description: "Gestão da página institucional",
      badge: null
    },
    { 
      id: "legislation", 
      label: "Legislação", 
      icon: BookOpen, 
      description: "Documentos legais e regulamentações",
      badge: "8"
    },
    { 
      id: "publications", 
      label: "Publicações", 
      icon: FileText, 
      description: "Relatórios e documentos",
      badge: "12"
    },
    { 
      id: "events", 
      label: "Eventos", 
      icon: Calendar, 
      description: "Conferências e workshops",
      badge: "3"
    },
    { 
      id: "gallery", 
      label: "Galeria", 
      icon: Image, 
      description: "Fotos e imagens",
      badge: "28"
    },
  ];

  const stats = [
    { label: "Total de Publicações", value: "12", icon: FileText, color: "bg-blue-500" },
    { label: "Eventos Próximos", value: "3", icon: Calendar, color: "bg-green-500" },
    { label: "Itens na Galeria", value: "28", icon: Image, color: "bg-purple-500" },
    { label: "Legislações Ativas", value: "8", icon: BookOpen, color: "bg-orange-500" },
  ];

  const recentActivities = [
    { action: "Publicação criada", item: "Relatório Anual 2024", time: "há 2 horas" },
    { action: "Evento atualizado", item: "Conferência Nacional", time: "há 4 horas" },
    { action: "Legislação adicionada", item: "Nova Regulamentação", time: "há 1 dia" },
    { action: "Galeria atualizada", item: "Fotos do Workshop", time: "há 2 dias" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-card border-r border-border shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-primary rounded-xl shadow-lg flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm sm:text-lg text-foreground truncate">Admin ANPERE</h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Painel de Gestão</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-destructive/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">{user?.username}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Administrador</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              <div className="px-3 py-2 mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gestão de Conteúdo
                </h3>
              </div>
              
              {sidebarItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className={`w-full justify-start gap-2 sm:gap-4 h-10 sm:h-12 px-2 sm:px-4 transition-all duration-200 ${
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false); // Close sidebar on mobile after selection
                    }}
                    data-testid={`nav-${item.id}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${activeSection === item.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={activeSection === item.id ? "secondary" : "outline"}
                              className="ml-1 sm:ml-2 text-xs flex-shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 truncate hidden sm:block ${
                          activeSection === item.id 
                            ? 'text-primary-foreground/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Button>
              ))}
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="p-3 sm:p-4 border-t border-border bg-muted/20">
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full gap-2 h-8 sm:h-10 text-xs sm:text-sm"
                onClick={handleSeedData}
              >
                <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dados de Exemplo</span>
                <span className="sm:hidden">Exemplo</span>
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className="p-3 sm:p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2 sm:gap-3 h-8 sm:h-12 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive text-xs sm:text-sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="font-medium truncate">Terminar Sessão</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold truncate">
                  {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Gerir conteúdo do sistema ANPERE
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2 flex-shrink-0 hidden sm:flex">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Sistema Ativo
            </Badge>
          </div>
        </header>


        {/* Dashboard Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="space-y-4 sm:space-y-6 max-w-full">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                    <CardDescription>
                      Últimas alterações no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.item} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                      Operações frequentes do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => setActiveSection("publications")}
                      >
                        <FileText className="w-4 h-4" />
                        Nova Publicação
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => setActiveSection("events")}
                      >
                        <Calendar className="w-4 h-4" />
                        Criar Evento
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => setActiveSection("legislation")}
                      >
                        <BookOpen className="w-4 h-4" />
                        Adicionar Legislação
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full justify-start gap-3"
                        onClick={handleSeedData}
                      >
                        <Database className="w-4 h-4" />
                        Criar Dados de Exemplo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Publications Section */}
          {activeSection === "publications" && <AdminPublications />}

          {/* Events Section */}
          {activeSection === "events" && <AdminEvents />}

          {/* Legislation Section */}
          {activeSection === "legislation" && <AdminLegislation />}

          {/* Gallery Section */}
          {activeSection === "gallery" && <AdminGallery />}

          {/* About Section */}
          {activeSection === "about" && <AdminAbout />}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;