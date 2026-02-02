import { useState } from "react";
import { useLocation } from "wouter";
import { HPHButton, HPHCard } from "@/components/ui/hph";
import { 
  UserAdd01Icon as UserPlus, 
  File02Icon as FileText, 
  Calendar03Icon as Calendar, 
  Legal01Icon as Scale, 
  Mortarboard01Icon as GraduationCap,
  ArrowRight01Icon as ArrowRight 
} from "hugeicons-react";

const services = [
  {
    id: 1,
    icon: UserPlus,
    title: "ASSOCIAR-SE",
    subtitle: "Torne-se membro da ANPERE",
    section: "contactos",
    link: "/associar-se"
  },
  {
    id: 2,
    icon: FileText,
    title: "PUBLICAÇÕES",
    subtitle: "Actas, relatórios e documentos",
    section: "publicacoes",
    link: "/publicacoes"
  },
  {
    id: 3,
    icon: Calendar,
    title: "EVENTOS",
    subtitle: "Workshops e conferências",
    section: "eventos",
    link: "/eventos"
  },
  {
    id: 4,
    icon: Scale,
    title: "ASSISTÊNCIA JURÍDICA",
    subtitle: "Apoio legal aos associados",
    section: "legislacao",
    link: "/legislacao"
  },
  {
    id: 5,
    icon: GraduationCap,
    title: "FORMAÇÃO TÉCNICA",
    subtitle: "Capacitação profissional",
    section: "eventos",
    link: "/eventos"
  }
];

const ServiceCards = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const handleCardClick = (service: typeof services[0]) => {
    if (service.link) {
      setLocation(service.link);
    } else {
      const element = document.getElementById(service.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="hidden lg:block relative -mt-20 mb-8 z-10 font-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HPHCard className="p-3 lg:p-4 shadow-xl overflow-hidden rounded-2xl">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/20">
            {services.map((service) => {
              const IconComponent = service.icon;
              const isActive = activeCard === service.id;
              
              return (
                <div
                  key={service.id}
                  className={`relative flex-1 p-3 cursor-pointer transition-all duration-500 ease-in-out group ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110 z-10 rounded-xl' 
                      : 'bg-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:scale-105 hover:z-10 hover:rounded-xl'
                  }`}
                  onMouseEnter={() => setActiveCard(service.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={() => handleCardClick(service)}
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-primary/10 group-hover:bg-primary-foreground/20'
                      }`}>
                        <IconComponent className={`w-4 h-4 transition-colors duration-300 ${
                          isActive 
                            ? 'text-primary-foreground' 
                            : 'text-primary group-hover:text-primary-foreground'
                        }`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-[10px] font-extrabold tracking-widest uppercase mb-1 transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-foreground group-hover:text-primary-foreground'
                    }`} data-testid={`service-title-${service.id}`}>
                      {service.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`text-[10px] font-medium leading-relaxed transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-primary-foreground/80'
                    }`} data-testid={`service-subtitle-${service.id}`}>
                      {service.subtitle}
                    </p>

                    {/* Action Button - appears on hover/active */}
                    <div className={`mt-2 transition-all duration-300 ${
                      isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}>
                      <HPHButton
                        size="sm"
                        variant="secondary"
                        className={`w-8 h-8 rounded-full p-0 flex items-center justify-center ${
                          isActive 
                            ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                            : 'bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary'
                        }`}
                        data-testid={`service-action-${service.id}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </HPHButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </HPHCard>
      </div>
    </div>
  );
};

export default ServiceCards;
