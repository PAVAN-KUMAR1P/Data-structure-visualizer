
import React from 'react';
import { DATA_STRUCTURE_CONTAINER, TEXT_PRIMARY, ACCENT, ACTIVE } from '../../../services/theme';

interface Props {
    data: string[];
    label: string; // "Queue", "Stack", "Priority Queue"
    className?: string;
}

const TraversalDataViewer: React.FC<Props> = ({ data, label, className }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className={`absolute top-4 left-4 z-20 min-w-[200px] max-w-[300px] animate-fade-in ${className}`}>
            {/* 🌿 Soft Mint Learning Theme - Queue/Stack Container */}
            <div 
                className="backdrop-blur-sm rounded-xl overflow-hidden shadow-soft-md flex flex-col"
                style={{ 
                    backgroundColor: DATA_STRUCTURE_CONTAINER.background, 
                    border: `2px solid ${DATA_STRUCTURE_CONTAINER.border}` 
                }}
            >
                {/* Header */}
                <div className="px-4 py-2 bg-white/50 border-b border-mint-200 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-widest font-mono" style={{ color: TEXT_PRIMARY }}>
                        <i className={`fa-solid ${label.includes('Stack') ? 'fa-layer-group' : 'fa-list-ol'} mr-2`} style={{ color: ACCENT }}></i>
                        {label}
                    </span>
                    <span className="text-[9px] font-bold text-mint-600">{data.length} ITEMS</span>
                </div>

                {/* List */}
                <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {data.map((item, i) => (
                        <div 
                            key={i} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono animate-fade-in-up transition-all duration-300"
                            style={{ 
                                backgroundColor: i === 0 ? `${ACTIVE}15` : 'white',
                                border: i === 0 ? `2px solid ${ACTIVE}` : '1px solid #E2E8F0'
                            }}
                        >
                            <span className="text-mint-500 text-[9px] w-4 text-right font-bold">{i}.</span>
                            <span className="font-bold" style={{ color: i === 0 ? ACTIVE : TEXT_PRIMARY }}>{item}</span>
                            {i === 0 && <span className="ml-auto text-[8px] font-black uppercase" style={{ color: ACTIVE }}>NEXT</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TraversalDataViewer;
