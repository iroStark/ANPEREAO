import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HPHButton } from "@/components/ui/hph";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu01Icon as Menu, 
  Cancel01Icon as X, 
  ArrowDown01Icon as ChevronDown, 
  UserAdd01Icon as UserPlus,
  Home01Icon as Home,
  UserGroupIcon as Users,
  Legal01Icon as Scale,
  Note01Icon as Notes,
  Calendar03Icon as Calendar,
  Image01Icon as Images,

  Book02Icon as History,
  Target02Icon as Target,
  HierarchyIcon as Hierarchy,
  Task01Icon as Task,
  Analytics01Icon as Analytics,
  File02Icon as File,
  Megaphone01Icon as Megaphone
} from "hugeicons-react";
const anpereLogo = "/favicon.png";

const FloatingMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 100; // Pixels para ativar o efeito
      setIsScrolled(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const publicationsItems = [
    { name: "Planos de Actividades", path: "/plano-atividades", icon: <Task className="w-4 h-4" /> },
    { name: "Relatórios Anuais", path: "/publicacoes", icon: <Analytics className="w-4 h-4" /> },
    { name: "Actas de Reunião", path: "/publicacoes", icon: <File className="w-4 h-4" /> },
    { name: "Comunicados", path: "/publicacoes", icon: <Megaphone className="w-4 h-4" /> },
  ];

  const aboutItems = [
    { name: "Nossa História", path: "/#history", hash: "history", icon: <History className="w-4 h-4" /> },
    { name: "Missão e Visão", path: "/#mission-vision", hash: "mission-vision", icon: <Target className="w-4 h-4" /> },
    { name: "Órgãos Sociais", path: "/orgaos-sociais", icon: <Hierarchy className="w-4 h-4" /> },
  ];

  const handleAboutNavigation = (item: typeof aboutItems[0]) => {
    if (item.hash) {
      // Se tem hash, navegar para home e fazer scroll
      if (location !== '/') {
        sessionStorage.setItem('scrollToSection', item.hash);
        setLocation('/');
      } else {
        setTimeout(() => {
          const element = document.getElementById(item.hash);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    } else {
      setLocation(item.path);
    }
    closeMenu();
  };

  return (
    <>
      <div 
        className={`fixed z-50 transition-all duration-500 ease-in-out top-0 left-0 w-full px-0 lg:px-4 ${
          isScrolled 
            ? 'lg:top-0 lg:left-0 lg:w-full lg:px-0' 
            : 'lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl'
        }`}
      >
        <nav 
          className={`transition-all duration-500 ease-in-out border-b lg:border border-border bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-md rounded-none ${
            isScrolled 
              ? 'lg:bg-white/80 lg:dark:bg-card/80 lg:shadow-md lg:rounded-none' 
              : 'lg:bg-white/95 lg:dark:bg-card/95 lg:shadow-lg lg:rounded-2xl'
          }`}
        >
          <div className={`transition-all duration-500 ease-in-out px-4 py-3 ${
            isScrolled ? 'lg:px-6 lg:py-3' : 'lg:px-6 lg:py-4'
          }`}>
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link
                href="/"
                className="flex-shrink-0 flex items-center"
                data-testid="logo-floating-menu"
              >
                <img 
                  src={anpereLogo}
                  alt="ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico"
                  className="h-12 w-auto"
                />
                <div className="ml-3">
                  <div className="text-lg font-bold">
                    <span className="text-foreground">AN</span>
                    <span className="text-primary">PERE</span>
                  </div>
                  {/* Texto Mobile (Sempre visível, quebra de linha) */}
                  <div className="block md:hidden text-[10px] leading-tight text-muted-foreground whitespace-normal max-w-[200px]">
                    Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
                  </div>
                  
                  {/* Texto Desktop (Só aparece com scroll, numa linha) */}
                  {isScrolled && (
                    <div className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">
                      Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
                    </div>
                  )}
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  data-testid="nav-home"
                >
                  {isScrolled && <Home className="w-4 h-4" />}
                  Página Inicial
                </Link>

                {/* About Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" data-testid="nav-about-dropdown">
                      {isScrolled && <Users className="w-4 h-4" />}
                      Quem Somos
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 mt-2" align="start">
                    {aboutItems.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        className="cursor-pointer"
                        onClick={() => handleAboutNavigation(item)}
                        data-testid={`dropdown-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          {item.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/legislacao"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  data-testid="nav-legislation"
                >
                  {isScrolled && <Scale className="w-4 h-4" />}
                  Legislação
                </Link>

                {/* Publications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" data-testid="nav-publications-dropdown">
                      {isScrolled && <Notes className="w-4 h-4" />}
                      Publicações
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 mt-2" align="start">
                    {publicationsItems.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        className="cursor-pointer"
                        data-testid={`dropdown-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Link href={item.path} className="w-full flex items-center gap-2" onClick={closeMenu}>
                          {item.icon}
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/eventos"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  data-testid="nav-events"
                >
                  {isScrolled && <Calendar className="w-4 h-4" />}
                  Eventos
                </Link>

                <Link
                  href="/galeria"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                  data-testid="nav-gallery"
                >
                  {isScrolled && <Images className="w-4 h-4" />}
                  Galeria
                </Link>
              </div>

              {/* CTA Button */}
              <div className="hidden lg:flex items-center">
                <HPHButton asChild variant="primary" className="rounded-full px-6">
                  <Link href="/associar-se" data-testid="button-associate" className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    {!isScrolled && "ASSOCIAR-SE"}
                  </Link>
                </HPHButton>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay (Full Screen) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden pt-24 px-6 overflow-y-auto pb-40">
          <div className="space-y-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 w-full text-left text-lg font-semibold text-foreground hover:text-primary py-3 border-b border-border"
              data-testid="nav-mobile-home"
            >
              <Home className="w-6 h-6" />
              Página Inicial
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-3 w-full text-left text-lg font-semibold text-foreground">
                <Users className="w-6 h-6" />
                Quem Somos
              </div>
              <div className="pl-6 space-y-3">
                {aboutItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleAboutNavigation(item)}
                    className="flex items-center gap-3 w-full text-left text-base text-muted-foreground hover:text-primary py-2"
                    data-testid={`nav-mobile-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/legislacao"
              onClick={closeMenu}
              className="flex items-center gap-3 w-full text-left text-lg font-semibold text-foreground hover:text-primary py-3 border-b border-border"
              data-testid="nav-mobile-legislation"
            >
              <Scale className="w-6 h-6" />
              Legislação
            </Link>

            <div className="space-y-3 border-b border-border pb-3">
              <div className="flex items-center gap-3 w-full text-left text-lg font-semibold text-foreground">
                <Notes className="w-6 h-6" />
                Publicações
              </div>
              <div className="pl-6 space-y-3">
                {publicationsItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={closeMenu}
                    className="flex items-center gap-3 w-full text-left text-base text-muted-foreground hover:text-primary py-2"
                    data-testid={`nav-mobile-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <HPHButton asChild variant="primary" className="w-full rounded-full h-12 text-lg">
                <Link href="/associar-se" onClick={closeMenu} data-testid="button-mobile-associate" className="flex items-center justify-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  ASSOCIAR-SE
                </Link>
              </HPHButton>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            onClick={closeMenu}
            className={`flex flex-col items-center gap-1 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className={`w-6 h-6 ${location === '/' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Início</span>
          </Link>

          <Link
            href="/eventos"
            onClick={closeMenu}
            className={`flex flex-col items-center gap-1 ${location === '/eventos' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Calendar className={`w-6 h-6 ${location === '/eventos' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Eventos</span>
          </Link>

          <Link
            href="/galeria"
            onClick={closeMenu}
            className={`flex flex-col items-center gap-1 ${location === '/galeria' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Images className={`w-6 h-6 ${location === '/galeria' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Galeria</span>
          </Link>

          <Link
            href="/publicacoes"
            onClick={closeMenu}
            className={`flex flex-col items-center gap-1 ${location === '/publicacoes' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Notes className={`w-6 h-6 ${location === '/publicacoes' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Public.</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center gap-1 ${isMenuOpen ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
        {/* Safe Area for iPhone Home Indicator */}
        <div className="h-6 w-full bg-background" /> 
      </div>
    </>
  );
};

export default FloatingMenu;