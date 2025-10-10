import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const publicationsItems = [
    { name: "Planos de Actividades", path: "/publicacoes" },
    { name: "Relatórios Anuais", path: "/publicacoes" },
    { name: "Actas de Reunião", path: "/publicacoes" },
    { name: "Comunicados", path: "/publicacoes" },
  ];

  const aboutItems = [
    { name: "Nossa História", path: "/" },
    { name: "Missão e Visão", path: "/" },
    { name: "Organigrama", path: "/organigrama" },
    { name: "Diretoria", path: "/" },
  ];

  return (
    <header className="bg-white dark:bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" data-testid="link-home" className="flex items-center">
              <img 
                src={import.meta.env.BASE_URL + 'attached_assets/Gemini_Generated_Image_vlpezzvlpezzvlpe_1758913669762.png'}
                alt="ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico"
                className="h-10 w-auto"
              />
              <div className="ml-3">
                <div className="text-xl font-bold text-primary">
                  ANPERE
                </div>
                <div className="text-xs text-muted-foreground">
                  Profissionais do Espectro Rádio Eletrónico
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/" data-testid="link-home">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  Home
                </Button>
              </Link>

              {/* About Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium"
                    data-testid="link-quem-somos"
                  >
                    Quem Somos
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {aboutItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.path} className="w-full cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/legislacao" data-testid="link-legislacao">
                <Button
                  variant={location === "/legislacao" ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  Legislação
                </Button>
              </Link>

              {/* Publications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium"
                    data-testid="link-publicacoes"
                  >
                    Publicações
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
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
                <Button
                  variant={location === "/eventos" ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  Eventos
                </Button>
              </Link>

              <Link href="/galeria" data-testid="link-galeria">
                <Button
                  variant={location === "/galeria" ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  Galeria
                </Button>
              </Link>

              <Link href="/#contactos" data-testid="link-contactos">
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  Contactos
                </Button>
              </Link>
            </nav>
            
            {/* Login Button */}
            <Link href="/admin/login" data-testid="link-admin-login">
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            <Link href="/" data-testid="link-mobile-home">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Button>
            </Link>

            <div className="space-y-1">
              <Link href="/" data-testid="link-mobile-quem-somos">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quem Somos
                </Button>
              </Link>
              <div className="pl-4 space-y-1">
                {aboutItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    data-testid={`link-mobile-about-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-xs text-muted-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/legislacao" data-testid="link-mobile-legislacao">
              <Button
                variant={location === "/legislacao" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Legislação
              </Button>
            </Link>

            <div className="space-y-1">
              <Link href="/publicacoes" data-testid="link-mobile-publicacoes">
                <Button
                  variant={location === "/publicacoes" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Publicações
                </Button>
              </Link>
              <div className="pl-4 space-y-1">
                {publicationsItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    data-testid={`link-mobile-publications-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-xs text-muted-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/eventos" data-testid="link-mobile-eventos">
              <Button
                variant={location === "/eventos" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </Button>
            </Link>

            <Link href="/galeria" data-testid="link-mobile-galeria">
              <Button
                variant={location === "/galeria" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Galeria
              </Button>
            </Link>

            <Link href="/#contactos" data-testid="link-mobile-contactos">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                Contactos
              </Button>
            </Link>
            
            {/* Mobile Login Button */}
            <Link href="/admin/login" data-testid="link-mobile-admin-login">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;