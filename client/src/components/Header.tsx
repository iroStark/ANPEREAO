import { useState } from "react";
import { Link, useLocation } from "wouter";
import { HPHButton } from "@/components/ui/hph";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu01Icon, Cancel01Icon, ArrowDown01Icon } from "hugeicons-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const publicationsItems = [
    { name: "Planos de Actividades", path: "/plano-atividades" },
    { name: "Relatórios Anuais", path: "/publicacoes" },
    { name: "Actas de Reunião", path: "/publicacoes" },
    { name: "Comunicados", path: "/publicacoes" },
  ];

  const aboutItems = [
    { name: "Nossa História", path: "/#history", hash: "history" },
    { name: "Missão e Visão", path: "/#mission-vision", hash: "mission-vision" },
    { name: "Órgãos Sociais", path: "/orgaos-sociais" },
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
  };

  return (
    <header className="bg-white dark:bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" data-testid="link-home" className="flex items-center">
              <img 
                src="/uploads/logo.svg"
                alt="ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico"
                className="h-10 w-auto"
              />
              <div className="ml-3">
                <div className="text-xl font-bold text-primary">
                  ANPERE
                </div>
                <div className="text-xs text-muted-foreground">
                  Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/" data-testid="link-home">
                <HPHButton
                  variant={location === "/" ? "primary" : "ghost"}
                  className="text-sm font-medium"
                >
                  Página Inicial
                </HPHButton>
              </Link>

              {/* About Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <HPHButton
                    variant="ghost"
                    className="text-sm font-medium"
                    data-testid="link-quem-somos"
                  >
                    Quem Somos
                    <ArrowDown01Icon className="w-4 h-4 ml-1" />
                  </HPHButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {aboutItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      onClick={() => {
                        handleAboutNavigation(item);
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer"
                    >
                        {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/legislacao" data-testid="link-legislacao">
                <HPHButton
                  variant={location === "/legislacao" ? "primary" : "ghost"}
                  className="text-sm font-medium"
                >
                  Legislação
                </HPHButton>
              </Link>

              {/* Publications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <HPHButton
                    variant="ghost"
                    className="text-sm font-medium"
                    data-testid="link-publicacoes"
                  >
                    Publicações
                    <ArrowDown01Icon className="w-4 h-4 ml-1" />
                  </HPHButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {publicationsItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.path} className="w-full cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/eventos" data-testid="link-eventos">
                <HPHButton
                  variant={location === "/eventos" ? "primary" : "ghost"}
                  className="text-sm font-medium"
                >
                  Eventos
                </HPHButton>
              </Link>

              <Link href="/galeria" data-testid="link-galeria">
                <HPHButton
                  variant={location === "/galeria" ? "primary" : "ghost"}
                  className="text-sm font-medium"
                >
                  Galeria
                </HPHButton>
              </Link>

              <Link href="/#contactos" data-testid="link-contactos">
                <HPHButton
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  Contactos
                </HPHButton>
              </Link>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <HPHButton
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <Cancel01Icon size={24} /> : <Menu01Icon size={24} />}
            </HPHButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            <Link href="/" data-testid="link-mobile-home">
              <HPHButton
                variant={location === "/" ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </HPHButton>
            </Link>

            <div className="space-y-1">
              <Link href="/" data-testid="link-mobile-quem-somos">
                <HPHButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quem Somos
                </HPHButton>
              </Link>
              <div className="pl-4 space-y-1">
                {aboutItems.map((item) => (
                  <HPHButton
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-xs text-muted-foreground"
                    onClick={() => {
                      handleAboutNavigation(item);
                      setIsMenuOpen(false);
                    }}
                    data-testid={`link-mobile-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </HPHButton>
                ))}
              </div>
            </div>

            <Link href="/legislacao" data-testid="link-mobile-legislacao">
              <HPHButton
                variant={location === "/legislacao" ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Legislação
              </HPHButton>
            </Link>

            <div className="space-y-1">
              <Link href="/publicacoes" data-testid="link-mobile-publicacoes">
                <HPHButton
                  variant={location === "/publicacoes" ? "primary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Publicações
                </HPHButton>
              </Link>
              <div className="pl-4 space-y-1">
                {publicationsItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    data-testid={`link-mobile-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <HPHButton
                      variant="ghost"
                      className="w-full justify-start text-xs text-muted-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </HPHButton>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/eventos" data-testid="link-mobile-eventos">
              <HPHButton
                variant={location === "/eventos" ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </HPHButton>
            </Link>

            <Link href="/galeria" data-testid="link-mobile-galeria">
              <HPHButton
                variant={location === "/galeria" ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Galeria
              </HPHButton>
            </Link>

            <Link href="/#contactos" data-testid="link-mobile-contactos">
              <HPHButton
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Contactos
              </HPHButton>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;