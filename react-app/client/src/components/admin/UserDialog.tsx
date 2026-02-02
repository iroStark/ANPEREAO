import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';
import { CreateUserData, UpdateUserData } from '@/hooks/useUsers';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UpdateUserData | null;
  onSubmit: (data: CreateUserData) => void;
  isLoading?: boolean;
}

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
];

export const UserDialog = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading = false,
}: UserDialogProps) => {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    role: 'viewer',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Não mostrar senha existente
        role: user.role || 'viewer',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'viewer',
        isActive: true,
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se está editando e não há nova senha, remover o campo password
    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }
    
    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? 'Atualize as informações do usuário.'
              : 'Adicione um novo usuário ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Ex: joao.silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ex: joao@anpere.ao"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? 'Nova Senha (deixe vazio para manter a atual)' : 'Senha'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              required={!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value as 'admin' | 'editor' | 'viewer')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Usuário ativo</Label>
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
              {isLoading ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
