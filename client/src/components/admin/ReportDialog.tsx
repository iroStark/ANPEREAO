import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateReportData, UpdateReportData } from '@/hooks/useReports';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report?: UpdateReportData | null;
  onSubmit: (data: CreateReportData) => void;
  isLoading?: boolean;
}

const typeOptions = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'annual', label: 'Anual' },
  { value: 'special', label: 'Especial' },
];

const statusOptions = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Arquivado' },
];

export const ReportDialog = ({
  open,
  onOpenChange,
  report,
  onSubmit,
  isLoading = false,
}: ReportDialogProps) => {
  const [formData, setFormData] = useState<CreateReportData>({
    title: '',
    description: '',
    type: 'monthly',
    status: 'draft',
    period: '',
    fileUrl: '',
  });

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        description: report.description || '',
        type: report.type || 'monthly',
        status: report.status || 'draft',
        period: report.period || '',
        fileUrl: report.fileUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'monthly',
        status: 'draft',
        period: '',
        fileUrl: '',
      });
    }
  }, [report, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {report ? 'Editar Relatório' : 'Novo Relatório'}
          </DialogTitle>
          <DialogDescription>
            {report 
              ? 'Atualize as informações do relatório.'
              : 'Adicione um novo relatório ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Relatório Mensal - Janeiro 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o conteúdo do relatório..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value as 'monthly' | 'quarterly' | 'annual' | 'special')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as 'draft' | 'published' | 'archived')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value)}
              placeholder="Ex: Janeiro 2024, Q1 2024, 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">URL do Arquivo (opcional)</Label>
            <Input
              id="fileUrl"
              type="url"
              value={formData.fileUrl}
              onChange={(e) => handleInputChange('fileUrl', e.target.value)}
              placeholder="https://exemplo.com/relatorio.pdf"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Salvando...' : report ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
