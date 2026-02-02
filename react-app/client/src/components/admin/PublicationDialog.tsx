import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload01Icon as Upload, Cancel01Icon as X } from "hugeicons-react";
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
import { CreatePublicationData, UpdatePublicationData } from '@/hooks/usePublications';

interface PublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication?: UpdatePublicationData | null;
  onSubmit: (data: CreatePublicationData) => void;
  isLoading?: boolean;
}

const categoryOptions = [
  'Plano',
  'Relatório',
  'Acta',
  'Comunicado',
  'Guia',
  'Newsletter',
  'Manual',
  'Estudo',
  'Boletim',
  'Circular',
];

export const PublicationDialog = ({
  open,
  onOpenChange,
  publication,
  onSubmit,
  isLoading = false,
}: PublicationDialogProps) => {
  const [formData, setFormData] = useState<CreatePublicationData>({
    title: '',
    description: '',
    category: '',
    date: new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
    fileUrl: '',
    downloadUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || '',
        description: publication.description || '',
        category: publication.category || '',
        date: publication.date || new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
        fileUrl: publication.fileUrl || '',
        downloadUrl: publication.downloadUrl || '',
      });
      setFilePreview(publication.fileUrl || publication.downloadUrl || null);
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        date: new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
        fileUrl: '',
        downloadUrl: '',
      });
      setFilePreview(null);
    }
    setSelectedFile(null);
  }, [publication, open]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
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
    setFormData(prev => ({ ...prev, fileUrl: '', downloadUrl: '' }));
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
        finalData.downloadUrl = uploadedUrl;
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return;
      }
    }
    
    onSubmit(finalData);
  };

  const handleInputChange = (field: keyof CreatePublicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {publication ? 'Editar Publicação' : 'Nova Publicação'}
          </DialogTitle>
          <DialogDescription>
            {publication 
              ? 'Atualize as informações da publicação.'
              : 'Adicione uma nova publicação ao sistema.'
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
              placeholder="Ex: Relatório Anual 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o conteúdo desta publicação..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="Ex: Janeiro 2024"
                required
              />
              <p className="text-xs text-muted-foreground">
                Data preenchida automaticamente. Pode editar se necessário.
              </p>
            </div>
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
              {publication && (publication.fileUrl || publication.downloadUrl) && !selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <span className="text-sm flex-1">Arquivo atual: {publication.fileUrl || publication.downloadUrl}</span>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : publication ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
