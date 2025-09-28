import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { FileText, Download, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublications } from "@/hooks/usePublications";

const Publicacoes = () => {
  const { data: publications = [], isLoading, error } = usePublications();

  const getCategoryColor = (category: string) => {
    const colors = {
      "Plano": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Relatório": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      "Acta": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Comunicado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Guia": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Newsletter": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "Manual": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Estudo": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      "Boletim": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "Circular": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar publicações: {error.message}</p>
        </div>
        <Footer />
      </div>
    );
  }

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
            className="text-center mt-[48px] mb-[48px]"
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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando publicações...</p>
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma publicação disponível no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.id}
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
                        {pub.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {new Date(pub.publishedAt).toLocaleDateString('pt-PT')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Documento
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