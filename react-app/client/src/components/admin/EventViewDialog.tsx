import { HPHModal, HPHBadge, HPHButton } from "@/components/ui/hph";
import { Separator } from "@/components/ui/separator";
import { Calendar03Icon as Calendar, Clock01Icon as Clock, Location01Icon as MapPin, Tag01Icon as Tag, UserGroupIcon as Users, Link01Icon as LinkIcon } from "hugeicons-react";
import { type Event } from "@/hooks/useEvents";

interface EventViewDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventViewDialog({
  event,
  open,
  onOpenChange,
}: EventViewDialogProps) {
  const getEventStatus = () => {
    if (!event) return null;
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate >= now
      ? <HPHBadge variant="green">Próximo</HPHBadge>
      : <HPHBadge variant="gray">Realizado</HPHBadge>;
  };

  return (
    <HPHModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={event?.title || "Detalhes do Evento"}
      description="Detalhes completos do evento"
      maxWidth="max-w-2xl"
    >
        {event && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <HPHBadge variant="primary" className="gap-1.5 flex items-center">
                    <Tag className="w-3.5 h-3.5" />
                    {event.type}
                  </HPHBadge>
                  {getEventStatus()}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 font-accent">
                Descrição
              </h4>
              <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg text-sm">
                {event.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Data</p>
                  <p className="text-sm font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Horário</p>
                  <p className="text-sm font-medium">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Local</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Capacidade</p>
                    <p className="text-sm font-medium">{event.capacity}</p>
                  </div>
                </div>
              )}
            </div>

            {(event.publishedAt || event.updatedAt) && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                {event.publishedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Publicado em
                    </h4>
                    <p className="text-xs">
                      {new Date(event.publishedAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {event.updatedAt && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Atualizado em
                    </h4>
                    <p className="text-xs">
                      {new Date(event.updatedAt).toLocaleDateString('pt-PT', {
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
              {event.registrationUrl && (
                <HPHButton asChild variant="primary" size="sm">
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Inscrever-se
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
