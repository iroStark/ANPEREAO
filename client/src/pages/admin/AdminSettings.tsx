import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { SettingDialog } from '@/components/admin/SettingDialog';
import { 
  useSettings, 
  useCreateSetting, 
  useUpdateSetting, 
  useDeleteSetting,
  type Setting 
} from '@/hooks/useSettings';
import { Plus, Search, Filter, Edit2, Trash2, Settings, Globe, Mail, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Hooks para gerenciar dados
  const { data: settings = [], isLoading, error } = useSettings();
  const createSetting = useCreateSetting();
  const updateSetting = useUpdateSetting();
  const deleteSetting = useDeleteSetting();

  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || setting.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleCreateSetting = async (data: any) => {
    try {
      await createSetting.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Configuração criada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar configuração', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleUpdateSetting = async (data: any) => {
    if (!editingSetting) return;
    
    try {
      await updateSetting.mutateAsync({ id: editingSetting.id, ...data });
      setEditingSetting(null);
      toast.success('Configuração atualizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar configuração', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleDeleteSetting = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta configuração?')) {
      try {
        await deleteSetting.mutateAsync(id);
        toast.success('Configuração excluída com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao excluir configuração', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleEditSetting = (setting: Setting) => {
    setEditingSetting(setting);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar configurações: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <Settings className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'general':
        return <Badge variant="default" className="gap-1"><Settings className="w-3 h-3" />Geral</Badge>;
      case 'email':
        return <Badge variant="secondary" className="gap-1"><Mail className="w-3 h-3" />Email</Badge>;
      case 'security':
        return <Badge variant="destructive" className="gap-1"><Shield className="w-3 h-3" />Segurança</Badge>;
      case 'database':
        return <Badge variant="outline" className="gap-1"><Database className="w-3 h-3" />Base de Dados</Badge>;
      case 'website':
        return <Badge variant="secondary" className="gap-1"><Globe className="w-3 h-3" />Website</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'string':
        return <Badge variant="outline">Texto</Badge>;
      case 'number':
        return <Badge variant="outline">Número</Badge>;
      case 'boolean':
        return <Badge variant="outline">Sim/Não</Badge>;
      case 'json':
        return <Badge variant="outline">JSON</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerir configurações do sistema ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
            data-testid="button-create-setting"
          >
            <Plus className="w-4 h-4" />
            Nova Configuração
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Configurações</p>
                  <p className="text-2xl font-bold">{settings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="text-2xl font-bold">{settings.filter(s => s.category === 'website').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-2xl font-bold">{settings.filter(s => s.category === 'email').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Segurança</p>
                  <p className="text-2xl font-bold">{settings.filter(s => s.category === 'security').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar configurações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-settings"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('all')}
                >
                  Todas
                </Button>
                <Button
                  variant={filterCategory === 'general' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('general')}
                >
                  Geral
                </Button>
                <Button
                  variant={filterCategory === 'website' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('website')}
                >
                  Website
                </Button>
                <Button
                  variant={filterCategory === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('email')}
                >
                  Email
                </Button>
                <Button
                  variant={filterCategory === 'security' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('security')}
                >
                  Segurança
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        )}

        {/* Settings List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredSettings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(setting.category)}
                          <h3 className="text-lg font-semibold truncate">
                            {setting.key}
                          </h3>
                          {getCategoryBadge(setting.category)}
                          {getTypeBadge(setting.type)}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {setting.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          <span>Valor: <code className="bg-muted px-1 rounded">{setting.value}</code></span>
                          <span>Atualizado: {new Date(setting.updatedAt).toLocaleDateString('pt-PT')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSetting(setting)}
                          data-testid={`button-edit-${setting.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSetting(setting.id)}
                          disabled={deleteSetting.isPending}
                          data-testid={`button-delete-${setting.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSettings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma configuração encontrada</h3>
                <p className="mb-4">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece adicionando uma nova configuração.'
                  }
                </p>
                {!searchTerm && filterCategory === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Configuração
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <SettingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateSetting}
          isLoading={createSetting.isPending}
        />

        <SettingDialog
          open={!!editingSetting}
          onOpenChange={(open) => !open && setEditingSetting(null)}
          setting={editingSetting}
          onSubmit={handleUpdateSetting}
          isLoading={updateSetting.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
