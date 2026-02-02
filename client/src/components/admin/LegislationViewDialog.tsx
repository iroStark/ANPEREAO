import { HPHModal, HPHBadge, HPHButton } from "@/components/ui/hph";
import { Separator } from "@/components/ui/separator";
import { Legal01Icon as Scale, Calendar03Icon as Calendar, Tag01Icon as Tag } from "hugeicons-react";
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
    <HPHModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={legislation?.title || "Detalhes da Legislação"}
      description="Detalhes completos da legislação"
      maxWidth="max-w-2xl"
    >
        {legislation && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{legislation.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <HPHBadge variant="primary" className="gap-1.5 flex items-center">
                    <Tag className="w-3.5 h-3.5" />
                    {legislation.category}
                  </HPHBadge>
                  <HPHBadge variant="gray" className="gap-1.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5" />
                    Ano: {legislation.year}
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
                {legislation.description}
              </p>
            </div>

            {/* Metadata */}
            {(legislation.publishedAt || legislation.updatedAt) && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                {legislation.publishedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Publicado em
                    </h4>
                    <p className="text-xs">
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
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Atualizado em
                    </h4>
                    <p className="text-xs">
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

            <div className="pt-4 border-t border-border flex justify-end">
              <HPHButton variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Fechar
              </HPHButton>
            </div>
          </div>
        )}
    </HPHModal>
  );
}
