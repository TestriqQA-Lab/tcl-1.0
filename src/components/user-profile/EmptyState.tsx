import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionText: string;
    onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionText,
    onAction
}) => (
    <div className="flex flex-col items-center justify-center py-8 text-center transition-all animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-[#f0f9f9] rounded-full flex items-center justify-center mb-4 text-[#117a7a]">
            {icon}
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-6 max-w-xs">{description}</p>
        <button
            onClick={onAction}
            className="bg-[#117a7a] text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-[#0e6666] transition-colors shadow-sm flex items-center gap-2"
        >
            <Plus size={16} />
            {actionText}
        </button>
    </div>
);

export default EmptyState;
