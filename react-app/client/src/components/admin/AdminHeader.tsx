import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { Menu01Icon as Menu, Notification01Icon as Bell, Search01Icon as Search, CheckmarkCircle02Icon as Check, Delete02Icon as Trash2, Cancel01Icon as X } from "hugeicons-react";
import { useNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '@/hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLocation } from 'wouter';
import { formatDistanceToNow, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const AdminHeader = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdmin();
  const [, setLocation] = useLocation();
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = { count: 0 } } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.link) {
      setLocation(notification.link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'member_registration':
        return '👤';
      case 'contact_message':
        return '✉️';
      default:
        return '🔔';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Breadcrumbs */}
      <div className="flex-1">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount.count > 9 ? '9+' : unreadCount.count}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between p-2 border-b">
              <h3 className="font-semibold text-sm">Notificações</h3>
              {unreadCount.count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Carregando notificações...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              <>
                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                  <>
                    {unreadNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="text-xl flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={cn("text-sm font-medium", !notification.isRead && "font-semibold")}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                                {notification.createdAt && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {(() => {
                                      const date = new Date(notification.createdAt);
                                      return isValid(date) 
                                        ? formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
                                        : 'há algum tempo';
                                    })()}
                                  </p>
                                )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => handleDeleteNotification(e, notification.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    {readNotifications.length > 0 && <DropdownMenuSeparator />}
                  </>
                )}

                {/* Read Notifications */}
                {readNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted opacity-70"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="text-xl flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.createdAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR })}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;








