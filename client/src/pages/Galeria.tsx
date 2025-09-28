import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { ImageIcon, Play, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGallery } from "@/hooks/useGallery";

const Galeria = () => {
  const { data: galleryItems = [], isLoading, error } = useGallery();

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Evento': 'bg-blue-100 text-blue-800',
      'Palestra': 'bg-green-100 text-green-800',
      'Cerimónia': 'bg-purple-100 text-purple-800',
      'Workshop': 'bg-orange-100 text-orange-800',
      'Entrevista': 'bg-pink-100 text-pink-800',
      'Visita': 'bg-cyan-100 text-cyan-800',
      'Assembleia': 'bg-indigo-100 text-indigo-800',
      'Formação': 'bg-yellow-100 text-yellow-800',
      'Networking': 'bg-teal-100 text-teal-800',
      'Outro': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Outro'];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar galeria: {error.message}</p>
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

      {/* Loading State */}
      {isLoading && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">Carregando galeria...</p>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    <CardContent className="p-0">
                      {/* Media Display */}
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {item.mediaUrl ? (
                              <video 
                                src={item.mediaUrl} 
                                className="w-full h-full object-cover"
                                controls
                              />
                            ) : (
                              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Play className="w-8 h-8 text-primary ml-1" />
                              </div>
                            )}
                          </div>
                        ) : (
                          item.mediaUrl ? (
                            <img 
                              src={item.mediaUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          )
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getCategoryColor(item.category)} border-0`}>
                            {item.category}
                          </Badge>
                        </div>

                        {/* Duration Badge for Videos */}
                        {item.type === 'video' && item.duration && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-black/50 text-white border-0">
                              {item.duration}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {item.description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date}</span>
                            </div>
                            {item.views && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{item.views}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {galleryItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-12"
              >
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  Galeria Vazia
                </h3>
                <p className="text-muted-foreground">
                  Ainda não há itens na galeria. Volte em breve para ver os nossos conteúdos!
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Galeria;