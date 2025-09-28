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
import { CreateEventData, UpdateEventData } from '@/hooks/useEvents';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: UpdateEventData | null;
  onSubmit: (data: CreateEventData) => void;
  isLoading?: boolean;
}

const typeOptions = [
  'Conferência',
  'Workshop',
  'Seminário',
  'Assembleia',
  'Mesa Redonda',
  'Treinamento',
  'Networking',
  'Apresentação',
  'Debate',
  'Curso',
];

export const EventDialog = ({
  open,
  onOpenChange,
  event,
  onSubmit,
  isLoading = false,
}: EventDialogProps) => {
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: '',
    capacity: '',
    registrationUrl: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        type: event.type || '',
        capacity: event.capacity || '',
        registrationUrl: event.registrationUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: '',
        capacity: '',
        registrationUrl: '',
      });
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateEventData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogDescription>
            {event 
              ? 'Atualize as informações do evento.'
              : 'Adicione um novo evento ao sistema.'
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
              placeholder="Ex: Conferência Nacional de Telecomunicações 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o evento..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="Ex: 09:00 - 17:00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ex: Hotel Presidente, Luanda"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade (opcional)</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Ex: 200 participantes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationUrl">URL de Inscrição (opcional)</Label>
            <Input
              id="registrationUrl"
              value={formData.registrationUrl}
              onChange={(e) => handleInputChange('registrationUrl', e.target.value)}
              placeholder="https://exemplo.com/inscricao"
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
              {isLoading ? 'Salvando...' : event ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
