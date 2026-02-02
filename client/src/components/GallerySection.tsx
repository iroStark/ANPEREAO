import { useState } from "react";
import { HPHCard, HPHCardHeader, HPHCardContent, HPHButton, HPHBadge } from '@/components/ui/hph';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // HPHModal does not fit here as we need a custom DialogContent for image viewing without standard modal framing
import { ArrowLeft01Icon as ChevronLeft, ArrowRight01Icon as ChevronRight, ViewIcon as Eye, Calendar03Icon as Calendar, Image01Icon as ImageIcon, Cancel01Icon as X } from "hugeicons-react";
import { useGallery, GalleryItem } from "@/hooks/useGallery";


const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const { data: galleryItems = [], isLoading, error } = useGallery();

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url;
  };

  // Map categories from real data
  const galleryCategories = [
    { name: "Todos", value: "all", count: galleryItems.length },
    ...Array.from(new Set(galleryItems.map(item => item.category)))
      .map(category => ({ 
        name: category, 
        value: category.toLowerCase().replace(/\s+/g, '-'), 
        count: galleryItems.filter(item => item.category === category).length 
      }))
  ];

  const filteredPhotos = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(photo => photo.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-gallery-title">
            Galeria
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-intro">
            Momentos especiais e atividades da ANPERE capturados em imagens
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {galleryCategories.map((category) => (
            <HPHButton
              key={category.value}
              variant={selectedCategory === category.value ? "primary" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
              data-testid={`button-gallery-filter-${category.value}`}
            >
              {category.name}
              <HPHBadge variant={selectedCategory === category.value ? "primary" : "gray"} className="text-xs">
                {category.count}
              </HPHBadge>
            </HPHButton>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando galeria...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Erro ao carregar galeria: {error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma imagem encontrada na galeria</p>
          </div>
        )}

        {/* Photo Grid */}
        {!isLoading && !error && filteredPhotos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <HPHCard 
                key={photo.id} 
                className="overflow-hidden group cursor-pointer"
                onClick={() => photo.mediaUrl && setSelectedPhoto(photo)}
                hover
              >
                <HPHCardContent className="p-0">
                  <div className="relative aspect-video bg-muted">
                    {/* Real Image or Placeholder */}
                    {photo.mediaUrl ? (
                      <>
                        <img
                          src={getImageUrl(photo.mediaUrl)}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const sibling = target.nextElementSibling as HTMLElement;
                            if (sibling) sibling.classList.remove('hidden');
                          }}
                        />
                        {/* Overlay melhorado */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <HPHButton
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhoto(photo);
                              }}
                              data-testid={`button-view-photo-${photo.id}`}
                              className="backdrop-blur-sm bg-white/90 hover:bg-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Imagem
                            </HPHButton>
                          </div>
                        </div>
                      </>
                    ) : null}
                    
                    {/* Fallback placeholder */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10 flex items-center justify-center ${photo.mediaUrl ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ImageIcon className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Imagem da galeria</p>
                      </div>
                    </div>
                  </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-photo-title-${photo.id}`}>
                    {photo.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`text-photo-description-${photo.id}`}>
                    {photo.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(photo.date).toLocaleDateString('pt-PT')}
                  </div>
                </div>
              </HPHCardContent>
              </HPHCard>
            ))}
          </div>
        )}

        {/* Load More Button - Hidden for now, can be implemented later with pagination */}
        {filteredPhotos.length > 9 && (
          <div className="text-center mt-12">
            <HPHButton variant="outline" data-testid="button-load-more-photos">
              Carregar Mais Fotos
            </HPHButton>
          </div>
        )}
        
        {/* Photo Modal - Visualização Ampliada */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-7xl w-full max-h-[95vh] p-0 gap-0">
            {selectedPhoto && (
              <div className="relative">
                {/* Botão de fechar */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                  aria-label="Fechar"
                  data-testid="button-close-modal"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Imagem ampliada */}
                <div className="relative w-full max-h-[85vh] flex items-center justify-center bg-black/95">
                  {selectedPhoto.mediaUrl ? (
                    <img
                      src={getImageUrl(selectedPhoto.mediaUrl)}
                      alt={selectedPhoto.title}
                      className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load in modal
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const sibling = target.nextElementSibling as HTMLElement;
                        if (sibling) sibling.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback placeholder for modal */}
                  <div className={`w-full h-full min-h-[400px] flex items-center justify-center ${selectedPhoto.mediaUrl ? 'hidden' : ''}`}>
                    <div className="text-center text-white">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{selectedPhoto.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedPhoto.date && new Date(selectedPhoto.date).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Informações da imagem */}
                <div className="bg-background p-6 border-t">
                  <DialogHeader>
                    <DialogTitle data-testid="text-modal-photo-title" className="text-2xl font-bold mb-2">
                      {selectedPhoto.title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {selectedPhoto.description || "Sem descrição disponível."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPhoto.date).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <HPHBadge variant="gray">{selectedPhoto.category}</HPHBadge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;