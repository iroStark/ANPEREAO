import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Todo: remove mock functionality - implement real form submission
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            Contactos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-intro">
            Entre em contacto connosco para mais informações sobre a ANPERE ou para se tornar associado
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" data-testid="text-contact-info-title">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Informações de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Endereço da Sede</h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-address">
                      Município de Viana<br />
                      Rua Comandante Bula<br />
                      Prédio N.º 33L1 1ª andar esquerdo<br />
                      Luanda, Angola
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Telefones</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p data-testid="text-phone-1">+244 923 066 488</p>
                      <p data-testid="text-phone-2">+244 925 153 454</p>
                      <p data-testid="text-phone-3">+244 923 817 105</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-email">
                      cruzgama7@gmail.com
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Horário de Funcionamento</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Segunda a Sexta: 8:00 - 17:00</p>
                      <p>Sábado: 8:00 - 12:00</p>
                      <p>Domingo: Fechado</p>
                    </div>
                  </div>
                </div>

                {/* NIF */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>NIF:</strong> <span data-testid="text-nif">5000379263</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Mapa de Localização</p>
                    <p className="text-sm text-muted-foreground">Viana, Luanda - Angola</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-contact-form-title">
                Envie-nos uma Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome completo"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+244 9XX XXX XXX"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Assunto *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Assunto da mensagem"
                      data-testid="input-subject"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Mensagem *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Escreva sua mensagem aqui..."
                    data-testid="textarea-message"
                  />
                </div>

                <Button type="submit" className="w-full" data-testid="button-send-message">
                  Enviar Mensagem
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Campos obrigatórios. Responderemos em até 24 horas.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;