import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertMemberSchema } from '@shared/schema';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { PhoneInput } from '@/components/ui/phone-input';
import { IdDocumentInput } from '@/components/ui/id-document-input';
import { countries, getProvincesByCountry } from '@/lib/countries';
import { Member } from '@/hooks/useMembers';
import { Upload01Icon as Upload, Cancel01Icon as X } from "hugeicons-react";

const memberFormSchema = insertMemberSchema.extend({
  photoUrl: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
  onSubmit: (data: MemberFormData, photoFile?: File) => void;
  isLoading?: boolean;
}

export const MemberDialog: React.FC<MemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSubmit,
  isLoading = false,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedNationality, setSelectedNationality] = useState<string>("AO");
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<string>("AO");
  const [documentType, setDocumentType] = useState<"BI" | "Passaporte">("BI");

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

  useEffect(() => {
    if (member && open) {
      // Parse dates from DD/MM/YYYY format
      const parseDate = (dateStr: string) => {
        if (!dateStr) return undefined;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      // Find country code from nationality
      const country = countries.find(c => c.name === member.nationality);
      const countryCode = country?.code || "AO";
      setSelectedNationality(countryCode);

      // Extract phone country code
      const phoneMatch = member.phone?.match(/^\+(\d+)/);
      if (phoneMatch) {
        const phoneCode = `+${phoneMatch[1]}`;
        const phoneCountry = countries.find(c => c.phoneCode === phoneCode);
        if (phoneCountry) {
          setSelectedPhoneCountry(phoneCountry.code);
        }
      }

      // Determine document type
      if (member.idDocument) {
        const isBI = /^\d{9}/.test(member.idDocument.replace(/[^0-9A-Za-z]/g, ''));
        setDocumentType(isBI ? "BI" : "Passaporte");
      }

      form.reset({
        fullName: member.fullName || "",
        birthDate: parseDate(member.birthDate) || "",
        birthPlace: member.birthPlace || "",
        nationality: member.nationality || "Angolana",
        gender: member.gender,
        maritalStatus: member.maritalStatus,
        idDocument: member.idDocument || "",
        idIssueDate: parseDate(member.idIssueDate) || "",
        idIssuePlace: member.idIssuePlace || "",
        fatherName: member.fatherName || "",
        motherName: member.motherName || "",
        occupation: member.occupation || "",
        phone: member.phone || "",
        currentAddress: member.currentAddress || "",
        municipality: member.municipality || "",
        workProvince: member.workProvince || "",
        email: member.email || "",
        photoUrl: member.photoUrl || "",
        otherInfo: member.otherInfo || "",
        status: member.status || "active",
      });

      if (member.photoUrl) {
        setPhotoPreview(member.photoUrl);
      }
    } else if (open) {
      form.reset({
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
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      setSelectedNationality("AO");
      setSelectedPhoneCountry("AO");
      setDocumentType("BI");
    }
  }, [member, open, form]);

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

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    form.setValue("photoUrl", "");
  };

  const handleSubmit = (data: MemberFormData) => {
    onSubmit(data, photoFile || undefined);
  };

  const availableProvinces = getProvincesByCountry(selectedNationality);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Editar Membro' : 'Novo Membro'}
          </DialogTitle>
          <DialogDescription>
            {member
              ? 'Atualize as informações do membro.'
              : 'Preencha os dados do novo membro.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const year = date.getFullYear();
                              field.onChange(`${day}/${month}/${year}`);
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
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidade *</FormLabel>
                      <Select
                        value={selectedNationality}
                        onValueChange={(value) => {
                          const country = countries.find(c => c.code === value);
                          setSelectedNationality(value);
                          field.onChange(country?.name || "");
                          form.setValue("birthPlace", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a nacionalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naturalidade *</FormLabel>
                    {availableProvinces.length > 0 ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a naturalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableProvinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input {...field} placeholder="Digite a naturalidade" />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
            </div>

            {/* Document Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documento de Identificação</h3>
              
              <FormField
                control={form.control}
                name="idDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>B.I./Passaporte *</FormLabel>
                    <FormControl>
                      <IdDocumentInput
                        value={field.value}
                        onChange={field.onChange}
                        documentType={documentType}
                        onDocumentTypeChange={setDocumentType}
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
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const year = date.getFullYear();
                              field.onChange(`${day}/${month}/${year}`);
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Family Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Familiares</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Pai *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Profissionais</h3>
              
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função que Exerce/exerceu *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contactos e Residência</h3>
              
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
                        <Input {...field} type="email" />
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
                      <Textarea {...field} rows={3} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Foto</h3>
              
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemovePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        {photoPreview ? 'Alterar Foto' : 'Carregar Foto'}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Other Info */}
            <FormField
              control={form.control}
              name="otherInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outros dados</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="Informações adicionais (opcional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            {member && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : member ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

