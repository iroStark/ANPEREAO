import { HPHModal, HPHBadge, HPHButton } from "@/components/ui/hph";
import { Separator } from "@/components/ui/separator";
import { File02Icon as FileText, Calendar03Icon as Calendar, Tag01Icon as Tag, Download01Icon as Download } from "hugeicons-react";
import { type Publication } from "@/hooks/usePublications";

interface PublicationViewDialogProps {
  publication: Publication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublicationViewDialog({
  publication,
  open,
  onOpenChange,
}: PublicationViewDialogProps) {
  return (
    <HPHModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={publication?.title || "Detalhes da Publicação"}
      description="Detalhes completos da publicação"
      maxWidth="max-w-2xl"
    >
        {publication && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{publication.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <HPHBadge variant="primary" className="gap-1.5 flex items-center">
                    <Tag className="w-3.5 h-3.5" />
                    {publication.category}
                  </HPHBadge>
                  <HPHBadge variant="gray" className="gap-1.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5" />
                    {publication.date}
                  </HPHBadge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 font-accent">
                Descrição
              </h4>
              <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg text-sm">
                {publication.description}
              </p>
            </div>

            {publication.downloadUrl && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                  Documento Disponível
                </h4>
                <a
                  href={publication.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:bg-primary/10 p-3 rounded-lg transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Download do documento</span>
                    <span className="text-[10px] text-primary/60 uppercase">Clique para abrir ou descarregar</span>
                  </div>
                </a>
              </div>
            )}

            {/* Metadata */}
            {(publication.publishedAt || publication.updatedAt) && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                {publication.publishedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Publicado em
                    </h4>
                    <p className="text-xs">
                      {new Date(publication.publishedAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {publication.updatedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Atualizado em
                    </h4>
                    <p className="text-xs">
                      {new Date(publication.updatedAt).toLocaleDateString('pt-PT', {
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
              {publication.downloadUrl && (
                <HPHButton asChild variant="primary" size="sm">
                  <a href={publication.downloadUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
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
