import { motion } from "framer-motion";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { Shield02Icon as Shield, ArrowLeft01Icon as ArrowLeft, LockKeyIcon as Lock, ViewIcon as Eye, File02Icon as FileText, Mail01Icon as Mail, Call02Icon as Phone, Calendar03Icon as Calendar } from "hugeicons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const PoliticaPrivacidade = () => {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Proteção e Privacidade de Dados Pessoais
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
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
                A <strong className="text-foreground">Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico (ANPERE)</strong> 
                {" "}reconhece a importância da proteção dos dados pessoais dos seus associados, visitantes do website e todos aqueles que 
                interagem connosco. Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as suas 
                informações pessoais, em conformidade com a <strong className="text-foreground">Lei n.º 22/11 de 17 de Junho - Lei sobre a Proteção 
                de Dados Pessoais</strong> da República de Angola e outras normas aplicáveis.
              </p>
              <p>
                Ao utilizar os nossos serviços, website ou fornecer-nos os seus dados pessoais, aceita as práticas descritas nesta política.
              </p>
            </CardContent>
          </Card>

          {/* Responsável pelo Tratamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                2. Responsável pelo Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O responsável pelo tratamento dos seus dados pessoais é:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-foreground">ANPERE - Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico</p>
                <p><strong className="text-foreground">Morada:</strong> Rua Comandante Bula, Prédio N.º 33L1, Luanda, Angola</p>
                <p><strong className="text-foreground">Contacto:</strong> geral@anpere.ao</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados Recolhidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                3. Dados Pessoais Recolhidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Recolhemos e tratamos os seguintes tipos de dados pessoais:</p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3.1. Dados de Identificação</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Nome completo</li>
                    <li>Data e local de nascimento</li>
                    <li>Nacionalidade</li>
                    <li>Documento de identificação (B.I./Passaporte) e respetivos dados de emissão</li>
                    <li>Fotografia</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3.2. Dados de Contacto</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Endereço de correio eletrónico</li>
                    <li>Número de telefone</li>
                    <li>Endereço residencial</li>
                    <li>Município e distrito</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3.3. Dados Profissionais</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Função que exerce/exerceu</li>
                    <li>Província onde trabalhou</li>
                    <li>Informações sobre a filiação</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3.4. Dados de Utilização</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Endereço IP</li>
                    <li>Dados de navegação no website</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finalidades do Tratamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                4. Finalidades do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Os seus dados pessoais são tratados para as seguintes finalidades:</p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">4.1. Gestão de Associados</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Processamento e gestão de candidaturas à associação</li>
                    <li>Manutenção do registo de membros</li>
                    <li>Emissão de comprovativos de inscrição</li>
                    <li>Atribuição de números de membro</li>
                    <li>Gestão do estado de membro (ativo, inativo, etc.)</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">4.2. Comunicação</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Envio de informações sobre atividades da associação</li>
                    <li>Notificações sobre eventos, workshops e formações</li>
                    <li>Comunicações sobre o estado da candidatura</li>
                    <li>Respostas a pedidos de informação</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">4.3. Prestação de Serviços</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Organização de eventos e formações</li>
                    <li>Prestação de assistência jurídica</li>
                    <li>Gestão de publicações e documentação</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">4.4. Obrigações Legais e Regulamentares</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Cumprimento de obrigações legais aplicáveis</li>
                    <li>Resposta a solicitações de autoridades competentes</li>
                    <li>Arquivo de documentos conforme legislação aplicável</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                5. Base Legal do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>O tratamento dos seus dados pessoais baseia-se em:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Consentimento:</strong> Quando nos dá o seu consentimento explícito para o tratamento de dados (ex: newsletter, cookies não essenciais)</li>
                <li><strong className="text-foreground">Execução de Contrato:</strong> Para a gestão da sua associação e prestação de serviços contratados</li>
                <li><strong className="text-foreground">Obrigação Legal:</strong> Para cumprimento de obrigações legais aplicáveis</li>
                <li><strong className="text-foreground">Interesse Legítimo:</strong> Para melhorar os nossos serviços e comunicação, desde que não prejudique os seus direitos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Conservação dos Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                6. Conservação dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Os seus dados pessoais são conservados apenas pelo tempo necessário para cumprir as finalidades para as quais foram recolhidos, 
                respeitando os prazos legais de conservação aplicáveis.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong className="text-foreground">Dados de associados:</strong> Durante toda a duração da associação e após o término, 
                pelo prazo legalmente exigido para arquivo de documentos associativos.</p>
                <p><strong className="text-foreground">Dados de candidaturas não aprovadas:</strong> Pelo prazo necessário para análise 
                e eventual recurso, não excedendo 2 anos após a decisão final.</p>
                <p><strong className="text-foreground">Dados de navegação:</strong> Conforme a política de cookies, geralmente não superior a 13 meses.</p>
              </div>
            </CardContent>
          </Card>

          {/* Segurança dos Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                7. Segurança dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra acesso não autorizado, 
                alteração, divulgação ou destruição não autorizada:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Encriptação de dados em trânsito e em repouso</li>
                <li>Controlos de acesso rigorosos</li>
                <li>Monitorização regular de sistemas e redes</li>
                <li>Backups regulares</li>
                <li>Formação regular da equipa sobre proteção de dados</li>
                <li>Procedimentos de resposta a incidentes de segurança</li>
              </ul>
            </CardContent>
          </Card>

          {/* Partilha de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                8. Partilha de Dados com Terceiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Não vendemos, alugamos ou partilhamos os seus dados pessoais com terceiros para fins comerciais. Podemos partilhar dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Prestadores de Serviços:</strong> Com empresas que nos prestam serviços (hospedagem, gestão de email, etc.), 
                que estão obrigadas a manter a confidencialidade</li>
                <li><strong className="text-foreground">Obrigações Legais:</strong> Quando exigido por lei ou por ordem judicial</li>
                <li><strong className="text-foreground">Autoridades Competentes:</strong> Quando necessário para cumprir obrigações legais ou regulamentares</li>
              </ul>
              <p className="bg-muted/50 p-4 rounded-lg">
                <strong className="text-foreground">Nota importante:</strong> Todos os prestadores de serviços que tratam dados pessoais em nosso nome estão 
                obrigados contratualmente a manter os mesmos níveis de segurança e confidencialidade.
              </p>
            </CardContent>
          </Card>

          {/* Direitos dos Titulares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                9. Os Seus Direitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Em conformidade com a legislação aplicável, tem os seguintes direitos relativamente aos seus dados pessoais:
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.1. Direito de Acesso</h4>
                  <p>Pode solicitar informações sobre os dados pessoais que tratamos sobre si.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.2. Direito de Retificação</h4>
                  <p>Pode solicitar a correção de dados incorretos ou desatualizados.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.3. Direito ao Apagamento</h4>
                  <p>Pode solicitar o apagamento dos seus dados quando não existir fundamento legal para a sua conservação.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.4. Direito à Limitação do Tratamento</h4>
                  <p>Pode solicitar a limitação do tratamento dos seus dados em certas circunstâncias.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.5. Direito de Oposição</h4>
                  <p>Pode opor-se ao tratamento dos seus dados para certas finalidades, incluindo marketing direto.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.6. Direito à Portabilidade</h4>
                  <p>Pode solicitar a transferência dos seus dados para outro responsável pelo tratamento, quando aplicável.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">9.7. Direito de Revogar o Consentimento</h4>
                  <p>Quando o tratamento se baseia no seu consentimento, pode revogá-lo a qualquer momento, sem afetar a legalidade 
                  do tratamento anterior à revogação.</p>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="font-semibold text-foreground mb-2">Como exercer os seus direitos:</p>
                <p>Para exercer qualquer destes direitos, pode contactar-nos através de:</p>
                <div className="mt-3 space-y-1">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <strong className="text-foreground">Email:</strong> geral@anpere.ao
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <strong className="text-foreground">Telefone:</strong> (ver contactos no website)
                  </p>
                </div>
                <p className="text-sm mt-3">
                  Responderemos ao seu pedido no prazo máximo de 30 dias, podendo solicitar informações adicionais para verificar a sua identidade.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                10. Cookies e Tecnologias Similares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O nosso website utiliza cookies e tecnologias similares para melhorar a sua experiência de navegação. Para mais informações, 
                consulte a nossa Política de Cookies.
              </p>
              <p>
                Pode gerir as preferências de cookies através das definições do seu navegador.
              </p>
            </CardContent>
          </Card>

          {/* Alterações à Política */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                11. Alterações a esta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente para refletir alterações nas nossas práticas ou por outras 
                razões operacionais, legais ou regulamentares.
              </p>
              <p>
                Recomendamos que consulte periodicamente esta página para se manter informado sobre como protegemos os seus dados. 
                A data da última atualização encontra-se no topo desta página.
              </p>
              <p>
                Alterações significativas serão comunicadas através do nosso website ou por email, quando aplicável.
              </p>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                12. Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para questões relacionadas com esta Política de Privacidade ou para exercer os seus direitos, pode contactar-nos:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-foreground">ANPERE</p>
                <p>Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico</p>
                <p><strong className="text-foreground">Morada:</strong> Rua Comandante Bula, Prédio N.º 33L1, Luanda, Angola</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <strong className="text-foreground">Email:</strong> geral@anpere.ao
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disposições Finais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                13. Disposições Finais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Esta Política de Privacidade é regida pela legislação angolana, nomeadamente pela Lei n.º 22/11 de 17 de Junho 
                sobre a Proteção de Dados Pessoais.
              </p>
              <p>
                Em caso de conflito ou interpretação desta política, prevalece a versão em português.
              </p>
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

export default PoliticaPrivacidade;

