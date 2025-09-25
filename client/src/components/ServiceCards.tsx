import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  Scale, 
  GraduationCap,
  ArrowRight 
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: UserPlus,
    title: "ASSOCIAR-SE",
    subtitle: "Torne-se membro da ANPERE",
    section: "contactos"
  },
  {
    id: 2,
    icon: FileText,
    title: "PUBLICAÇÕES",
    subtitle: "Actas, relatórios e documentos",
    section: "publicacoes"
  },
  {
    id: 3,
    icon: Calendar,
    title: "EVENTOS",
    subtitle: "Workshops e conferências",
    section: "eventos"
  },
  {
    id: 4,
    icon: Scale,
    title: "ASSISTÊNCIA JURÍDICA",
    subtitle: "Apoio legal aos associados",
    section: "contactos"
  },
  {
    id: 5,
    icon: GraduationCap,
    title: "FORMAÇÃO TÉCNICA",
    subtitle: "Capacitação profissional",
    section: "eventos"
  }
];

const ServiceCards = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative -mt-20 mb-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              const isActive = activeCard === service.id;
              
              return (
                <div
                  key={service.id}
                  className={`relative p-6 rounded-xl cursor-pointer transition-all duration-500 ease-in-out group ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'bg-background hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:scale-105'
                  }`}
                  onMouseEnter={() => setActiveCard(service.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={() => scrollToSection(service.section)}
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-primary/10 group-hover:bg-primary-foreground/20'
                      }`}>
                        <IconComponent className={`w-6 h-6 transition-colors duration-300 ${
                          isActive 
                            ? 'text-primary-foreground' 
                            : 'text-primary group-hover:text-primary-foreground'
                        }`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-sm font-bold mb-2 transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-foreground group-hover:text-primary-foreground'
                    }`} data-testid={`service-title-${service.id}`}>
                      {service.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-primary-foreground/80'
                    }`} data-testid={`service-subtitle-${service.id}`}>
                      {service.subtitle}
                    </p>

                    {/* Action Button - appears on hover/active */}
                    <div className={`mt-4 transition-all duration-300 ${
                      isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`w-8 h-8 rounded-full p-0 ${
                          isActive 
                            ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 group-hover:bg-primary-foreground group-hover:text-primary'
                        }`}
                        data-testid={`service-action-${service.id}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;