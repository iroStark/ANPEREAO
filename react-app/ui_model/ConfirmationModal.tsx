import React from 'react';
import { HPHModal } from './HPHModal';
import { HPHButton } from './HPHButton';
import { AlertCircleIcon, Delete02Icon } from 'hugeicons-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    variant = "danger",
    isLoading = false
}) => {
    return (
        <HPHModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            maxWidth="max-w-md"
            icon={<AlertCircleIcon className={`w-5 h-5 ${variant === 'danger' ? 'text-red-500' : 'text-primary-500'}`} />}
            footer={
                <>
                    <HPHButton variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelLabel}
                    </HPHButton>
                    <HPHButton 
                        onClick={onConfirm} 
                        loading={isLoading}
                        className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600 border-red-600' : ''}
                        icon={variant === 'danger' ? <Delete02Icon className="w-4 h-4" /> : undefined}
                    >
                        {confirmLabel}
                    </HPHButton>
                </>
            }
        >
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {description}
                </p>
            </div>
        </HPHModal>
    );
};
