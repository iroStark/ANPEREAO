import { useState } from "react";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { BookOpen01Icon as BookOpen, File02Icon as FileText, Legal02Icon as Gavel, Legal01Icon as Scale, Building04Icon as Building, Calendar03Icon as Calendar, Search01Icon as Search, FilterIcon as Filter } from "hugeicons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HPHInput, HPHSelect } from "@/components/ui/hph";
import { useLegislation } from "@/hooks/useLegislation";

const Legislacao = () => {
  const { data: legislations = [], isLoading, error } = useLegislation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(legislations.map(l => l.category)))];

  // Função para obter ícone baseado no nome
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Scale,
      FileText,
      Gavel,
      BookOpen,
      Building,
      Calendar,
    };
    return icons[iconName] || Scale;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar legislações: {error.message}</p>
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
              Legislação
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conheça o quadro legal que regula o sector das comunicações electrónicas 
              e as normas que orientam os profissionais da ANPERE.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Legislation Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1">
              <HPHInput
                placeholder="Pesquisar legislação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="w-full md:w-64">
              <HPHSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                icon={<Filter className="w-5 h-5" />}
                options={categories.map(cat => ({
                  value: cat,
                  label: cat === 'all' ? 'Todas as Categorias' : cat
                }))}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando legislações...</p>
            </div>
          ) : legislations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma legislação disponível no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {legislations
                .filter(item => {
                  const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                       item.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((item, index) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover-elevate">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className="w-8 h-8 text-primary" />
                          <Badge variant="secondary">{item.year}</Badge>
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <Badge variant="outline" className="w-fit">
                          {item.category}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          {item.description}
                        </CardDescription>
                        {item.category === "Estatuto" && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            asChild
                          >
                            <a href={`/estatutos?id=${item.id}`}>
                              Ver Estatutos
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* Additional Information */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Mantenha-se Atualizado
            </h2>
            <p className="text-muted-foreground mb-6">
              A legislação do sector está em constante evolução. Acompanhe as atualizações 
              e alterações através dos nossos canais oficiais.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Legislacao;