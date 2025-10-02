import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  FileText,
  Calendar,
  ImageIcon,
  Database,
  TrendingUp,
  Activity,
  Plus,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();

  const handleSeedData = async () => {
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Dados criados com sucesso!',
          description: 'Os dados de exemplo foram adicionados ao sistema.',
        });
      } else {
        throw new Error('Failed to seed data');
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar dados',
        description: 'Não foi possível criar os dados de exemplo.',
        variant: 'destructive',
      });
    }
  };

  const stats = [
    {
      label: 'Total de Membros',
      value: '1,234',
      change: '+12%',
      color: 'bg-blue-500',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Publicações',
      value: '89',
      change: '+5%',
      color: 'bg-green-500',
      icon: FileText,
      trend: 'up'
    },
    {
      label: 'Eventos',
      value: '24',
      change: '+18%',
      color: 'bg-purple-500',
      icon: Calendar,
      trend: 'up'
    },
    {
      label: 'Documentos',
      value: '156',
      change: '+8%',
      color: 'bg-orange-500',
      icon: ImageIcon,
      trend: 'up'
    }
  ];

  const recentActivities = [
    {
      action: 'Publicação criada',
      item: 'Relatório Anual 2024',
      time: 'há 2 horas',
      type: 'create'
    },
    {
      action: 'Evento atualizado',
      item: 'Conferência de Telecomunicações',
      time: 'há 4 horas',
      type: 'update'
    },
    {
      action: 'Legislação adicionada',
      item: 'Decreto Lei nº 45/2024',
      time: 'há 6 horas',
      type: 'create'
    },
    {
      action: 'Galeria atualizada',
      item: 'Fotos do Workshop',
      time: 'ontem',
      type: 'update'
    }
  ];

  const quickActions = [
    {
      label: 'Nova Publicação',
      icon: FileText,
      href: '/admin/publications',
      description: 'Criar novo documento'
    },
    {
      label: 'Criar Evento',
      icon: Calendar,
      href: '/admin/events',
      description: 'Agendar novo evento'
    },
    {
      label: 'Adicionar Legislação',
      icon: Database,
      href: '/admin/legislation',
      description: 'Incluir documento legal'
    },
    {
      label: 'Galeria',
      icon: ImageIcon,
      href: '/admin/gallery',
      description: 'Gerenciar imagens'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema administrativo da ANPERE
            </p>
          </div>
          <Button onClick={handleSeedData} className="gap-2" data-testid="button-seed-data">
            <Database className="w-4 h-4" />
            Criar Dados de Exemplo
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {stat.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} flex-shrink-0`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.item}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Visão Geral dos Dados
            </CardTitle>
            <CardDescription>
              Estatísticas e tendências do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Uptime do Sistema</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2.4k</div>
                <div className="text-sm text-muted-foreground">Visualizações Mensais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;




