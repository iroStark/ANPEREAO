import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";

// Todo: remove mock functionality - replace with real gallery data
const galleryCategories = [
  { name: "Todos", value: "all", count: 12 },
  { name: "Eventos", value: "events", count: 8 },
  { name: "Seminários", value: "seminars", count: 4 },
  { name: "Reuniões", value: "meetings", count: 6 },
  { name: "Formações", value: "training", count: 3 },
];

const photos = [
  {
    id: 1,
    title: "Assembleia Geral 2024",
    category: "events",
    date: "2024-02-15",
    image: "/api/placeholder/400/300",
    description: "Assembleia geral com presença de todos os associados"
  },
  {
    id: 2,
    title: "Workshop 5G",
    category: "seminars",
    date: "2024-01-20",
    image: "/api/placeholder/400/300",
    description: "Workshop técnico sobre tecnologias 5G"
  },
  {
    id: 3,
    title: "Reunião Diretoria",
    category: "meetings",
    date: "2024-01-10",
    image: "/api/placeholder/400/300",
    description: "Reunião mensal da diretoria da ANPERE"
  },
  {
    id: 4,
    title: "Formação Técnica",
    category: "training",
    date: "2023-12-15",
    image: "/api/placeholder/400/300",
    description: "Sessão de formação para profissionais"
  },
  {
    id: 5,
    title: "Evento de Confraternização",
    category: "events",
    date: "2023-12-10",
    image: "/api/placeholder/400/300",
    description: "Encontro social entre associados"
  },
  {
    id: 6,
    title: "Seminário Espectro Rádio",
    category: "seminars",
    date: "2023-11-25",
    image: "/api/placeholder/400/300",
    description: "Seminário sobre gestão do espectro radioelétrico"
  },
];

const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

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

        {/* Photo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover-elevate group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-8 h-8 text-primary" />
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

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" data-testid="button-load-more-photos">
            Carregar Mais Fotos
          </Button>
        </div>

        {/* Photo Modal */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle data-testid="text-modal-photo-title">
                {selectedPhoto?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{selectedPhoto?.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedPhoto?.date && new Date(selectedPhoto.date).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;