import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  UserGroupIcon as Users,
  File02Icon as FileText,
  Calendar03Icon as Calendar,
  Image01Icon as ImageIcon,
  TradeUpIcon as TrendingUp,
  Activity01Icon as Activity,
  Add01Icon as Plus,
  ChartHistogramIcon as BarChart3,
  Clock01Icon as Clock,
  CheckmarkCircle02Icon as CheckCircle,
  Comment01Icon as MessageSquare
} from "hugeicons-react";
import { useMembers } from '@/hooks/useMembers';
import { usePublications } from '@/hooks/usePublications';
import { useEvents } from '@/hooks/useEvents';
import { useLegislation } from '@/hooks/useLegislation';
import { useReportsAdmin } from '@/hooks/useReports';
import { useGallery } from '@/hooks/useGallery';
import { useContactMessages } from '@/hooks/useContactMessages';
import { useAllActivityPlansAdmin } from '@/hooks/useActivityPlan';
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isValid, parseISO } from 'date-fns';

const safeFormatDistance = (dateStr: string | null | undefined) => {
  if (!dateStr) return 'sem data';
  const date = new Date(dateStr);
  if (!isValid(date)) return 'data inválida';
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Buscar dados reais
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: publications = [], isLoading: publicationsLoading } = usePublications();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: legislation = [], isLoading: legislationLoading } = useLegislation();
  const { data: reports = [], isLoading: reportsLoading } = useReportsAdmin();
  const { data: gallery = [], isLoading: galleryLoading } = useGallery();
  const { data: contactMessages = [], isLoading: messagesLoading } = useContactMessages();
  const { data: activityPlans = [], isLoading: plansLoading } = useAllActivityPlansAdmin();

  // Calcular estatísticas reais
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const pendingMembers = members.filter(m => m.status === 'pending').length;
    
    const totalPublications = publications.length;
    const totalReports = reports.length;
    const totalEvents = events.length;
    const totalLegislation = legislation.length;
    const totalDocuments = totalReports + totalLegislation + activityPlans.length;
    
    // Calcular mudanças (comparar com mês anterior - simplificado)
    const membersThisMonth = members.filter(m => {
      const regDate = new Date(m.registrationDate);
      const now = new Date();
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length;
    
    return [
    {
      label: 'Total de Membros',
        value: totalMembers.toLocaleString('pt-AO'),
        subtitle: `${activeMembers} ativos, ${pendingMembers} pendentes`,
      color: 'bg-blue-500',
      icon: Users,
    },
    {
      label: 'Publicações',
        value: totalPublications.toLocaleString('pt-AO'),
        subtitle: `${reports.length} relatórios`,
      color: 'bg-green-500',
      icon: FileText,
    },
    {
      label: 'Eventos',
        value: totalEvents.toLocaleString('pt-AO'),
        subtitle: `${events.filter(e => new Date(e.date) >= new Date()).length} próximos`,
      color: 'bg-purple-500',
      icon: Calendar,
    },
    {
      label: 'Documentos',
        value: totalDocuments.toLocaleString('pt-AO'),
        subtitle: `${totalLegislation} legislações`,
      color: 'bg-orange-500',
      icon: ImageIcon,
      }
    ];
  }, [members, publications, reports, events, legislation, activityPlans]);

  // Gerar atividades recentes baseadas em dados reais
  const recentActivities = useMemo(() => {
    const activities: Array<{
      action: string;
      item: string;
      time: string;
      type: 'create' | 'update';
      date: Date;
    }> = [];

    // Membros recentes
    members.slice(0, 3).forEach(member => {
      activities.push({
        action: 'Membro registrado',
        item: member.fullName,
        time: safeFormatDistance(member.registrationDate),
        type: 'create',
        date: member.registrationDate ? new Date(member.registrationDate) : new Date(0),
      });
    });

    // Publicações recentes
    publications.slice(0, 2).forEach(pub => {
      const pubDate = pub.publishedAt || pub.date || pub.updatedAt || new Date().toISOString();
      activities.push({
      action: 'Publicação criada',
        item: pub.title,
        time: safeFormatDistance(pubDate),
        type: 'create',
        date: new Date(pubDate),
      });
    });

    // Eventos recentes
    events.slice(0, 2).forEach(event => {
      // Don't use event.date as it might be a display string (e.g. "15 de Junho")
      const eventDate = event.publishedAt || event.updatedAt || new Date().toISOString();
      activities.push({
        action: 'Evento criado',
        item: event.title,
        time: safeFormatDistance(eventDate),
        type: 'create',
        date: new Date(eventDate),
      });
    });

    // Legislação recente
    legislation.slice(0, 1).forEach(leg => {
      const legDate = leg.publishedAt || leg.updatedAt || new Date().toISOString();
      activities.push({
      action: 'Legislação adicionada',
        item: leg.title,
        time: safeFormatDistance(legDate),
        type: 'create',
        date: new Date(legDate),
      });
    });

    // Ordenar por data (mais recente primeiro) e pegar os 6 primeiros
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6)
      .map(({ date, ...rest }) => rest);
  }, [members, publications, events, legislation]);

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
      icon: FileText,
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
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        {stat.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {stat.subtitle}
                          </p>
                        )}
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
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma atividade recente</p>
                  </div>
                )}
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
                    onClick={() => setLocation(action.href)}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left cursor-pointer"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{members.filter(m => m.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Membros Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{members.filter(m => m.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground">Candidaturas Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{contactMessages.length}</div>
                <div className="text-sm text-muted-foreground">Mensagens de Contacto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gallery.length}</div>
                <div className="text-sm text-muted-foreground">Itens na Galeria</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;








