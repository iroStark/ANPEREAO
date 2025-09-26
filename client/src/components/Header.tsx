import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Quem Somos", href: "/quem-somos" },
    { name: "Legislação", href: "/legislacao" },
    { name: "Publicações", href: "/publicacoes" },
    { name: "Eventos", href: "/eventos" },
    { name: "Galeria", href: "/galeria" },
    { name: "Contactos", href: "/contactos" },
  ];

  return (
    <header className="bg-white dark:bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" data-testid="link-home">
              <div className="text-2xl font-bold text-primary">
                ANPERE
              </div>
              <div className="text-xs text-muted-foreground">
                Profissionais do Espectro Rádio Eletrónico
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    className="text-sm font-medium"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
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
          <nav className="md:hidden py-4 border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Button
                  variant={location === item.href ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {/* Mobile Login Button */}
            <Link href="/admin/login" data-testid="link-mobile-admin-login">
              <Button
                variant="outline"
                className="w-full justify-start mb-2"
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