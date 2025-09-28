import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  Info,
  BookOpen,
  FileText,
  Calendar,
  ImageIcon,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Conteúdo',
    icon: FileText,
    href: '/admin/content',
    children: [
      { name: 'Sobre Nós', href: '/admin/about', icon: Info },
      { name: 'Legislação', href: '/admin/legislation', icon: BookOpen },
      { name: 'Publicações', href: '/admin/publications', icon: FileText },
    ],
  },
  {
    name: 'Eventos',
    href: '/admin/events',
    icon: Calendar,
  },
  {
    name: 'Galeria',
    href: '/admin/gallery',
    icon: ImageIcon,
  },
  {
    name: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const [location, setLocation] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (href: string) => {
    setLocation(href);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavItem = ({ item, level = 0 }: { item: NavigationItem; level?: number }) => {
    const isActive = location === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const [expanded, setExpanded] = useState(false);

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              level > 0 && 'ml-4'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="truncate">{item.name}</span>
                {expanded ? (
                  <ChevronLeft className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </>
            )}
          </button>
          {expanded && !sidebarCollapsed && (
            <div className="space-y-1 ml-4">
              {item.children?.map((child) => (
                <NavItem key={child.href} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => handleNavigation(item.href)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          level > 0 && 'ml-4'
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="truncate">{item.name}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border shadow-xl transition-all duration-300',
          'lg:relative lg:translate-x-0 lg:inset-0',
          sidebarCollapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Admin</h2>
                <p className="text-xs text-muted-foreground">ANPERE</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Administrador</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

