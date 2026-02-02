import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { UserGroupIcon as Users, Building04Icon as Building2, UserIcon as User, Mail01Icon as Mail, Call02Icon as Phone, File02Icon as FileText, ArrowRight01Icon as ArrowRight } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrgaosSociais, useOrgaosSociaisByType, OrgaoSocial } from "@/hooks/useOrgaosSociais";

const OrgaosSociais = () => {
  const { data: allOrgaos = [], isLoading } = useOrgaosSociais();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { data: orgaosByType = [] } = useOrgaosSociaisByType(selectedType || '');
  
  const orgaosToShow = selectedType ? orgaosByType : allOrgaos;
  
  // Group by organ type
  const groupedOrgaos = orgaosToShow.reduce((acc, orgao) => {
    if (!acc[orgao.organType]) {
      acc[orgao.organType] = [];
    }
    acc[orgao.organType].push(orgao);
    return acc;
  }, {} as Record<string, OrgaoSocial[]>);

  const organTypes = ['Assembleia Geral', 'Direcção', 'Conselho Fiscal'];

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Órgãos Sociais
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conheça os membros dos órgãos sociais da ANPERE
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              size="sm"
            >
              Todos
            </Button>
            {organTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Orgãos Sociais Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando órgãos sociais...</p>
            </div>
          ) : orgaosToShow.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum órgão social disponível.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedOrgaos).map(([type, orgaos]) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    {type}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orgaos.map((orgao, index) => (
                      <motion.div
                        key={orgao.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              {orgao.photoUrl ? (
                                <img
                                  src={orgao.photoUrl}
                                  alt={orgao.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-8 h-8 text-primary" />
                                </div>
                              )}
                              <div className="flex-1">
                                <CardTitle className="text-lg">{orgao.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1">
                                  {orgao.position}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {orgao.bio && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {orgao.bio}
                              </p>
                            )}
                            <Link href={`/orgaos-sociais/${orgao.id}`}>
                              <Button variant="outline" className="w-full">
                                Ver Detalhes
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrgaosSociais;

