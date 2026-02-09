
import React, { useState } from 'react';
import { TreeType, TreeOperation } from '../treeTypes';

interface Props {
    onOperation: (op: TreeOperation, value?: number) => void;
    isProcessing: boolean;
    treeType: TreeType;
    onTreeTypeChange: (type: TreeType) => void;
    customUI?: boolean;
}

const TreeControlPanel: React.FC<Props> = ({ onOperation, isProcessing, treeType }) => {
    const [val, setVal] = useState<string>('');

    const handleOp = (op: TreeOperation) => {
        const numVal = parseInt(val);
        const noValueOps: TreeOperation[] = ['INORDER', 'PREORDER', 'POSTORDER', 'LEVEL_ORDER', 'FIND_MIN', 'FIND_MAX', 'GET_HEIGHT', 'CLEAR', 'EXTRACT_ROOT', 'HEAPIFY'];
        if (!noValueOps.includes(op) && (isNaN(numVal) || val.trim() === '')) return;
        onOperation(op, noValueOps.includes(op) ? undefined : numVal);
        if (op === 'INSERT') setVal('');
    };

    const isHeap = treeType === 'MAX_HEAP' || treeType === 'MIN_HEAP';

    // 🌿 Soft Mint Learning Theme - Section Header
    const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
        <div className="flex items-center gap-2 mb-3 mt-1">
            <span className="w-6 h-6 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center text-xs border border-mint-200">
                <i className={`fa-solid ${icon}`}></i>
            </span>
            <h3 className="text-xs font-bold text-deep-green uppercase tracking-wide font-mono">{title}</h3>
        </div>
    );

    // 🌿 Soft Mint Button Styles
    const btnBase = "rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 border uppercase tracking-wider";
    const primaryBtn = "bg-mint-100 border-mint-300 text-mint-700 hover:bg-mint-200 hover:border-mint-400 shadow-soft";
    const secondaryBtn = "bg-white border-slate-200 text-slate-600 hover:bg-mint-50 hover:text-mint-700 hover:border-mint-300 shadow-soft";
    const dangerBtn = "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-soft";
    const accentBtn = "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 shadow-soft";

    return (
        <div className="space-y-8 animate-fade-in px-1">

            {/* BUILD */}
            <div>
                <SectionHeader title="Construct" icon="fa-hammer" />
                <div className="bg-white p-3 rounded-2xl border border-mint-200 space-y-3 shadow-soft">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleOp('INSERT')}
                            placeholder="Value..."
                            className="flex-1 min-w-0 px-3 py-2 bg-mint-50 border border-mint-200 rounded-xl text-sm text-deep-green placeholder-slate-400 focus:outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-200 font-mono"
                        />
                        <button
                            onClick={() => handleOp('INSERT')}
                            disabled={isProcessing || !val.trim()}
                            className="w-10 h-10 rounded-xl bg-mint-400 text-white flex items-center justify-center hover:bg-mint-500 shadow-soft transition-all disabled:opacity-30 disabled:shadow-none"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {isHeap ? (
                            <button onClick={() => handleOp('EXTRACT_ROOT')} disabled={isProcessing} className={`${btnBase} ${dangerBtn} px-3 py-2.5`}>
                                <i className="fa-solid fa-arrow-up-from-bracket"></i> Extract
                            </button>
                        ) : (
                            <button onClick={() => handleOp('DELETE')} disabled={isProcessing || !val.trim()} className={`${btnBase} ${dangerBtn} px-3 py-2.5`}>
                                <i className="fa-solid fa-trash"></i> Delete
                            </button>
                        )}
                        <button onClick={() => handleOp('CLEAR')} disabled={isProcessing} className={`${btnBase} ${secondaryBtn} px-3 py-2.5`}>
                            <i className="fa-solid fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* EXPLORE */}
            <div>
                <SectionHeader title="Traverse" icon="fa-compass" />
                <div className="space-y-2">
                    <button onClick={() => handleOp('SEARCH')} disabled={isProcessing || !val.trim() || isHeap} className={`w-full py-2.5 ${btnBase} ${isHeap ? 'opacity-30' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 shadow-soft'}`}>
                        <i className="fa-solid fa-magnifying-glass"></i> Search Strategy
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        {['INORDER', 'PREORDER', 'POSTORDER', 'LEVEL_ORDER'].map(op => (
                            <button key={op} onClick={() => handleOp(op as TreeOperation)} disabled={isProcessing} className={`${btnBase} ${primaryBtn} py-2`}>
                                {op.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ANALYZE */}
            <div>
                <SectionHeader title="Analyze" icon="fa-chart-simple" />
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleOp('FIND_MIN')} disabled={isProcessing} className={`${btnBase} ${accentBtn} py-2.5`}>
                        <i className="fa-solid fa-down-long"></i> Min Val
                    </button>
                    <button onClick={() => handleOp('FIND_MAX')} disabled={isProcessing} className={`${btnBase} ${accentBtn} py-2.5`}>
                        <i className="fa-solid fa-up-long"></i> Max Val
                    </button>
                    <button onClick={() => handleOp('GET_HEIGHT')} disabled={isProcessing} className={`${btnBase} ${accentBtn} col-span-2 py-2.5`}>
                        <i className="fa-solid fa-ruler-vertical"></i> Calculate Height
                    </button>
                    {isHeap && (
                        <button onClick={() => handleOp('HEAPIFY')} disabled={isProcessing} className={`${btnBase} ${primaryBtn} col-span-2 py-2.5`}>
                            <i className="fa-solid fa-rotate"></i> Re-Heapify
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TreeControlPanel;
