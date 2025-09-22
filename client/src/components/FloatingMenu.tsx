import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";

const FloatingMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const publicationsItems = [
    { name: "Planos de Actividades", section: "publicacoes" },
    { name: "Relatórios Anuais", section: "publicacoes" },
    { name: "Actas de Reunião", section: "publicacoes" },
    { name: "Comunicados", section: "publicacoes" },
  ];

  const aboutItems = [
    { name: "Nossa História", section: "quem-somos" },
    { name: "Missão e Visão", section: "quem-somos" },
    { name: "Organograma", section: "quem-somos" },
    { name: "Diretoria", section: "quem-somos" },
  ];

  return (
    <div 
      className={`fixed z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'top-0 left-0 w-full px-0' 
          : 'top-4 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4'
      }`}
    >
      <nav 
        className={`transition-all duration-500 ease-in-out border border-border ${
          isScrolled 
            ? 'bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-md rounded-none' 
            : 'bg-white/95 dark:bg-card/95 backdrop-blur-sm shadow-lg rounded-2xl'
        }`}
      >
        <div className={`transition-all duration-500 ease-in-out ${
          isScrolled ? 'px-4 sm:px-6 py-3' : 'px-6 py-4'
        }`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              onClick={() => scrollToSection('home')} 
              className="flex-shrink-0 cursor-pointer"
              data-testid="logo-floating-menu"
            >
              <div className="text-xl font-bold">
                <span className="text-foreground">AN</span>
                <span className="text-primary">PERE</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Profissionais do Espectro Rádio
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection('home')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-home"
              >
                Home
              </button>

              {/* About Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" data-testid="nav-about-dropdown">
                    Quem Somos
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2" align="start">
                  {aboutItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => scrollToSection(item.section)}
                      className="cursor-pointer"
                      data-testid={`dropdown-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => scrollToSection('legislacao')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-legislation"
              >
                Legislação
              </button>

              {/* Publications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" data-testid="nav-publications-dropdown">
                    Publicações
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2" align="start">
                  {publicationsItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => scrollToSection(item.section)}
                      className="cursor-pointer"
                      data-testid={`dropdown-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => scrollToSection('eventos')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-events"
              >
                Eventos
              </button>

              <button
                onClick={() => scrollToSection('galeria')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-gallery"
              >
                Galeria
              </button>

              <button
                onClick={() => scrollToSection('contactos')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-contact"
              >
                Contactos
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <Button 
                onClick={() => scrollToSection('contactos')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-full"
                data-testid="button-associate"
              >
                ASSOCIAR-SE
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu-floating"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pt-6 border-t border-border">
              <div className="space-y-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-home"
                >
                  Home
                </button>

                <div className="space-y-2">
                  <button
                    onClick={() => scrollToSection('quem-somos')}
                    className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                    data-testid="nav-mobile-about"
                  >
                    Quem Somos
                  </button>
                  <div className="pl-4 space-y-2">
                    {aboutItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.section)}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-primary py-1"
                        data-testid={`nav-mobile-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('legislacao')}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-legislation"
                >
                  Legislação
                </button>

                <div className="space-y-2">
                  <button
                    onClick={() => scrollToSection('publicacoes')}
                    className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                    data-testid="nav-mobile-publications"
                  >
                    Publicações
                  </button>
                  <div className="pl-4 space-y-2">
                    {publicationsItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.section)}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-primary py-1"
                        data-testid={`nav-mobile-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('eventos')}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-events"
                >
                  Eventos
                </button>

                <button
                  onClick={() => scrollToSection('galeria')}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-gallery"
                >
                  Galeria
                </button>

                <button
                  onClick={() => scrollToSection('contactos')}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-contact"
                >
                  Contactos
                </button>

                <div className="pt-4">
                  <Button 
                    onClick={() => scrollToSection('contactos')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full"
                    data-testid="button-mobile-associate"
                  >
                    ASSOCIAR-SE
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default FloatingMenu;