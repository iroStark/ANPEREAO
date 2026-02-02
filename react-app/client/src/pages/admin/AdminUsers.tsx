import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserDialog } from '@/components/admin/UserDialog';
import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  type User 
} from '@/hooks/useUsers';
import { Add01Icon as Plus, Search01Icon as Search, FilterHorizontalIcon as Filter, Edit02Icon as Edit2, Delete02Icon as Trash2, ViewIcon as Eye, UserGroupIcon as Users, SecurityCheckIcon as Shield, UserCheck01Icon as UserCheck } from "hugeicons-react";
import { toast } from 'sonner';

const AdminUsers = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Hooks para gerenciar dados
  const { data: users = [], isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = async (data: any) => {
    try {
      await createUser.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Usuário criado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar usuário', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (!editingUser) return;
    
    try {
      await updateUser.mutateAsync({ id: editingUser.id, ...data });
      setEditingUser(null);
      toast.success('Usuário atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar usuário', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser.mutateAsync(id);
        toast.success('Usuário excluído com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao excluir usuário', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar usuários: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="gap-1"><Shield className="w-3 h-3" />Admin</Badge>;
      case 'editor':
        return <Badge variant="default" className="gap-1"><Edit2 className="w-3 h-3" />Editor</Badge>;
      case 'viewer':
        return <Badge variant="secondary" className="gap-1"><Eye className="w-3 h-3" />Visualizador</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default" className="gap-1"><UserCheck className="w-3 h-3" />Ativo</Badge> :
      <Badge variant="outline">Inativo</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">
              Gerir usuários do sistema ANPERE
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
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
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
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
                    placeholder="Pesquisar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('admin')}
                >
                  Admins
                </Button>
                <Button
                  variant={filterRole === 'editor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('editor')}
                >
                  Editores
                </Button>
                <Button
                  variant={filterRole === 'viewer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole('viewer')}
                >
                  Visualizadores
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        )}

        {/* Users List */}
        {!isLoading && (
          <div className="grid gap-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold truncate">
                            {user.username}
                          </h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.isActive)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          {user.email && <span>Email: {user.email}</span>}
                          <span>Criado: {new Date(user.createdAt).toLocaleDateString('pt-PT')}</span>
                          {user.lastLoginAt && (
                            <span>Último login: {new Date(user.lastLoginAt).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUser.isPending}
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
        {!isLoading && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p className="mb-4">
                  {searchTerm || filterRole !== 'all' 
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece adicionando um novo usuário.'
                  }
                </p>
                {!searchTerm && filterRole === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <UserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateUser}
          isLoading={createUser.isPending}
        />

        <UserDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onSubmit={handleUpdateUser}
          isLoading={updateUser.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
