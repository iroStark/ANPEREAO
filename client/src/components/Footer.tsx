import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="text-xl font-bold mb-4" data-testid="text-footer-org-title">
              ANPERE
            </h3>
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
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span data-testid="text-footer-address">
                  Rua Comandante Bula, Prédio N.º 33L1<br />
                  1ª andar esquerdo, Viana, Luanda
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span data-testid="text-footer-email">cruzgama7@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span data-testid="text-footer-phones">923 066 488 / 925 153 454</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-links-title">
              Links Rápidos
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-primary-foreground/90">
              <a href="#home" className="hover:text-white transition-colors" data-testid="link-footer-home">
                Home
              </a>
              <a href="#quem-somos" className="hover:text-white transition-colors" data-testid="link-footer-about">
                Quem Somos
              </a>
              <a href="#legislacao" className="hover:text-white transition-colors" data-testid="link-footer-legislation">
                Legislação
              </a>
              <a href="#publicacoes" className="hover:text-white transition-colors" data-testid="link-footer-publications">
                Publicações
              </a>
              <a href="#eventos" className="hover:text-white transition-colors" data-testid="link-footer-events">
                Eventos
              </a>
              <a href="#galeria" className="hover:text-white transition-colors" data-testid="link-footer-gallery">
                Galeria
              </a>
              <a href="#contactos" className="hover:text-white transition-colors" data-testid="link-footer-contact">
                Contactos
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/80 mb-4 sm:mb-0" data-testid="text-footer-copyright">
            © 2024 ANPERE. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 text-sm text-primary-foreground/80">
            <span data-testid="text-footer-nif">NIF: 5000379263</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;