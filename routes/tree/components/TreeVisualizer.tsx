
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TreeNode, FlatTreeNode, TreeType } from '../../../treeTypes';
import { flatToTree, calculateNodePositions, calculateHeapPositions } from '../../../services/treeOperations';
import { NODE_STYLES, EDGE_STYLES, TEXT_PRIMARY, ACCENT } from '../../../services/theme';

interface Props {
    nodes: FlatTreeNode[];
    treeType: TreeType;
    traversalPath: string[];
}

const NODE_RADIUS = 34;

const TreeVisualizer: React.FC<Props> = ({ nodes, treeType, traversalPath }) => {
    const isHeap = treeType === 'MAX_HEAP' || treeType === 'MIN_HEAP';

    // State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Layout
    const treeHeight = nodes.length > 0 ? Math.floor(Math.log2(nodes.length)) + 1 : 0;
    const contentWidth = Math.max(1200, Math.pow(2, treeHeight) * 80);
    const contentHeight = Math.max(400, treeHeight * 120 + 200);

    const positionedNodes = React.useMemo(() => {
        if (nodes.length === 0) return [];
        if (isHeap) return calculateHeapPositions([...nodes], contentWidth);
        const tree = flatToTree(nodes);
        if (tree) {
            calculateNodePositions(tree, contentWidth);
            const collectPositions = (node: TreeNode | null, result: Map<string, { x: number; y: number }>) => {
                if (!node) return;
                result.set(node.id, { x: node.x, y: node.y });
                collectPositions(node.left, result); collectPositions(node.right, result);
            };
            const posMap = new Map<string, { x: number; y: number }>();
            collectPositions(tree, posMap);
            return nodes.map(n => ({ ...n, x: posMap.get(n.id)?.x || 0, y: posMap.get(n.id)?.y || 0 }));
        }
        return nodes;
    }, [nodes, isHeap, contentWidth]);

    const nodeMap = React.useMemo(() => {
        const map = new Map<string, FlatTreeNode>();
        positionedNodes.forEach(n => map.set(n.id, n));
        return map;
    }, [positionedNodes]);

    const handleFitToScreen = useCallback(() => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        const scale = Math.min(width / contentWidth, height / contentHeight, 1) * 0.85;
        setScale(scale);
        setPosition({ x: (width - contentWidth * scale) / 2, y: (height - contentHeight * scale) / 2 });
    }, [contentWidth, contentHeight]);

    useEffect(() => { if (nodes.length > 0) handleFitToScreen(); }, [nodes.length, handleFitToScreen]);

    const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
    const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const handleMouseUp = () => setIsDragging(false);
    const handleWheel = (e: React.WheelEvent) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setScale(s => Math.min(Math.max(0.1, s * (e.deltaY > 0 ? 0.9 : 1.1)), 5)); } };

    // 🌿 Soft Mint Learning Theme - Node Styles
    const getStatusStyles = (status: FlatTreeNode['status']) => {
        switch (status) {
            case 'searching': return { ...NODE_STYLES.searching, filter: 'url(#softShadowActive)' };
            case 'found': return { ...NODE_STYLES.found, filter: 'url(#softShadowActive)' };
            case 'processing': return { ...NODE_STYLES.active, filter: 'url(#softShadowActive)' };
            case 'new': return { ...NODE_STYLES.new, filter: 'url(#softShadowActive)' };
            case 'visited': return { ...NODE_STYLES.visited, filter: 'url(#softShadow)' };
            default: return { ...NODE_STYLES.default, filter: 'url(#softShadow)' };
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-white rounded-2xl"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>

            {/* 🌿 Traversal Path (Light Theme) */}
            {traversalPath.length > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-white backdrop-blur-sm rounded-xl px-4 py-2 border border-mint-300 shadow-soft">
                    <span className="text-[9px] font-black text-mint-600 uppercase tracking-widest">PATH: </span>
                    <span className="text-xs font-bold text-deep-green code-font ml-2">{traversalPath.join(' → ')}</span>
                </div>
            )}

            <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }} className="w-full h-full origin-top-left">
                <svg width={contentWidth} height={contentHeight} className="drop-shadow-sm">
                    <defs>
                        {/* 🌿 Soft Mint Gradient for edges */}
                        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.7" />
                        </linearGradient>
                        {/* Soft shadows instead of neon glows */}
                        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#94A3B8" floodOpacity="0.2" />
                        </filter>
                        <filter id="softShadowActive" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0EA5E9" floodOpacity="0.25" />
                        </filter>
                    </defs>

                    {/* Edges */}
                    {positionedNodes.map(node => {
                        const edges = [];
                        const drawEdge = (childId: string | null) => {
                            if (!childId) return null;
                            const child = nodeMap.get(childId);
                            if (!child) return null;
                            return (
                                <line key={`edge-${node.id}-${child.id}`} x1={node.x} y1={node.y + NODE_RADIUS} x2={child.x} y2={child.y - NODE_RADIUS}
                                    stroke="url(#edgeGradient)" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" opacity="0.8" />
                            );
                        };
                        if (node.leftId) edges.push(drawEdge(node.leftId));
                        if (node.rightId) edges.push(drawEdge(node.rightId));
                        return edges;
                    })}

                    {/* Nodes */}
                    {positionedNodes.map((node, index) => {
                        const styles = getStatusStyles(node.status);
                        const isRoot = !node.parentId;
                        const isActive = node.status !== 'idle';
                        return (
                            <g key={node.id} className={`transition-all duration-500 ${isActive ? 'animate-pulse-active' : ''}`}>
                                {/* Soft ring for active nodes */}
                                {isActive && <circle cx={node.x} cy={node.y} r={NODE_RADIUS + 6} fill="none" stroke={styles.stroke} strokeWidth="2" opacity="0.3" />}
                                {/* Main node circle */}
                                <circle cx={node.x} cy={node.y} r={NODE_RADIUS} fill={styles.fill} stroke={styles.stroke} strokeWidth={isActive ? "3" : "2"} filter={styles.filter} className="transition-all duration-300" />
                                {/* Node value */}
                                <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" className="text-lg font-black code-font" fill={styles.text} style={{ fontWeight: 800 }}>{node.value}</text>

                                {/* Status label */}
                                {styles.label && (
                                    <g transform={`translate(${node.x}, ${node.y - NODE_RADIUS - 18})`}>
                                        <rect x="-35" y="-10" width="70" height="20" rx="6" fill={styles.stroke} />
                                        <text textAnchor="middle" dy="4" className="text-[9px] font-black fill-white uppercase tracking-wider">{styles.label}</text>
                                    </g>
                                )}
                                {/* ROOT indicator */}
                                {isRoot && (
                                    <g transform={`translate(${node.x}, ${node.y - NODE_RADIUS - 35})`}>
                                        <text textAnchor="middle" className="text-[9px] font-black uppercase tracking-widest" fill={TEXT_PRIMARY}>ROOT</text>
                                    </g>
                                )}
                                {/* AVL height indicator */}
                                {treeType === 'AVL' && <text x={node.x + NODE_RADIUS + 8} y={node.y} className="text-[8px] font-bold" fill={ACCENT}>h={node.height}</text>}
                                {/* Heap index indicator */}
                                {isHeap && <text x={node.x} y={node.y + NODE_RADIUS + 16} textAnchor="middle" className="text-[8px] font-bold code-font" fill={TEXT_PRIMARY}>[{index}]</text>}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default TreeVisualizer;
