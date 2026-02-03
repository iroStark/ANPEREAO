import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft02Icon as ArrowLeft, 
  Calendar03Icon as Calendar,
  Download04Icon as Download,
  File02Icon as FileIcon,
  Megaphone01Icon as Megaphone
} from 'hugeicons-react';
import { Publication } from '@/hooks/usePublications';

const categoryColors: Record<string, string> = {
  "Comunicado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Circular": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Plano": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Relatório": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Acta": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export default function PublicacaoDetalhes() {
  const { id } = useParams<{ id: string }>();

  const { data: publication, isLoading, error } = useQuery<Publication>({
    queryKey: ['publication', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/publications/${id}`);
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Publicação não encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A publicação que você está procurando não existe ou foi removida.
            </p>
            <Link href="/publicacoes">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Publicações
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/publicacoes">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Publicações
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header da Publicação */}
          <div className="mb-8">
            <Badge className={categoryColors[publication.category] || "bg-gray-100 text-gray-800"}>
              {publication.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
              {publication.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publication.date}</span>
              </div>
            </div>
          </div>

          {/* Imagem (se existir) */}
          {publication.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={publication.imageUrl} 
                alt={publication.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Conteúdo */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detalhes
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-lg leading-relaxed">
                  {publication.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Anexo (se existir) */}
          {(publication.fileUrl || publication.downloadUrl) && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Anexo
                </h2>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Documento anexado
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Clique para baixar o documento completo
                    </p>
                  </div>
                  <a 
                    href={publication.fileUrl || publication.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/publicacoes">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver Todas as Publicações
              </Button>
            </Link>
            {(publication.fileUrl || publication.downloadUrl) && (
              <a 
                href={publication.fileUrl || publication.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Documento
                </Button>
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
