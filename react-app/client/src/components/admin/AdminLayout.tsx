import { ReactNode } from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AdminProvider>
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-16 xl:ml-64">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;

