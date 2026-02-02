import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  HPHButton,
  HPHInput,
  HPHTextarea,
  HPHSelect,
  HPHCard,
  HPHCardContent,
  HPHCardHeader,
  HPHCardTitle,
  HPHCardDescription,
  HPHBadge
} from "@/components/ui/hph";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  File02Icon as FileText, 
  Upload01Icon as Upload, 
  Download01Icon as Download, 
  ArrowLeft01Icon as ArrowLeft, 
  UserAdd01Icon as UserPlus, 
  CheckmarkCircle02Icon as CheckCircle2, 
  Shield02Icon as Shield, 
  UserGroupIcon as Users, 
  Award01Icon as Award, 
  Mail01Icon as Mail, 
  Call02Icon as Phone, 
  Cancel01Icon as X,
  UserIcon as User,
  Calendar01Icon as Calendar,
  Location01Icon as Location,
  Globe02Icon as Globe,
  FavouriteIcon as Heart,
  Briefcase01Icon as Briefcase,
  MapsIcon as Map,
  Note01Icon as Note,
  Comment01Icon as Comment,
  IdentificationIcon as IdCard,
  Home01Icon as HomeIcon
} from "hugeicons-react";
import { z } from "zod";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { Link } from "wouter";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";
import { DatePicker } from "@/components/ui/date-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { IdDocumentInput } from "@/components/ui/id-document-input";
import { countries, getProvincesByCountry } from "@/lib/countries";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const memberFormSchema = insertMemberSchema.extend({
  photoUrl: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Deve aceitar os termos e condições para continuar",
  }),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

export default function MemberRegistration() {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<any>(null);
  const [selectedNationality, setSelectedNationality] = useState<string>("AO");
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<string>("AO");
  const [documentType, setDocumentType] = useState<"BI" | "Passaporte">("BI");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      birthPlace: "",
      nationality: "Angolana",
      gender: undefined,
      maritalStatus: undefined,
      idDocument: "",
      idIssueDate: "",
      idIssuePlace: "",
      fatherName: "",
      motherName: "",
      occupation: "",
      phone: "",
      currentAddress: "",
      municipality: "",
      workProvince: "",
      email: "",
      photoUrl: "",
      otherInfo: "",
      status: "pending",
      acceptTerms: false,
    },
  });

  const watchNationality = form.watch("nationality");
  const availableProvinces = getProvincesByCountry(selectedNationality);

  const registerMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      const formData = new FormData();
      
      // Add all text fields (except acceptTerms which is only for validation)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'acceptTerms' && value !== null && value !== undefined) {
          // Format dates to DD/MM/YYYY if they are Date objects or ISO strings
          if ((key === 'birthDate' || key === 'idIssueDate') && value) {
            let dateStr = value.toString();
            // If it's an ISO string, convert to DD/MM/YYYY
            if (dateStr.includes('T') || dateStr.includes('-')) {
              const date = new Date(dateStr);
              dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            }
            formData.append(key, dateStr);
          } else {
          formData.append(key, value.toString());
          }
        }
      });

      // Add photo file if exists
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${baseUrl}/members/register`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha ao registar membro');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setRegisteredMember(data);
      toast({
        title: "Candidatura submetida com sucesso!",
        description: `A sua candidatura será revista e receberá informações por email e telefone sobre o resultado.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao realizar inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    if (!registeredMember) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Helper function to draw a line
    const drawLine = (y: number, width: number = pageWidth - 2 * margin, x: number = margin) => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(x, y, x + width, y);
    };

    // Helper function to draw a box
    const drawBox = (x: number, y: number, width: number, height: number, color: number[] = [240, 240, 240]) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height, 'FD');
    };

    // Header with colored background
    drawBox(0, 0, pageWidth, 50, [41, 128, 185]); // Blue background
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ANPERE", pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("ASSOCIAÇÃO NACIONAL DOS EX-PROFISSIONAIS", pageWidth / 2, 26, { align: "center" });
    doc.text("DO ESPECTRO RÁDIO ELECTRÓNICO", pageWidth / 2, 32, { align: "center" });
    doc.setFontSize(9);
    doc.text("Rua Comandante Bula, Prédio N.º 33L1, Luanda, Angola | geral@anpere.ao", pageWidth / 2, 40, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Title section with border
    let yPos = 60;
    drawBox(margin, yPos, maxWidth, 15, [245, 245, 245]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text(`COMPROVATIVO DE INSCRIÇÃO`, pageWidth / 2, yPos + 10, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Nº ${registeredMember.memberNumber}`, pageWidth / 2, yPos + 18, { align: "center" });
    doc.setTextColor(0, 0, 0);
    
    yPos += 30;
    
    // Status badge
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    drawBox(margin, yPos, maxWidth, 8, [255, 193, 7]); // Yellow background
    doc.setTextColor(0, 0, 0);
    doc.text("STATUS: EM ANÁLISE", pageWidth / 2, yPos + 6, { align: "center" });
    
    yPos += 15;
    
    // Section divider
    drawLine(yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const checkPageBreak = (additionalHeight = 7) => {
      if (yPos + additionalHeight > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
        // Redraw header on new page
        drawBox(0, 0, pageWidth, 35, [41, 128, 185]);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("ANPERE", pageWidth / 2, 15, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("ASSOCIAÇÃO NACIONAL DOS EX-PROFISSIONAIS DO ESPECTRO RÁDIO ELECTRÓNICO", pageWidth / 2, 22, { align: "center" });
        doc.setTextColor(0, 0, 0);
        yPos = 40;
      }
    };

    const addField = (label: string, value: string, section?: string) => {
      checkPageBreak();
      
      // Section header
      if (section) {
        yPos += 5;
        doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 128, 185);
        doc.text(section.toUpperCase(), margin, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 8;
        drawLine(yPos - 3, maxWidth * 0.3);
        yPos += 5;
      }
      
      // Field with background
      const fieldHeight = 8;
      drawBox(margin, yPos - 5, maxWidth, fieldHeight, [250, 250, 250]);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin + 3, yPos);
      doc.setFont("helvetica", "normal");
      
      // Handle long text with wrapping
      const textLines = doc.splitTextToSize(value || "N/A", maxWidth - 70);
      textLines.forEach((line: string, index: number) => {
        if (index > 0) {
          yPos += 5;
          checkPageBreak(5);
        }
        doc.text(line, margin + 65, yPos);
      });
      yPos += 8;
    };

    const addMultilineField = (label: string, value: string) => {
      checkPageBreak();
      const fieldHeight = 15;
      drawBox(margin, yPos - 5, maxWidth, fieldHeight, [250, 250, 250]);
      
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin + 3, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      
      const textLines = doc.splitTextToSize(value || "N/A", maxWidth - 10);
      textLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin + 3, yPos);
        yPos += 5;
      });
      yPos += 5;
    };

    // Personal Information Section
    addField("Nome Completo", registeredMember.fullName, "Informações Pessoais");
    addField("Data de Nascimento", registeredMember.birthDate);
    addField("Naturalidade", registeredMember.birthPlace);
    addField("Nacionalidade", registeredMember.nationality);
    addField("Sexo", registeredMember.gender);
    addField("Estado Civil", registeredMember.maritalStatus);
    
    // Document Information Section
    addField("B.I./Passaporte", registeredMember.idDocument, "Documento de Identificação");
    addField("Data de Emissão", registeredMember.idIssueDate);
    addField("Local de Emissão", registeredMember.idIssuePlace);
    
    // Family Information Section
    addField("Nome do Pai", registeredMember.fatherName, "Informações Familiares");
    addField("Nome da Mãe", registeredMember.motherName);
    
    // Professional Information Section
    addField("Função que Exerce/exerceu", registeredMember.occupation, "Informações Profissionais");
    addField("Província onde Trabalhou", registeredMember.workProvince);
    
    // Contact Information Section
    addField("Telefone", registeredMember.phone, "Contactos e Residência");
    addField("E-mail", registeredMember.email);
    addField("Residência Actual", registeredMember.currentAddress);
    addField("Município e Distrito", registeredMember.municipality);
    
    if (registeredMember.otherInfo) {
      addMultilineField("Outros Dados", registeredMember.otherInfo);
    }

    // Date and signature section with styled box
    checkPageBreak(50);
    yPos += 15;
    drawLine(yPos);
    yPos += 10;
    
    drawBox(margin, yPos, maxWidth, 35, [248, 249, 250]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    doc.text(`Luanda, aos ${formattedDate}`, margin + 5, yPos + 8);
    
    yPos += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("_________________________________", pageWidth / 2, yPos, { align: "center" });
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("O ASSOCIADO", pageWidth / 2, yPos, { align: "center" });

    // Footer on last page with colored background
    const footerY = pageHeight - 20;
    drawBox(0, footerY, pageWidth, 20, [41, 128, 185]);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Documento gerado automaticamente pelo sistema ANPERE", pageWidth / 2, footerY + 8, { align: "center" });
    doc.text("Este documento é válido apenas para fins de candidatura", pageWidth / 2, footerY + 14, { align: "center" });

    // Save PDF with safe filename (replace / with _)
    const safeFilename = registeredMember.memberNumber.replace(/\//g, '_');
    doc.save(`comprovativo-inscricao-${safeFilename}.pdf`);
  };

  const onSubmit = (data: MemberFormData) => {
    registerMutation.mutate(data);
  };

  if (registeredMember) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingMenu />
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-8 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Candidatura Submetida!
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A sua candidatura foi submetida com sucesso. Receberá informações por email e telefone sobre o resultado da análise.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Success Content */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <HPHCard className="shadow-lg border-2 border-primary/20">
              <HPHCardContent className="p-8 space-y-8">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl text-center border-2 border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Número de Candidatura
                  </p>
                  <p className="text-5xl md:text-6xl font-bold text-primary mb-4">
                    {registeredMember.memberNumber}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">
                      Em Análise
                    </span>
                  </div>
                </div>

                {/* Informação sobre revisão */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Próximos Passos</h3>
                      <p className="text-sm text-muted-foreground">
                        A sua candidatura será revista pela equipa da ANPERE. Receberá informações sobre o resultado 
                        da análise através do <strong className="text-foreground">email ({registeredMember.email})</strong> 
                        {" "}e <strong className="text-foreground">telefone ({registeredMember.phone})</strong> cadastrados.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-blue-200 dark:border-blue-800">
                    <div className="mt-0.5">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Tempo estimado:</strong> A análise pode levar até 7 dias úteis. 
                        Fique atento às comunicações!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 p-6 bg-muted/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</p>
              <p className="text-lg font-semibold">{registeredMember.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">E-mail</p>
                    <p className="text-lg font-semibold">{registeredMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Telefone</p>
                    <p className="text-lg font-semibold">{registeredMember.phone}</p>
                  </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <HPHButton 
                onClick={generatePDF} 
                className="flex-1"
                size="lg"
                data-testid="button-download-pdf"
              >
                <Download className="mr-2 h-5 w-5" />
                Imprimir Comprovativo PDF
              </HPHButton>
              <HPHButton 
                variant="outline"
                onClick={() => {
                  setRegisteredMember(null);
                  form.reset();
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="flex-1"
                size="lg"
                data-testid="button-new-registration"
              >
                <FileText className="mr-2 h-5 w-5" />
                Nova Inscrição
              </HPHButton>
                  <Link href="/">
                    <HPHButton variant="ghost" className="flex-1" size="lg">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Voltar ao Início
                    </HPHButton>
                  </Link>
            </div>
          </HPHCardContent>
        </HPHCard>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingMenu />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="max-w-5xl mx-auto">
          <Link href="/">
            <HPHButton variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </HPHButton>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tornar-se Associado
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Junte-se à <span className="font-semibold text-primary">ANPERE</span> - Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Preencha o formulário abaixo para fazer parte da nossa comunidade de profissionais das telecomunicações.
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mt-12"
          >
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
              <Users className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Rede Profissional</h3>
              <p className="text-sm text-muted-foreground">Conecte-se com profissionais do sector</p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
              <Award className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Formação Contínua</h3>
              <p className="text-sm text-muted-foreground">Acesso a workshops e eventos exclusivos</p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
              <Shield className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Assistência Jurídica</h3>
              <p className="text-sm text-muted-foreground">Apoio legal aos nossos associados</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <HPHCard className="shadow-xl border-2 border-primary/10">
            <HPHCardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <HPHCardTitle className="text-2xl md:text-3xl text-center">
                Ficha de Inscrição de Membro
              </HPHCardTitle>
              <HPHCardDescription className="text-center text-base mt-2">
                Por favor, preencha todos os campos obrigatórios (*) para completar a sua inscrição
            </HPHCardDescription>
          </HPHCardHeader>
            <HPHCardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <FormLabel className="text-base font-semibold mb-4 block">
                      Fotografia
                      <span className="text-xs font-normal text-muted-foreground ml-2">(opcional)</span>
                    </FormLabel>
                    <div className="mt-2">
                      {photoPreview ? (
                        <div className="relative w-32 h-32 mx-auto group">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl border-2 border-primary shadow-lg"
                          />
                          <HPHButton
                            type="button"
                            size="sm"
                            variant="danger"
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                            data-testid="button-remove-photo"
                          >
                            ×
                          </HPHButton>
                        </div>
                      ) : (
                        <label className="w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all hover-elevate">
                          <Upload className="h-8 w-8 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground font-medium">Carregar Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            data-testid="input-photo"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Informações Pessoais</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<User className="w-5 h-5" />} data-testid="input-fullName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento *</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? (field.value.includes('/') ? undefined : new Date(field.value)) : undefined}
                              onChange={(date) => {
                                if (date) {
                                  // Format to DD/MM/YYYY for storage
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const year = date.getFullYear();
                                  const formattedDate = `${day}/${month}/${year}`;
                                  field.onChange(formattedDate);
                                } else {
                                  field.onChange("");
                                }
                              }}
                              placeholder="Selecione a data de nascimento"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naturalidade *</FormLabel>
                          {availableProvinces.length > 0 ? (
                            <HPHSelect
                              {...field}
                              icon={<Location className="w-5 h-5" />}
                              options={availableProvinces.map(province => ({ value: province, label: province }))}
                              placeholder="Selecione a naturalidade"
                              data-testid="input-birthPlace"
                            />
                          ) : (
                            <FormControl>
                              <HPHInput {...field} icon={<Location className="w-5 h-5" />} data-testid="input-birthPlace" placeholder="Digite a naturalidade" />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nacionalidade *</FormLabel>
                          <HPHSelect
                            {...field}
                            value={selectedNationality}
                            icon={<Globe className="w-5 h-5" />}
                            onChange={(e) => {
                              const value = e.target.value;
                              const country = countries.find(c => c.code === value);
                              setSelectedNationality(value);
                              field.onChange(country?.name || "");
                              // Reset naturalidade quando mudar nacionalidade
                              form.setValue("birthPlace", "");
                            }}
                            options={countries.map(country => ({ value: country.code, label: country.name }))}
                            placeholder="Selecione a nacionalidade"
                            data-testid="input-nationality"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo *</FormLabel>
                          <FormControl>
                            <HPHSelect 
                              {...field} 
                              icon={<User className="w-5 h-5" />}
                              options={[
                                { value: "Masculino", label: "Masculino" },
                                { value: "Feminino", label: "Feminino" }
                              ]}
                              placeholder="Selecione o sexo"
                              data-testid="select-gender"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil *</FormLabel>
                        <FormControl>
                          <HPHSelect 
                            {...field} 
                            icon={<Heart className="w-5 h-5" />}
                            options={[
                              { value: "Solteiro(a)", label: "Solteiro(a)" },
                              { value: "Casado(a)", label: "Casado(a)" },
                              { value: "Divorciado(a)", label: "Divorciado(a)" },
                              { value: "Viúvo(a)", label: "Viúvo(a)" }
                            ]}
                            placeholder="Selecione o estado civil"
                            data-testid="select-maritalStatus"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Documento de Identificação</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="idDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>B.I./Passaporte *</FormLabel>
                        <FormControl>
                          <IdDocumentInput
                            {...field}
                            documentType={documentType}
                            onDocumentTypeChange={setDocumentType}
                            icon={<IdCard className="w-5 h-5" />}
                            data-testid="input-idDocument"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="idIssueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Emissão *</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? (field.value.includes('/') ? undefined : new Date(field.value)) : undefined}
                              onChange={(date) => {
                                if (date) {
                                  // Format to DD/MM/YYYY for storage
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const year = date.getFullYear();
                                  const formattedDate = `${day}/${month}/${year}`;
                                  field.onChange(formattedDate);
                                } else {
                                  field.onChange("");
                                }
                              }}
                              placeholder="Selecione a data de emissão"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idIssuePlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local de Emissão *</FormLabel>
                          <FormControl>
                            <HPHInput
                              placeholder="Local de Emissão"
                              {...field}
                              icon={<Location className="w-5 h-5" />}
                              data-testid="input-idIssuePlace"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Filiação</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pai *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<User className="w-5 h-5" />} data-testid="input-fatherName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Mãe *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<User className="w-5 h-5" />} data-testid="input-motherName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Informações Profissionais</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função que Exerce/exerceu *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<Briefcase className="w-5 h-5" />} data-testid="input-occupation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Província onde Trabalhou *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<Location className="w-5 h-5" />} data-testid="input-workProvince" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Contactos e Residência</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              countryCode={selectedPhoneCountry}
                              onCountryChange={setSelectedPhoneCountry}
                              placeholder="923 456 789"
                              icon={<Phone className="w-5 h-5" />}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                          <HPHInput {...field} type="email" icon={<Mail className="w-5 h-5" />} data-testid="input-email" />
                        </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="currentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residência Actual *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<HomeIcon className="w-5 h-5" />} data-testid="input-currentAddress" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="municipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Município e Distrito *</FormLabel>
                        <FormControl>
                          <HPHInput {...field} icon={<Map className="w-5 h-5" />} data-testid="input-municipality" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-foreground">Informações Adicionais</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Nascimento *</FormLabel>
                        <FormControl>
                          <HPHInput
                            placeholder="Local de Nascimento"
                            {...field}
                            icon={<Location className="w-5 h-5" />}
                            data-testid="input-birthPlace"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nacionalidade *</FormLabel>
                        <FormControl>
                          <HPHInput
                            placeholder="Nacionalidade"
                            {...field}
                            icon={<Globe className="w-5 h-5" />}
                            data-testid="input-nationality"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outros Dados</FormLabel>
                        <FormControl>
                          <HPHTextarea 
                            {...field}
                            value={field.value || ""}
                            icon={<FileText className="w-5 h-5" />}
                            placeholder="Informações adicionais relevantes..."
                            className="min-h-24"
                            data-testid="input-otherInfo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="pt-6 border-t-2 border-primary/10">
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 border-primary/20 p-4 bg-muted/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-accept-terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Aceito os{" "}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowTermsModal(true);
                              }}
                              className="text-primary hover:underline font-semibold"
                            >
                              Termos e Condições
                            </button>
                            {" "}e a{" "}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPrivacyModal(true);
                              }}
                              className="text-primary hover:underline font-semibold"
                            >
                              Política de Privacidade
                            </button>
                            {" "}da ANPERE *
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Ao submeter esta candidatura, concorda que os seus dados pessoais sejam tratados conforme descrito na nossa Política de Privacidade.
                          </p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 border-t-2 border-primary/10">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-destructive">*</span> Campos obrigatórios
                    </p>
                  <HPHButton
                    type="submit"
                    size="lg"
                      disabled={registerMutation.isPending || !form.watch("acceptTerms")}
                      className="w-full sm:w-auto min-w-[200px]"
                    data-testid="button-submit-registration"
                  >
                      {registerMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          A processar...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Submeter Inscrição
                        </>
                      )}
                  </HPHButton>
                  </div>
                </div>
              </form>
            </Form>
          </HPHCardContent>
        </HPHCard>
      </div>
      </section>

      {/* Modal de Termos e Condições */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Termos e Condições
            </DialogTitle>
            <DialogDescription>
              Condições de Uso e Regulamento da Associação
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Introdução</h3>
              <p className="mb-2">
                Bem-vindo à <strong className="text-foreground">Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico (ANPERE)</strong>.
              </p>
              <p className="mb-2">
                Estes Termos e Condições regulam o uso do nosso website e os serviços oferecidos pela ANPERE. 
                Ao aceder e utilizar este website, aceita estar vinculado a estes termos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Aceitação dos Termos</h3>
              <p className="mb-2">
                Ao utilizar este website e os serviços da ANPERE, declara e garante que leu, compreendeu e concorda 
                em ficar vinculado a estes Termos e Condições.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Membros e Associação</h3>
              <p className="mb-2">
                Para tornar-se membro da ANPERE, deve ser ex-profissional do espectro rádio electrónico e preencher 
                todos os requisitos estabelecidos nos estatutos da associação.
              </p>
              <p className="mb-2">
                Ao submeter uma candidatura, concorda que todas as informações fornecidas são verdadeiras e precisas, 
                e que receberá comunicação sobre o resultado da análise via email e telefone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Privacidade e Proteção de Dados</h3>
              <p className="mb-2">
                O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, que faz parte 
                integrante destes Termos e Condições.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Limitação de Responsabilidade</h3>
              <p className="mb-2">
                Na medida máxima permitida por lei, a ANPERE não será responsável por danos diretos, indiretos, 
                incidentais ou consequenciais resultantes do uso do website.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Lei Aplicável</h3>
              <p className="mb-2">
                Estes Termos e Condições são regidos pelas leis da República de Angola.
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Para ler os termos completos, visite a página{" "}
                <Link href="/termos-condicoes" className="text-primary hover:underline">
                  Termos e Condições
                </Link>
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <HPHButton onClick={() => setShowTermsModal(false)}>Fechar</HPHButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Política de Privacidade */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Política de Privacidade
            </DialogTitle>
            <DialogDescription>
              Proteção e Privacidade de Dados Pessoais
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Introdução</h3>
              <p className="mb-2">
                A ANPERE reconhece a importância da proteção dos dados pessoais. Esta Política de Privacidade 
                descreve como recolhemos, utilizamos, armazenamos e protegemos as suas informações pessoais, em 
                conformidade com a Lei n.º 22/11 de 17 de Junho - Lei sobre a Proteção de Dados Pessoais da 
                República de Angola.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Dados Pessoais Recolhidos</h3>
              <p className="mb-2">Recolhemos e tratamos os seguintes tipos de dados pessoais:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                <li>Dados de identificação (nome, data de nascimento, documento de identificação)</li>
                <li>Dados de contacto (email, telefone, endereço)</li>
                <li>Dados profissionais (função, província onde trabalhou)</li>
                <li>Dados de utilização (endereço IP, dados de navegação)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Finalidades do Tratamento</h3>
              <p className="mb-2">Os seus dados pessoais são tratados para:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                <li>Gestão de associados e processamento de candidaturas</li>
                <li>Comunicação sobre atividades e eventos</li>
                <li>Prestação de serviços</li>
                <li>Cumprimento de obrigações legais</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Os Seus Direitos</h3>
              <p className="mb-2">
                Tem direito de acesso, retificação, apagamento, limitação do tratamento, oposição e portabilidade 
                dos seus dados pessoais. Para exercer estes direitos, contacte-nos através de geral@anpere.ao
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Segurança dos Dados</h3>
              <p className="mb-2">
                Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra 
                acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Para ler a política completa, visite a página{" "}
                <Link href="/politica-privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <HPHButton onClick={() => setShowPrivacyModal(false)}>Fechar</HPHButton>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
