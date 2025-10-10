import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Play, Calendar, Tag, Eye } from "lucide-react";
import { type GalleryItem } from "@/hooks/useGallery";

interface GalleryViewDialogProps {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryViewDialog({
  item,
  open,
  onOpenChange,
}: GalleryViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {item && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.type === 'video' ? (
                    <Play className="w-6 h-6 text-primary" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{item.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    Detalhes completos do {item.type === 'video' ? 'vídeo' : 'imagem'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="space-y-6">
              {/* Type, Category and Date */}
              <div className="flex flex-wrap gap-3">
                <Badge variant={item.type === 'video' ? 'default' : 'secondary'} className="gap-1.5">
                  {item.type === 'video' ? <Play className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  {item.type === 'video' ? 'Vídeo' : 'Imagem'}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {item.category}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </Badge>
                {item.views !== undefined && (
                  <Badge variant="outline" className="gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {item.views} visualizações
                  </Badge>
                )}
              </div>

              {/* Media Preview */}
              {item.type === 'image' && item.mediaUrl && (
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title}
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                </div>
              )}

              {item.type === 'video' && item.thumbnailUrl && (
                <div className="rounded-lg overflow-hidden border relative">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Descrição
                </h3>
                <p className="text-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Video Duration */}
              {item.type === 'video' && item.duration && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Duração
                  </h3>
                  <p className="text-foreground">{item.duration}</p>
                </div>
              )}

              {/* Metadata */}
              {(item.publishedAt || item.updatedAt) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {item.publishedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Publicado em
                      </h3>
                      <p className="text-sm">
                        {new Date(item.publishedAt).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {item.updatedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Atualizado em
                      </h3>
                      <p className="text-sm">
                        {new Date(item.updatedAt).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              {item.mediaUrl && (
                <Button asChild variant="default">
                  <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    {item.type === 'video' ? <Play className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    Ver {item.type === 'video' ? 'Vídeo' : 'Imagem'}
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
