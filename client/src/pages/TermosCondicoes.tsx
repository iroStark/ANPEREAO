import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { File02Icon as FileText, ArrowLeft01Icon as ArrowLeft, Legal01Icon as Scale, Shield02Icon as Shield, UserGroupIcon as Users, AlertCircleIcon as AlertCircle, CheckmarkCircle02Icon as CheckCircle } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const TermosCondicoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Termos e Condições
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Condições de Uso e Regulamento da Associação
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Última atualização: {new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Introdução */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                1. Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Bem-vindo à <strong className="text-foreground">Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico (ANPERE)</strong>.
              </p>
              <p>
                Estes Termos e Condições regulam o uso do nosso website e os serviços oferecidos pela ANPERE. 
                Ao aceder e utilizar este website, aceita estar vinculado a estes termos. Se não concordar com 
                qualquer parte destes termos, não deve utilizar os nossos serviços.
              </p>
              <p>
                A ANPERE reserva-se o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação no website.
              </p>
            </CardContent>
          </Card>

          {/* Aceitação dos Termos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                2. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Ao utilizar este website e os serviços da ANPERE, declara e garante que:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Leu, compreendeu e concorda em ficar vinculado a estes Termos e Condições</li>
                <li>Possui capacidade legal para celebrar contratos vinculativos</li>
                <li>Utilizará os nossos serviços apenas para fins legítimos</li>
                <li>Fornecerá informações precisas e atualizadas quando solicitado</li>
                <li>Respeitará todos os direitos de propriedade intelectual</li>
              </ul>
            </CardContent>
          </Card>

          {/* Membros e Associação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                3. Membros e Associação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-foreground mb-2">3.1. Elegibilidade</h4>
                <p>
                  Para tornar-se membro da ANPERE, deve ser ex-profissional do espectro rádio electrónico 
                  e preencher todos os requisitos estabelecidos nos estatutos da associação.
                </p>

                <h4 className="font-semibold text-foreground mb-2 mt-4">3.2. Processo de Candidatura</h4>
                <p>
                  Ao submeter uma candidatura para associação:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Concorda que todas as informações fornecidas são verdadeiras e precisas</li>
                  <li>Autoriza a ANPERE a verificar as informações fornecidas</li>
                  <li>Compreende que a aceitação está sujeita à revisão e aprovação pela direção</li>
                  <li>Reconhece que receberá comunicação sobre o resultado da análise via email e telefone</li>
                </ul>

                <h4 className="font-semibold text-foreground mb-2 mt-4">3.3. Direitos e Obrigações dos Membros</h4>
                <p>Os membros têm direito a:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Participar nas atividades e eventos da associação</li>
                  <li>Ter acesso a serviços e benefícios exclusivos</li>
                  <li>Votar nas assembleias gerais</li>
                  <li>Receber informações sobre as atividades da associação</li>
                </ul>
                <p className="mt-3">Os membros comprometem-se a:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Respeitar os estatutos e regulamentos da associação</li>
                  <li>Pagar as quotas e contribuições estabelecidas</li>
                  <li>Manter as informações de contacto atualizadas</li>
                  <li>Conduzir-se de forma respeitosa e profissional</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Uso do Website */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                4. Uso do Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <h4 className="font-semibold text-foreground mb-2">4.1. Uso Permitido</h4>
              <p>
                O website da ANPERE destina-se a fornecer informações sobre a associação, serviços e atividades. 
                É permitido utilizar o website para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Aceder a informações públicas sobre a associação</li>
                <li>Submeter candidaturas de associação</li>
                <li>Consultar publicações e eventos</li>
                <li>Contactar a associação</li>
              </ul>

              <h4 className="font-semibold text-foreground mb-2 mt-4">4.2. Uso Proibido</h4>
              <p>É expressamente proibido:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Utilizar o website para atividades ilegais ou não autorizadas</li>
                <li>Interferir com o funcionamento do website ou dos sistemas</li>
                <li>Tentar aceder a áreas restritas sem autorização</li>
                <li>Copiar, modificar ou distribuir conteúdo sem autorização</li>
                <li>Transmitir vírus, malware ou código malicioso</li>
                <li>Realizar ações que possam danificar a reputação da ANPERE</li>
              </ul>
            </CardContent>
          </Card>

          {/* Propriedade Intelectual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                5. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Todo o conteúdo presente neste website, incluindo mas não limitado a textos, gráficos, logótipos, 
                ícones, imagens, áudios, downloads digitais e compilações de dados, é propriedade da ANPERE ou dos 
                seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais angolanas e internacionais.
              </p>
              <p>
                É concedida uma licença limitada, não exclusiva e não transferível para aceder e utilizar o website 
                para fins pessoais e não comerciais. Esta licença não inclui o direito de:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Revender ou utilizar comercialmente o conteúdo do website</li>
                <li>Recolher e utilizar listagens de produtos, descrições ou preços</li>
                <li>Fazer uso derivado do website ou do seu conteúdo</li>
                <li>Fazer download ou copiar informações de contas para benefício de outro comerciante</li>
                <li>Utilizar data mining, robots ou ferramentas similares de recolha e extração de dados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                6. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O tratamento dos seus dados pessoais é regido pela nossa{" "}
                <Link href="/politica-privacidade" className="text-primary hover:underline font-semibold">
                  Política de Privacidade
                </Link>
                {", "}que faz parte integrante destes Termos e Condições.
              </p>
              <p>
                Ao utilizar os nossos serviços, consente o tratamento dos seus dados pessoais de acordo com 
                a nossa Política de Privacidade e a legislação angolana aplicável.
              </p>
            </CardContent>
          </Card>

          {/* Limitação de Responsabilidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                7. Limitação de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Na medida máxima permitida por lei, a ANPERE não será responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou 
                impossibilidade de uso do website</li>
                <li>Perda de dados, lucros ou oportunidades de negócio</li>
                <li>Interrupções no serviço, erros ou omissões</li>
                <li>Vírus ou outros componentes nocivos que possam ser transmitidos através do website</li>
                <li>Ações de terceiros, incluindo hacking ou interferência não autorizada</li>
              </ul>
              <p>
                A ANPERE não garante que o website estará sempre disponível, livre de erros ou que os defeitos 
                serão corrigidos. O website é fornecido "como está" e "conforme disponível".
              </p>
            </CardContent>
          </Card>

          {/* Indemnização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                8. Indemnização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Concorda em indemnizar, defender e isentar a ANPERE, seus diretores, funcionários e agentes de 
                todas e quaisquer reivindicações, responsabilidades, danos, perdas, custos e despesas (incluindo 
                honorários advocatícios) que surjam ou estejam relacionados com:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Seu uso ou má utilização do website</li>
                <li>Violação destes Termos e Condições</li>
                <li>Violação de quaisquer direitos de terceiros</li>
                <li>Informações falsas ou enganosas fornecidas por si</li>
              </ul>
            </CardContent>
          </Card>

          {/* Rescisão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                9. Rescisão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A ANPERE reserva-se o direito de suspender ou terminar o seu acesso ao website e aos serviços 
                a qualquer momento, sem aviso prévio, por qualquer motivo, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Violação destes Termos e Condições</li>
                <li>Comportamento fraudulento ou enganoso</li>
                <li>Não pagamento de quotas ou contribuições</li>
                <li>Conduta que prejudique a reputação da associação</li>
                <li>Qualquer outra razão que a ANPERE considere apropriada</li>
              </ul>
              <p>
                No caso de rescisão, todas as obrigações e responsabilidades existentes antes da rescisão 
                permanecerão em vigor.
              </p>
            </CardContent>
          </Card>

          {/* Modificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                10. Modificações dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A ANPERE reserva-se o direito de modificar estes Termos e Condições a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no website.
              </p>
              <p>
                É sua responsabilidade revisar periodicamente estes termos. O uso continuado do website após 
                a publicação de alterações constitui aceitação dos novos termos.
              </p>
              <p>
                Se não concordar com as alterações, deve deixar de utilizar o website e os serviços da ANPERE.
              </p>
            </CardContent>
          </Card>

          {/* Lei Aplicável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                11. Lei Aplicável e Jurisdição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Estes Termos e Condições são regidos e interpretados de acordo com as leis da República de Angola.
              </p>
              <p>
                Qualquer disputa que surja relacionada com estes termos ou o uso do website será submetida à 
                jurisdição exclusiva dos tribunais competentes de Luanda, Angola.
              </p>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                12. Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para questões relacionadas com estes Termos e Condições, pode contactar-nos:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-foreground">ANPERE</p>
                <p>Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico</p>
                <p><strong className="text-foreground">Morada:</strong> Rua Comandante Bula, Prédio N.º 33L1, Luanda, Angola</p>
                <p><strong className="text-foreground">Email:</strong> geral@anpere.ao</p>
              </div>
            </CardContent>
          </Card>

          {/* Botão Voltar */}
          <div className="flex justify-center pt-6">
            <Link href="/">
              <Button size="lg" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TermosCondicoes;

