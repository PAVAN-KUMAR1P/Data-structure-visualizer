
import { GraphNode, GraphEdge, TraversalStep } from '../routes/graph/graphTypes';

export const generateInitialGraph = (nodeCount: number = 6): { nodes: GraphNode[], edges: GraphEdge[] } => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
        nodes.push({
            id: (i + 1).toString(),
            value: i + 1,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            status: 'idle'
        });
    }

    // Create a simple connected graph (cycle + some random edges)
    for (let i = 0; i < nodeCount; i++) {
        edges.push({
            source: (i + 1).toString(),
            target: ((i + 1) % nodeCount + 1).toString(),
            status: 'idle'
        });
    }

    // Add a few cross edges
    if (nodeCount > 4) {
        edges.push({ source: '1', target: '4', status: 'idle' });
        edges.push({ source: '2', target: '5', status: 'idle' });
    }

    return { nodes, edges };
};

export const bfsTraversal = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNodeId: string
): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const adj = getAdjacencyList(nodes, edges);
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];

    visited.add(startNodeId);

    // Initial State
    steps.push({
        visited: [...visited],
        queue: [...queue],
        current: null,
        processingEdges: [],
        description: `Initialize BFS queue with start node ${startNodeId}`
    });

    while (queue.length > 0) {
        const current = queue.shift()!;

        // Processing Step
        steps.push({
            visited: [...visited],
            queue: [...queue],
            current: current,
            processingEdges: [],
            description: `Dequeued ${current}. Processing neighbors...`
        });

        const neighbors = adj.get(current) || [];
        const processingEdges = [];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                processingEdges.push({ source: current, target: neighbor });

                steps.push({
                    visited: [...visited],
                    queue: [...queue],
                    current: current,
                    processingEdges: [{ source: current, target: neighbor }],
                    description: `Visited neighbor ${neighbor} and added to queue`
                });
            }
        }
    }

    // Final Step
    steps.push({
        visited: [...visited],
        queue: [],
        current: null,
        processingEdges: [],
        description: "BFS Traversal Complete",
        traversalOrder: [...visited]
    });

    return steps;
};

export const dfsTraversal = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNodeId: string
): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const adj = getAdjacencyList(nodes, edges);
    const visited = new Set<string>();
    const stack: string[] = [startNodeId];

    // Initial State
    steps.push({
        visited: [],
        queue: [...stack], // Using 'queue' property to represent stack for visualization consistency
        current: null,
        processingEdges: [],
        description: `Initialize DFS stack with start node ${startNodeId}`
    });

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (!visited.has(current)) {
            visited.add(current);

            steps.push({
                visited: [...visited],
                queue: [...stack],
                current: current,
                processingEdges: [],
                description: `Popped ${current} from stack and marked as visited`
            });

            const neighbors = adj.get(current) || [];
            // Reverse neighbors to simulate standard stack push order if desired, or keep as is
            for (const neighbor of neighbors.reverse()) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                    steps.push({
                        visited: [...visited],
                        queue: [...stack],
                        current: current,
                        processingEdges: [{ source: current, target: neighbor }],
                        description: `Pushed neighbor ${neighbor} to stack`
                    });
                }
            }
        }
    }

    steps.push({
        visited: [...visited],
        queue: [],
        current: null,
        processingEdges: [],
        description: "DFS Traversal Complete",
        traversalOrder: [...visited]
    });

    return steps;
};

export const dijkstraTraversal = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNodeId: string
): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const adj = getAdjacencyList(nodes, edges);

    // Distances
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[startNodeId] = 0;

    const visited = new Set<string>();
    const pq: { id: string, dist: number }[] = [{ id: startNodeId, dist: 0 }];

    // Initial Step
    steps.push({
        visited: [],
        queue: pq.map(i => `${i.id}(${i.dist})`), // visualizing PQ contents by ID with Distance
        current: null,
        processingEdges: [],
        description: `Initialize Dijkstra. Start node ${startNodeId} distance = 0, others = Infinity.`
    });

    while (pq.length > 0) {
        // Sort by distance (simple priority queue simulation)
        pq.sort((a, b) => a.dist - b.dist);
        const { id: current, dist: currentDist } = pq.shift()!;

        if (visited.has(current)) continue;
        visited.add(current);

        steps.push({
            visited: [...visited],
            queue: pq.map(i => `${i.id}(${i.dist})`),
            current: current,
            processingEdges: [],
            description: `Processing node ${current} with current shortest distance ${currentDist}`
        });

        const neighbors = adj.get(current) || [];
        for (const neighbor of neighbors) {
            // In typical Dijkstra with non-negative weights we might revisit if shorter path found, 
            // but strict visited set is often used for efficient simplified logic if standard logic.
            // For general robustness let's allow re-relaxation processing visually.

            const edgeWeight = 1; // Default Unit Weight since UI doesn't allow setting weights yet
            const newDist = currentDist + edgeWeight;

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = current;
                pq.push({ id: neighbor, dist: newDist });

                steps.push({
                    visited: [...visited],
                    queue: pq.map(i => `${i.id}(${i.dist})`),
                    current: current,
                    processingEdges: [{ source: current, target: neighbor }],
                    description: `Relaxing edge ${current}->${neighbor}. New distance: ${newDist}`
                });
            }
        }
    }

    // Create distances object for final output
    const finalDistances: { [key: string]: number } = {};
    nodes.forEach(node => {
        finalDistances[node.id] = distances[node.id];
    });

    steps.push({
        visited: [...visited],
        queue: [],
        current: null,
        processingEdges: [],
        description: "Dijkstra's Algorithm Complete",
        distances: finalDistances,
        traversalOrder: [...visited]
    });

    return steps;
};

const getAdjacencyList = (nodes: GraphNode[], edges: GraphEdge[]) => {
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
        adj.get(e.source)?.push(e.target);
        // Assuming undirected for now, or make optional
        adj.get(e.target)?.push(e.source);
    });
    // Sort neighbors for deterministic behavior
    adj.forEach((neighbors, key) => {
        neighbors.sort((a, b) => parseInt(a) - parseInt(b));
    });
    return adj;
};
