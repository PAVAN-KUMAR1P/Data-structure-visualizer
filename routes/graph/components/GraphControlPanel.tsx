
import React from 'react';

interface Props {
    onCommand: (text: string) => void;
    isProcessing: boolean;
}

const GraphControlPanel: React.FC<Props> = ({ onCommand, isProcessing }) => {

    // 🌿 Soft Mint Learning Theme - Section Header
    const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
        <div className="flex items-center gap-2 mb-3 mt-1">
            <span className="w-6 h-6 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center text-xs border border-mint-200">
                <i className={`fa-solid ${icon}`}></i>
            </span>
            <h3 className="text-xs font-bold text-deep-green uppercase tracking-wide font-mono">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in px-1">

            {/* Playback Controls */}
            <div>
                <SectionHeader title="Playback" icon="fa-sliders" />
                <div className="bg-white p-2 rounded-2xl border border-mint-200 flex items-center justify-between shadow-soft">
                    <button onClick={() => onCommand("previous step")} disabled={isProcessing} className="p-3 rounded-xl bg-mint-50 text-slate-500 hover:text-mint-600 hover:border-mint-300 border border-mint-200 transition-all disabled:opacity-30">
                        <i className="fa-solid fa-backward-step"></i>
                    </button>
                    <button onClick={() => onCommand("play")} disabled={isProcessing} className="p-3 w-16 rounded-xl bg-mint-400 border border-mint-500 text-white hover:bg-mint-500 shadow-soft transition-all disabled:opacity-30 flex items-center justify-center">
                        <i className={`fa-solid ${isProcessing ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button onClick={() => onCommand("next step")} disabled={isProcessing} className="p-3 rounded-xl bg-mint-50 text-slate-500 hover:text-mint-600 hover:border-mint-300 border border-mint-200 transition-all disabled:opacity-30">
                        <i className="fa-solid fa-forward-step"></i>
                    </button>
                </div>
            </div>

            {/* Algorithms */}
            <div>
                <SectionHeader title="Algorithms" icon="fa-network-wired" />
                <div className="space-y-3">
                    {/* BFS */}
                    <div className="group relative">
                        <button onClick={() => onCommand("start BFS")} disabled={isProcessing} className="w-full p-4 rounded-xl bg-white border border-mint-200 hover:border-soft-green hover:shadow-soft-md transition-all text-left flex items-center justify-between group-hover:-translate-y-1 shadow-soft">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-soft-green border border-green-200 flex items-center justify-center font-bold text-xs">BFS</div>
                                <div>
                                    <div className="text-sm font-bold text-deep-green group-hover:text-soft-green transition-colors">Breadth First</div>
                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide font-mono">Level Order</div>
                                </div>
                            </div>
                            <i className="fa-solid fa-play text-slate-300 group-hover:text-soft-green transition-colors"></i>
                        </button>
                    </div>

                    {/* DFS */}
                    <div className="group relative">
                        <button onClick={() => onCommand("start DFS")} disabled={isProcessing} className="w-full p-4 rounded-xl bg-white border border-mint-200 hover:border-sky-active hover:shadow-soft-md transition-all text-left flex items-center justify-between group-hover:-translate-y-1 shadow-soft">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-active border border-sky-200 flex items-center justify-center font-bold text-xs">DFS</div>
                                <div>
                                    <div className="text-sm font-bold text-deep-green group-hover:text-sky-active transition-colors">Depth First</div>
                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide font-mono">Recursive</div>
                                </div>
                            </div>
                            <i className="fa-solid fa-play text-slate-300 group-hover:text-sky-active transition-colors"></i>
                        </button>
                    </div>

                    {/* Dijkstra */}
                    <div className="group relative">
                        <button onClick={() => onCommand("start Dijkstra")} disabled={isProcessing} className="w-full p-4 rounded-xl bg-white border border-mint-200 hover:border-warm-yellow hover:shadow-soft-md transition-all text-left flex items-center justify-between group-hover:-translate-y-1 shadow-soft">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-50 text-warm-yellow border border-amber-200 flex items-center justify-center font-bold"><i className="fa-solid fa-route text-xs"></i></div>
                                <div>
                                    <div className="text-sm font-bold text-deep-green group-hover:text-amber-600 transition-colors">Dijkstra</div>
                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide font-mono">Shortest Path</div>
                                </div>
                            </div>
                            <i className="fa-solid fa-play text-slate-300 group-hover:text-warm-yellow transition-colors"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit */}
            <div>
                <SectionHeader title="Edit Graph" icon="fa-pen" />
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onCommand("add_node 100")} className="p-2 rounded-xl bg-white border border-mint-200 text-xs font-bold text-slate-600 hover:text-mint-600 hover:border-mint-400 hover:bg-mint-50 transition-colors shadow-soft">
                        + Add Node
                    </button>
                    <button onClick={() => onCommand("reset")} className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:text-soft-red hover:border-red-300 hover:bg-red-50 transition-colors shadow-soft">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphControlPanel;
