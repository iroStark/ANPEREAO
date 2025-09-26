import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { ImageIcon, Play, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Galeria = () => {
  const galleryItems = [
    {
      type: "image",
      title: "Conferência Nacional de Telecomunicações 2023",
      description: "Momentos marcantes da conferência anual que reuniu mais de 300 profissionais",
      date: "Junho 2023",
      category: "Evento",
      views: 1250,
      thumbnail: "placeholder-conference.jpg"
    },
    {
      type: "video", 
      title: "Apresentação: O Futuro do 5G em Angola",
      description: "Palestra técnica sobre implementação e perspectivas da tecnologia 5G",
      date: "Maio 2023",
      category: "Palestra",
      views: 890,
      duration: "45 min",
      thumbnail: "placeholder-5g-presentation.jpg"
    },
    {
      type: "image",
      title: "Cerimónia de Posse da Nova Diretoria",
      description: "Registo fotográfico da cerimónia de posse dos novos dirigentes",
      date: "Abril 2023",
      category: "Cerimónia",
      views: 675,
      thumbnail: "placeholder-ceremony.jpg"
    },
    {
      type: "image",
      title: "Workshop: Cibersegurança nas Telecomunicações", 
      description: "Sessão prática sobre segurança em redes de telecomunicações",
      date: "Março 2023",
      category: "Workshop",
      views: 420,
      thumbnail: "placeholder-cybersecurity.jpg"
    },
    {
      type: "video",
      title: "Entrevista: Regulamentação do Sector",
      description: "Entrevista com especialistas sobre as novas regulamentações",
      date: "Fevereiro 2023",
      category: "Entrevista", 
      views: 1100,
      duration: "32 min",
      thumbnail: "placeholder-interview.jpg"
    },
    {
      type: "image",
      title: "Visita Técnica às Instalações da ITEL",
      description: "Visita educativa dos associados às instalações técnicas",
      date: "Janeiro 2023",
      category: "Visita",
      views: 320,
      thumbnail: "placeholder-visit.jpg"
    },
    {
      type: "image",
      title: "Assembleia Geral Ordinária 2023",
      description: "Registo da assembleia geral anual dos membros",
      date: "Dezembro 2022",
      category: "Assembleia",
      views: 250,
      thumbnail: "placeholder-assembly.jpg"
    },
    {
      type: "video",
      title: "Documentário: História da ANPERE",
      description: "Documentário sobre a fundação e evolução da associação",
      date: "Novembro 2022",
      category: "Documentário",
      views: 1500,
      duration: "28 min",
      thumbnail: "placeholder-documentary.jpg"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Evento": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Palestra": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Cerimónia": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Workshop": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Entrevista": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Visita": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Assembleia": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "Documentário": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
              Galeria
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore os momentos mais marcantes da ANPERE através de fotografias, 
              vídeos e registos dos nossos eventos e atividades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2"
          >
            <Badge variant="default" className="whitespace-nowrap cursor-pointer">
              Todos
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover-elevate">
              Imagens
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover-elevate">
              Vídeos
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover-elevate">
              Eventos
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover-elevate">
              Workshops
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                data-testid={`gallery-item-${index}`}
              >
                <Card className="overflow-hidden hover-elevate">
                  <div className="relative aspect-video bg-muted">
                    {/* Placeholder for image/video thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      {item.type === "video" ? (
                        <div className="relative">
                          <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                          <Play className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                      ) : (
                        <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                      )}
                    </div>
                    
                    {/* Category Badge */}
                    <Badge 
                      className={`absolute top-2 left-2 text-xs ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </Badge>
                    
                    {/* Video Duration */}
                    {item.type === "video" && item.duration && (
                      <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs">
                        {item.duration}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Load More */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-6">
              Mostrando 8 de 24 itens
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              data-testid="button-load-more"
            >
              Carregar Mais
            </motion.button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Galeria;