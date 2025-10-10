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
import { FileText, Calendar, Tag, Download } from "lucide-react";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {publication && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{publication.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    Detalhes completos da publicação
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {publication.category}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {publication.date}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Descrição
                </h3>
                <p className="text-foreground leading-relaxed">
                  {publication.description}
                </p>
              </div>

              {publication.downloadUrl && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Documento
                  </h3>
                  <a
                    href={publication.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Download do documento
                  </a>
                </div>
              )}

              {(publication.publishedAt || publication.updatedAt) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {publication.publishedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Publicado em
                      </h3>
                      <p className="text-sm">
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
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Atualizado em
                      </h3>
                      <p className="text-sm">
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
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              {publication.downloadUrl && (
                <Button asChild variant="default">
                  <a href={publication.downloadUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
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
