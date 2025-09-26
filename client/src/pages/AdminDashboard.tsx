import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "about", label: "Quem Somos", icon: Users },
    { id: "legislation", label: "Legislação", icon: BookOpen },
    { id: "publications", label: "Publicações", icon: FileText },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "gallery", label: "Galeria", icon: Image },
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg lg:relative lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Admin ANPERE</h2>
                <p className="text-xs text-muted-foreground">Gestão de Conteúdo</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.username}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setActiveSection(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Terminar Sessão
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerir conteúdo do sistema ANPERE
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Sistema Ativo
            </Badge>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="grid lg:grid-cols-2 gap-6">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </CardTitle>
                <CardDescription>
                  Gestão de {sidebarItems.find(item => item.id === activeSection)?.label?.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                  <p className="text-muted-foreground mb-4">
                    Esta secção será implementada na próxima fase.
                  </p>
                  <Button variant="outline" onClick={() => setActiveSection("dashboard")}>
                    Voltar ao Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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