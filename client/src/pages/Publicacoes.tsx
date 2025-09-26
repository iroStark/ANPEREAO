import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import { FileText, Download, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Publicacoes = () => {
  const publications = [
    {
      title: "Plano de Actividades 2024",
      description: "Planeamento estratégico das actividades da ANPERE para o ano de 2024",
      category: "Plano",
      date: "Janeiro 2024",
      size: "2.4 MB",
      downloads: 245,
    },
    {
      title: "Relatório Anual 2023",
      description: "Relatório completo das actividades e conquistas do ano anterior",
      category: "Relatório",
      date: "Março 2024",
      size: "5.8 MB", 
      downloads: 189,
    },
    {
      title: "Acta da Assembleia Geral",
      description: "Acta da última Assembleia Geral Ordinária da Associação",
      category: "Acta",
      date: "Dezembro 2023",
      size: "1.2 MB",
      downloads: 98,
    },
    {
      title: "Comunicado - Novas Regulamentações",
      description: "Informações sobre as novas regulamentações do sector das telecomunicações",
      category: "Comunicado",
      date: "Novembro 2023",
      size: "850 KB",
      downloads: 312,
    },
    {
      title: "Guia do Profissional ANPERE",
      description: "Manual completo com direitos, deveres e benefícios dos associados",
      category: "Guia",
      date: "Outubro 2023",
      size: "3.1 MB",
      downloads: 156,
    },
    {
      title: "Newsletter Trimestral Q4",
      description: "Boletim informativo com as principais notícias do último trimestre",
      category: "Newsletter",
      date: "Dezembro 2023",
      size: "1.8 MB",
      downloads: 203,
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Plano": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Relatório": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      "Acta": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Comunicado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Guia": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Newsletter": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Publicações
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Aceda aos documentos oficiais, relatórios, comunicados e outras 
              publicações importantes da ANPERE.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-8 h-8 text-primary" />
                      <Badge className={getCategoryColor(pub.category)}>
                        {pub.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {pub.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm line-clamp-3">
                      {pub.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {pub.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        {pub.downloads}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {pub.size}
                      </span>
                      <Button size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
    </div>
  );
};

export default Publicacoes;