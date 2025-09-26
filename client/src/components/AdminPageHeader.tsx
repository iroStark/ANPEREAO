import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

const AdminPageHeader = ({ title, description, action, children }: AdminPageHeaderProps) => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;