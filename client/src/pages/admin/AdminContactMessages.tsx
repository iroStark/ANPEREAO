import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  useContactMessages,
  useUpdateContactMessage,
  useDeleteContactMessage,
  type ContactMessage 
} from '@/hooks/useContactMessages';
import { Mail01Icon as Mail, Search01Icon as Search, ViewIcon as Eye, Delete02Icon as Trash2, CheckmarkCircle02Icon as CheckCircle, CancelCircleIcon as XCircle, Call02Icon as Phone, UserIcon as User, Calendar03Icon as Calendar, Comment01Icon as MessageSquare } from "hugeicons-react";
import { toast } from 'sonner';

const AdminContactMessages = () => {
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  const { data: messages = [], isLoading, error } = useContactMessages();
  const updateContactMessage = useUpdateContactMessage();
  const deleteContactMessage = useDeleteContactMessage();

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterRead === 'all' || 
      (filterRead === 'read' && message.isRead) ||
      (filterRead === 'unread' && !message.isRead);
    
    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      await updateContactMessage.mutateAsync({ id: message.id, isRead: true });
      toast.success('Mensagem marcada como lida');
    } catch (error: any) {
      toast.error('Erro ao marcar mensagem', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleMarkAsUnread = async (message: ContactMessage) => {
    try {
      await updateContactMessage.mutateAsync({ id: message.id, isRead: false });
      toast.success('Mensagem marcada como não lida');
    } catch (error: any) {
      toast.error('Erro ao marcar mensagem', { description: error.message || 'Tente novamente.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await deleteContactMessage.mutateAsync(id);
        toast.success('Mensagem excluída com sucesso!');
        if (viewingMessage?.id === id) {
          setViewingMessage(null);
        }
      } catch (error: any) {
        toast.error('Erro ao excluir mensagem', { description: error.message || 'Tente novamente.' });
      }
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando mensagens...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro ao carregar mensagens: {error.message}</p>
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
            <h1 className="text-3xl font-bold">Mensagens de Contato</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as mensagens enviadas através do formulário de contato.
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-lg px-4 py-2">
              {unreadCount} não lidas
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email, assunto ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRead === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('all')}
            >
              Todas
            </Button>
            <Button
              variant={filterRead === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('unread')}
            >
              Não Lidas
            </Button>
            <Button
              variant={filterRead === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('read')}
            >
              Lidas
            </Button>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`hover:shadow-lg transition-shadow ${!message.isRead ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{message.subject}</CardTitle>
                          {!message.isRead && (
                            <Badge variant="default" className="text-xs">Nova</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{message.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                          {message.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(message.createdAt).toLocaleDateString('pt-PT', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingMessage(message)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      {message.isRead ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsUnread(message)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Marcar como Não Lida
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(message)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Lida
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View Message Dialog */}
        <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {viewingMessage && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>{viewingMessage.subject}</DialogTitle>
                    {!viewingMessage.isRead && (
                      <Badge variant="default">Nova</Badge>
                    )}
                  </div>
                  <DialogDescription>
                    Mensagem recebida em {viewingMessage.createdAt && new Date(viewingMessage.createdAt).toLocaleDateString('pt-PT', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Nome</p>
                        <p className="text-sm text-muted-foreground">{viewingMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{viewingMessage.email}</p>
                      </div>
                    </div>
                    {viewingMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-sm text-muted-foreground">{viewingMessage.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm font-medium">Mensagem</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {viewingMessage.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    {viewingMessage.isRead ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleMarkAsUnread(viewingMessage);
                          setViewingMessage({ ...viewingMessage, isRead: false });
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Marcar como Não Lida
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleMarkAsRead(viewingMessage);
                          setViewingMessage({ ...viewingMessage, isRead: true });
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Lida
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(viewingMessage.id)}
                      className="text-destructive hover:text-destructive ml-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;

