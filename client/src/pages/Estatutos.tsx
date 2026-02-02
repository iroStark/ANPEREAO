import { useLocation } from "wouter";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { File02Icon as FileText, Download01Icon as Download, Calendar03Icon as Calendar, ArrowLeft01Icon as ArrowLeft } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLegislationById } from "@/hooks/useLegislation";
import { Link } from "wouter";

const Estatutos = () => {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || location.split('/').pop();

  const { data: legislation, isLoading, error } = useLegislationById(id || '');

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar estatutos: {error.message}</p>
          <Link href="/legislacao">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Legislação
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-muted-foreground">Carregando estatutos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!legislation) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-muted-foreground">Estatutos não encontrados.</p>
          <Link href="/legislacao">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Legislação
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse o conteúdo HTML/texto
  const formatContent = (content: string | undefined) => {
    if (!content) return null;
    
    // Se já for HTML, limpar e melhorar formatação
    if (content.includes('<')) {
      // Remover asteriscos, cardinais e outros marcadores markdown
      let cleaned = content
        .replace(/\*\*/g, '') // Remove ** (negrito markdown)
        .replace(/\*/g, '') // Remove * (itálico markdown)
        .replace(/#{1,6}\s/g, '') // Remove # (títulos markdown)
        .replace(/---/g, '<hr class="my-8 border-t-2 border-border" />') // Converte --- em HR
        .replace(/--/g, '—'); // Converte -- em em-dash
      
      // Garantir que os títulos tenham negrito
      cleaned = cleaned.replace(/<h([1-6])/g, '<h$1 class="font-bold"');
      
      return cleaned;
    }
    
    // Converter texto simples para HTML
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += '<br />';
        continue;
      }
      
      // Remover asteriscos e cardinais
      let cleanLine = trimmed.replace(/^[*#]+\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
      
      // Detectar CAPÍTULOS (linhas em maiúsculas com CAPÍTULO)
      if (cleanLine.match(/^CAPÍTULO\s+[IVX]+/i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2 class="text-3xl font-bold mt-10 mb-4 text-primary">${cleanLine}</h2>`;
        continue;
      }
      
      // Detectar subtítulos de capítulo
      if (cleanLine.match(/^(Da|Dos|Das|Do)\s+/i) && i > 0 && lines[i-1]?.trim().match(/^CAPÍTULO/i)) {
        html += `<h3 class="text-xl font-semibold mb-6 text-foreground">${cleanLine}</h3>`;
        continue;
      }
      
      // Detectar ARTIGOS
      if (cleanLine.match(/^Artigo\s+\d+\./i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h4 class="text-lg font-bold mt-6 mb-3 text-foreground">${cleanLine}</h4>`;
        continue;
      }
      
      // Detectar subtítulos de artigo (entre parênteses)
      if (cleanLine.match(/^\([^)]+\)$/)) {
        html += `<p class="italic mb-3 text-muted-foreground">${cleanLine}</p>`;
        continue;
      }
      
      // Detectar listas (linhas começando com a), b), c), etc)
      if (cleanLine.match(/^[a-z]\)\s/)) {
        if (!inList) {
          html += '<ul class="list-disc list-inside mb-4 space-y-2 ml-6">';
          inList = true;
        }
        const itemText = cleanLine.replace(/^[a-z]\)\s/, '');
        html += `<li class="mb-2">${itemText}</li>`;
        continue;
      }
      
      // Fechar lista se necessário
      if (inList && !cleanLine.match(/^[a-z]\)\s/)) {
        html += '</ul>';
        inList = false;
      }
      
      // Parágrafos normais
      html += `<p class="mb-4 leading-relaxed">${cleanLine}</p>`;
    }
    
    if (inList) {
      html += '</ul>';
    }
    
    return html;
  };

  const formattedContent = formatContent(legislation.content);

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto">
          <Link href="/legislacao">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Legislação
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <Badge variant="secondary">{legislation.year}</Badge>
              <Badge variant="outline">{legislation.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {legislation.title}
            </h1>
            {legislation.description && (
              <p className="text-lg text-muted-foreground">
                {legislation.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {legislation.publishedAt && (
                    <span>
                      Publicado em {new Date(legislation.publishedAt).toLocaleDateString('pt-PT')}
                    </span>
                  )}
                </div>
                {legislation.fileUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={legislation.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {formattedContent ? (
                <div 
                  className="text-foreground [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-0 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-primary [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-6 [&_h3]:mt-0 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mb-3 [&_h4]:mt-6 [&_h5]:text-base [&_h5]:font-bold [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:mb-2 [&_hr]:my-8 [&_hr]:border-t-2"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              ) : legislation.fileUrl ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Visualização do conteúdo não disponível. Por favor, baixe o PDF.
                  </p>
                  <Button asChild>
                    <a href={legislation.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Conteúdo não disponível no momento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Estatutos;

