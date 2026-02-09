
import React, { useRef, useEffect } from 'react';
import { GraphAlgorithm, TraversalStep } from '../graphTypes';
import GraphInputControl from './GraphInputControl';

interface Props {
    algorithm: GraphAlgorithm;
    isProcessing: boolean;
    traversalStep: TraversalStep | null;
    explanation: string;
    onCommand: (text: string) => void;
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    voiceStatus: string;
}

const GraphInfoPanel: React.FC<Props> = ({
    algorithm,
    isProcessing,
    traversalStep,
    explanation,
    onCommand,
    isListening,
    onStartListening,
    onStopListening,
    voiceStatus
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [traversalStep, explanation]);

    return (
        <div className="h-full flex flex-col bg-white shadow-soft-lg border-r border-mint-200 w-full max-w-sm z-30 rounded-r-2xl">
            {/* 🌿 Header - Soft Mint Theme */}
            <div className="px-6 py-5 border-b border-mint-200 bg-mint-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-mint-400 flex items-center justify-center text-white shadow-soft">
                        <i className="fa-solid fa-diagram-project"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-deep-green tracking-tight">Graph Explorer</h3>
                        <span className="text-[10px] text-mint-600 font-bold uppercase tracking-widest">
                            {algorithm ? `${algorithm} Algorithm` : 'Interactive Mode'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Input Control */}
            <GraphInputControl
                isProcessing={isProcessing}
                onCommand={onCommand}
                isListening={isListening}
                onStartListening={onStartListening}
                onStopListening={onStopListening}
                voiceStatus={voiceStatus}
            />

            {/* Main Content Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* Data Structure Viz (Queue/Stack) */}
                {traversalStep && (
                    <section className="space-y-4 animate-fade-in">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <i className={`fa-solid ${algorithm === 'BFS' ? 'fa-layer-group' : algorithm === 'DIJKSTRA' ? 'fa-sort-amount-up' : 'fa-bars-staggered'} text-mint-500`}></i>
                            {algorithm === 'BFS' ? 'Queue' : algorithm === 'DIJKSTRA' ? 'Priority Queue' : 'Stack'} State
                        </h4>
                        <div className="bg-deep-green p-4 rounded-2xl overflow-x-auto">
                            <div className="flex gap-2">
                                {traversalStep.queue.length === 0 ? (
                                    <span className="text-xs text-mint-300/60 italic">Empty</span>
                                ) : (
                                    traversalStep.queue.map((item, idx) => (
                                        <div key={idx} className="min-w-[30px] h-8 rounded bg-mint-900/50 flex items-center justify-center text-xs font-bold text-white border border-mint-700/50">
                                            {item}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Step Description */}
                {traversalStep && (
                    <section className="space-y-4 animate-fade-in">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <i className="fa-solid fa-list-check text-soft-green"></i> Current Step
                        </h4>
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-200 shadow-soft">
                            <p className="text-xs text-green-800 font-bold leading-relaxed">
                                {traversalStep.description}
                            </p>
                        </div>
                    </section>
                )}

                {/* Algorithm Output */}
                {traversalStep && (traversalStep.traversalOrder || traversalStep.distances) && (
                    <section className="space-y-4 animate-fade-in">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <i className="fa-solid fa-chart-simple text-highlight"></i> Algorithm Output
                        </h4>

                        {/* Traversal Order */}
                        {traversalStep.traversalOrder && (
                            <div className="bg-gradient-to-r from-mint-50 to-sky-50 p-4 rounded-2xl border border-mint-200 shadow-soft">
                                <p className="text-[10px] font-bold text-mint-600 uppercase tracking-wider mb-2">
                                    Traversal Order
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {traversalStep.traversalOrder.map((nodeId, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1">
                                            <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-deep-green shadow-soft border border-mint-200">
                                                {nodeId}
                                            </span>
                                            {idx < traversalStep.traversalOrder!.length - 1 && (
                                                <i className="fa-solid fa-arrow-right text-[8px] text-mint-400"></i>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dijkstra Distances */}
                        {traversalStep.distances && (
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border border-amber-200 shadow-soft">
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-3">
                                    Shortest Distances from Source
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(traversalStep.distances).map(([nodeId, dist]) => (
                                        <div key={nodeId} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl shadow-soft border border-amber-200">
                                            <span className="text-xs font-bold text-slate-600">Node {nodeId}</span>
                                            <span className="text-xs font-black text-amber-600">
                                                {dist === Infinity ? '∞' : dist}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* AI Explanation / General Info */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-robot text-sky-active"></i> Logic & Insights
                    </h4>

                    {explanation ? (
                        <div className="bg-white p-5 rounded-3xl border border-mint-200 shadow-soft animate-fade-in">
                            <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {explanation}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-mint-50/50 p-8 rounded-3xl border border-dashed border-mint-300 text-center">
                            <i className="fa-solid fa-wave-square text-mint-200 text-2xl mb-3"></i>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                                Run an algorithm to see step-by-step logic
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Visited Nodes Footer */}
            {traversalStep && (
                <div className="p-4 bg-mint-50 border-t border-mint-200">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono overflow-x-auto whitespace-nowrap">
                        <span className="font-bold uppercase tracking-wider text-slate-400">Visited:</span>
                        [{traversalStep.visited.join(', ')}]
                    </div>
                </div>
            )}
        </div>
    );
};

export default GraphInfoPanel;
