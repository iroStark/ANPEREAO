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
import { BookOpen, FileText, Gavel, Scale, Building, Calendar } from 'lucide-react';
import { CreateLegislationData, UpdateLegislationData } from '@/hooks/useLegislation';

interface LegislationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  legislation?: UpdateLegislationData | null;
  onSubmit: (data: CreateLegislationData) => void;
  isLoading?: boolean;
}

const iconOptions = [
  { value: 'Scale', label: 'Balança', icon: Scale },
  { value: 'FileText', label: 'Documento', icon: FileText },
  { value: 'Gavel', label: 'Martelo', icon: Gavel },
  { value: 'BookOpen', label: 'Livro', icon: BookOpen },
  { value: 'Building', label: 'Edifício', icon: Building },
  { value: 'Calendar', label: 'Calendário', icon: Calendar },
];

const categoryOptions = [
  'Lei Principal',
  'Regulamento',
  'Código',
  'Decreto',
  'Portaria',
  'Estatuto',
  'Norma Técnica',
];

export const LegislationDialog = ({
  open,
  onOpenChange,
  legislation,
  onSubmit,
  isLoading = false,
}: LegislationDialogProps) => {
  const [formData, setFormData] = useState<CreateLegislationData>({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear().toString(),
    icon: 'Scale',
  });

  useEffect(() => {
    if (legislation) {
      setFormData({
        title: legislation.title || '',
        description: legislation.description || '',
        category: legislation.category || '',
        year: legislation.year || new Date().getFullYear().toString(),
        icon: legislation.icon || 'Scale',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        year: new Date().getFullYear().toString(),
        icon: 'Scale',
      });
    }
  }, [legislation, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateLegislationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedIcon = iconOptions.find(option => option.value === formData.icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {legislation ? 'Editar Legislação' : 'Nova Legislação'}
          </DialogTitle>
          <DialogDescription>
            {legislation 
              ? 'Atualize as informações da legislação.'
              : 'Adicione uma nova legislação ao sistema.'
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
              placeholder="Ex: Lei das Comunicações Electrónicas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o conteúdo e propósito desta legislação..."
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
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => handleInputChange('icon', value)}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedIcon && <selectedIcon.icon className="w-4 h-4" />}
                    <span>{selectedIcon?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {isLoading ? 'Salvando...' : legislation ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
