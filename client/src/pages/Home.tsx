import Header from "@/components/Header";
import HeroSlideshow from "@/components/HeroSlideshow";
import AboutSection from "@/components/AboutSection";
import LegislationSection from "@/components/LegislationSection";
import PublicationsSection from "@/components/PublicationsSection";
import EventsSection from "@/components/EventsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="home">
          <HeroSlideshow />
        </section>
        <section id="quem-somos">
          <AboutSection />
        </section>
        <section id="legislacao">
          <LegislationSection />
        </section>
        <section id="publicacoes">
          <PublicationsSection />
        </section>
        <section id="eventos">
          <EventsSection />
        </section>
        <section id="galeria">
          <GallerySection />
        </section>
        <section id="contactos">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;