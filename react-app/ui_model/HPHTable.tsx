import React from 'react';

interface HPHTableProps {
  headers: string[];
  children: React.ReactNode;
}

export const HPHTable: React.FC<HPHTableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 dark:bg-[#0B0B15]/50 text-xs text-gray-500 dark:text-gray-400 font-extrabold border-b border-gray-100 dark:border-[#252540] uppercase tracking-wider">
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
      className={`group hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </tr>
  );
};

export const HPHTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <td className={`px-6 py-5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </td>
  );
};
