import { useState } from "react";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { Image01Icon as ImageIcon, PlayCircle02Icon as Play, Calendar03Icon as Calendar, ViewIcon as Eye, Cancel01Icon as X, ZoomInAreaIcon as ZoomIn, Layers01Icon as Layers, Video01Icon as Video, Task01Icon as ClipboardList, UserGroupIcon as Users, Search01Icon as Search } from "hugeicons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HPHInput } from "@/components/ui/hph";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGallery, type GalleryItem } from "@/hooks/useGallery";

const Galeria = () => {
  const { data: galleryItems = [], isLoading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState("");

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url;
  };

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
      'Ajuda Social': 'bg-red-100 text-red-800',
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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <FloatingMenu />
      {/* Hero Section */}
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
              Galeria
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore os momentos mais marcantes da ANPERE através de fotografias, 
              vídeos e registos dos nossos eventos e atividades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-4 md:py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto mb-6 md:mb-8">
            <HPHInput
              placeholder="Pesquisar galeria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex md:justify-center overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-3 md:gap-4 mb-4 md:mb-8 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { id: 'Todos', label: 'Todos', icon: <Layers className="w-4 h-4" /> },
              { id: 'Imagens', label: 'Imagens', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'Vídeos', label: 'Vídeos', icon: <Video className="w-4 h-4" /> },
              { id: 'Eventos', label: 'Eventos', icon: <Calendar className="w-4 h-4" /> },
              { id: 'Workshops', label: 'Workshops', icon: <Users className="w-4 h-4" /> },
              { id: 'Networking', label: 'Networking', icon: <Users className="w-4 h-4" /> },
            ].map((filter) => (
              <Badge 
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"} 
                className="whitespace-nowrap cursor-pointer hover-elevate py-2 px-4 gap-2 text-xs md:text-sm flex-shrink-0"
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.icon}
                {filter.label}
              </Badge>
            ))}
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
              {galleryItems
                .filter(item => {
                  const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                       item.description.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  let matchesFilter = true;
                  if (selectedFilter !== 'Todos') {
                    if (selectedFilter === 'Imagens') matchesFilter = item.type === 'image';
                    else if (selectedFilter === 'Vídeos') matchesFilter = item.type === 'video';
                    else matchesFilter = item.category === selectedFilter || item.category === selectedFilter.slice(0, -1);
                  }
                  
                  return matchesSearch && matchesFilter;
                })
                .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => item.mediaUrl && setSelectedImage(item)}
                  >
                    <CardContent className="p-0">
                      {/* Media Display */}
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden group">
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {item.mediaUrl ? (
                              <video 
                                src={getImageUrl(item.mediaUrl)} 
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
                            <>
                              <img 
                                src={getImageUrl(item.mediaUrl)} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {/* Overlay para indicar que é clicável */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="w-12 h-12 text-white" />
                              </div>
                            </>
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

      {/* Modal de Visualização Ampliada */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full max-h-[95vh] p-0 gap-0">
          {selectedImage && (
            <div className="relative">
              {/* Botão de fechar */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Mídia ampliada (imagem ou vídeo) */}
              <div className="relative w-full max-h-[90vh] flex items-center justify-center bg-black/95">
                {selectedImage.type === 'video' && selectedImage.mediaUrl ? (
                  <video 
                    src={getImageUrl(selectedImage.mediaUrl)}
                    controls
                    className="max-w-full max-h-[90vh] w-auto h-auto"
                  >
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                ) : (
                  <img 
                    src={getImageUrl(selectedImage.mediaUrl || '')} 
                    alt={selectedImage.title}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  />
                )}
              </div>
              
              {/* Informações da mídia */}
              <div className="bg-background p-6 border-t">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">{selectedImage.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {selectedImage.description || "Sem descrição disponível."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedImage.date}</span>
                  </div>
                  <Badge variant="outline">{selectedImage.category}</Badge>
                  {selectedImage.type === 'video' && selectedImage.duration && (
                    <Badge variant="secondary">Duração: {selectedImage.duration}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Galeria;