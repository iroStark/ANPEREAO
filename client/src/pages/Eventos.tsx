import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";

const Eventos = () => {
  const { data: events = [], isLoading, error } = useEvents();

  // Separar eventos em próximos e passados baseado na data
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const pastEvents = events.filter(event => new Date(event.date) < now);

  const getStatusBadge = (eventDate: string) => {
    const eventDateObj = new Date(eventDate);
    return eventDateObj >= now 
      ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Próximo</Badge>
      : <Badge variant="secondary">Realizado</Badge>;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar eventos: {error.message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-[48px] mb-[48px]"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Eventos
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Participe nos nossos eventos, conferências e workshops para se manter 
              atualizado com as últimas tendências do sector das telecomunicações.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Próximos Eventos
            </h2>
            <p className="text-muted-foreground">
              Não perca os eventos que temos programados para si
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {isLoading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Carregando eventos...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Nenhum evento próximo programado.</p>
              </div>
            ) : (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{event.type}</Badge>
                        {getStatusBadge(event.date)}
                      </div>
                      <CardTitle className="text-xl line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription>
                        {event.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(event.date).toLocaleDateString('pt-PT')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          {event.location}
                        </div>
                        {event.capacity && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            {event.capacity} participantes
                          </div>
                        )}
                      </div>
                      
                      <Button className="w-full gap-2" data-testid={`button-register-${index}`}>
                        Inscrever-se
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Past Events */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Eventos Realizados
            </h2>
            <p className="text-muted-foreground">
              Confira alguns dos eventos que já realizámos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Carregando eventos...</p>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">Nenhum evento realizado ainda.</p>
              </div>
            ) : (
              pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  <Card className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{event.type}</Badge>
                        {getStatusBadge(event.date)}
                      </div>
                      <CardTitle className="text-lg">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm">
                        {event.description}
                      </CardDescription>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('pt-PT')}
                        </div>
                        {event.capacity && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {event.capacity} participantes
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Eventos;