import { useLocation } from "wouter";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { UserIcon as User, Mail01Icon as Mail, Call02Icon as Phone, File02Icon as FileText, ArrowLeft01Icon as ArrowLeft, Building04Icon as Building2 } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrgaoSocialById } from "@/hooks/useOrgaosSociais";
import { Link } from "wouter";

const OrgaoSocialDetalhes = () => {
  const [location] = useLocation();
  const orgaoId = location.split('/').pop() || '';
  
  const { data: orgao, isLoading, error } = useOrgaoSocialById(orgaoId);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-red-500">Erro ao carregar órgão social: {error.message}</p>
          <Link href="/orgaos-sociais">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Órgãos Sociais
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
          <p className="text-muted-foreground">Carregando detalhes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orgao) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-muted-foreground">Órgão social não encontrado.</p>
          <Link href="/orgaos-sociais">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Órgãos Sociais
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto">
          <Link href="/orgaos-sociais">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Órgãos Sociais
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
              <Badge variant="secondary">{orgao.organType}</Badge>
            </div>
            {orgao.photoUrl ? (
              <img
                src={orgao.photoUrl}
                alt={orgao.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border-4 border-primary/20">
                <User className="w-16 h-16 text-primary" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {orgao.name}
            </h1>
            <Badge variant="default" className="text-lg px-4 py-2">
              {orgao.position}
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {orgao.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Biografia / Currículo
                  </h3>
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: orgao.bio.replace(/\n/g, '<br />') }}
                  />
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                {orgao.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a 
                        href={`mailto:${orgao.email}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {orgao.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {orgao.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <a 
                        href={`tel:${orgao.phone}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {orgao.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrgaoSocialDetalhes;

