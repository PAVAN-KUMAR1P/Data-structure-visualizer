
import { GraphNode, GraphEdge, TraversalStep, GraphAlgorithm } from '../graphTypes';
import TraversalDataViewer from './TraversalDataViewer';
import { NODE_STYLES, EDGE_STYLES, TEXT_PRIMARY, ACCENT, ACTIVE, VISITED, HIGHLIGHT } from '../../../services/theme';

interface Props {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isProcessing: boolean;
    traversalStep: TraversalStep | null;
    algorithm: GraphAlgorithm;
}

const GraphVisualizer: React.FC<Props> = ({ nodes, edges, isProcessing, traversalStep, algorithm }) => {

    // 🌿 Soft Mint Learning Theme - Node Styles
    const getNodeStyles = (node: GraphNode) => {
        if (traversalStep) {
            if (traversalStep.current === node.id) return { ...NODE_STYLES.active, filter: 'url(#softShadowActive)' }; // Current
            if (traversalStep.visited.includes(node.id)) return { ...NODE_STYLES.visited, filter: 'url(#softShadow)' }; // Visited
            if (traversalStep.queue.includes(node.id)) return { ...NODE_STYLES.queued, filter: 'url(#softShadow)' }; // Queue
        }
        return { ...NODE_STYLES.default, filter: 'url(#softShadow)' }; // Default
    };

    const getEdgeColor = (edge: GraphEdge) => {
        if (traversalStep && traversalStep.processingEdges.some(e =>
            (e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source)
        )) return ACTIVE; // Active edge
        return EDGE_STYLES.default.stroke; // Default muted
    };

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-8 bg-white rounded-2xl">
            <svg className="w-full h-full max-w-4xl max-h-[600px] z-10" viewBox="0 0 800 600">
                <defs>
                    {/* 🌿 Soft shadows instead of neon glows */}
                    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#94A3B8" floodOpacity="0.2" />
                    </filter>
                    <filter id="softShadowActive" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor={ACTIVE} floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Edges */}
                <g>
                    {edges.map((edge, index) => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;
                        const isActive = getEdgeColor(edge) === ACTIVE;
                        return (
                            <line
                                key={`${edge.source}-${edge.target}-${index}`}
                                x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                                stroke={getEdgeColor(edge)}
                                strokeWidth={isActive ? "4" : "2"}
                                className="transition-all duration-300"
                                strokeOpacity={isActive ? 1 : 0.6}
                            />
                        );
                    })}
                </g>

                {/* Nodes */}
                <g>
                    {nodes.map((node) => {
                        const style = getNodeStyles(node);
                        const isCurrent = node.id === traversalStep?.current;
                        return (
                            <g key={node.id} className={`transition-all duration-500 ${isCurrent ? 'animate-pulse-active' : ''}`}>
                                {/* Soft ring for current node */}
                                {isCurrent && <circle cx={node.x} cy={node.y} r="31" fill="none" stroke={style.stroke} strokeWidth="2" opacity="0.4" />}
                                {/* Main node */}
                                <circle cx={node.x} cy={node.y} r="25" fill={style.fill} stroke={style.stroke} strokeWidth="3" filter={style.filter} className="transition-all duration-300" />
                                {/* Node value */}
                                <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-sm font-black pointer-events-none select-none code-font" fill={style.text}>{node.value}</text>
                                {/* Node ID label */}
                                <text x={node.x} y={node.y + 40} textAnchor="middle" className="text-[10px] font-mono font-bold tracking-wider" fill={TEXT_PRIMARY} opacity="0.6">NODE {node.id}</text>
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Live Data Structure Viewer */}
            {traversalStep && algorithm && (
                <TraversalDataViewer
                    data={traversalStep.queue}
                    label={algorithm === 'BFS' ? 'Queue' : algorithm === 'DFS' ? 'Stack' : 'Priority Queue'}
                />
            )}

            {/* 🌿 Legend Overlay (Light Theme) */}
            <div className="absolute bottom-6 left-6 p-4 bg-white backdrop-blur-sm rounded-2xl shadow-soft-md border border-mint-200 text-xs space-y-2 font-mono">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: NODE_STYLES.active.fill, borderColor: NODE_STYLES.active.stroke }}></div> <span className="text-deep-green font-semibold">CURRENT_NODE</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: NODE_STYLES.visited.fill, borderColor: NODE_STYLES.visited.stroke }}></div> <span className="text-deep-green font-semibold">VISITED</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: NODE_STYLES.queued.fill, borderColor: NODE_STYLES.queued.stroke }}></div> <span className="text-deep-green font-semibold">IN_QUEUE</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: NODE_STYLES.default.fill, borderColor: NODE_STYLES.default.stroke }}></div> <span className="text-deep-green font-semibold">UNVISITED</span></div>
            </div>
        </div>
    );
};

export default GraphVisualizer;
