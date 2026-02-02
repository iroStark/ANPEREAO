import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { File02Icon as FileText, Download01Icon as Download, Calendar03Icon as Calendar, ViewIcon as Eye, Task01Icon as ClipboardList, FileValidationIcon as FileCheck, Megaphone01Icon as Megaphone, ArrowRight01Icon as ChevronRight, Search01Icon as Search, Layers01Icon as Layers } from "hugeicons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HPHInput } from "@/components/ui/hph";
import { usePublications } from "@/hooks/usePublications";
import { useReports } from "@/hooks/useReports";
import { useAllActivityPlans } from "@/hooks/useActivityPlan";

type PublicationItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  type: 'plano' | 'relatorio' | 'acta' | 'comunicado' | 'evento';
  fileUrl?: string;
  downloadUrl?: string;
  publishedAt?: string;
  planId?: string; // Para planos de atividades
};

const Publicacoes = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: publications = [], isLoading: publicationsLoading } = usePublications();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: activityPlans = [], isLoading: plansLoading } = useAllActivityPlans();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Plano": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Relatório": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      "Acta": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Comunicado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Evento": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Guia": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Newsletter": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "Manual": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Estudo": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      "Boletim": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "Circular": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  // Transformar planos de atividades em itens de publicação
  const planItems: PublicationItem[] = activityPlans.map(plan => ({
    id: plan.id,
    title: `${plan.title} ${plan.year}`,
    description: plan.description || `Plano de atividades da ANPERE para o ano de ${plan.year}`,
    category: "Plano",
    date: plan.year,
    type: 'plano',
    planId: plan.id,
  }));

  // Transformar relatórios em itens de publicação
  const reportItems: PublicationItem[] = reports.map(report => ({
    id: report.id,
    title: report.title,
    description: report.description,
    category: "Relatório",
    date: report.period,
    type: 'relatorio',
    fileUrl: report.fileUrl,
  }));

  // Extrair itens individuais dos planos de atividades (Eventos)
  const eventItems: PublicationItem[] = activityPlans.flatMap(plan => 
    (plan.items || []).map(item => ({
      id: `event-${item.id}`,
      title: item.activity,
      description: `Evento previsto no Plano de Atividades ${plan.year}. Local: ${item.location || 'A definir'}. Horário: ${item.time || 'A definir'}.`,
      category: "Evento",
      date: item.date || plan.year,
      type: 'evento',
      planId: plan.id,
    }))
  );

  // Filtrar actas e comunicados das publicações
  const actaItems: PublicationItem[] = publications
    .filter(pub => pub.category === "Acta" || pub.category === "Acta de Reunião")
    .map(pub => ({
      id: pub.id,
      title: pub.title,
      description: pub.description,
      category: pub.category,
      date: pub.date,
      type: 'acta' as const,
      fileUrl: pub.fileUrl,
      downloadUrl: pub.downloadUrl,
      publishedAt: pub.publishedAt,
    }));

  const comunicadoItems: PublicationItem[] = publications
    .filter(pub => pub.category === "Comunicado")
    .map(pub => ({
      id: pub.id,
      title: pub.title,
      description: pub.description,
      category: pub.category,
      date: pub.date,
      type: 'comunicado' as const,
      fileUrl: pub.fileUrl,
      downloadUrl: pub.downloadUrl,
      publishedAt: pub.publishedAt,
    }));

  // Combinar todos os itens
  const allItems: PublicationItem[] = [
    ...planItems,
    ...reportItems,
    ...eventItems,
    ...actaItems,
    ...comunicadoItems,
  ];

  // Filtrar por consulta e tipo
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      switch(selectedFilter) {
        case 'planos': matchesFilter = item.type === 'plano'; break;
        case 'relatorios': matchesFilter = item.type === 'relatorio'; break;
        case 'actas': matchesFilter = item.type === 'acta'; break;
        case 'comunicados': matchesFilter = item.type === 'comunicado'; break;
        case 'eventos': matchesFilter = item.type === 'evento'; break;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  // Ordenar por data (mais recente primeiro)
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const isLoading = publicationsLoading || reportsLoading || plansLoading;

  const filterOptions = [
    { value: 'all', label: 'Todos', icon: <Layers className="w-4 h-4" />, count: allItems.length },
    { value: 'planos', label: 'Planos', icon: <ClipboardList className="w-4 h-4" />, count: planItems.length },
    { value: 'eventos', label: 'Eventos', icon: <Calendar className="w-4 h-4" />, count: eventItems.length },
    { value: 'relatorios', label: 'Relatórios', icon: <FileCheck className="w-4 h-4" />, count: reportItems.length },
    { value: 'actas', label: 'Actas', icon: <FileText className="w-4 h-4" />, count: actaItems.length },
    { value: 'comunicados', label: 'Comunicados', icon: <Megaphone className="w-4 h-4" />, count: comunicadoItems.length },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <FloatingMenu />
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-24 pb-8 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-4 md:mt-[48px] mb-8 md:mb-[48px]"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Publicações
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Aceda aos documentos oficiais, planos de atividades, relatórios anuais, 
              actas de reunião, comunicados e outras publicações importantes da ANPERE.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-6 md:py-8 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div className="max-w-2xl mx-auto">
            <HPHInput
              placeholder="Pesquisar publicações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                onClick={() => setSelectedFilter(option.value)}
                className="gap-2 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
              >
                {option.icon}
                {option.label}
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px] md:text-xs">
                  {option.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando publicações...</p>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma publicação disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        {item.type === 'plano' && <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                        {item.type === 'evento' && <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                        {item.type === 'relatorio' && <FileCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                        {item.type === 'acta' && <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                        {item.type === 'comunicado' && <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
                        {!['plano', 'evento', 'relatorio', 'acta', 'comunicado'].includes(item.type) && (
                        <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        )}
                        <Badge className={`${getCategoryColor(item.category)} text-[10px] md:text-xs`}>
                          {item.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-xs md:text-sm line-clamp-3">
                        {item.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </div>
                        {item.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {new Date(item.publishedAt).toLocaleDateString('pt-PT')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-3 sm:gap-0 border-t mt-2">
                        {item.type === 'plano' ? (
                          <>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              Visualizar Plano
                            </span>
                            <Button size="sm" className="w-full sm:w-auto gap-2" asChild>
                              <Link href={`/plano-atividades?id=${item.planId}`}>
                                <Eye className="w-4 h-4" />
                                Ver Plano
                              </Link>
                            </Button>
                          </>
                        ) : item.type === 'evento' ? (
                          <>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              Detalhes do Evento
                            </span>
                            <Button size="sm" className="w-full sm:w-auto gap-2" variant="outline" asChild>
                              <Link href={`/plano-atividades?id=${item.planId}`}>
                                <Eye className="w-4 h-4" />
                                Ver no Plano
                              </Link>
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {item.fileUrl || item.downloadUrl ? 'Documento' : 'Informação'}
                            </span>
                            {item.fileUrl || item.downloadUrl ? (
                              <Button size="sm" className="w-full sm:w-auto gap-2" asChild>
                                <a 
                                  href={item.downloadUrl || item.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                              <Download className="w-4 h-4" />
                              Download
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="w-full sm:w-auto gap-2" disabled>
                                <FileText className="w-4 h-4" />
                                Sem arquivo
                            </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Mantenha-se Informado
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscreva a nossa newsletter para receber as últimas publicações 
              e atualizações importantes diretamente no seu email.
            </p>
            <Button size="lg" data-testid="button-subscribe">
              Subscrever Newsletter
            </Button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Publicacoes;
