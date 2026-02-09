
import React, { useState } from 'react';
import { TreeType, TreeOperation } from '../treeTypes';
import { getTreeSnippet } from '../../../services/treeCodeSnippets';

interface Props {
    operation: TreeOperation | null;
    treeType: TreeType;
}

const TreeCodeDisplay: React.FC<Props> = ({ operation, treeType }) => {
    const [lang, setLang] = useState<'cpp' | 'python' | 'c'>('cpp');

    if (!operation) {
        return (
            <div className="bg-white rounded-xl p-6 h-full flex items-center justify-center border border-mint-200 shadow-soft">
                <p className="text-slate-400 text-sm font-mono">_awaiting_operation...</p>
            </div>
        );
    }

    const code = getTreeSnippet(treeType, operation, lang);

    return (
        <div className="bg-white rounded-xl flex flex-col h-full border border-mint-200 overflow-hidden shadow-soft-lg">
            <div className="flex items-center justify-between px-4 py-3 bg-mint-50 border-b border-mint-200">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-soft-red/60"></div>
                        <div className="w-2 h-2 rounded-full bg-highlight/60"></div>
                        <div className="w-2 h-2 rounded-full bg-soft-green/60"></div>
                    </div>
                    <span className="ml-2 text-[10px] font-bold text-mint-700 uppercase tracking-widest font-mono">
                        {treeType.replace('_', ' ')} :: {operation.replace('_', ' ')}
                    </span>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-mint-200 shadow-soft">
                    <button onClick={() => setLang('c')} className={`px-2 py-1 text-[9px] font-bold rounded-l-md transition-all ${lang === 'c' ? 'bg-mint-100 text-mint-700' : 'text-slate-400 hover:text-mint-600'}`}>C</button>
                    <button onClick={() => setLang('cpp')} className={`px-2 py-1 text-[9px] font-bold transition-all ${lang === 'cpp' ? 'bg-mint-100 text-mint-700' : 'text-slate-400 hover:text-mint-600'}`}>C++</button>
                    <button onClick={() => setLang('python')} className={`px-2 py-1 text-[9px] font-bold rounded-r-md transition-all ${lang === 'python' ? 'bg-mint-100 text-mint-700' : 'text-slate-400 hover:text-mint-600'}`}>PY</button>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-slate-900 rounded-b-xl">
                <pre className="code-font text-xs text-slate-200 leading-relaxed whitespace-pre font-mono">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default TreeCodeDisplay;
