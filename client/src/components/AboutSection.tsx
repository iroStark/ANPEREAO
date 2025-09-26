import { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  History, 
  Building, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star
} from "lucide-react";
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
  
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
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

  const timeline = [
    { year: "2008", event: "Fundação da ANPERE", description: "Criação oficial da associação" },
    { year: "2012", event: "Primeiros Convénios", description: "Estabelecimento de parcerias estratégicas" },
    { year: "2018", event: "Expansão Nacional", description: "Presença em todas as províncias" },
    { year: "2023", event: "Modernização Digital", description: "Plataformas digitais para associados" }
  ];

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
              r="50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-20"
              animate={{
                r: [40, 60, 40],
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
              r="40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-15"
              animate={{
                r: [30, 50, 30],
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
              r="35" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-muted-foreground opacity-10"
              animate={{
                r: [25, 45, 25],
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
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                Sobre a ANPERE
              </Badge>
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
              <Button size="lg" className="group hover-elevate">
                Junte-se a Nós
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-sm bg-white/10 border-white/20 hover-elevate">
                Saiba Mais
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

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
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveTab(tab.id)}
                  className="group hover-elevate"
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </motion.div>

          {/* Tab Content with Smooth Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {activeTab === "mission" && (
                <Card className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border-primary/20 hover-elevate">
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-center mb-6">Nossa Missão</h3>
                    <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
                      Servir de forma integral todos os profissionais do espectro rádio eletrónico, 
                      proporcionando assistência social, médica, jurídica, cultural e desportiva, 
                      fortalecendo nossa comunidade profissional.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">Assistência Integral</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Apoio médico-medicamentoso</li>
                          <li>• Assistência jurídica especializada</li>
                          <li>• Programas culturais e desportivos</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">Apoio Familiar</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Suporte aos descendentes</li>
                          <li>• Assistência aos ascendentes</li>
                          <li>• Programas de confraternização</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "vision" && (
                <Card className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border-chart-2/20 hover-elevate">
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center">
                        <Eye className="w-8 h-8 text-chart-2" />
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-center mb-6">Nossa Visão</h3>
                    <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
                      Ser reconhecida como a associação mutualista de referência em Angola, 
                      sendo o porto seguro de todos os profissionais do espectro rádio eletrónico nacional.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <Award className="w-12 h-12 text-chart-2 mx-auto mb-3" />
                        <h4 className="font-semibold mb-2">Referência Nacional</h4>
                        <p className="text-sm text-muted-foreground">Reconhecimento como líder em assistência mutualista</p>
                      </div>
                      <div className="text-center">
                        <Shield className="w-12 h-12 text-chart-2 mx-auto mb-3" />
                        <h4 className="font-semibold mb-2">Porto Seguro</h4>
                        <p className="text-sm text-muted-foreground">Proteção e apoio integral aos profissionais</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-chart-2 mx-auto mb-3" />
                        <h4 className="font-semibold mb-2">Excelência</h4>
                        <p className="text-sm text-muted-foreground">Superação das expectativas dos associados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "values" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const IconComponent = value.icon;
                    return (
                      <motion.div
                        key={value.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border-white/20 hover-elevate">
                          <CardContent className="p-6">
                            <div className={`w-12 h-12 ${value.bg} rounded-full flex items-center justify-center mb-4`}>
                              <IconComponent className={`w-6 h-6 ${value.color}`} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                            <p className="text-muted-foreground">{value.description}</p>
                          </CardContent>
                        </Card>
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
                  <Card className="backdrop-blur-lg bg-white/50 dark:bg-black/50 border-white/20 h-full">
                    <CardContent className="p-6">
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
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        ref={timelineRef}
        className="py-12 bg-background"
        initial="hidden"
        animate={timelineInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Nossa Jornada
            </h2>
            <p className="text-xl text-muted-foreground">
              Marcos importantes na história da ANPERE
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-chart-2 to-chart-3 rounded-full" />

            <div className="space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="w-5/12">
                    <Card className={`backdrop-blur-lg bg-white/50 dark:bg-black/50 border-white/20 hover-elevate ${
                      index % 2 === 0 ? 'mr-8' : 'ml-8'
                    }`}>
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/20">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center relative z-10"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-20 bg-gradient-to-br from-primary via-chart-2 to-chart-3 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full"
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
            <Button size="lg" variant="secondary" className="group hover-elevate">
              <Users className="w-5 h-5 mr-2" />
              Tornar-se Associado
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+244 xxx xxx xxx</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>geral@anpere.ao</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;