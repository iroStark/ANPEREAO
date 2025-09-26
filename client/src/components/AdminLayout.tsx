import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Shield, 
  Users, 
  FileText, 
  Calendar,
  ImageIcon,
  BookOpen,
  Info,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Shield, current: location === '/admin' },
    { name: 'Sobre Nós', href: '/admin/about', icon: Info, current: location === '/admin/about' },
    { name: 'Legislação', href: '/admin/legislation', icon: BookOpen, current: location === '/admin/legislation' },
    { name: 'Publicações', href: '/admin/publications', icon: FileText, current: location === '/admin/publications' },
    { name: 'Eventos', href: '/admin/events', icon: Calendar, current: location === '/admin/events' },
    { name: 'Galeria', href: '/admin/gallery', icon: ImageIcon, current: location === '/admin/gallery' },
  ];

  const handleNavigation = (href: string) => {
    setLocation(href);
    setSidebarOpen(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-primary rounded-xl shadow-lg flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm sm:text-lg text-foreground truncate">Admin ANPERE</h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Painel de Gestão</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-destructive/10"
              onClick={() => setSidebarOpen(false)}
              data-testid="button-close-sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">Administrador</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg
                    transition-all duration-200 text-left
                    ${item.current 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                data-testid="button-logout"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="-m-2.5"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-open-sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
            Admin ANPERE
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;