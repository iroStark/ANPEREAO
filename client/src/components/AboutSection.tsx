import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Users, History, Building } from "lucide-react";

const mission = [
  "Delinear planos de assistência social, médico-medicamentosa, cultural, recreativa, desportiva e jurídica aos associados",
  "Prestar apoio material e moral aos descendentes e ascendentes dos associados tombados e falecidos",
  "Estabelecer convénios ou contratos com estabelecimentos comerciais, bancários, educacionais, culturais, de saúde",
  "Preservar e honrar a memória dos profissionais tombados e falecidos ao longo dos anos",
  "Congregar os membros por meio de acções culturais, desportivas e de confraternização",
  "Mobilizar sinergias no sentido de granjear reconhecimento da sociedade"
];

const vision = [
  "Tornar a ANPERE numa Associação de Carácter Mutualista de referência a nível da assistência social",
  "Tornar a ANPERE no Porto Seguro de todos os profissionais do espetro rádio electrónico nacional",
  "Estar à altura dos compromissos estatutários e das expectativas dos associados"
];

const values = ["Humanidade", "Unidade", "Solidariedade", "Patriotismo"];

const AboutSection = () => {
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

        {/* Mission, Vision, Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Mission */}
          <Card className="hover-elevate">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-primary" data-testid="text-mission-title">
                Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mission.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start" data-testid={`text-mission-item-${index}`}>
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="ghost" className="mt-4 text-primary" data-testid="button-mission-more">
                Ver mais detalhes
              </Button>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="hover-elevate">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-chart-2" />
              </div>
              <CardTitle className="text-xl text-chart-2" data-testid="text-vision-title">
                Visão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {vision.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start" data-testid={`text-vision-item-${index}`}>
                    <span className="w-2 h-2 bg-chart-2 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="hover-elevate">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-chart-3" />
              </div>
              <CardTitle className="text-xl text-chart-3" data-testid="text-values-title">
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="text-center" data-testid={`text-value-${index}`}>
                    <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg font-semibold text-chart-3">{value[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* History */}
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center mb-4">
                <History className="w-6 h-6 text-primary mr-3" />
                <CardTitle data-testid="text-history-title">Nossa História</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" data-testid="text-history-content">
                A ANPERE foi fundada com o objetivo de unir e representar os profissionais do espectro rádio eletrónico em Angola, 
                promovendo o desenvolvimento técnico e oferecendo apoio integral aos seus membros.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Lema:</strong> "R Onten, R Hoje, R Sempre"
              </p>
              <Button variant="outline" data-testid="button-history-more">
                Conhecer mais sobre nossa história
              </Button>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center mb-4">
                <Building className="w-6 h-6 text-primary mr-3" />
                <CardTitle data-testid="text-organization-title">Organização Social</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" data-testid="text-organization-content">
                Como associação de carácter mutualista, organizamos nossa estrutura para melhor servir os associados 
                através de departamentos especializados e uma liderança comprometida.
              </p>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>Organograma disponível para consulta</span>
              </div>
              <Button variant="outline" data-testid="button-organogram">
                Ver Organograma
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;