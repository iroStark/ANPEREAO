import { HPHCard, HPHCardHeader, HPHCardContent, HPHButton, HPHInput, HPHFormTextArea } from '@/components/ui/hph';
import { Location01Icon as MapPin, Call02Icon as Phone, Mail01Icon as Mail, Clock01Icon as Clock, UserIcon as User, Note01Icon as Note, Comment01Icon as Comment } from "hugeicons-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem");
      }

      setSubmitStatus({ type: 'success', message: data.message || "Mensagem enviada com sucesso! Entraremos em contacto em breve." });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      setSubmitStatus({ type: 'error', message: error.message || "Erro ao enviar mensagem. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
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
            <HPHCard>
              <HPHCardHeader>
                <h3 className="text-lg font-bold flex items-center" data-testid="text-contact-info-title">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Informações de Contacto
                </h3>
              </HPHCardHeader>
              <HPHCardContent className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Endereço da Sede</h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-address">
                      Rua Comandante Bula, Prédio N.º 33L1<br />
                      1ª andar esquerdo<br />
                      Viana, Luanda, Angola
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Telefones</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p data-testid="text-phone-1">+244 976 519 388</p>
                  
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
                    <strong>NIF:</strong> <span data-testid="text-nif">5001574345</span>
                  </p>
                </div>
              </HPHCardContent>
            </HPHCard>

            {/* Interactive Map */}
            <HPHCard className="overflow-hidden">
              <HPHCardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.5!2d13.3!3d-8.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDgnMDAuMCJTIDEzwrAxOCcwMC4wIkU!5e0!3m2!1spt!2sao!4v1234567890123!5m2!1spt!2sao&q=39W5%2B79G%2C+Vila+de+viana+Benfica%2C+Luanda"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da ANPERE - Vila de Viana Benfica, Luanda"
                  />
                </div>
              </HPHCardContent>
            </HPHCard>
          </div>

          {/* Contact Form */}
          <HPHCard>
            <HPHCardHeader>
              <h3 className="text-lg font-bold" data-testid="text-contact-form-title">
                Envie-nos uma Mensagem
              </h3>
            </HPHCardHeader>
            <HPHCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <HPHInput
                    label="Nome Completo *"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                    icon={<User className="w-5 h-5" />}
                    data-testid="input-name"
                  />
                  <HPHInput
                    label="Email *"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    icon={<Mail className="w-5 h-5" />}
                    data-testid="input-email"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <HPHInput
                    label="Telefone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+244 9XX XXX XXX"
                    icon={<Phone className="w-5 h-5" />}
                    data-testid="input-phone"
                  />
                  <HPHInput
                    label="Assunto *"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Assunto da mensagem"
                    icon={<Note className="w-5 h-5" />}
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <HPHFormTextArea
                    label="Mensagem *"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Escreva sua mensagem aqui..."
                    icon={<Comment className="w-5 h-5" />}
                    data-testid="textarea-message"
                  />
                </div>

                {submitStatus && (
                  <div className={`p-3 rounded-md text-sm ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <HPHButton type="submit" className="w-full" data-testid="button-send-message" loading={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </HPHButton>

                <p className="text-xs text-muted-foreground text-center">
                  * Campos obrigatórios. Responderemos em até 24 horas.
                </p>
              </form>
            </HPHCardContent>
          </HPHCard>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;