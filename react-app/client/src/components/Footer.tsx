import { Location01Icon, Call02Icon, Mail01Icon } from "hugeicons-react";
import { Link, useLocation } from "wouter";
import anpereLogo from "@assets/ChatGPT Image 26 de set. de 2025, 20_37_30.png";

const Footer = () => {
  const [location, setLocation] = useLocation();

  const handleLinkClick = (sectionId: string) => {
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
      }, 100);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={anpereLogo} 
                alt="ANPERE Logo" 
                className="h-12 w-auto object-contain"
              />
              <h3 className="text-xl font-bold" data-testid="text-footer-org-title">
              ANPERE
            </h3>
            </div>
            <p className="text-sm text-primary-foreground/90 mb-4" data-testid="text-footer-org-description">
              Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
            </p>
            <p className="text-xs text-primary-foreground/80" data-testid="text-footer-motto">
              "R Onten, R Hoje, R Sempre"
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-contact-title">
              Contacto
            </h4>
            <div className="space-y-3 text-sm text-primary-foreground/90">
              <div className="flex items-start">
                <Location01Icon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span data-testid="text-footer-address">
                  Rua Comandante Bula, Prédio N.º 33L1<br />
                  1ª andar esquerdo, Viana, Luanda
                </span>
              </div>
              <div className="flex items-center">
                <Mail01Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span data-testid="text-footer-email">cruzgama7@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Call02Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span data-testid="text-footer-phones">+244 976 510 388 </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-links-title">
              Links Rápidos
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-primary-foreground/90">
              <button 
                onClick={() => handleLinkClick('home')} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-home"
              >
                Home
              </button>
              <button 
                onClick={() => handleLinkClick('quem-somos')} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-about"
              >
                Quem Somos
              </button>
              <button 
                onClick={() => {
                  if (location !== '/legislacao') {
                    setLocation('/legislacao');
                  }
                }} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-legislation"
              >
                Legislação
              </button>
              <button 
                onClick={() => {
                  if (location !== '/publicacoes') {
                    setLocation('/publicacoes');
                  }
                }} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-publications"
              >
                Publicações
              </button>
              <button 
                onClick={() => {
                  if (location !== '/eventos') {
                    setLocation('/eventos');
                  }
                }} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-events"
              >
                Eventos
              </button>
              <button 
                onClick={() => {
                  if (location !== '/galeria') {
                    setLocation('/galeria');
                  }
                }} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-gallery"
              >
                Galeria
              </button>
              <button 
                onClick={() => handleLinkClick('contactos')} 
                className="hover:text-white transition-colors text-left"
                data-testid="link-footer-contact"
              >
                Contactos
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/80" data-testid="text-footer-copyright">
            © 2024 ANPERE. Todos os direitos reservados.
          </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/80">
              <Link 
                href="/politica-privacidade" 
                className="hover:text-white transition-colors underline"
                data-testid="link-footer-privacy"
              >
                Política de Privacidade
              </Link>
              <span className="text-primary-foreground/40">•</span>
              <Link 
                href="/termos-condicoes" 
                className="hover:text-white transition-colors underline"
                data-testid="link-footer-terms"
              >
                Termos e Condições
              </Link>
              <span className="text-primary-foreground/40">•</span>
            <span data-testid="text-footer-nif">NIF: 5001574345</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;