import FloatingMenu from "@/components/FloatingMenu";
import HeroSlideshow from "@/components/HeroSlideshow";
import ServiceCards from "@/components/ServiceCards";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      <main>
        <section id="home">
          <HeroSlideshow />
        </section>
        <ServiceCards />
        <section id="quem-somos">
          <AboutSection />
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