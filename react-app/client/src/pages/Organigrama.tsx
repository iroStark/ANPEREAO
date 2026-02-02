import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Award, Building2, Phone, Mail } from "lucide-react";

const Organigrama = () => {
  const orgaosSociais = {
    assembleia: {
      title: "Assembleia Geral",
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      presidente: {
        name: "Dr. João Manuel Silva",
        contact: {
          phone: "+244 923 456 789",
          email: "presidente.ag@anpere.ao"
        }
      },
      secretario: {
        name: "Eng.ª Maria Santos",
        contact: {
          phone: "+244 923 456 790",
          email: "secretario.ag@anpere.ao"
        }
      }
    },
    direcao: {
      title: "Direcção",
      icon: Building2,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      presidente: {
        name: "Eng. António Fernandes",
        contact: {
          phone: "+244 923 456 791",
          email: "presidente@anpere.ao"
        }
      },
      vicePresidente: {
        name: "Dr. Carlos Eduardo",
        contact: {
          phone: "+244 923 456 792",
          email: "vice.presidente@anpere.ao"
        }
      },
      secretario: {
        name: "Eng. Pedro Costa",
        contact: {
          phone: "+244 923 456 793",
          email: "secretario@anpere.ao"
        }
      },
      tesoureiro: {
        name: "Dr.ª Ana Paula",
        contact: {
          phone: "+244 923 456 794",
          email: "tesoureiro@anpere.ao"
        }
      },
      vogais: [
        {
          name: "Eng. José Almeida",
          contact: {
            phone: "+244 923 456 795",
            email: "vogal1@anpere.ao"
          }
        },
        {
          name: "Dr.ª Sofia Rodrigues",
          contact: {
            phone: "+244 923 456 796",
            email: "vogal2@anpere.ao"
          }
        }
      ]
    },
    fiscal: {
      title: "Conselho Fiscal",
      icon: Award,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      presidente: {
        name: "Dr. Manuel Pereira",
        contact: {
          phone: "+244 923 456 797",
          email: "presidente.cf@anpere.ao"
        }
      },
      membros: [
        {
          name: "Eng. Ricardo Santos",
          contact: {
            phone: "+244 923 456 798",
            email: "membro1.cf@anpere.ao"
          }
        },
        {
          name: "Dr.ª Isabel Martins",
          contact: {
            phone: "+244 923 456 799",
            email: "membro2.cf@anpere.ao"
          }
        }
      ]
    }
  };

  const MemberCard = ({ name, role, contact }: { name: string; role: string; contact: { phone: string; email: string } }) => (
    <Card className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <Badge variant="secondary" className="mt-1">{role}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span className="truncate">{contact.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12 mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Órgãos Sociais
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conheça a estrutura organizacional da ANPERE e os responsáveis pela gestão e fiscalização da associação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organigrama Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Assembleia Geral */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 rounded-lg ${orgaosSociais.assembleia.color} flex items-center justify-center`}>
                <orgaosSociais.assembleia.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{orgaosSociais.assembleia.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <MemberCard 
                name={orgaosSociais.assembleia.presidente.name}
                role="Presidente da Mesa"
                contact={orgaosSociais.assembleia.presidente.contact}
              />
              <MemberCard 
                name={orgaosSociais.assembleia.secretario.name}
                role="Secretário"
                contact={orgaosSociais.assembleia.secretario.contact}
              />
            </div>
          </motion.div>

          {/* Direcção */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 rounded-lg ${orgaosSociais.direcao.color} flex items-center justify-center`}>
                <orgaosSociais.direcao.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{orgaosSociais.direcao.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MemberCard 
                name={orgaosSociais.direcao.presidente.name}
                role="Presidente"
                contact={orgaosSociais.direcao.presidente.contact}
              />
              <MemberCard 
                name={orgaosSociais.direcao.vicePresidente.name}
                role="Vice-Presidente"
                contact={orgaosSociais.direcao.vicePresidente.contact}
              />
              <MemberCard 
                name={orgaosSociais.direcao.secretario.name}
                role="Secretário"
                contact={orgaosSociais.direcao.secretario.contact}
              />
              <MemberCard 
                name={orgaosSociais.direcao.tesoureiro.name}
                role="Tesoureiro"
                contact={orgaosSociais.direcao.tesoureiro.contact}
              />
              {orgaosSociais.direcao.vogais.map((vogal, index) => (
                <MemberCard 
                  key={index}
                  name={vogal.name}
                  role={`Vogal ${index + 1}`}
                  contact={vogal.contact}
                />
              ))}
            </div>
          </motion.div>

          {/* Conselho Fiscal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 rounded-lg ${orgaosSociais.fiscal.color} flex items-center justify-center`}>
                <orgaosSociais.fiscal.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{orgaosSociais.fiscal.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MemberCard 
                name={orgaosSociais.fiscal.presidente.name}
                role="Presidente"
                contact={orgaosSociais.fiscal.presidente.contact}
              />
              {orgaosSociais.fiscal.membros.map((membro, index) => (
                <MemberCard 
                  key={index}
                  name={membro.name}
                  role={`Membro ${index + 1}`}
                  contact={membro.contact}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Organigrama;
