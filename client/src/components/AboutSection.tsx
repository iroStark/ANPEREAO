import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, History, Building, ArrowRight } from "lucide-react";

const aboutData = [
  {
    id: "mission",
    title: "Missão",
    description: "Delinear planos de assistência social, médico-medicamentosa, cultural, recreativa, desportiva e jurídica aos associados",
    icon: Target,
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
    description: "Tornar a ANPERE numa Associação de Carácter Mutualista de referência a nível nacional",
    icon: Eye,
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
    description: "Humanidade, Unidade, Solidariedade e Patriotismo",
    icon: Heart,
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
    description: "Fundada para unir e representar os profissionais do espectro rádio eletrónico em Angola",
    icon: History,
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
    description: "Estrutura organizacional focada no atendimento eficaz aos associados",
    icon: Building,
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
    <section className="py-20 bg-background">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-about-title">
          Quem Somos
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-intro">
          ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {expandedCard ? (
          // Expanded Card View
          <div className="w-full">
            {aboutData
              .filter(card => card.id === expandedCard)
              .map((card) => {
                const IconComponent = card.icon;
                return (
                  <div 
                    key={card.id} 
                    className="w-full min-h-[500px] bg-white dark:bg-card rounded-[20px] p-[60px] relative transform transition-all duration-500 ease-in-out opacity-100 translate-y-0"
                    style={{
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)'
                    }}
                    data-testid={`expanded-card-${card.id}`}
                  >
                    {/* Back Button */}
                    <Button 
                      onClick={handleBackClick}
                      className="absolute top-8 right-8 w-[120px] h-[40px] bg-primary hover:bg-primary/90 text-white rounded-[12px] font-inter text-sm font-bold transition-colors duration-200"
                      data-testid="button-back"
                    >
                      Voltar
                    </Button>

                    {/* Header */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-foreground font-inter mb-2">
                          {card.title}
                        </h3>
                        <p className="text-lg text-muted-foreground font-inter">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8 transform transition-all duration-500 ease-in-out opacity-100 translate-y-0">
                      <p className="text-lg text-foreground leading-relaxed font-inter">
                        {card.fullContent.description}
                      </p>

                      {/* Mission Content */}
                      {card.id === "mission" && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Objetivos Principais</h4>
                            <ul className="space-y-4">
                              {card.fullContent.items?.map((item, index) => (
                                <li key={index} className="flex items-start text-muted-foreground font-inter">
                                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Áreas de Destaque</h4>
                            <div className="flex flex-wrap gap-3">
                              {card.fullContent.highlights?.map((highlight, index) => (
                                <Badge key={index} variant="secondary" className="text-sm font-inter">
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
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Nossos Objetivos</h4>
                            <ul className="space-y-4">
                              {card.fullContent.items?.map((item, index) => (
                                <li key={index} className="flex items-start text-muted-foreground font-inter">
                                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Metas Estratégicas</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {card.fullContent.goals?.map((goal, index) => (
                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                  <span className="font-medium text-foreground font-inter">{goal}</span>
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
                                <h4 className="text-xl font-bold text-primary mb-3 font-inter">{value.name}</h4>
                                <p className="text-muted-foreground font-inter">{value.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* History Content */}
                      {card.id === "history" && (
                        <div className="space-y-6">
                          <div className="text-center p-6 bg-primary/5 rounded-lg">
                            <h4 className="text-2xl font-bold text-primary mb-2 font-inter">"{card.fullContent.motto}"</h4>
                            <p className="text-muted-foreground font-inter">Lema da ANPERE</p>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Marcos Históricos</h4>
                            <div className="space-y-4">
                              {card.fullContent.timeline?.map((milestone, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                                  <Badge variant="outline" className="font-semibold font-inter">
                                    {milestone.year}
                                  </Badge>
                                  <p className="text-muted-foreground flex-1 font-inter">{milestone.event}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Conquistas</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              {card.fullContent.achievements?.map((achievement, index) => (
                                <div key={index} className="text-center p-4 bg-primary/5 rounded-lg">
                                  <span className="text-sm font-medium text-foreground font-inter">{achievement}</span>
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
                            <h4 className="text-xl font-semibold text-foreground mb-4 font-inter">Departamentos</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {card.fullContent.departments?.map((dept, index) => (
                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                  <h5 className="font-semibold text-foreground mb-2 font-inter">{dept.name}</h5>
                                  <p className="text-sm text-muted-foreground font-inter">{dept.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // Grid View - All Cards
          <div className="flex flex-wrap justify-center gap-6">
            {aboutData.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={card.id}
                  className={`w-[350px] h-[240px] bg-white dark:bg-card rounded-[20px] p-6 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    expandedCard && expandedCard !== card.id 
                      ? 'opacity-0 translate-y-[30px] pointer-events-none duration-400' 
                      : 'opacity-100 translate-y-0'
                  }`}
                  style={{
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }}
                  onClick={(e) => {
                    // Scale effect for 200ms
                    const element = e.currentTarget;
                    element.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                      element.style.transform = 'scale(1.05)';
                      handleCardClick(card.id);
                    }, 200);
                  }}
                  data-testid={`card-${card.id}`}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[20px] font-bold text-foreground mb-2 text-center font-inter" data-testid={`title-${card.id}`}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] text-muted-foreground mb-4 text-center leading-relaxed font-inter">
                    {card.description}
                  </p>

                  {/* Button */}
                  <div className="flex justify-center">
                    <button className="text-[14px] font-bold text-primary hover:text-primary/80 transition-colors duration-200 font-inter flex items-center">
                      Ver detalhes
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;