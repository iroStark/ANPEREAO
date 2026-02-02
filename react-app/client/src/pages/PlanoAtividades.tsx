import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { Calendar03Icon as Calendar, Location01Icon as MapPin, Clock01Icon as Clock, UserGroupIcon as Users, File02Icon as FileText, ArrowLeft01Icon as ArrowLeft, ArrowRight01Icon as ChevronRight } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActivityPlan, useAllActivityPlans, useActivityPlanById, ActivityPlanItem } from "@/hooks/useActivityPlan";

const PlanoAtividades = () => {
  const [location, setLocation] = useLocation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Get all plans for listing
  const { data: allPlans = [], isLoading: plansLoading } = useAllActivityPlans();
  
  // Get active plan as default
  const { data: activePlan } = useActivityPlan();
  
  // If a plan ID is in URL, use it
  const params = new URLSearchParams(window.location.search);
  const planIdFromUrl = params.get('id');
  const currentPlanId = selectedPlanId || planIdFromUrl;
  
  // Fetch specific plan if ID is provided
  const { data: selectedPlanDetails, isLoading: planDetailsLoading } = useActivityPlanById(currentPlanId || '');
  
  // Determine which plan to show
  const plan = currentPlanId && selectedPlanDetails
    ? selectedPlanDetails
    : activePlan || allPlans.find(p => p.isActive) || allPlans[0];

  // Organizar itens por número, agrupando sub-itens
  const organizeItems = (items: ActivityPlanItem[] = []) => {
    if (!items || items.length === 0) return [];
    
    const itemsMap = new Map<string, ActivityPlanItem & { children?: ActivityPlanItem[] }>();
    
    // Primeiro, adicionar todos os itens principais ao map
    items.forEach(item => {
      if (!item.parentId) {
        // É um item principal
        itemsMap.set(item.id, { ...item, children: [] });
      }
    });
    
    // Depois, adicionar os sub-itens aos seus pais
    items.forEach(item => {
      if (item.parentId) {
        // É um sub-item
        const parent = itemsMap.get(item.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(item);
        }
      }
    });
    
    return Array.from(itemsMap.values()).sort((a, b) => a.order - b.order);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    // Update URL without reload
    const newUrl = `/plano-atividades?id=${planId}`;
    window.history.pushState({}, '', newUrl);
    setLocation(newUrl);
  };

  const handleBackToList = () => {
    setSelectedPlanId(null);
    setLocation('/plano-atividades');
  };

  const organizedItems = plan?.items ? organizeItems(plan.items) : [];

  // Show list of plans if no specific plan is selected
  if (!planIdFromUrl && !selectedPlanId && allPlans.length > 1) {
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
                Planos de Atividades
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Selecione um plano para visualizar os detalhes das atividades
              </p>
            </motion.div>
          </div>
        </section>

        {/* Plans List */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {plansLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando planos...</p>
              </div>
            ) : allPlans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum plano de atividades disponível.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlans.map((planItem, index) => (
                  <motion.div
                    key={planItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handlePlanSelect(planItem.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{planItem.year}</Badge>
                          {planItem.isActive && (
                            <Badge variant="default">Ativo</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{planItem.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {planItem.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {planItem.description}
                          </p>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanSelect(planItem.id);
                          }}
                        >
                          Ver Detalhes
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Show plan details
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
            {allPlans.length > 1 && (
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Lista de Planos
              </Button>
            )}
            <Badge className="mb-4" variant="secondary">
              {plan?.year || '2025'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {plan?.title || 'Plano de Atividades'}
            </h1>
            {plan?.description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {plan.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Activities Table */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {(plansLoading || planDetailsLoading) ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando plano de atividades...</p>
            </div>
          ) : !plan || organizedItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum plano de atividades disponível no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Plano de Atividades - {plan.year}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="text-left p-4 font-semibold text-sm">N°</th>
                        <th className="text-left p-4 font-semibold text-sm">ATIVIDADE</th>
                        <th className="text-left p-4 font-semibold text-sm">DATA</th>
                        <th className="text-left p-4 font-semibold text-sm">HORA</th>
                        <th className="text-left p-4 font-semibold text-sm">LOCAL</th>
                        <th className="text-left p-4 font-semibold text-sm">PARTICIPANTES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizedItems.map((item, idx) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 font-medium text-primary">{item.number}</td>
                          <td className="p-4">
                            <div className="font-medium">{item.activity}</div>
                            {item.children && item.children.length > 0 && (
                              <div className="mt-2 space-y-1 ml-4 text-sm text-muted-foreground">
                                {item.children.map((child) => (
                                  <div key={child.id} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{child.activity}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              {item.date && (
                                <>
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span>{item.date}</span>
                                </>
                              )}
                            </div>
                            {item.children && item.children.map((child) => (
                              child.date && (
                                <div key={child.id} className="flex items-center gap-2 text-sm text-muted-foreground mt-1 ml-4">
                                  <Calendar className="w-3 h-3" />
                                  <span>{child.date}</span>
                                </div>
                              )
                            ))}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              {item.time && (
                                <>
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span>{item.time}</span>
                                </>
                              )}
                            </div>
                            {item.children && item.children.map((child) => (
                              child.time && (
                                <div key={child.id} className="flex items-center gap-2 text-sm text-muted-foreground mt-1 ml-4">
                                  <Clock className="w-3 h-3" />
                                  <span>{child.time}</span>
                                </div>
                              )
                            ))}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              {item.location && (
                                <>
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span>{item.location}</span>
                                </>
                              )}
                            </div>
                            {item.children && item.children.map((child) => (
                              child.location && (
                                <div key={child.id} className="flex items-center gap-2 text-sm text-muted-foreground mt-1 ml-4">
                                  <MapPin className="w-3 h-3" />
                                  <span>{child.location}</span>
                                </div>
                              )
                            ))}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              {item.participants && (
                                <>
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span>{item.participants}</span>
                                </>
                              )}
                            </div>
                            {item.children && item.children.map((child) => (
                              child.participants && (
                                <div key={child.id} className="flex items-center gap-2 text-sm text-muted-foreground mt-1 ml-4">
                                  <Users className="w-3 h-3" />
                                  <span>{child.participants}</span>
                                </div>
                              )
                            ))}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanoAtividades;
