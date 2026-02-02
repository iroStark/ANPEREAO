import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { HPHButton, HPHCard, HPHBadge, HPHModal, HPHTabSwitcher } from "@/components/ui/hph";
import { useTimelineEvents, type TimelineEvent } from "@/hooks/useTimelineEvents";
import { 
  Target02Icon as Target, 
  ViewIcon as Eye, 
  FavouriteIcon as Heart, 
  UserGroupIcon as Users, 
  Time01Icon as History, 
  Building04Icon as Building, 
  ArrowRight01Icon as ArrowRight, 
  Call02Icon as Phone, 
  Mail01Icon as Mail, 
  Location01Icon as MapPin,
  Award01Icon as Award,
  ChartIncreaseIcon as TrendingUp,
  Shield02Icon as Shield,
  FlashIcon as Zap,
  Globe02Icon as Globe,
  StarIcon as Star
} from "hugeicons-react";
import DynamicSeparator from "@/components/DynamicSeparator";
// SVG-based background - no image imports needed

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 200
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

const floatAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch timeline events from database
  const { data: timelineEvents = [], isLoading: isLoadingTimeline } = useTimelineEvents();
  
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  // Função para navegar e fazer scroll suave até uma seção
  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      // Se não estiver na home, navegar primeiro e armazenar a seção no sessionStorage
      sessionStorage.setItem('scrollToSection', sectionId);
      setLocation('/');
    } else {
      // Se já estiver na home, fazer scroll direto
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 100; // Offset para o menu fixo
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  // Efeito para fazer scroll quando chegar na home após navegação
  useEffect(() => {
    if (location === '/') {
      const sectionToScroll = sessionStorage.getItem('scrollToSection');
      if (sectionToScroll) {
        sessionStorage.removeItem('scrollToSection');
        setTimeout(() => {
          const element = document.getElementById(sectionToScroll);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Se for mission-vision, ativar a aba mission
            if (sectionToScroll === 'mission-vision') {
              setActiveTab('mission');
            }
          }
        }, 300); // Aguardar a página carregar
      }
    }
  }, [location]);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  const values = [
    { id: "humanidade", title: "Humanidade", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", description: "Tratamos cada associado com dignidade e respeito" },
    { id: "unidade", title: "Unidade", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", description: "Fortalecemos os laços entre profissionais" },
    { id: "solidariedade", title: "Solidariedade", icon: Shield, color: "text-green-500", bg: "bg-green-500/10", description: "Apoiamos mutuamente nossos membros" },
    { id: "patriotismo", title: "Patriotismo", icon: Globe, color: "text-yellow-500", bg: "bg-yellow-500/10", description: "Contribuímos para o desenvolvimento de Angola" }
  ];

  const stats = [
    { number: "1000+", label: "Associados Ativos", icon: Users },
    { number: "15+", label: "Anos de História", icon: History },
    { number: "50+", label: "Convénios Ativos", icon: Building },
    { number: "24/7", label: "Suporte Disponível", icon: Phone }
  ];

  // Use timeline events from database, fallback to empty array if loading
  const timeline = timelineEvents.length > 0 
    ? timelineEvents 
    : [
        { year: "2008", event: "Fundação da ANPERE", description: "Criação oficial da associação", id: "1" },
        { year: "2012", event: "Primeiros Convénios", description: "Estabelecimento de parcerias estratégicas", id: "2" },
        { year: "2018", event: "Expansão Nacional", description: "Presença em todas as províncias", id: "3" },
        { year: "2023", event: "Modernização Digital", description: "Plataformas digitais para associados", id: "4" }
  ];

  const handleEventClick = (event: TimelineEvent | typeof timeline[0]) => {
    // If it's a TimelineEvent from database, use it directly
    if ('id' in event && 'details' in event) {
      setSelectedEvent(event as TimelineEvent);
      setIsModalOpen(true);
    } else {
      // Fallback for hardcoded events
      setSelectedEvent({
        id: event.id || '',
        year: event.year,
        event: event.event,
        description: event.description,
        details: event.description, // Use description as details for fallback
      } as TimelineEvent);
      setIsModalOpen(true);
    }
  };

  const tabs = [
    { id: "mission", label: "Missão", icon: Target },
    { id: "vision", label: "Visão", icon: Eye },
    { id: "values", label: "Valores", icon: Heart }
  ];

  return (
    <section className="relative overflow-hidden bg-background -mt-20">
      {/* Hero Section with Parallax */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center"
        style={{ position: 'relative' }}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Parallax Background with SVG Pattern */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          {/* Remove colored background gradient - keep only abstract pattern */}
          
          {/* Abstract SVG Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
              </linearGradient>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="url(#grad1)" strokeWidth="1"/>
              </pattern>
            </defs>
            
            {/* Network/Grid Pattern */}
            <rect width="100%" height="100%" fill="url(#grid)" className="text-muted-foreground" />
            
            {/* Floating Circles - representing radio waves/signals */}
            <motion.circle 
              cx="200" 
              cy="200" 
              r={50}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-20"
              style={{ transformOrigin: '200px 200px' }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                strokeWidth: [1, 3, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle 
              cx="800" 
              cy="300" 
              r={40}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-15"
              style={{ transformOrigin: '800px 300px' }}
              animate={{
                scale: [0.75, 1.25, 0.75],
                strokeWidth: [1, 2, 1]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.circle 
              cx="150" 
              cy="700" 
              r={35}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-10"
              style={{ transformOrigin: '150px 700px' }}
              animate={{
                scale: [0.7, 1.3, 0.7],
                strokeWidth: [1, 2.5, 1]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            {/* Connection Lines - representing telecommunications */}
            <motion.path
              d="M 200 200 Q 500 100 800 300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="text-muted-foreground opacity-15"
              animate={{
                strokeDashoffset: [0, -20, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.path
              d="M 150 700 Q 400 400 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3,3"
              className="text-muted-foreground opacity-10"
              animate={{
                strokeDashoffset: [0, -15, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />
            
            {/* Geometric Shapes */}
            <motion.polygon
              points="700,500 750,450 800,500 750,550"
              fill="currentColor"
              className="text-muted-foreground opacity-8"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.rect
              x="100"
              y="400"
              width="60"
              height="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground opacity-10"
              animate={{
                rotate: [0, -360]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        </motion.div>

        {/* Floating Geometric Shapes */}
        <motion.div
          animate={floatAnimation}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 2 } }}
          className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-chart-3/20 to-chart-4/20 rounded-full blur-xl"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-3xl p-8 lg:p-12 border border-white/20"
          >
            <motion.div variants={itemVariants}>
              <HPHBadge variant="primary" className="mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Sobre a ANPERE
              </HPHBadge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent"
            >
              Unidos pelo Futuro
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/associar-se">
                <HPHButton size="lg" className="group" data-testid="button-join-us">
                  Junte-se a Nós
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </HPHButton>
              </Link>
              <HPHButton 
                variant="outline" 
                size="lg" 
                className="backdrop-blur-sm bg-white/10 border-white/20"
                onClick={() => scrollToSection('quem-somos')}
              >
                Saiba Mais
              </HPHButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Separator */}
      <DynamicSeparator />

      {/* Mission, Vision & Values - Interactive Tabs */}
      <motion.div
        className="py-12 bg-gradient-to-b from-background to-muted/20"
        initial="hidden"
        animate={cardsInView ? "visible" : "hidden"}
        variants={containerVariants}
        ref={cardsRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Pilares
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os fundamentos que guiam nossa missão de servir os profissionais de telecomunicações
            </p>
          </motion.div>

          {/* Interactive Tabs */}
          <div className="flex justify-center mb-12">
            <HPHTabSwitcher 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>

          {/* Tab Content with Smooth Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
              id="mission-vision"
            >
              {activeTab === "mission" && (
                <div id="mission" className="scroll-mt-20">
                  <HPHCard className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-primary/20">
                          <Target className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                          Nossa Missão
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          Servir de forma integral todos os profissionais do espectro rádio eletrónico, 
                          proporcionando assistência social, médica, jurídica, cultural e desportiva, 
                          fortalecendo nossa comunidade profissional.
                        </p>
                      </div>
                      <div className="p-8 md:p-12 md:w-1/2 bg-muted/30">
                        <div className="space-y-8">
                          <div className="group">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Shield className="w-4 h-4" />
                              </div>
                              <h4 className="font-bold text-foreground">Assistência Integral</h4>
                            </div>
                            <ul className="space-y-2 ml-11">
                              {['Apoio médico-medicamentoso', 'Assistência jurídica especializada', 'Programas culturais e desportivos'].map((item, i) => (
                                <li key={i} className="flex items-center text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="group">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Users className="w-4 h-4" />
                              </div>
                              <h4 className="font-bold text-foreground">Apoio Familiar</h4>
                            </div>
                            <ul className="space-y-2 ml-11">
                              {['Suporte aos descendentes', 'Assistência aos ascendentes', 'Programas de confraternização'].map((item, i) => (
                                <li key={i} className="flex items-center text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HPHCard>
                </div>
              )}

              {activeTab === "vision" && (
                <div id="vision" className="scroll-mt-20">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-chart-2/20 to-transparent blur-3xl rounded-full opacity-50" />
                      <HPHCard className="relative border-chart-2/20 bg-card/50 backdrop-blur-sm p-8 text-center h-full flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-chart-2/10 to-transparent rounded-full flex items-center justify-center mb-6 ring-1 ring-chart-2/20">
                          <Eye className="w-10 h-10 text-chart-2" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Ser reconhecida como a associação mutualista de referência em Angola, 
                          sendo o porto seguro de todos os profissionais do espectro rádio eletrónico nacional.
                        </p>
                      </HPHCard>
                    </div>
                    
                    <div className="md:col-span-7 grid gap-4">
                      {[
                        { icon: Award, title: "Referência Nacional", desc: "Reconhecimento como líder em assistência mutualista em todo território angolano" },
                        { icon: Shield, title: "Porto Seguro", desc: "Garantia de proteção, estabilidade e apoio integral para cada associado" },
                        { icon: TrendingUp, title: "Excelência Contínua", desc: "Superação constante das expectativas através da melhoria contínua dos serviços" }
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <HPHCard key={i} hover className="flex items-start gap-4 p-5 transition-all hover:bg-chart-2/5 border-l-4 border-l-transparent hover:border-l-chart-2">
                            <div className="mt-1 min-w-fit">
                              <Icon className="w-6 h-6 text-chart-2" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </HPHCard>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "values" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const IconComponent = value.icon;
                    return (
                      <motion.div
                        key={value.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HPHCard hover className="h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-t-4 border-t-transparent hover:border-t-primary">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${value.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <IconComponent className={`w-6 h-6 ${value.color}`} />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                              </div>
                            </div>
                          </HPHCard>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats Section with Counter Animation */}
      <motion.div
        ref={statsRef}
        className="py-12 bg-gradient-to-r from-primary/5 via-chart-2/5 to-chart-3/5"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Nossa Força em Números
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", damping: 18, stiffness: 300 }}
                  className="text-center"
                  onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <HPHCard className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <motion.div
                        animate={{
                          scale: hoveredCard === `stat-${index}` ? 1.2 : 1,
                          rotate: hoveredCard === `stat-${index}` ? 360 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <IconComponent className="w-8 h-8 text-primary" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2, type: "spring" }}
                        className="text-3xl lg:text-4xl font-bold text-primary mb-2"
                      >
                        {stat.number}
                      </motion.div>
                      <p className="text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground">{stat.label}</p>
                    </HPHCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        id="history"
        ref={timelineRef}
        className="py-12 bg-background"
        initial="hidden"
        animate={timelineInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Nossa História
            </h2>
            <p className="text-xl text-muted-foreground">
              Marcos importantes na história da ANPERE
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-chart-2 to-chart-3 rounded-full" />

            <div className="space-y-8 md:space-y-16">
              {isLoadingTimeline ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando eventos...</p>
                </div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum evento disponível.</p>
                </div>
              ) : (
                timeline.map((item, index) => (
                <motion.div
                    key={item.id || index}
                  variants={itemVariants}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="w-full md:w-5/12 mb-8 md:mb-0">
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <HPHCard 
                          className={`p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 mx-4 md:mx-0 ${
                            index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                          }`}
                          onClick={() => handleEventClick(item)}
                        >
                        <HPHBadge variant="primary" className="mb-3">
                          {item.year}
                        </HPHBadge>
                        <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                        <p className="text-muted-foreground text-sm md:text-base">{item.description}</p>
                            {(item as TimelineEvent).details && (
                              <HPHButton 
                                variant="ghost" 
                                size="sm" 
                                className="mt-3 text-primary hover:text-primary/80 p-0 h-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(item);
                                }}
                              >
                                Ver detalhes <ArrowRight className="ml-2 w-4 h-4" />
                              </HPHButton>
                            )}
                    </HPHCard>
                      </motion.div>
                  </div>
                  
                  <div className="relative flex items-center justify-center md:w-auto">
                    {/* Linha vertical visível apenas no mobile para conectar os pontos */}
                    <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-chart-2 to-chart-3 -z-10 md:hidden" style={{ top: '-2rem', bottom: '-2rem' }} />
                    
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                        className="w-12 h-12 md:w-8 md:h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center relative z-10 cursor-pointer shadow-lg md:shadow-none"
                        onClick={() => handleEventClick(item)}
                    >
                      <Star className="w-6 h-6 md:w-4 md:h-4 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="hidden md:block w-5/12" />
                </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-20 bg-gradient-to-br from-primary via-[hsl(220_85%_20%)] to-[hsl(220_85%_15%)] dark:from-primary dark:via-[hsl(220_85%_20%)] dark:to-[hsl(220_85%_15%)] text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern - Radio Waves / Network Connections */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <radialGradient id="waveGradient1" cx="50%" cy="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="waveGradient2" cx="50%" cy="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Radio Wave Patterns - Representing Telecommunications */}
            <motion.circle
              cx="200"
              cy="150"
              r={80}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
              style={{ transformOrigin: '200px 150px' }}
              initial={{ opacity: 0.3 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="200"
              cy="150"
              r={120}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white"
              style={{ transformOrigin: '200px 150px' }}
              initial={{ opacity: 0.2 }}
              animate={{ 
                scale: [1, 1.33, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.circle
              cx="200"
              cy="150"
              r={160}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white"
              style={{ transformOrigin: '200px 150px' }}
              initial={{ opacity: 0.15 }}
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />

            {/* Network Connection Nodes - Representing Association Unity */}
            <motion.circle
              cx="400"
              cy="300"
              r={8}
              fill="currentColor"
              className="text-white"
              style={{ transformOrigin: '400px 300px' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="600"
              cy="200"
              r={8}
              fill="currentColor"
              className="text-white"
              style={{ transformOrigin: '600px 200px' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            />
            <motion.circle
              cx="800"
              cy="400"
              r={8}
              fill="currentColor"
              className="text-white"
              style={{ transformOrigin: '800px 400px' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6
              }}
            />
            <motion.circle
              cx="1000"
              cy="250"
              r={8}
              fill="currentColor"
              className="text-white"
              style={{ transformOrigin: '1000px 250px' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9
              }}
            />

            {/* Connection Lines - Representing Unity and Collaboration */}
            <motion.line
              x1="400"
              y1="300"
              x2="600"
              y2="200"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.line
              x1="600"
              y1="200"
              x2="800"
              y2="400"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.line
              x1="800"
              y1="400"
              x2="1000"
              y2="250"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.line
              x1="400"
              y1="300"
              x2="1000"
              y2="250"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />

            {/* Electronic Signal Patterns - Representing Radio Electronics */}
            <motion.path
              d="M 100 450 Q 200 400, 300 450 T 500 450"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.path
              d="M 700 500 Q 800 450, 900 500 T 1100 500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </svg>
        </div>

        {/* Animated Background Elements - Gradient Orbs */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.4, 1],
            x: [0, 40, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-20 w-60 h-60 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full blur-2xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Building className="w-20 h-20 mx-auto mb-8 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Faça Parte da Nossa Família
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Junte-se a mais de 1000 profissionais que confiam na ANPERE. 
              Juntos, construímos um futuro melhor para as telecomunicações em Angola.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <HPHButton size="lg" variant="secondary" className="group" asChild>
              <Link href="/associar-se">
                <Users className="w-5 h-5 mr-2" />
                Tornar-se Associado
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </HPHButton>
            
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+244 976 519 388</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>geral@anpere.ao</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Timeline Event Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <HPHModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            title={selectedEvent.event}
            description="Detalhes do evento histórico"
          >
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <HPHBadge variant="primary">
                  {selectedEvent.year}
                </HPHBadge>
              </div>
              {selectedEvent.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-border mt-4">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.event}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="mt-4">
                <h4 className="text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground mb-2">Descrição</h4>
                <p className="text-foreground">{selectedEvent.description}</p>
              </div>
              {selectedEvent.details && (
                <div className="mt-4">
                  <h4 className="text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground mb-2">Detalhes</h4>
                  <p className="text-foreground whitespace-pre-line text-sm">{selectedEvent.details}</p>
                </div>
              )}
            </div>
          </HPHModal>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;