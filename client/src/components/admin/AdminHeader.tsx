import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { Menu, Bell, Search } from 'lucide-react';

const AdminHeader = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdmin();

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;


