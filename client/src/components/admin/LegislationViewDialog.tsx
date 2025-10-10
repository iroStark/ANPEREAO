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
import { Scale, Calendar, Tag } from "lucide-react";
import { type Legislation } from "@/hooks/useLegislation";

interface LegislationViewDialogProps {
  legislation: Legislation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegislationViewDialog({
  legislation,
  open,
  onOpenChange,
}: LegislationViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {legislation && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{legislation.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    Detalhes completos da legislação
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="space-y-6">
              {/* Category and Year */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {legislation.category}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Ano: {legislation.year}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Descrição
                </h3>
                <p className="text-foreground leading-relaxed">
                  {legislation.description}
                </p>
              </div>

              {/* Metadata */}
              {(legislation.publishedAt || legislation.updatedAt) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {legislation.publishedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Publicado em
                      </h3>
                      <p className="text-sm">
                        {new Date(legislation.publishedAt).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {legislation.updatedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Atualizado em
                      </h3>
                      <p className="text-sm">
                        {new Date(legislation.updatedAt).toLocaleDateString('pt-PT', {
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

            <div className="flex justify-end">
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
