import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Cancel01Icon } from 'hugeicons-react';

interface HPHModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    zIndex?: number;
    icon?: React.ReactNode;
    description?: string;
}

export const HPHModal: React.FC<HPHModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    maxWidth = 'max-w-2xl',
    zIndex = 50,
    icon,
    description
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div 
            className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200`}
            style={{ zIndex }}
        >
            <div 
                className={`bg-white dark:bg-[#10101E] rounded-2xl border border-gray-200 dark:border-[#252540] w-full ${maxWidth} shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-[#252540] flex justify-between items-start bg-white dark:bg-[#10101E] sticky top-0 z-10">
                    <div className="flex items-start gap-3">
                        {icon && (
                            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-600 dark:text-primary-400 mt-0.5">
                                {icon}
                            </div>
                        )}
                        <div>
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
                             {description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{description}</p>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#252540] text-gray-500 transition-colors"
                    >
                        <Cancel01Icon className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto bg-gray-50 dark:bg-[#0B0B15] flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-gray-200 dark:border-[#252540] flex justify-end gap-3 bg-white dark:bg-[#10101E] sticky bottom-0 z-10">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
