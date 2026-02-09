
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { GraphNode, GraphEdge, GraphAlgorithm, TraversalStep } from './graphTypes';
import GraphVisualizer from './components/GraphVisualizer';
import GraphControlPanel from './components/GraphControlPanel';
import GraphBuilder from './components/GraphBuilder';
import CommandConsole from '../../components/CommandConsole';
import { generateInitialGraph, bfsTraversal, dfsTraversal, dijkstraTraversal } from '../../services/graphOperations';
import { parseVoiceCommand, VoiceRecognition, VoiceIntent, speak } from '../../services/voiceControl';
import { getGraphAlgorithmExplanation } from '../../services/graphGemini';

const GraphApp: React.FC = () => {
    const navigate = useNavigate();

    // -- State --
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [edges, setEdges] = useState<GraphEdge[]>([]);
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(null);
    const [steps, setSteps] = useState<TraversalStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [explanation, setExplanation] = useState<string>('');

    // UI
    const [showControls, setShowControls] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [lastSpoken, setLastSpoken] = useState('');
    const [showGraphBuilder, setShowGraphBuilder] = useState(false);

    const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);

    // -- Init --
    useEffect(() => {
        const initialData = generateInitialGraph(6);
        setNodes(initialData.nodes);
        setEdges(initialData.edges);
        voiceRecognitionRef.current = new VoiceRecognition();
        voiceRecognitionRef.current.onResult((text) => {
            setLastSpoken(text);
            handleUserCommand(text);
        });
        voiceRecognitionRef.current.onStatus(st => st.includes('hearing') && setVoiceStatus('Listening...'));
        return () => voiceRecognitionRef.current?.stop();
    }, []);

    // -- Animation Loop --
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            interval = setInterval(() => setCurrentStepIndex(prev => prev + 1), 1000);
        } else if (currentStepIndex >= steps.length - 1) setIsPlaying(false);
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps.length]);

    // -- Voice Narrator --
    useEffect(() => { const step = steps[currentStepIndex]; if (step?.description && currentStepIndex >= 0) speak(step.description); }, [currentStepIndex, steps]);

    // -- Logic --
    const startTraversal = (algo: GraphAlgorithm, startNodeId: string) => {
        setCurrentStepIndex(-1); setSteps([]); setAlgorithm(algo); setIsProcessing(true); setIsPlaying(true);
        const algoDescriptions: Record<string, string> = { 'BFS': 'Starting Breadth First Search.', 'DFS': 'Starting Depth First Search.', 'DIJKSTRA': "Starting Dijkstra's algorithm." };
        if (algoDescriptions[algo || '']) speak(algoDescriptions[algo || '']);

        let traversalSteps: TraversalStep[] = [];
        if (algo === 'BFS') traversalSteps = bfsTraversal(nodes, edges, startNodeId);
        else if (algo === 'DFS') traversalSteps = dfsTraversal(nodes, edges, startNodeId);
        else if (algo === 'DIJKSTRA') traversalSteps = dijkstraTraversal(nodes, edges, startNodeId);

        setSteps(traversalSteps);
        getReasoning(algo);
        setTimeout(() => setCurrentStepIndex(0), 500);
    };

    const getReasoning = async (algo: GraphAlgorithm) => { setExplanation("Analyzing algorithm..."); const result = await getGraphAlgorithmExplanation(algo, nodes.length); setExplanation(result.explanation); };

    const resetGraph = () => { setIsPlaying(false); setCurrentStepIndex(-1); setSteps([]); setAlgorithm(null); setExplanation(""); const data = generateInitialGraph(6); setNodes(data.nodes); setEdges(data.edges); };

    const handleUserCommand = async (text: string) => {
        setVoiceStatus('Thinking...');
        const intent = await parseVoiceCommand(text);
        if (intent) handleIntent(intent);
        else setVoiceStatus('?');
        setTimeout(() => setVoiceStatus(''), 2000);
    };

    const handleIntent = async (intent: VoiceIntent) => {
        switch (intent.operation) {
            case 'start_traversal': if (intent.algorithm) startTraversal(intent.algorithm, intent.value?.toString() || '1'); break;
            case 'add_edge': if (intent.source && intent.target && !edges.some(e => e.source === intent.source?.toString() && e.target === intent.target?.toString())) setEdges(p => [...p, { source: intent.source!.toString(), target: intent.target!.toString(), status: 'idle' }]); break;
            case 'remove_edge': setEdges(p => p.filter(e => !(e.source === intent.source?.toString() && e.target === intent.target?.toString()))); break;
            case 'add_node': if (intent.value && !nodes.some(n => n.id === intent.value!.toString())) setNodes(p => [...p, { id: intent.value!.toString(), value: Number(intent.value), x: 300, y: 300, status: 'idle' }]); break;
            case 'reset': resetGraph(); break;
            case 'play': setIsPlaying(true); break;
            case 'pause': setIsPlaying(false); break;
        }
    };

    const handleCommandInput = (text: string) => {
        const lower = text.toLowerCase();
        if (lower === 'start bfs') startTraversal('BFS', '1');
        else if (lower === 'start dfs') startTraversal('DFS', '1');
        else if (lower === 'start dijkstra') startTraversal('DIJKSTRA', '1');
        else if (lower === 'play') setIsPlaying(true);
        else if (lower === 'pause') setIsPlaying(false);
        else if (lower === 'reset') resetGraph();
        else handleUserCommand(text);
    };

    const createCustomGraph = (nodeCount: number, customEdges: { source: number; target: number }[]) => {
        resetGraph();
        const newNodes: GraphNode[] = [];
        const centerX = 400, centerY = 300, radius = 200;
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
            newNodes.push({ id: (i + 1).toString(), value: i + 1, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle), status: 'idle' });
        }
        setEdges(customEdges.map(e => ({ source: e.source.toString(), target: e.target.toString(), status: 'idle' })));
        setNodes(newNodes);
    };

    const toggleVoice = () => { if (isListening) { voiceRecognitionRef.current?.stop(); setIsListening(false); } else { voiceRecognitionRef.current?.start(); setIsListening(true); } };

    return (
        <Layout title="Graph Visualizer" subtitle="BFS • DFS • Dijkstra" icon="fa-share-nodes" themeColor="violet">
            <GraphBuilder isOpen={showGraphBuilder} onClose={() => setShowGraphBuilder(false)} onCreateGraph={createCustomGraph} currentNodeCount={nodes.length} />

            <div className="flex h-full w-full relative">
                {/* LEFT: Canvas */}
                <div className={`transition-all duration-300 h-full flex flex-col ${showControls ? 'w-3/4' : 'w-full'}`}>

                    {/* Dark Toolbar */}
                    <div className="h-14 border-b border-cyan-900/30 flex justify-between items-center px-6 bg-[#020617] shrink-0">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 font-mono">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <span>NODES: <strong className="text-cyan-400">{nodes.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <span>EDGES: <strong className="text-purple-400">{edges.length}</strong></span>
                            </div>
                            {algorithm && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/30 text-violet-400 rounded-lg border border-violet-900/50">
                                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                                    <span>RUNNING: <strong>{algorithm}</strong></span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowGraphBuilder(true)} className="px-3 py-1.5 bg-cyan-950/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold hover:bg-cyan-900/50 transition-colors uppercase tracking-wider">
                                <i className="fa-solid fa-plus mr-1"></i> New Graph
                            </button>
                            <button onClick={() => setShowControls(!showControls)} className="p-2 text-slate-500 hover:bg-slate-900 rounded-lg">
                                <i className={`fa-solid ${showControls ? 'fa-sidebar-flip' : 'fa-table-columns'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Dark Canvas */}
                    <div className="flex-1 bg-[#020617] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(rgba(34,211,238,0.3) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}></div>

                        <div className="absolute inset-0">
                            <GraphVisualizer nodes={nodes} edges={edges} isProcessing={isPlaying} traversalStep={steps[currentStepIndex] || null} algorithm={algorithm} />
                        </div>

                        {/* Voice Bubble (Dark) */}
                        {voiceStatus && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)] flex items-center gap-3 animate-fade-in-up font-mono">
                                {voiceStatus.includes('Listening') && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>}
                                {voiceStatus}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sidebar (Dark) */}
                {showControls && (
                    <div className="w-1/4 min-w-[320px] bg-slate-900/50 border-l border-cyan-900/20 h-full flex flex-col z-20 backdrop-blur-sm">
                        <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest font-mono">CONTROLS</label>
                            <button onClick={resetGraph} className="text-xs font-bold text-red-500 hover:text-red-400">RESET</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                            {explanation && (
                                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                                    <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
                                        <i className="fa-solid fa-microchip"></i> AI_ANALYSIS
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed font-light">{explanation}</p>
                                </div>
                            )}
                            <GraphControlPanel onCommand={handleCommandInput} isProcessing={isPlaying} />
                        </div>

                        {/* Command Console */}
                        <CommandConsole
                            onCommand={handleCommandInput}
                            isListening={isListening}
                            onToggleVoice={toggleVoice}
                            status={voiceStatus}
                            lastCommand={lastSpoken}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GraphApp;
