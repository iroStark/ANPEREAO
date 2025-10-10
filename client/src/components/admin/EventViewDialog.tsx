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
import { Calendar, Clock, MapPin, Tag, Users, Link as LinkIcon } from "lucide-react";
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
      ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Próximo</Badge>
      : <Badge variant="secondary">Realizado</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {event && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{event.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    Detalhes completos do evento
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {event.type}
                </Badge>
                {getEventStatus()}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Descrição
                </h3>
                <p className="text-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Data</p>
                    <p className="text-sm font-medium">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Horário</p>
                    <p className="text-sm font-medium">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Local</p>
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                </div>
                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Capacidade</p>
                      <p className="text-sm font-medium">{event.capacity}</p>
                    </div>
                  </div>
                )}
              </div>

              {(event.publishedAt || event.updatedAt) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {event.publishedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Publicado em
                      </h3>
                      <p className="text-sm">
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
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Atualizado em
                      </h3>
                      <p className="text-sm">
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
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              {event.registrationUrl && (
                <Button asChild variant="default">
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Inscrever-se
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
