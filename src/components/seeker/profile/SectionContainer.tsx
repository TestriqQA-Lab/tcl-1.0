import React from 'react';
import { Pencil, Plus } from 'lucide-react';

interface SectionContainerProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    onEdit?: () => void;
    onAdd?: () => void;
    children: React.ReactNode;
    className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
    id,
    title,
    icon,
    onEdit,
    onAdd,
    children,
    className = '',
}) => {
    return (
        <div id={id} className={`bg-white rounded-2xl p-6 shadow-sm scroll-mt-28 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-emerald-700">{icon}</div>}
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>

                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="text-emerald-700 hover:text-emerald-800 text-sm font-medium px-3 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center min-w-[32px] md:min-w-fit"
                        >
                            <span className="hidden md:inline">Edit</span>
                            <Pencil size={16} className="md:hidden" />
                        </button>
                    )}
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-sm font-medium px-2 md:px-3 py-1 bg-emerald-50 rounded-full md:rounded-lg hover:bg-emerald-100 transition-colors justify-center min-w-[32px] md:min-w-fit"
                        >
                            <Plus size={18} />
                            <span className="hidden md:inline">Add {title}</span>
                        </button>
                    )}
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default SectionContainer;
