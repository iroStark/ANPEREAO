import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, User } from "lucide-react";

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const publicationsItems = [
    { name: "Planos de Actividades", path: "/publicacoes" },
    { name: "Relatórios Anuais", path: "/publicacoes" },
    { name: "Actas de Reunião", path: "/publicacoes" },
    { name: "Comunicados", path: "/publicacoes" },
  ];

  const aboutItems = [
    { name: "Nossa História", path: "/quem-somos" },
    { name: "Missão e Visão", path: "/quem-somos" },
    { name: "Organograma", path: "/quem-somos" },
    { name: "Diretoria", path: "/quem-somos" },
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
            <Link
              href="/"
              className="flex-shrink-0"
              data-testid="logo-floating-menu"
            >
              <div className="text-xl font-bold">
                <span className="text-foreground">AN</span>
                <span className="text-primary">PERE</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Profissionais do Espectro Rádio
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-home"
              >
                Home
              </Link>

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
                      className="cursor-pointer"
                      data-testid={`dropdown-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.path} className="w-full" onClick={closeMenu}>
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/legislacao"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-legislation"
              >
                Legislação
              </Link>

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
                      className="cursor-pointer"
                      data-testid={`dropdown-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.path} className="w-full" onClick={closeMenu}>
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/eventos"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-events"
              >
                Eventos
              </Link>

              <Link
                href="/galeria"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-gallery"
              >
                Galeria
              </Link>

              <Link
                href="/contactos"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                data-testid="nav-contact"
              >
                Contactos
              </Link>

              {/* Login Button */}
              <Link
                href="/admin/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 flex items-center"
                data-testid="nav-login"
              >
                <User className="w-4 h-4 mr-1" />
                Login
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-full">
                <Link href="/contactos" data-testid="button-associate">
                  ASSOCIAR-SE
                </Link>
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
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-home"
                >
                  Home
                </Link>

                <div className="space-y-2">
                  <Link
                    href="/quem-somos"
                    onClick={closeMenu}
                    className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                    data-testid="nav-mobile-about"
                  >
                    Quem Somos
                  </Link>
                  <div className="pl-4 space-y-2">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={closeMenu}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-primary py-1"
                        data-testid={`nav-mobile-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/legislacao"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-legislation"
                >
                  Legislação
                </Link>

                <div className="space-y-2">
                  <Link
                    href="/publicacoes"
                    onClick={closeMenu}
                    className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                    data-testid="nav-mobile-publications"
                  >
                    Publicações
                  </Link>
                  <div className="pl-4 space-y-2">
                    {publicationsItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={closeMenu}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-primary py-1"
                        data-testid={`nav-mobile-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/eventos"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-events"
                >
                  Eventos
                </Link>

                <Link
                  href="/galeria"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-gallery"
                >
                  Galeria
                </Link>

                <Link
                  href="/contactos"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2"
                  data-testid="nav-mobile-contact"
                >
                  Contactos
                </Link>

                {/* Mobile Login Button */}
                <Link
                  href="/admin/login"
                  onClick={closeMenu}
                  className="block w-full text-left text-sm font-medium text-foreground hover:text-primary py-2 flex items-center"
                  data-testid="nav-mobile-login"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>

                <div className="pt-4">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full">
                    <Link href="/contactos" onClick={closeMenu} data-testid="button-mobile-associate">
                      ASSOCIAR-SE
                    </Link>
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