import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  useAllActivityPlans,
  useActivityPlanById,
  useCreateActivityPlan,
  useUpdateActivityPlan,
  useDeleteActivityPlan,
  useCreateActivityPlanItem,
  useUpdateActivityPlanItem,
  useDeleteActivityPlanItem,
  type ActivityPlan,
  type ActivityPlanItem,
} from '@/hooks/useActivityPlan';
import { Add01Icon as Plus, Search01Icon as Search, Edit02Icon as Edit2, Delete02Icon as Trash2, ViewIcon as Eye, Calendar03Icon as Calendar, File02Icon as FileText, ArrowUp01Icon as ArrowUp, ArrowDown01Icon as ArrowDown } from "hugeicons-react";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const planSchema = z.object({
  year: z.string().min(4, 'Ano deve ter 4 dígitos').max(4),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

const itemSchema = z.object({
  number: z.number().min(1, 'Número é obrigatório'),
  activity: z.string().min(1, 'Atividade é obrigatória'),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  participants: z.string().optional(),
  order: z.number().min(0),
  parentId: z.string().optional(),
});

type PlanFormData = z.infer<typeof planSchema>;
type ItemFormData = z.infer<typeof itemSchema>;

const AdminActivityPlan = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActivityPlan | null>(null);
  const [editingItem, setEditingItem] = useState<ActivityPlanItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: plans = [], isLoading: plansLoading } = useAllActivityPlans();
  const { data: selectedPlan, isLoading: planLoading } = useActivityPlanById(selectedPlanId || '');
  
  const createPlan = useCreateActivityPlan();
  const updatePlan = useUpdateActivityPlan();
  const deletePlan = useDeleteActivityPlan();
  const createItem = useCreateActivityPlanItem();
  const updateItem = useUpdateActivityPlanItem();
  const deleteItem = useDeleteActivityPlanItem();

  const { register: registerPlan, handleSubmit: handlePlanSubmit, formState: { errors: planErrors }, reset: resetPlan, setValue: setPlanValue, watch: watchPlan } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      year: '2025',
      title: 'Plano de Atividades',
      description: '',
      isActive: true,
    },
  });

  const { register: registerItem, handleSubmit: handleItemSubmit, formState: { errors: itemErrors }, reset: resetItem, setValue: setItemValue } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      number: 1,
      activity: '',
      date: '',
      time: '',
      location: '',
      participants: '',
      order: 0,
      parentId: undefined,
    },
  });

  // Se não houver plano selecionado, selecionar o primeiro ou o ativo
  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      const activePlan = plans.find(p => p.isActive) || plans[0];
      if (activePlan) {
        setSelectedPlanId(activePlan.id);
      }
    }
  }, [plans.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = selectedPlan?.items?.filter(item =>
    item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.participants?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Primeiro por número, depois por ordem
    if (a.number !== b.number) return a.number - b.number;
    return a.order - b.order;
  });

  const onSubmitPlan = async (data: PlanFormData) => {
    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, ...data });
        toast.success('Plano atualizado com sucesso!');
      } else {
        await createPlan.mutateAsync(data);
        toast.success('Plano criado com sucesso!');
      }
      resetPlan();
      setIsPlanDialogOpen(false);
      setEditingPlan(null);
    } catch (error: any) {
      toast.error('Erro ao salvar plano', { description: error.message || 'Tente novamente.' });
    }
  };

  const onSubmitItem = async (data: ItemFormData) => {
    if (!selectedPlanId) {
      toast.error('Selecione um plano primeiro');
      return;
    }
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ planId: selectedPlanId, itemId: editingItem.id, ...data });
        toast.success('Item atualizado com sucesso!');
      } else {
        await createItem.mutateAsync({ ...data, planId: selectedPlanId });
        toast.success('Item criado com sucesso!');
      }
      resetItem();
      setIsItemDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error('Erro ao salvar item', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleEditPlan = (plan: ActivityPlan) => {
    setEditingPlan(plan);
    setPlanValue('year', plan.year);
    setPlanValue('title', plan.title);
    setPlanValue('description', plan.description || '');
    setPlanValue('isActive', plan.isActive);
    setIsPlanDialogOpen(true);
  };

  const handleEditItem = (item: ActivityPlanItem) => {
    setEditingItem(item);
    setItemValue('number', item.number);
    setItemValue('activity', item.activity);
    setItemValue('date', item.date || '');
    setItemValue('time', item.time || '');
    setItemValue('location', item.location || '');
    setItemValue('participants', item.participants || '');
    setItemValue('order', item.order);
    setItemValue('parentId', item.parentId || undefined);
    setIsItemDialogOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano? Todos os itens serão excluídos também.')) {
      try {
        await deletePlan.mutateAsync(id);
        toast.success('Plano excluído com sucesso!');
        if (selectedPlanId === id) {
          setSelectedPlanId(null);
        }
      } catch (error: any) {
        toast.error('Erro ao excluir plano', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        if (!selectedPlanId) return;
        await deleteItem.mutateAsync({ planId: selectedPlanId, itemId });
        toast.success('Item excluído com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao excluir item', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const handleClosePlanDialog = () => {
    setIsPlanDialogOpen(false);
    setEditingPlan(null);
    resetPlan();
  };

  const handleCloseItemDialog = () => {
    setIsItemDialogOpen(false);
    setEditingItem(null);
    resetItem();
  };

  if (plansLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando planos...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Plano de Atividades</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os planos de atividades e seus itens
            </p>
          </div>
          <Button onClick={() => setIsPlanDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Plans List */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                selectedPlanId === plan.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.title} {plan.year}</CardTitle>
                  {plan.isActive && <Badge variant="default">Ativo</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPlan(plan);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlan(plan.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Plan Items */}
        {selectedPlan && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Atividades - {selectedPlan.title} {selectedPlan.year}</h2>
                <p className="text-muted-foreground text-sm">
                  {sortedItems.length} atividade(s)
                </p>
              </div>
              <Button onClick={() => setIsItemDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Atividade
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Items Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20 bg-muted/50">
                        <th className="text-left p-4 font-semibold text-sm">N°</th>
                        <th className="text-left p-4 font-semibold text-sm">ATIVIDADE</th>
                        <th className="text-left p-4 font-semibold text-sm">DATA</th>
                        <th className="text-left p-4 font-semibold text-sm">HORA</th>
                        <th className="text-left p-4 font-semibold text-sm">LOCAL</th>
                        <th className="text-left p-4 font-semibold text-sm">PARTICIPANTES</th>
                        <th className="text-left p-4 font-semibold text-sm">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            Nenhuma atividade encontrada
                          </td>
                        </tr>
                      ) : (
                        sortedItems.map((item) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-4 font-medium text-primary">{item.number}</td>
                            <td className="p-4">
                              <div className="font-medium">{item.activity}</div>
                            </td>
                            <td className="p-4 text-sm">{item.date || '-'}</td>
                            <td className="p-4 text-sm">{item.time || '-'}</td>
                            <td className="p-4 text-sm">{item.location || '-'}</td>
                            <td className="p-4 text-sm">{item.participants || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedPlan && plans.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum plano encontrado</p>
              <Button onClick={() => setIsPlanDialogOpen(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Plan Dialog */}
        <Dialog open={isPlanDialogOpen} onOpenChange={handleClosePlanDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
              </DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Edite os dados do plano de atividades' : 'Crie um novo plano de atividades'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePlanSubmit(onSubmitPlan)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    {...registerPlan('year')}
                    placeholder={new Date().getFullYear().toString()}
                    defaultValue={new Date().getFullYear().toString()}
                  />
                  {planErrors.year && (
                    <p className="text-sm text-destructive">{planErrors.year.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Ano preenchido automaticamente. Pode editar se necessário.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isActive"
                      checked={watchPlan('isActive')}
                      onCheckedChange={(checked) => setPlanValue('isActive', checked)}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {watchPlan('isActive') ? 'Ativo' : 'Inativo'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...registerPlan('title')}
                  placeholder="Plano de Atividades"
                />
                {planErrors.title && (
                  <p className="text-sm text-destructive">{planErrors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...registerPlan('description')}
                  placeholder="Descrição do plano..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClosePlanDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createPlan.isPending || updatePlan.isPending}>
                  {editingPlan ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Item Dialog */}
        <Dialog open={isItemDialogOpen} onOpenChange={handleCloseItemDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Atividade' : 'Adicionar Nova Atividade'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Edite os dados da atividade' : 'Adicione uma nova atividade ao plano'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleItemSubmit(onSubmitItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    type="number"
                    {...registerItem('number', { valueAsNumber: true })}
                    min={1}
                  />
                  {itemErrors.number && (
                    <p className="text-sm text-destructive">{itemErrors.number.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    {...registerItem('order', { valueAsNumber: true })}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Atividade *</Label>
                <Textarea
                  id="activity"
                  {...registerItem('activity')}
                  placeholder="Nome da atividade..."
                  rows={2}
                />
                {itemErrors.activity && (
                  <p className="text-sm text-destructive">{itemErrors.activity.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data/Período</Label>
                  <Input
                    id="date"
                    {...registerItem('date')}
                    placeholder="Ex: Janeiro a Dezembro, Trimestralmente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    {...registerItem('time')}
                    placeholder="Ex: 09:00 - 15:00, 7:00 AM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  {...registerItem('location')}
                  placeholder="Ex: Sede, FOCABA, Barra do Dande"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input
                  id="participants"
                  {...registerItem('participants')}
                  placeholder="Ex: Membros [5], Direção [5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseItemDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
                  {editingItem ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityPlan;

