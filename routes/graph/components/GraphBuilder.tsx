
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreateGraph: (nodeCount: number, edges: { source: number; target: number }[]) => void;
    currentNodeCount: number;
}

const GraphBuilder: React.FC<Props> = ({ isOpen, onClose, onCreateGraph, currentNodeCount }) => {
    const [nodeCount, setNodeCount] = useState(6);
    const [edgeInput, setEdgeInput] = useState('');
    const [edges, setEdges] = useState<{ source: number; target: number }[]>([]);
    const [error, setError] = useState('');

    const addEdge = () => {
        setError('');
        // Parse edge input like "1-2" or "1,2" or "1 2"
        const match = edgeInput.match(/(\d+)\s*[-,\s]\s*(\d+)/);
        if (!match) {
            setError('Invalid format. Use: 1-2 or 1,2');
            return;
        }

        const source = parseInt(match[1]);
        const target = parseInt(match[2]);

        if (source < 1 || source > nodeCount || target < 1 || target > nodeCount) {
            setError(`Node must be between 1 and ${nodeCount}`);
            return;
        }

        if (source === target) {
            setError('Self-loops not allowed');
            return;
        }

        // Check if edge already exists
        if (edges.some(e => (e.source === source && e.target === target) || (e.source === target && e.target === source))) {
            setError('Edge already exists');
            return;
        }

        setEdges(prev => [...prev, { source, target }]);
        setEdgeInput('');
    };

    const removeEdge = (index: number) => {
        setEdges(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreate = () => {
        onCreateGraph(nodeCount, edges);
        onClose();
    };

    const handleNodeCountChange = (val: number) => {
        setNodeCount(val);
        // Remove edges that reference nodes beyond new count
        setEdges(prev => prev.filter(e => e.source <= val && e.target <= val));
    };

    const createEmptyGraph = () => {
        setEdges([]);
        onCreateGraph(nodeCount, []);
        onClose();
    };

    const createCompleteGraph = () => {
        const newEdges: { source: number; target: number }[] = [];
        for (let i = 1; i <= nodeCount; i++) {
            for (let j = i + 1; j <= nodeCount; j++) {
                newEdges.push({ source: i, target: j });
            }
        }
        setEdges(newEdges);
    };

    const createCycleGraph = () => {
        const newEdges: { source: number; target: number }[] = [];
        for (let i = 1; i <= nodeCount; i++) {
            newEdges.push({ source: i, target: i === nodeCount ? 1 : i + 1 });
        }
        setEdges(newEdges);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-deep-green/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-soft-lg border border-mint-200 max-w-lg w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
                {/* Soft Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-mint-300 to-mint-400 rounded-full blur-3xl opacity-15"></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-mint-400 flex items-center justify-center text-white shadow-soft">
                            <i className="fa-solid fa-diagram-project"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-deep-green">Graph Builder</h3>
                            <p className="text-[10px] text-mint-600 uppercase tracking-widest font-bold">Create custom graph</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-deep-green hover:bg-mint-50 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Node Count */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Number of Nodes
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="2"
                            max="12"
                            value={nodeCount}
                            onChange={(e) => handleNodeCountChange(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-mint-100 rounded-lg appearance-none cursor-pointer accent-mint-500"
                        />
                        <span className="w-10 h-10 bg-mint-100 text-deep-green rounded-xl flex items-center justify-center font-black text-lg border border-mint-200">
                            {nodeCount}
                        </span>
                    </div>
                </div>

                {/* Quick Templates */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Quick Templates
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={createEmptyGraph}
                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                            <i className="fa-solid fa-circle-dot mr-1"></i> Empty
                        </button>
                        <button
                            onClick={createCycleGraph}
                            className="px-3 py-2 bg-mint-50 text-mint-700 rounded-xl text-xs font-bold hover:bg-mint-100 transition-colors border border-mint-200"
                        >
                            <i className="fa-solid fa-circle-notch mr-1"></i> Cycle
                        </button>
                        <button
                            onClick={createCompleteGraph}
                            className="px-3 py-2 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-100 transition-colors border border-sky-200"
                        >
                            <i className="fa-solid fa-share-nodes mr-1"></i> Complete
                        </button>
                    </div>
                </div>

                {/* Add Edge */}
                <div className="mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Add Edge (e.g., 1-2)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={edgeInput}
                            onChange={(e) => setEdgeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addEdge()}
                            placeholder="1-2"
                            className="flex-1 px-4 py-2.5 bg-white border border-mint-200 rounded-xl text-sm text-deep-green focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-400"
                        />
                        <button
                            onClick={addEdge}
                            className="px-4 py-2.5 bg-mint-400 text-white rounded-xl text-sm font-bold hover:bg-mint-500 transition-colors shadow-soft"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    {error && (
                        <p className="text-xs text-soft-red mt-1.5 font-medium">{error}</p>
                    )}
                </div>

                {/* Edge List */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Edges ({edges.length})
                    </label>
                    {edges.length === 0 ? (
                        <div className="bg-mint-50 border border-dashed border-mint-300 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 font-medium">No edges added yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-mint-50 rounded-xl border border-mint-200">
                            {edges.map((edge, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-deep-green border border-mint-200 shadow-soft group"
                                >
                                    {edge.source} ↔ {edge.target}
                                    <button
                                        onClick={() => removeEdge(idx)}
                                        className="ml-1 text-slate-400 hover:text-soft-red transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <i className="fa-solid fa-xmark text-[10px]"></i>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white bg-mint-400 hover:bg-mint-500 shadow-soft-lg transition-all"
                    >
                        <i className="fa-solid fa-check mr-2"></i>
                        Create Graph
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphBuilder;
