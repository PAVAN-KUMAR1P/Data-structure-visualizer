
export interface GraphNode {
    id: string;
    value: string | number;
    x: number;
    y: number;
    status: 'idle' | 'visited' | 'processing' | 'queued' | 'start';
}

export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
    status: 'idle' | 'traversed' | 'processing';
}

export type GraphAlgorithm = 'BFS' | 'DFS' | 'DIJKSTRA' | null;

export interface TraversalStep {
    visited: string[];
    queue: string[]; // Used for Queue (BFS) or Stack (DFS) for visualization
    current: string | null;
    processingEdges: { source: string; target: string }[];
    description: string;
    // Algorithm output data
    distances?: { [nodeId: string]: number }; // For Dijkstra shortest paths
    traversalOrder?: string[]; // For BFS/DFS final order
}

export interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isDirected: boolean;
    isWeighted: boolean;
}
