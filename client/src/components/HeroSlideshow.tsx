import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage1 from "@assets/generated_images/Angolan_telecommunications_professionals_working_640a21c0.png";
import heroImage2 from "@assets/generated_images/Telecommunications_tower_in_Luanda_Angola_da464df4.png";
import heroImage3 from "@assets/generated_images/Angolan_professionals_telecommunications_meeting_859a9b86.png";
import heroImage4 from "@assets/generated_images/ANPERE_assembly_meeting.png";

const slides = [
  {
    image: heroImage1,
    title: "Profissionais do Espectro Rádio Eletrónico",
    subtitle: "Unindo especialistas em telecomunicações de Angola",
    description: "ANPERE representa e apoia os profissionais que trabalham com o espectro rádio eletrónico, promovendo excelência técnica e desenvolvimento profissional."
  },
  {
    image: heroImage2,
    title: "Tecnologia e Inovação",
    subtitle: "Avançando nas telecomunicações angolanas",
    description: "Contribuímos para o desenvolvimento das telecomunicações em Angola através da formação contínua e partilha de conhecimento técnico."
  },
  {
    image: heroImage3,
    title: "Comunidade Profissional",
    subtitle: "Solidariedade e apoio mútuo",
    description: "Oferecemos assistência social, médica e jurídica aos nossos associados, fortalecendo a comunidade de profissionais de telecomunicações."
  },
  {
    image: heroImage4,
    title: "Assembleia de Constituição da ANPERE",
    subtitle: "Unidade e determinação dos profissionais",
    description: "Momento histórico da fundação da nossa associação, onde profissionais de telecomunicações se uniram para criar uma organização forte e representativa do setor em Angola."
  }
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/40 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid={`text-hero-title-${index}`}>
                  {slide.title}
                </h1>
                <h2 className="text-xl md:text-2xl font-medium mb-6 text-blue-100" data-testid={`text-hero-subtitle-${index}`}>
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl mb-8 text-blue-50 leading-relaxed" data-testid={`text-hero-description-${index}`}>
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                    data-testid="button-hero-learn-more"
                  >
                    Saiba Mais
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                    data-testid="button-hero-contact"
                  >
                    Contactar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls - Full Screen Sides */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="text-white bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/30"
        style={{
          position: 'fixed',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          width: '48px',
          height: '48px'
        }}
        data-testid="button-prev-slide"
      >
        <ChevronLeft size={28} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="text-white bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/30"
        style={{
          position: 'fixed',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          width: '48px',
          height: '48px'
        }}
        data-testid="button-next-slide"
      >
        <ChevronRight size={28} />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            data-testid={`button-slide-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;