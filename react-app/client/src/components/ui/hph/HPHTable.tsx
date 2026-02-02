import React from 'react';
import { cn } from '@/lib/utils';

interface HPHTableProps {
  headers: string[];
  children: React.ReactNode;
}

export const HPHTable: React.FC<HPHTableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/50 text-xs text-muted-foreground font-extrabold border-b border-border uppercase tracking-wider">
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-extrabold text-muted-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface HPHTableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const HPHTableRow: React.FC<HPHTableRowProps> = ({ children, onClick }) => {
  return (
    <tr 
      onClick={onClick}
      className={cn(
        "group hover:bg-muted/50 transition-colors border-b border-border last:border-0",
        onClick && "cursor-pointer"
      )}
    >
      {children}
    </tr>
  );
};

export const HPHTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <td className={cn("px-6 py-5 whitespace-nowrap text-sm text-foreground", className)} {...props}>
      {children}
    </td>
  );
};
