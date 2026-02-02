import React, { useState } from 'react';
import { 
  HPHButton, 
  HPHCard, 
  HPHCardHeader, 
  HPHCardContent, 
  HPHInput, 
  HPHSelect, 
  HPHBadge,
  HPHModal,
  HPHTable,
  HPHTableRow,
  HPHTableCell,
  HPHDistributionChart,
  HPHBarChart
} from '@/components/ui/hph';
import { Home01Icon, UserIcon, Settings01Icon, Analytics01Icon } from 'hugeicons-react';

export const AdminDesignTest = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const chartData = [
    { name: 'Grupo A', value: 400, color: '#0088FE' }, // Keeping some hardcoded colors for data visualization is fine/expected
    { name: 'Grupo B', value: 300, color: '#00C49F' },
    { name: 'Grupo C', value: 300, color: '#FFBB28' },
    { name: 'Grupo D', value: 200, color: '#FF8042' },
  ];

  const barData = [
    { name: 'Jan', vendas: 4000 },
    { name: 'Fev', vendas: 3000 },
    { name: 'Mar', vendas: 2000 },
    { name: 'Abr', vendas: 2780 },
    { name: 'Mai', vendas: 1890 },
  ];

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-screen">
      <h1 className="text-3xl font-bold text-foreground">HPH Design System Test</h1>
      
      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <HPHButton variant="primary">Primary</HPHButton>
          <HPHButton variant="secondary">Secondary</HPHButton>
          <HPHButton variant="success">Success</HPHButton>
          <HPHButton variant="danger">Danger</HPHButton>
          <HPHButton variant="ghost">Ghost</HPHButton>
          <HPHButton variant="outline">Outline</HPHButton>
          <HPHButton variant="teal">Teal</HPHButton>
          <HPHButton variant="primary" loading>Loading</HPHButton>
          <HPHButton variant="primary" icon={<Home01Icon className="w-5 h-5" />}>With Icon</HPHButton>
        </div>
      </section>

      {/* Cards & Inputs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HPHCard>
          <HPHCardHeader>
            <h3 className="text-lg font-bold">Form Elements</h3>
          </HPHCardHeader>
          <HPHCardContent className="space-y-4">
            <HPHInput label="Username" placeholder="Enter username" icon={<UserIcon className="w-5 h-5"/>} />
            <HPHSelect 
              label="Role" 
              options={[{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }]} 
              icon={<Settings01Icon className="w-5 h-5"/>}
            />
            <div className="flex gap-2">
                <HPHBadge variant="blue">Blue Badge</HPHBadge>
                <HPHBadge variant="green">Green Badge</HPHBadge>
                <HPHBadge variant="red">Red Badge</HPHBadge>
                <HPHBadge variant="primary">Primary Badge</HPHBadge>
            </div>
          </HPHCardContent>
        </HPHCard>

        <HPHCard>
          <HPHCardHeader>
             <h3 className="text-lg font-bold">Modal Trigger</h3>
          </HPHCardHeader>
          <HPHCardContent>
            <p className="mb-4 text-muted-foreground">Click below to test the modal component.</p>
            <HPHButton onClick={() => setModalOpen(true)}>Open Modal</HPHButton>
          </HPHCardContent>
        </HPHCard>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HPHDistributionChart title="Distribution" data={chartData} />
        <HPHBarChart title="Monthly Sales" data={barData} dataKey="vendas" />
      </section>

      {/* Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Table</h2>
        <HPHCard>
            <HPHTable headers={['ID', 'Name', 'Role', 'Status', 'Actions']}>
                <HPHTableRow>
                    <HPHTableCell>#001</HPHTableCell>
                    <HPHTableCell>Alice Admin</HPHTableCell>
                    <HPHTableCell><HPHBadge variant="primary">Admin</HPHBadge></HPHTableCell>
                    <HPHTableCell><HPHBadge variant="green">Active</HPHBadge></HPHTableCell>
                    <HPHTableCell>
                        <HPHButton size="sm" variant="ghost" icon={<Settings01Icon className="w-4 h-4"/>} />
                    </HPHTableCell>
                </HPHTableRow>
                <HPHTableRow>
                    <HPHTableCell>#002</HPHTableCell>
                    <HPHTableCell>Bob User</HPHTableCell>
                    <HPHTableCell><HPHBadge variant="gray">Viewer</HPHBadge></HPHTableCell>
                    <HPHTableCell><HPHBadge variant="orange">Pending</HPHBadge></HPHTableCell>
                    <HPHTableCell>
                        <HPHButton size="sm" variant="ghost" icon={<Settings01Icon className="w-4 h-4"/>} />
                    </HPHTableCell>
                </HPHTableRow>
            </HPHTable>
        </HPHCard>
      </section>

      <HPHModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Test Modal"
        description="This is a test modal description."
        icon={<Analytics01Icon className="w-6 h-6"/>}
        footer={
            <>
                <HPHButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</HPHButton>
                <HPHButton onClick={() => setModalOpen(false)}>Confirm</HPHButton>
            </>
        }
      >
        <div className="space-y-4">
            <p>Modal content goes here. It adapts to the system theme.</p>
            <HPHInput label="Reason" placeholder="Type something..." />
        </div>
      </HPHModal>
    </div>
  );
};
