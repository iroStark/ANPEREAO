import { createContext, useContext, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface AdminContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: 'Dashboard', href: '/admin', icon: undefined }
  ]);

  return (
    <AdminContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        currentSection,
        setCurrentSection,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};


