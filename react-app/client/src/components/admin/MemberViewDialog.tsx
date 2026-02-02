import { HPHModal, HPHBadge, HPHButton } from "@/components/ui/hph";
import { Separator } from "@/components/ui/separator";
import { UserIcon as User, Call02Icon as Phone, Mail01Icon as Mail, Location01Icon as MapPin, Briefcase01Icon as Briefcase, Calendar03Icon as Calendar, Ticket01Icon as Hash } from "hugeicons-react";
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
    <HPHModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={member?.fullName || "Detalhes do Membro"}
      description={`Membro Nº ${member?.memberNumber || ""}`}
      maxWidth="max-w-3xl"
    >
        {member && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{member.fullName}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">Membro Nº {member.memberNumber}</span>
                </div>
              </div>
              <HPHBadge variant={member.status === 'active' ? 'primary' : 'gray'}>
                {member.status === 'active' ? 'Ativo' : member.status === 'inactive' ? 'Inativo' : 'Pendente'}
              </HPHBadge>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-accent">
                  Informações Pessoais
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Data de Nascimento</p>
                    <p className="text-sm font-medium">{member.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Naturalidade</p>
                    <p className="text-sm font-medium">{member.birthPlace}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Nacionalidade</p>
                    <p className="text-sm font-medium">{member.nationality}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Sexo</p>
                      <p className="text-sm font-medium">{member.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Estado Civil</p>
                      <p className="text-sm font-medium">{member.maritalStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-accent">
                  Documento de Identificação
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">B.I./Passaporte</p>
                    <p className="text-sm font-medium">{member.idDocument}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Data de Emissão</p>
                    <p className="text-sm font-medium">{member.idIssueDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Local de Emissão</p>
                    <p className="text-sm font-medium">{member.idIssuePlace}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Family Information */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-accent">
                  Filiação
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Nome do Pai</p>
                    <p className="text-sm font-medium">{member.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Nome da Mãe</p>
                    <p className="text-sm font-medium">{member.motherName}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-accent">
                  Informações Profissionais
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Ocupação</p>
                    <p className="text-sm font-medium">{member.occupation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Província onde Trabalhou</p>
                    <p className="text-sm font-medium">{member.workProvince}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-accent">
                Contactos
              </h4>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Telefone</p>
                    <p className="text-sm font-medium">{member.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">E-mail</p>
                    <p className="text-sm font-medium break-all">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-1 sm:col-span-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Endereço</p>
                    <p className="text-sm font-medium">{member.currentAddress}</p>
                    <p className="text-xs text-muted-foreground">{member.municipality}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Information */}
            {member.otherInfo && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 font-accent">
                    Outras Informações
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {member.otherInfo}
                  </p>
                </div>
              </>
            )}

            {/* Registration Date */}
            {member.registrationDate && (
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">
                    Inscrito em: {new Date(member.registrationDate).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <HPHButton variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Fechar
                </HPHButton>
              </div>
            )}
          </div>
        )}
    </HPHModal>
  );
}
