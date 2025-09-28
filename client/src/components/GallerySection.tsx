import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Eye, Calendar, ImageIcon } from "lucide-react";
import { useGallery, GalleryItem } from "@/hooks/useGallery";


const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const { data: galleryItems = [], isLoading, error } = useGallery();

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
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
              data-testid={`button-gallery-filter-${category.value}`}
            >
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
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
              <Card key={photo.id} className="overflow-hidden hover-elevate group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-muted">
                    {/* Real Image or Placeholder */}
                    {photo.mediaUrl ? (
                      <img
                        src={photo.mediaUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const sibling = target.nextElementSibling as HTMLElement;
                          if (sibling) sibling.classList.remove('hidden');
                        }}
                      />
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
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedPhoto(photo)}
                        data-testid={`button-view-photo-${photo.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Imagem
                      </Button>
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
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Load More Button - Hidden for now, can be implemented later with pagination */}
        {filteredPhotos.length > 9 && (
          <div className="text-center mt-12">
            <Button variant="outline" data-testid="button-load-more-photos">
              Carregar Mais Fotos
            </Button>
          </div>
        )}
        
        {/* Photo Modal */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle data-testid="text-modal-photo-title">
                {selectedPhoto?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {selectedPhoto?.mediaUrl ? (
                <img
                  src={selectedPhoto.mediaUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
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
              <div className={`w-full h-full flex items-center justify-center ${selectedPhoto?.mediaUrl ? 'hidden' : ''}`}>
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{selectedPhoto?.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedPhoto?.date && new Date(selectedPhoto.date).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;