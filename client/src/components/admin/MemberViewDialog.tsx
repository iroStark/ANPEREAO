import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, MapPin, Briefcase, Calendar, Hash } from "lucide-react";
import { type Member } from "@/hooks/useMembers";

interface MemberViewDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberViewDialog({
  member,
  open,
  onOpenChange,
}: MemberViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {member && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{member.fullName}</DialogTitle>
                  <DialogDescription className="text-base flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Membro Nº {member.memberNumber}
                  </DialogDescription>
                </div>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {member.status === 'active' ? 'Ativo' : member.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </Badge>
              </div>
            </DialogHeader>

            <Separator />

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Informações Pessoais
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
                    <p className="text-sm font-medium">{member.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Naturalidade</p>
                    <p className="text-sm font-medium">{member.birthPlace}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nacionalidade</p>
                    <p className="text-sm font-medium">{member.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sexo</p>
                    <p className="text-sm font-medium">{member.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estado Civil</p>
                    <p className="text-sm font-medium">{member.maritalStatus}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Document Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Documento de Identificação
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">B.I./Passaporte</p>
                    <p className="text-sm font-medium">{member.idDocument}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Data de Emissão</p>
                    <p className="text-sm font-medium">{member.idIssueDate}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Local de Emissão</p>
                    <p className="text-sm font-medium">{member.idIssuePlace}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Family Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Filiação
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nome do Pai</p>
                    <p className="text-sm font-medium">{member.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nome da Mãe</p>
                    <p className="text-sm font-medium">{member.motherName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Informações Profissionais
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ocupação</p>
                    <p className="text-sm font-medium">{member.occupation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Província onde Trabalhou</p>
                    <p className="text-sm font-medium">{member.workProvince}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Contactos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="text-sm font-medium">{member.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">E-mail</p>
                      <p className="text-sm font-medium">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Endereço</p>
                      <p className="text-sm font-medium">{member.currentAddress}</p>
                      <p className="text-sm text-muted-foreground mt-1">{member.municipality}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Information */}
              {member.otherInfo && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Outras Informações
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">{member.otherInfo}</p>
                  </div>
                </>
              )}

              {/* Registration Date */}
              {member.registrationDate && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Data de Inscrição
                    </h3>
                    <p className="text-sm">
                      {new Date(member.registrationDate).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
