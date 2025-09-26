import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Eventos = () => {
  const upcomingEvents = [
    {
      title: "Conferência Nacional de Telecomunicações 2024",
      description: "Evento anual que reúne profissionais do sector para debater as tendências e inovações",
      date: "15 de Junho, 2024",
      time: "09:00 - 17:00",
      location: "Hotel Presidente, Luanda",
      participants: "200+",
      status: "upcoming",
      category: "Conferência"
    },
    {
      title: "Workshop: 5G e o Futuro das Comunicações",
      description: "Sessão técnica sobre implementação e impacto da tecnologia 5G em Angola",
      date: "28 de Maio, 2024", 
      time: "14:00 - 18:00",
      location: "Centro de Convenções de Talatona",
      participants: "80",
      status: "upcoming",
      category: "Workshop"
    },
    {
      title: "Assembleia Geral Ordinária",
      description: "Reunião anual dos membros da ANPERE para aprovação de contas e planos",
      date: "10 de Abril, 2024",
      time: "15:00 - 17:00", 
      location: "Sede da ANPERE",
      participants: "150",
      status: "upcoming",
      category: "Assembleia"
    }
  ];

  const pastEvents = [
    {
      title: "Seminário: Cibersegurança nas Telecomunicações",
      description: "Discussão sobre desafios e soluções de segurança no sector",
      date: "22 de Fevereiro, 2024",
      time: "09:00 - 13:00",
      location: "ITEL, Luanda",
      participants: "120",
      status: "completed",
      category: "Seminário"
    },
    {
      title: "Mesa Redonda: Regulamentação do Espectro",
      description: "Debate sobre as novas regulamentações do espectro radioeléctrico",
      date: "18 de Janeiro, 2024",
      time: "16:00 - 18:30",
      location: "Ministério das Telecomunicações",
      participants: "45",
      status: "completed", 
      category: "Mesa Redonda"
    }
  ];

  const getStatusBadge = (status: string) => {
    return status === "upcoming" 
      ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Próximo</Badge>
      : <Badge variant="secondary">Realizado</Badge>;
  };

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
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{event.category}</Badge>
                      {getStatusBadge(event.status)}
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
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        {event.participants} participantes
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2" data-testid={`button-register-${index}`}>
                      Inscrever-se
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
              >
                <Card className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{event.category}</Badge>
                      {getStatusBadge(event.status)}
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
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {event.participants} participantes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Eventos;