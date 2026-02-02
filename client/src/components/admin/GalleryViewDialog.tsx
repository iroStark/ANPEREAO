import { HPHModal, HPHBadge, HPHButton } from "@/components/ui/hph";
import { Separator } from "@/components/ui/separator";
import { Image01Icon as ImageIcon, PlayIcon as Play, Calendar03Icon as Calendar, Tag01Icon as Tag, ViewIcon as Eye } from "hugeicons-react";
import { type GalleryItem } from "@/hooks/useGallery";

interface GalleryViewDialogProps {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return url;
};

export function GalleryViewDialog({
  item,
  open,
  onOpenChange,
}: GalleryViewDialogProps) {
  return (
    <HPHModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={item?.title || "Detalhes do Item"}
      description={`Detalhes completos do ${item?.type === 'video' ? 'vídeo' : 'imagem'}`}
      maxWidth="max-w-3xl"
    >
        {item && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {item.type === 'video' ? (
                  <Play className="w-6 h-6 text-primary" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <HPHBadge variant={item.type === 'video' ? 'primary' : 'gray'} className="gap-1.5 flex items-center">
                    {item.type === 'video' ? <Play className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    {item.type === 'video' ? 'Vídeo' : 'Imagem'}
                  </HPHBadge>
                  <HPHBadge variant="primary" className="gap-1.5 flex items-center">
                    <Tag className="w-3.5 h-3.5" />
                    {item.category}
                  </HPHBadge>
                  <HPHBadge variant="gray" className="gap-1.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </HPHBadge>
                  {item.views !== undefined && (
                    <HPHBadge variant="green" className="gap-1.5 flex items-center">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views} visualizações
                    </HPHBadge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Media Preview */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-muted/20">
              {item.type === 'image' && item.mediaUrl && (
                <img 
                  src={getImageUrl(item.mediaUrl)} 
                  alt={item.title}
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              )}
              {item.type === 'video' && item.mediaUrl && (
                <video 
                  src={getImageUrl(item.mediaUrl)}
                  controls
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                >
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 font-accent">
                Descrição
              </h4>
              <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg text-sm">
                {item.description}
              </p>
            </div>

            {/* Video Duration */}
            {item.type === 'video' && item.duration && (
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 font-accent">
                  Duração
                </h4>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Play className="w-4 h-4 text-primary" />
                  {item.duration}
                </div>
              </div>
            )}

            {/* Metadata */}
            {(item.publishedAt || item.updatedAt) && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                {item.publishedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Publicado em
                    </h4>
                    <p className="text-xs">
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
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Atualizado em
                    </h4>
                    <p className="text-xs">
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

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              {item.mediaUrl && (
                <HPHButton asChild variant="primary" size="sm">
                  <a href={getImageUrl(item.mediaUrl)} target="_blank" rel="noopener noreferrer" className="gap-2">
                    {item.type === 'video' ? <Play className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    Ver {item.type === 'video' ? 'Vídeo' : 'Imagem'}
                  </a>
                </HPHButton>
              )}
              <HPHButton variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Fechar
              </HPHButton>
            </div>
          </div>
        )}
    </HPHModal>
  );
}
