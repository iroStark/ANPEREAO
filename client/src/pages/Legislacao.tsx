import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Gavel, Scale } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Legislacao = () => {
  const legislationItems = [
    {
      title: "Lei das Comunicações Electrónicas",
      description: "Lei fundamental que regula o sector das comunicações electrónicas em Angola",
      category: "Lei Principal",
      year: "2023",
      icon: Scale,
    },
    {
      title: "Regulamento do Espectro Radioeléctrico",
      description: "Regulamentação específica para gestão e atribuição do espectro de frequências",
      category: "Regulamento",
      year: "2022", 
      icon: FileText,
    },
    {
      title: "Código de Conduta Profissional",
      description: "Normas éticas e deontológicas para profissionais do sector",
      category: "Código",
      year: "2023",
      icon: Gavel,
    },
    {
      title: "Decretos Executivos",
      description: "Conjunto de decretos que complementam a legislação principal",
      category: "Decreto",
      year: "2023",
      icon: BookOpen,
    }
  ];

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
          <div className="grid md:grid-cols-2 gap-6">
            {legislationItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className="w-8 h-8 text-primary" />
                      <Badge variant="secondary">{item.year}</Badge>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {item.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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