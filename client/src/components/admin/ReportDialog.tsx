import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Cancel01Icon as X } from "hugeicons-react";
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
  const getCurrentPeriod = () => {
    const now = new Date();
    const month = now.toLocaleDateString('pt-PT', { month: 'long' });
    const year = now.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const [formData, setFormData] = useState<CreateReportData>({
    title: '',
    description: '',
    type: 'monthly',
    status: 'draft',
    period: getCurrentPeriod(),
    fileUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        description: report.description || '',
        type: report.type || 'monthly',
        status: report.status || 'draft',
        period: report.period || getCurrentPeriod(),
        fileUrl: report.fileUrl || '',
      });
      setFilePreview(report.fileUrl || null);
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'monthly',
        status: 'draft',
        period: getCurrentPeriod(),
        fileUrl: '',
      });
      setFilePreview(null);
    }
    setSelectedFile(null);
  }, [report, open]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const uploadResponse = await fetch(`${baseUrl}/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
      },
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Erro ao fazer upload do arquivo');
    }
    
    const uploadResult = await uploadResponse.json();
    return uploadResult.url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFormData(prev => ({ ...prev, fileUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalData = { ...formData };
    
    // Se há um arquivo selecionado, fazer upload
    if (selectedFile) {
      try {
        const uploadedUrl = await uploadFile(selectedFile);
        finalData.fileUrl = uploadedUrl;
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return;
      }
    }
    
    onSubmit(finalData);
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
              data-testid="input-report-title"
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
              data-testid="textarea-report-description"
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
            <p className="text-xs text-muted-foreground">
              Período preenchido automaticamente. Pode editar se necessário.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <div className="space-y-2">
            <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="cursor-pointer"
              />
              {filePreview && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <span className="text-sm flex-1">Arquivo selecionado</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {report && report.fileUrl && !selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <span className="text-sm flex-1">Arquivo atual: {report.fileUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto" data-testid="button-submit-report">
              {isLoading ? 'Salvando...' : report ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
