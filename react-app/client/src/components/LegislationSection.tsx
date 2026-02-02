import { HPHCard, HPHCardHeader, HPHCardContent, HPHButton, HPHBadge } from '@/components/ui/hph';
import { 
  File02Icon as FileText, 
  Download01Icon as Download, 
  Legal01Icon as Scale, 
  Building04Icon as Building, 
  Calendar03Icon as Calendar 
} from "hugeicons-react";

// Todo: remove mock functionality - replace with real legislation data
const documents = [
  {
    id: 1,
    title: "Lei das Organizações",
    type: "Lei",
    description: "Lei geral que regulamenta o funcionamento das organizações profissionais em Angola",
    date: "2023-05-15",
    status: "Vigente",
    pages: 45,
    icon: Scale
  },
  {
    id: 2,
    title: "Estatuto Orgânico da ANPERE",
    type: "Estatuto",
    description: "Estatuto que define a estrutura organizacional e funcionamento da ANPERE",
    date: "2024-01-10",
    status: "Atual",
    pages: 28,
    icon: Building
  }
];

const LegislationSection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-legislation-title">
            Legislação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-legislation-intro">
            Documentos legais e normativos que regulamentam o funcionamento da ANPERE
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {documents.map((document) => {
            const IconComponent = document.icon;
            return (
              <HPHCard key={document.id} hover className="h-full">
                <HPHCardHeader>
                  <div className="w-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <HPHBadge variant="primary" className="mb-2">
                            {document.type}
                          </HPHBadge>
                          <HPHBadge variant={document.status === "Vigente" ? "green" : "gray"}>
                            {document.status}
                          </HPHBadge>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold" data-testid={`text-document-title-${document.id}`}>
                      {document.title}
                    </h4>
                  </div>
                </HPHCardHeader>
                <HPHCardContent>
                  <p className="text-muted-foreground mb-6" data-testid={`text-document-description-${document.id}`}>
                    {document.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(document.date).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {document.pages} páginas
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <HPHButton className="flex-1" data-testid={`button-view-document-${document.id}`}>
                      <FileText className="w-4 h-4 mr-2" />
                      Visualizar
                    </HPHButton>
                    <HPHButton variant="outline" data-testid={`button-download-document-${document.id}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </HPHButton>
                  </div>
                </HPHCardContent>
              </HPHCard>
            );
          })}
        </div>

        {/* Additional Information */}
        <HPHCard>
          <HPHCardHeader>
            <div className="flex items-center">
              <Scale className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-bold" data-testid="text-legal-info-title">Informações Legais</h3>
            </div>
          </HPHCardHeader>
          <HPHCardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-foreground mb-3">Base Legal</h4>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-legal-base">
                  A ANPERE opera conforme a legislação angolana para organizações profissionais, 
                  garantindo transparência e conformidade legal em todas as suas atividades.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Constituição:</span>
                    <span className="font-medium">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NIF:</span>
                    <span className="font-medium">5000379263</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">Associação Profissional</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Regulamentação</h4>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-regulation-info">
                  A ANPERE está sujeita à supervisão das autoridades competentes e cumpre 
                  rigorosamente com todas as obrigações legais e fiscais.
                </p>
                <HPHButton variant="outline" className="w-full" data-testid="button-legal-compliance">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Certificações e Licenças
                </HPHButton>
              </div>
            </div>
          </HPHCardContent>
        </HPHCard>
      </div>
    </section>
  );
};

export default LegislationSection;