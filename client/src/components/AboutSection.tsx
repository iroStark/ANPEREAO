import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, Users, History, Building, ArrowRight, ChevronLeft, Mail, Phone, MapPin } from "lucide-react";

const aboutData = [
  {
    id: "mission",
    title: "Missão",
    subtitle: "Nosso propósito e objetivos",
    icon: Target,
    color: "primary",
    colorClasses: {
      text: "text-primary",
      bg: "bg-primary/10",
      bgDot: "bg-primary"
    },
    summary: "Delinear planos de assistência social, médico-medicamentosa, cultural, recreativa, desportiva e jurídica aos associados",
    fullContent: {
      description: "A missão da ANPERE é servir de forma integral todos os profissionais do espectro rádio eletrónico, proporcionando apoio em múltiplas dimensões da vida pessoal e profissional.",
      items: [
        "Delinear planos de assistência social, médico-medicamentosa, cultural, recreativa, desportiva e jurídica aos associados",
        "Prestar apoio material e moral aos descendentes e ascendentes dos associados tombados e falecidos",
        "Estabelecer convénios ou contratos com estabelecimentos comerciais, bancários, educacionais, culturais, de saúde",
        "Preservar e honrar a memória dos profissionais tombados e falecidos ao longo dos anos",
        "Congregar os membros por meio de acções culturais, desportivas e de confraternização",
        "Mobilizar sinergias no sentido de granjear reconhecimento da sociedade"
      ],
      highlights: ["Assistência Integral", "Apoio Familiar", "Convénios Estratégicos", "Memória Histórica"]
    }
  },
  {
    id: "vision",
    title: "Visão",
    subtitle: "Onde queremos chegar",
    icon: Eye,
    color: "chart-2",
    colorClasses: {
      text: "text-chart-2",
      bg: "bg-chart-2/10",
      bgDot: "bg-chart-2"
    },
    summary: "Tornar a ANPERE numa Associação de Carácter Mutualista de referência a nível nacional",
    fullContent: {
      description: "Nossa visão é construir uma organização que seja reconhecida como referência em Angola na assistência e representação dos profissionais do setor.",
      items: [
        "Tornar a ANPERE numa Associação de Carácter Mutualista de referência a nível da assistência social",
        "Tornar a ANPERE no Porto Seguro de todos os profissionais do espetro rádio electrónico nacional",
        "Estar à altura dos compromissos estatutários e das expectativas dos associados"
      ],
      goals: ["Referência Nacional", "Porto Seguro", "Excelência no Atendimento", "Compromisso Estatutário"]
    }
  },
  {
    id: "values",
    title: "Valores",
    subtitle: "Nossos princípios fundamentais",
    icon: Heart,
    color: "chart-3",
    colorClasses: {
      text: "text-chart-3",
      bg: "bg-chart-3/10",
      bgDot: "bg-chart-3"
    },
    summary: "Humanidade, Unidade, Solidariedade e Patriotismo",
    fullContent: {
      description: "Os valores da ANPERE são os pilares que orientam todas as nossas ações e decisões, refletindo nosso compromisso com os associados e a sociedade angolana.",
      values: [
        {
          name: "Humanidade",
          description: "Tratamos cada associado com dignidade, respeito e compreensão das suas necessidades individuais"
        },
        {
          name: "Unidade",
          description: "Promovemos a coesão entre todos os profissionais do setor, fortalecendo os laços de cooperação"
        },
        {
          name: "Solidariedade",
          description: "Apoiamos mutuamente nossos membros em momentos de dificuldade e celebramos juntos as conquistas"
        },
        {
          name: "Patriotismo",
          description: "Contribuímos para o desenvolvimento de Angola através do fortalecimento do setor de telecomunicações"
        }
      ]
    }
  },
  {
    id: "history",
    title: "História",
    subtitle: "Nossa trajetória e conquistas",
    icon: History,
    color: "chart-4",
    colorClasses: {
      text: "text-chart-4",
      bg: "bg-chart-4/10",
      bgDot: "bg-chart-4"
    },
    summary: "Fundada para unir e representar os profissionais do espectro rádio eletrónico em Angola",
    fullContent: {
      description: "A ANPERE nasceu da necessidade de unir os profissionais do setor de telecomunicações em Angola, criando uma força coletiva para defender interesses e promover o desenvolvimento profissional.",
      timeline: [
        {
          year: "Fundação",
          event: "Criação da ANPERE com o objetivo de representar os profissionais do espectro rádio eletrónico"
        },
        {
          year: "Desenvolvimento",
          event: "Expansão dos serviços de assistência social e estabelecimento de convénios estratégicos"
        },
        {
          year: "Consolidação",
          event: "Reconhecimento como associação de referência no setor de telecomunicações"
        }
      ],
      motto: "R Onten, R Hoje, R Sempre",
      achievements: ["Mais de 1000 associados", "50+ convénios ativos", "Assistência integral garantida"]
    }
  },
  {
    id: "organization",
    title: "Organização",
    subtitle: "Nossa estrutura e funcionamento",
    icon: Building,
    color: "chart-5",
    colorClasses: {
      text: "text-chart-5",
      bg: "bg-chart-5/10",
      bgDot: "bg-chart-5"
    },
    summary: "Estrutura organizacional focada no atendimento eficaz aos associados",
    fullContent: {
      description: "Como associação de carácter mutualista, organizamos nossa estrutura para melhor servir os associados através de departamentos especializados e uma liderança comprometida.",
      departments: [
        {
          name: "Direcção Executiva",
          description: "Gestão estratégica e tomada de decisões"
        },
        {
          name: "Departamento Social",
          description: "Assistência social e apoio aos associados"
        },
        {
          name: "Departamento Jurídico",
          description: "Consultoria e apoio legal"
        },
        {
          name: "Departamento Cultural",
          description: "Atividades recreativas e culturais"
        }
      ],
      contacts: [
        { type: "email", value: "geral@anpere.ao", icon: Mail },
        { type: "phone", value: "+244 xxx xxx xxx", icon: Phone },
        { type: "address", value: "Luanda, Angola", icon: MapPin }
      ]
    }
  }
];

const AboutSection = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleBackClick = () => {
    setExpandedCard(null);
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-about-title">
            Quem Somos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-intro">
            ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative">
          {expandedCard ? (
            // Expanded Card View
            <div className="space-y-6">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={handleBackClick}
                className="mb-6 hover-elevate"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {aboutData
                .filter(card => card.id === expandedCard)
                .map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <Card 
                      key={card.id} 
                      className="w-full transform transition-all duration-700 ease-in-out scale-105 shadow-2xl"
                      data-testid={`expanded-card-${card.id}`}
                    >
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 ${card.colorClasses.bg} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-8 h-8 ${card.colorClasses.text}`} />
                          </div>
                          <div>
                            <CardTitle className={`text-2xl md:text-3xl ${card.colorClasses.text}`}>
                              {card.title}
                            </CardTitle>
                            <p className="text-muted-foreground mt-1">{card.subtitle}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-foreground text-lg leading-relaxed">
                          {card.fullContent.description}
                        </p>

                        {/* Mission Content */}
                        {card.id === "mission" && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Objetivos Principais</h4>
                              <ul className="space-y-3">
                                {card.fullContent.items?.map((item, index) => (
                                  <li key={index} className="flex items-start text-muted-foreground">
                                    <span className={`w-2 h-2 ${card.colorClasses.bgDot} rounded-full mt-2 mr-3 flex-shrink-0`} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Áreas de Destaque</h4>
                              <div className="flex flex-wrap gap-2">
                                {card.fullContent.highlights?.map((highlight, index) => (
                                  <Badge key={index} variant="secondary" className="text-sm">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Vision Content */}
                        {card.id === "vision" && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Nossos Objetivos</h4>
                              <ul className="space-y-3">
                                {card.fullContent.items?.map((item, index) => (
                                  <li key={index} className="flex items-start text-muted-foreground">
                                    <span className={`w-2 h-2 ${card.colorClasses.bgDot} rounded-full mt-2 mr-3 flex-shrink-0`} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Metas Estratégicas</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {card.fullContent.goals?.map((goal, index) => (
                                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                    <span className="font-medium text-foreground">{goal}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Values Content */}
                        {card.id === "values" && (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {card.fullContent.values?.map((value, index) => (
                                <div key={index} className="p-6 bg-muted/50 rounded-lg">
                                  <h4 className={`text-xl font-bold ${card.colorClasses.text} mb-3`}>{value.name}</h4>
                                  <p className="text-muted-foreground">{value.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* History Content */}
                        {card.id === "history" && (
                          <div className="space-y-6">
                            <div className="text-center p-6 bg-primary/5 rounded-lg">
                              <h4 className="text-2xl font-bold text-primary mb-2">"{card.fullContent.motto}"</h4>
                              <p className="text-muted-foreground">Lema da ANPERE</p>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Marcos Históricos</h4>
                              <div className="space-y-4">
                                {card.fullContent.timeline?.map((milestone, index) => (
                                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                                    <Badge variant="outline" className="font-semibold">
                                      {milestone.year}
                                    </Badge>
                                    <p className="text-muted-foreground flex-1">{milestone.event}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Conquistas</h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                {card.fullContent.achievements?.map((achievement, index) => (
                                  <div key={index} className="text-center p-4 bg-primary/5 rounded-lg">
                                    <span className="text-sm font-medium text-foreground">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Organization Content */}
                        {card.id === "organization" && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Departamentos</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {card.fullContent.departments?.map((dept, index) => (
                                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                    <h5 className="font-semibold text-foreground mb-2">{dept.name}</h5>
                                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-4">Contactos</h4>
                              <div className="space-y-3">
                                {card.fullContent.contacts?.map((contact, index) => {
                                  const IconComponent = contact.icon;
                                  return (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                                      <IconComponent className="w-5 h-5 text-primary" />
                                      <span className="text-foreground">{contact.value}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ) : (
            // Grid View - All Cards
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Card 
                    key={card.id}
                    className={`hover-elevate cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl ${
                      expandedCard && expandedCard !== card.id 
                        ? 'opacity-0 transform translate-y-4 pointer-events-none' 
                        : 'opacity-100 transform translate-y-0'
                    }`}
                    onClick={() => handleCardClick(card.id)}
                    data-testid={`card-${card.id}`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto w-16 h-16 ${card.colorClasses.bg} rounded-full flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-8 h-8 ${card.colorClasses.text}`} />
                      </div>
                      <CardTitle className={`text-xl ${card.colorClasses.text}`} data-testid={`title-${card.id}`}>
                        {card.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {card.summary}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${card.colorClasses.text} hover-elevate`}
                        data-testid={`button-${card.id}`}
                      >
                        Ver detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;