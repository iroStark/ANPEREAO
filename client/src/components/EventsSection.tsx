import { HPHCard, HPHCardHeader, HPHCardContent, HPHButton, HPHBadge } from '@/components/ui/hph';
import { Calendar03Icon as Calendar, Clock01Icon as Clock, Location01Icon as MapPin, UserGroupIcon as Users, ArrowRight01Icon as ArrowRight } from "hugeicons-react";

// Todo: remove mock functionality - replace with real event data
const upcomingEvents = [
  {
    id: 1,
    title: "Assembleia Geral Ordinária",
    date: "2024-04-15",
    time: "14:00",
    location: "Sede da ANPERE, Luanda",
    description: "Assembleia geral para aprovação do relatório anual e discussão do plano de atividades.",
    attendees: 45,
    status: "Confirmado",
    type: "Assembleia"
  },
  {
    id: 2,
    title: "Workshop: Novas Tecnologias 5G",
    date: "2024-04-20",
    time: "09:00",
    location: "Centro de Convenções, Luanda",
    description: "Workshop técnico sobre implementação e gestão de redes 5G em Angola.",
    attendees: 32,
    status: "Inscrições Abertas",
    type: "Formação"
  },
  {
    id: 3,
    title: "Encontro de Confraternização",
    date: "2024-05-10",
    time: "18:00",
    location: "Ilha de Luanda",
    description: "Evento social para fortalecer os laços entre os associados e suas famílias.",
    attendees: 78,
    status: "Aguardando",
    type: "Social"
  }
];

const pastEvents = [
  {
    id: 4,
    title: "Seminário Espectro Rádio",
    date: "2024-02-15",
    description: "Seminário técnico sobre gestão eficiente do espectro radioelétrico.",
    attendees: 56,
    type: "Seminário"
  },
  {
    id: 5,
    title: "Reunião Trimestral",
    date: "2024-01-20",
    description: "Reunião trimestral da direção com apresentação de resultados.",
    attendees: 28,
    type: "Reunião"
  }
];

const EventsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-events-title">
            Eventos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-events-intro">
            Mantenha-se atualizado com as atividades, workshops e encontros da ANPERE
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground" data-testid="text-upcoming-events-title">
              Próximos Eventos
            </h3>
            <HPHButton variant="outline" data-testid="button-view-calendar">
              Ver Calendário Completo
            </HPHButton>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <HPHCard key={event.id} hover className="h-full">
                <HPHCardHeader className="pb-3">
                  <div className="w-full">
                    <div className="flex items-start justify-between mb-2">
                       <HPHBadge variant="primary">
                        {event.type}
                      </HPHBadge>
                      <HPHBadge 
                        variant={event.status === "Confirmado" ? "green" : "gray"}
                      >
                        {event.status}
                      </HPHBadge>
                    </div>
                    <h4 className="text-xl font-bold text-foreground" data-testid={`text-event-title-${event.id}`}>
                      {event.title}
                    </h4>
                  </div>
                </HPHCardHeader>
                <HPHCardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      {new Date(event.date).toLocaleDateString('pt-PT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      {event.attendees} participantes
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-event-description-${event.id}`}>
                    {event.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <HPHButton size="sm" data-testid={`button-register-${event.id}`}>
                      Inscrever-se
                    </HPHButton>
                    <HPHButton size="sm" variant="outline" data-testid={`button-details-${event.id}`}>
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </HPHButton>
                  </div>
                </HPHCardContent>
              </HPHCard>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8" data-testid="text-past-events-title">
            Eventos Realizados
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <HPHCard key={event.id} hover className="h-full">
                <HPHCardHeader className="pb-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <HPHBadge variant="gray">
                        {event.type}
                      </HPHBadge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground" data-testid={`text-past-event-title-${event.id}`}>
                      {event.title}
                    </h4>
                  </div>
                </HPHCardHeader>
                <HPHCardContent>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-past-event-description-${event.id}`}>
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees}
                    </div>
                    <HPHButton size="sm" variant="ghost" data-testid={`button-past-event-photos-${event.id}`}>
                      Ver Fotos
                    </HPHButton>
                  </div>
                </HPHCardContent>
              </HPHCard>
            ))}
          </div>

          <div className="text-center mt-8">
            <HPHButton variant="outline" data-testid="button-view-all-events">
              Ver Todos os Eventos
            </HPHButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;