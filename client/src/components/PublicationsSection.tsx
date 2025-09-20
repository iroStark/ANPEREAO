import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  ClipboardList, 
  FileCheck, 
  Megaphone, 
  CreditCard,
  Presentation,
  Download 
} from "lucide-react";

// Todo: remove mock functionality - replace with real document data
const publications = [
  {
    id: 1,
    title: "Plano de Actividades 2024",
    type: "plano",
    date: "2024-01-15",
    description: "Planeamento estratégico das atividades da ANPERE para o ano 2024",
    status: "Atual",
    icon: ClipboardList
  },
  {
    id: 2,
    title: "Relatório Anual 2023",
    type: "relatorio",
    date: "2024-02-28",
    description: "Relatório completo das atividades realizadas durante o ano de 2023",
    status: "Publicado",
    icon: FileCheck
  },
  {
    id: 3,
    title: "Agenda de Reunião - Março 2024",
    type: "agenda",
    date: "2024-03-01",
    description: "Agenda da reunião mensal da direção da ANPERE",
    status: "Próxima",
    icon: Calendar
  },
  {
    id: 4,
    title: "Acta da Reunião Geral",
    type: "acta",
    date: "2024-02-15",
    description: "Acta da última reunião geral dos associados",
    status: "Aprovada",
    icon: FileText
  },
  {
    id: 5,
    title: "Comunicado: Quotas 2024",
    type: "comunicado",
    date: "2024-01-30",
    description: "Comunicado oficial sobre o pagamento de quotas para 2024",
    status: "Ativo",
    icon: Megaphone
  },
  {
    id: 6,
    title: "Mapa de Quotas",
    type: "mapa",
    date: "2024-03-10",
    description: "Mapa atualizado do estado de pagamento das quotas dos associados",
    status: "Atualizado",
    icon: CreditCard
  }
];

const publicationTypes = [
  { name: "Todos", value: "all", count: publications.length },
  { name: "Planos", value: "plano", count: publications.filter(p => p.type === "plano").length },
  { name: "Relatórios", value: "relatorio", count: publications.filter(p => p.type === "relatorio").length },
  { name: "Agendas", value: "agenda", count: publications.filter(p => p.type === "agenda").length },
  { name: "Actas", value: "acta", count: publications.filter(p => p.type === "acta").length },
  { name: "Comunicados", value: "comunicado", count: publications.filter(p => p.type === "comunicado").length },
];

const PublicationsSection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-publications-title">
            Publicações
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-publications-intro">
            Acesso a documentos oficiais, relatórios, agendas e comunicados da ANPERE
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {publicationTypes.map((type) => (
            <Button
              key={type.value}
              variant={type.value === "all" ? "default" : "outline"}
              className="flex items-center gap-2"
              data-testid={`button-filter-${type.value}`}
            >
              {type.name}
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Publications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {publications.map((publication) => {
            const IconComponent = publication.icon;
            return (
              <Card key={publication.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          {publication.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight" data-testid={`text-publication-title-${publication.id}`}>
                    {publication.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-publication-description-${publication.id}`}>
                    {publication.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(publication.date).toLocaleDateString('pt-PT')}
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2 text-primary"
                      data-testid={`button-download-${publication.id}`}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Presentations Section */}
        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center">
              <Presentation className="w-6 h-6 text-primary mr-3" />
              <CardTitle data-testid="text-presentations-title">Apresentações</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6" data-testid="text-presentations-description">
              Apresentações técnicas e institucionais da ANPERE, incluindo seminários, workshops e conferências.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-background rounded-lg">
                <FileText className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h4 className="font-medium text-foreground">Seminário Técnico 2024</h4>
                  <p className="text-sm text-muted-foreground">Inovações em telecomunicações</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto" data-testid="button-presentation-1">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center p-4 bg-background rounded-lg">
                <FileText className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h4 className="font-medium text-foreground">Workshop Espectro Rádio</h4>
                  <p className="text-sm text-muted-foreground">Gestão do espectro eletrónico</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto" data-testid="button-presentation-2">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PublicationsSection;