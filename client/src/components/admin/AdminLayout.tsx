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
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-16 xl:ml-64">
          <AdminHeader />
          <main className="flex-1">
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

