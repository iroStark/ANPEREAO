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
    date: '',
    fileUrl: '',
    downloadUrl: '',
  });

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || '',
        description: publication.description || '',
        category: publication.category || '',
        date: publication.date || '',
        fileUrl: publication.fileUrl || '',
        downloadUrl: publication.downloadUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        fileUrl: '',
        downloadUrl: '',
      });
    }
  }, [publication, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="Ex: Janeiro 2024"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">URL do Arquivo (opcional)</Label>
            <Input
              id="fileUrl"
              value={formData.fileUrl}
              onChange={(e) => handleInputChange('fileUrl', e.target.value)}
              placeholder="https://exemplo.com/arquivo.pdf"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downloadUrl">URL de Download (opcional)</Label>
            <Input
              id="downloadUrl"
              value={formData.downloadUrl}
              onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
              placeholder="https://exemplo.com/download"
              type="url"
            />
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
