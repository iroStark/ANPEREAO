import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Users, History, Building } from "lucide-react";
import angolanProfessionalsImage from "@assets/generated_images/Angolan_telecommunications_professionals_working_640a21c0.png";

const AboutSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto mb-10 text-center lg:mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-sans antialiased text-base md:text-lg text-primary font-semibold" data-testid="text-about-subtitle">
          Sobre Nós
        </p>
        <h2 className="font-sans antialiased font-bold text-2xl md:text-3xl lg:text-4xl text-foreground my-4 max-w-lg [text-wrap:balance] mx-auto" data-testid="text-about-title">
          ANPERE - Unidos pelo Futuro
        </h2>
        <p className="font-sans antialiased text-base mx-auto text-muted-foreground max-w-xl [text-wrap:balance]" data-testid="text-about-description">
          Associação Nacional dos Profissionais do Espectro Rádio Eletrónico - Fortalecendo o setor de telecomunicações em Angola
        </p>
      </div>

      {/* First Row */}
      <div className="mb-8 container mx-auto grid gap-y-8 lg:gap-x-8 grid-cols-1 lg:grid-cols-3 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Missão Card */}
        <div className="w-full rounded-lg border shadow-sm border-border bg-card overflow-hidden hover-elevate" data-testid="card-mission">
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h5 className="font-sans antialiased font-bold text-lg md:text-xl lg:text-2xl text-foreground mb-2 text-center" data-testid="text-mission-title">
              Nossa Missão
            </h5>
            <p className="font-sans antialiased text-base text-center mb-0 max-w-xs mx-auto font-normal text-muted-foreground" data-testid="text-mission-summary">
              Assistência integral aos profissionais do espectro rádio eletrónico em Angola
            </p>
          </div>
          <div className="p-2 h-[477px] overflow-hidden">
            <img 
              src={angolanProfessionalsImage} 
              alt="Profissionais ANPERE trabalhando" 
              className="rounded-lg w-full h-full object-cover" 
              data-testid="img-mission"
            />
          </div>
        </div>

        {/* Visão Card */}
        <div className="w-full rounded-lg border shadow-sm border-border col-span-2 bg-card overflow-hidden hover-elevate" data-testid="card-vision">
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-chart-2" />
              </div>
            </div>
            <h5 className="font-sans antialiased font-bold text-lg md:text-xl lg:text-2xl text-foreground mb-2 text-center" data-testid="text-vision-title">
              Nossa Visão
            </h5>
            <p className="font-sans antialiased text-base text-center mb-0 max-w-md mx-auto font-normal text-muted-foreground" data-testid="text-vision-summary">
              Ser a associação de referência nacional na assistência social aos profissionais de telecomunicações
            </p>
          </div>
          <div className="p-2 h-[300px] overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Porto Seguro Nacional</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Tornar a ANPERE no porto seguro de todos os profissionais do espectro rádio eletrónico em Angola
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="container mx-auto grid gap-y-8 lg:gap-x-8 grid-cols-1 lg:grid-cols-3 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Valores Card */}
        <div className="w-full rounded-lg border shadow-sm border-border col-span-2 bg-card overflow-hidden hover-elevate" data-testid="card-values">
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-chart-3" />
              </div>
            </div>
            <h5 className="font-sans antialiased font-bold text-lg md:text-xl lg:text-2xl text-foreground mb-2 text-center" data-testid="text-values-title">
              Nossos Valores
            </h5>
            <p className="font-sans antialiased text-base text-center mb-0 max-w-md mx-auto font-normal text-muted-foreground" data-testid="text-values-summary">
              Humanidade, Unidade, Solidariedade e Patriotismo guiam todas as nossas ações
            </p>
          </div>
          <div className="p-2 h-[300px]">
            <div className="bg-gradient-to-r from-chart-3/10 to-chart-4/10 rounded-lg h-full p-6 flex items-center">
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chart-3">H</span>
                  </div>
                  <h6 className="font-semibold text-foreground mb-1">Humanidade</h6>
                  <p className="text-xs text-muted-foreground">Dignidade e respeito</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chart-3">U</span>
                  </div>
                  <h6 className="font-semibold text-foreground mb-1">Unidade</h6>
                  <p className="text-xs text-muted-foreground">Força coletiva</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chart-3">S</span>
                  </div>
                  <h6 className="font-semibold text-foreground mb-1">Solidariedade</h6>
                  <p className="text-xs text-muted-foreground">Apoio mútuo</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chart-3">P</span>
                  </div>
                  <h6 className="font-semibold text-foreground mb-1">Patriotismo</h6>
                  <p className="text-xs text-muted-foreground">Amor por Angola</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* História e Comunidade Card */}
        <div className="w-full rounded-lg border shadow-sm border-border col-span-1 flex flex-col justify-between gap-4 bg-card overflow-hidden hover-elevate" data-testid="card-history-community">
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-chart-4" />
              </div>
            </div>
            <h5 className="font-sans antialiased font-bold text-lg md:text-xl lg:text-2xl text-foreground mb-2 text-center" data-testid="text-history-title">
              Nossa Comunidade
            </h5>
            <p className="font-sans antialiased text-base text-center mb-0 max-w-xs mx-auto font-normal text-muted-foreground" data-testid="text-history-summary">
              Unidos desde sempre pelo lema "R Onten, R Hoje, R Sempre"
            </p>
          </div>
          
          {/* Avatars Section */}
          <div className="flex items-center justify-center -space-x-6 p-4" data-testid="community-avatars">
            <div className="w-16 h-16 bg-primary/20 rounded-full border-2 border-border flex items-center justify-center hover:z-10 focus:z-10 transition-all">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="w-16 h-16 bg-chart-2/20 rounded-full border-2 border-border flex items-center justify-center hover:z-10 focus:z-10 transition-all">
              <Eye className="w-6 h-6 text-chart-2" />
            </div>
            <div className="w-16 h-16 bg-chart-3/20 rounded-full border-2 border-border flex items-center justify-center hover:z-10 focus:z-10 transition-all">
              <Heart className="w-6 h-6 text-chart-3" />
            </div>
            <div className="w-16 h-16 bg-chart-4/20 rounded-full border-2 border-border flex items-center justify-center hover:z-10 focus:z-10 transition-all">
              <History className="w-6 h-6 text-chart-4" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-primary/10 to-chart-4/10 rounded-lg p-6 text-center">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-xs text-muted-foreground">Associados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-chart-2">50+</div>
                  <div className="text-xs text-muted-foreground">Convénios</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-chart-3">R Sempre</div>
                  <div className="text-xs text-muted-foreground">Nosso Lema</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto mt-16 text-center max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12">
          <Building className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4" data-testid="text-cta-title">
            Junte-se à Nossa Família
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Faça parte da maior associação de profissionais do espectro rádio eletrónico em Angola. 
            Juntos somos mais fortes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hover-elevate" data-testid="button-join">
              <Users className="w-5 h-5 mr-2" />
              Tornar-se Associado
            </Button>
            <Button variant="outline" size="lg" className="hover-elevate" data-testid="button-learn-more">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;