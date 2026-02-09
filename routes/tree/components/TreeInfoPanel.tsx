import React, { useRef, useEffect } from 'react';
import { FlatTreeNode, TreeType, TreeStats } from '../treeTypes';
import { getTreeComplexityInfo } from '../../../services/treeGemini';
import TreeInputControl from './TreeInputControl';

interface Props {
    nodes: FlatTreeNode[];
    explanation: string;
    treeType: TreeType;
    isProcessing: boolean;
    stats: TreeStats;
    lastOperation: string | null;
    onCommand: (text: string) => void;
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    voiceStatus: string;
}

const TreeInfoPanel: React.FC<Props> = ({
    nodes,
    explanation,
    treeType,
    isProcessing,
    stats,
    lastOperation,
    onCommand,
    isListening,
    onStartListening,
    onStopListening,
    voiceStatus
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [explanation]);

    const complexityInfo = lastOperation ? getTreeComplexityInfo(lastOperation as any, treeType) : null;

    const getTreeTypeDescription = () => {
        switch (treeType) {
            case 'BST':
                return 'Binary Search Tree maintains the property that left subtree values < root < right subtree values.';
            case 'AVL':
                return 'AVL Tree is a self-balancing BST where the height difference between subtrees is at most 1.';
            case 'MAX_HEAP':
                return 'Max Heap is a complete binary tree where each parent node is greater than or equal to its children.';
            case 'MIN_HEAP':
                return 'Min Heap is a complete binary tree where each parent node is less than or equal to its children.';
        }
    };

    return (
        <div className="h-full flex flex-col bg-white shadow-soft-lg border-r border-mint-200 w-full max-w-sm z-30 rounded-r-2xl">
            {/* 🌿 Header - Soft Mint Theme */}
            <div className="px-6 py-5 border-b border-mint-200 bg-mint-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-mint-400 flex items-center justify-center text-white shadow-soft">
                        <i className="fa-solid fa-sitemap"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-deep-green tracking-tight">Tree Analysis</h3>
                        <span className="text-[10px] text-mint-600 font-bold uppercase tracking-widest">{treeType.replace('_', ' ')} Structure</span>
                    </div>
                </div>
            </div>

            {/* Voice & Command Input Section */}
            <TreeInputControl
                onCommand={onCommand}
                isProcessing={isProcessing}
                isListening={isListening}
                onStartListening={onStartListening}
                onStopListening={onStopListening}
                voiceStatus={voiceStatus}
            />

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Tree Stats */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-chart-simple text-mint-500"></i> Tree Properties
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-mint-50 p-3 rounded-2xl border border-mint-200 shadow-soft">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Nodes</p>
                            <p className="text-xl font-black text-deep-green code-font">{stats.nodeCount}</p>
                        </div>
                        <div className="bg-mint-50 p-3 rounded-2xl border border-mint-200 shadow-soft">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Height</p>
                            <p className="text-xl font-black text-deep-green code-font">{stats.height}</p>
                        </div>
                        <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 shadow-soft">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Min Value</p>
                            <p className="text-xl font-black text-sky-600 code-font">{stats.minValue ?? '-'}</p>
                        </div>
                        <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 shadow-soft">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Max Value</p>
                            <p className="text-xl font-black text-sky-600 code-font">{stats.maxValue ?? '-'}</p>
                        </div>
                    </div>
                    {treeType !== 'MAX_HEAP' && treeType !== 'MIN_HEAP' && (
                        <div className={`p-3 rounded-2xl border shadow-soft ${stats.isBalanced ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center gap-2">
                                <i className={`fa-solid ${stats.isBalanced ? 'fa-check-circle text-soft-green' : 'fa-exclamation-triangle text-highlight'}`}></i>
                                <span className={`text-xs font-bold ${stats.isBalanced ? 'text-green-700' : 'text-amber-700'}`}>
                                    {stats.isBalanced ? 'Tree is Balanced' : 'Tree is Unbalanced'}
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Complexity Info */}
                {complexityInfo && (
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <i className="fa-solid fa-clock text-mint-500"></i> Complexity Analysis
                        </h4>
                        <div className="bg-deep-green p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-mint-200 uppercase">Time</span>
                                <span className="text-sm font-black text-mint-400 code-font">{complexityInfo.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-mint-200 uppercase">Space</span>
                                <span className="text-sm font-black text-sky-400 code-font">{complexityInfo.space}</span>
                            </div>
                            <p className="text-[10px] text-mint-100/70 font-medium pt-2 border-t border-mint-700/30">
                                {complexityInfo.description}
                            </p>
                        </div>
                    </section>
                )}

                {/* AI Explanation */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-wand-magic-sparkles text-mint-500"></i> Step-by-Step Logic
                    </h4>

                    {isProcessing && !explanation ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-40">
                            <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyzing Tree...</p>
                        </div>
                    ) : explanation ? (
                        <div className="bg-white p-5 rounded-3xl border border-mint-200 shadow-soft animate-fade-in">
                            <div className="text-xs text-slate-600 leading-relaxed space-y-3 font-medium">
                                {explanation.split('\n').filter(l => l.trim()).map((line, i) => (
                                    <p key={i} className="relative pl-4">
                                        <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-mint-400 rounded-full"></span>
                                        {line.replace(/^\*|\-|\d\./, '').trim()}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-mint-50/50 p-10 rounded-3xl border border-dashed border-mint-300 text-center">
                            <i className="fa-solid fa-terminal text-mint-200 text-3xl mb-4"></i>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                                Perform an operation to see logical breakdown
                            </p>
                        </div>
                    )}
                </section>

                {/* Tree Type Info */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-circle-info text-mint-500"></i> About {treeType.replace('_', ' ')}
                    </h4>
                    <div className="bg-mint-50 p-4 rounded-2xl border border-mint-200 shadow-soft">
                        <p className="text-xs text-deep-green font-medium leading-relaxed">
                            {getTreeTypeDescription()}
                        </p>
                    </div>
                </section>
            </div>

            <div className="p-6 bg-mint-50/40 border-t border-mint-200">
                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-2xl border border-sky-200">
                    <i className="fa-solid fa-lightbulb text-sky-active"></i>
                    <p className="text-[10px] font-bold text-sky-700 leading-snug">
                        {treeType === 'AVL'
                            ? 'Tip: Watch how the tree auto-balances with rotations after insertions!'
                            : treeType.includes('HEAP')
                                ? 'Tip: Extract Root operation always removes the heap top efficiently!'
                                : 'Tip: Try inserting sorted values to see how BST becomes unbalanced!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TreeInfoPanel;
