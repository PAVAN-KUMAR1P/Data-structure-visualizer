
import React from 'react';

interface Props {
  nodesCount: number;
  onUndo: () => void;
  canUndo: boolean;
}

const Header: React.FC<Props> = ({ nodesCount, onUndo, canUndo }) => {
  return (
    <header className="px-8 py-4 flex justify-between items-center z-20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="relative bg-mint-400 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-soft transform hover:rotate-12 transition-transform cursor-pointer">
            <i className="fa-solid fa-link text-2xl"></i>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-deep-green tracking-tight leading-none">LinkedVision<span className="text-mint-500">.</span></h1>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mt-1">Interactive Data Structures</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-mint-200 shadow-soft">
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${nodesCount > 0 ? 'bg-soft-green animate-pulse' : 'bg-slate-300'}`}></div>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Nodes:</span>
          <span className="text-sm font-black text-deep-green code-font">{nodesCount.toString().padStart(2, '0')}</span>
        </div>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 bg-white/70 hover:bg-white border border-mint-200 shadow-soft disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 hover:text-mint-600"
        >
          <i className="fa-solid fa-rotate-left group-hover:-rotate-45 transition-transform"></i>
          Undo
        </button>
      </div>
    </header>
  );
};

export default Header;
