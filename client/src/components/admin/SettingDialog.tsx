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
import { CreateSettingData, UpdateSettingData } from '@/hooks/useSettings';

interface SettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting?: UpdateSettingData | null;
  onSubmit: (data: CreateSettingData) => void;
  isLoading?: boolean;
}

const categoryOptions = [
  { value: 'general', label: 'Geral' },
  { value: 'email', label: 'Email' },
  { value: 'security', label: 'Segurança' },
  { value: 'database', label: 'Base de Dados' },
  { value: 'website', label: 'Website' },
];

const typeOptions = [
  { value: 'string', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'json', label: 'JSON' },
];

export const SettingDialog = ({
  open,
  onOpenChange,
  setting,
  onSubmit,
  isLoading = false,
}: SettingDialogProps) => {
  const [formData, setFormData] = useState<CreateSettingData>({
    key: '',
    value: '',
    description: '',
    category: 'general',
    type: 'string',
  });

  useEffect(() => {
    if (setting) {
      setFormData({
        key: setting.key || '',
        value: setting.value || '',
        description: setting.description || '',
        category: setting.category || 'general',
        type: setting.type || 'string',
      });
    } else {
      setFormData({
        key: '',
        value: '',
        description: '',
        category: 'general',
        type: 'string',
      });
    }
  }, [setting, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateSettingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooleanValueChange = (value: string) => {
    const booleanValue = value === 'true' ? 'true' : 'false';
    setFormData(prev => ({ ...prev, value: booleanValue }));
  };

  const renderValueInput = () => {
    switch (formData.type) {
      case 'boolean':
        return (
          <Select
            value={formData.value}
            onValueChange={handleBooleanValueChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder="Ex: 100"
            required
          />
        );
      case 'json':
        return (
          <Textarea
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder='{"key": "value"}'
            rows={3}
            required
          />
        );
      default:
        return (
          <Input
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder="Ex: valor da configuração"
            required
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {setting ? 'Editar Configuração' : 'Nova Configuração'}
          </DialogTitle>
          <DialogDescription>
            {setting 
              ? 'Atualize as informações da configuração.'
              : 'Adicione uma nova configuração ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Chave</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => handleInputChange('key', e.target.value)}
              placeholder="Ex: site_name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o propósito desta configuração..."
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value as 'general' | 'email' | 'security' | 'database' | 'website')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value as 'string' | 'number' | 'boolean' | 'json')}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            {renderValueInput()}
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
              {isLoading ? 'Salvando...' : setting ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
