import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download } from "lucide-react";
import { z } from "zod";
import jsPDF from "jspdf";

const memberFormSchema = insertMemberSchema.extend({
  photoUrl: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

export default function MemberRegistration() {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<any>(null);

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
      status: "active",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add photo file if exists
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch('/api/members/register', {
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
        title: "Inscrição realizada com sucesso!",
        description: `Número de membro: ${data.memberNumber}. Pode agora imprimir o seu comprovativo.`,
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
    
    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ANPERE", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("ASSOCIAÇÃO NACIONAL DOS EX-PROFISSIONAIS", pageWidth / 2, 27, { align: "center" });
    doc.text("DO ESPECTRO RÁDIO ELECTRÓNICO", pageWidth / 2, 32, { align: "center" });
    
    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`COMPROVATIVO DE INSCRIÇÃO Nº ${registeredMember.memberNumber}`, pageWidth / 2, 45, { align: "center" });
    
    // Content
    let yPos = 60;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const checkPageBreak = (additionalHeight = 7) => {
      if (yPos + additionalHeight > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
    };

    const addField = (label: string, value: string) => {
      checkPageBreak();
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      
      // Handle long text with wrapping
      const textLines = doc.splitTextToSize(value || "N/A", maxWidth - 60);
      textLines.forEach((line: string, index: number) => {
        if (index > 0) {
          yPos += 5;
          checkPageBreak(5);
        }
        doc.text(line, 80, yPos);
      });
      yPos += 7;
    };

    const addMultilineField = (label: string, value: string) => {
      checkPageBreak();
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      
      const textLines = doc.splitTextToSize(value || "N/A", maxWidth);
      textLines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;
    };

    addField("Nome Completo", registeredMember.fullName);
    addField("Data de Nascimento", registeredMember.birthDate);
    addField("Naturalidade", registeredMember.birthPlace);
    addField("Nacionalidade", registeredMember.nationality);
    addField("Sexo", registeredMember.gender);
    addField("Estado Civil", registeredMember.maritalStatus);
    addField("B.I./Passaporte", registeredMember.idDocument);
    addField("Data de Emissão", registeredMember.idIssueDate);
    addField("Local de Emissão", registeredMember.idIssuePlace);
    addField("Nome do Pai", registeredMember.fatherName);
    addField("Nome da Mãe", registeredMember.motherName);
    addField("Função que Exerce/exerceu", registeredMember.occupation);
    addField("Telefone", registeredMember.phone);
    addField("Residência Actual", registeredMember.currentAddress);
    addField("Município e Distrito", registeredMember.municipality);
    addField("Província onde Trabalhou", registeredMember.workProvince);
    addField("E-mail", registeredMember.email);
    
    if (registeredMember.otherInfo) {
      addMultilineField("Outros Dados", registeredMember.otherInfo);
    }

    // Date and signature section
    checkPageBreak(30);
    yPos += 10;
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`Luanda, aos ${formattedDate}`, margin, yPos);
    
    yPos += 20;
    checkPageBreak(15);
    doc.text("_________________________________", pageWidth / 2, yPos, { align: "center" });
    yPos += 7;
    doc.text("O ASSOCIADO", pageWidth / 2, yPos, { align: "center" });

    // Footer on last page
    doc.setFontSize(8);
    doc.text("Documento gerado automaticamente pelo sistema ANPERE", pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save PDF with safe filename (replace / with _)
    const safeFilename = registeredMember.memberNumber.replace(/\//g, '_');
    doc.save(`comprovativo-inscricao-${safeFilename}.pdf`);
  };

  const onSubmit = (data: MemberFormData) => {
    registerMutation.mutate(data);
  };

  if (registeredMember) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Inscrição Concluída!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Parabéns! A sua inscrição foi realizada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Número de Membro</p>
              <p className="text-4xl font-bold text-primary">{registeredMember.memberNumber}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold">{registeredMember.fullName}</p>
              <p className="text-sm text-muted-foreground">{registeredMember.email}</p>
              <p className="text-sm text-muted-foreground">{registeredMember.phone}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={generatePDF} 
                className="flex-1"
                size="lg"
                data-testid="button-download-pdf"
              >
                <Download className="mr-2 h-5 w-5" />
                Imprimir Comprovativo PDF
              </Button>
              <Button 
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
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ficha de Inscrição de Membro</CardTitle>
            <CardDescription className="text-lg mt-2">
              ANPERE - Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div className="text-center">
                    <FormLabel>Fotografia</FormLabel>
                    <div className="mt-2">
                      {photoPreview ? (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg border-2 border-primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                            data-testid="button-remove-photo"
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <label className="w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-lg cursor-pointer hover-elevate">
                          <Upload className="h-8 w-8 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground">Carregar Foto</span>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informações Pessoais</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-fullName" />
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
                            <Input {...field} placeholder="DD/MM/AAAA" data-testid="input-birthDate" />
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
                          <FormControl>
                            <Input {...field} data-testid="input-birthPlace" />
                          </FormControl>
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
                          <FormControl>
                            <Input {...field} data-testid="input-nationality" />
                          </FormControl>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Selecione o sexo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-maritalStatus">
                              <SelectValue placeholder="Selecione o estado civil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                            <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                            <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                            <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Documento de Identificação</h3>
                  
                  <FormField
                    control={form.control}
                    name="idDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>B.I./Passaporte *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-idDocument" />
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
                            <Input {...field} placeholder="DD/MM/AAAA" data-testid="input-idIssueDate" />
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
                            <Input {...field} data-testid="input-idIssuePlace" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Filiação</h3>
                  
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pai *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-fatherName" />
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
                          <Input {...field} data-testid="input-motherName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informações Profissionais</h3>
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função que Exerce/exerceu *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-occupation" />
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
                          <Input {...field} data-testid="input-workProvince" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Contactos e Residência</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-phone" />
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
                            <Input {...field} type="email" data-testid="input-email" />
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
                          <Input {...field} data-testid="input-currentAddress" />
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
                          <Input {...field} data-testid="input-municipality" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informações Adicionais</h3>
                  
                  <FormField
                    control={form.control}
                    name="otherInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outros Dados</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            value={field.value || ""}
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

                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={registerMutation.isPending}
                    className="w-full md:w-auto"
                    data-testid="button-submit-registration"
                  >
                    {registerMutation.isPending ? "A processar..." : "Submeter Inscrição"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
