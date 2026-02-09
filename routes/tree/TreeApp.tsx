
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import {
    TreeType,
    TreeOperation,
    FlatTreeNode,
    TreeStats
} from './treeTypes';
import TreeVisualizer from './components/TreeVisualizer';
import TreeControlPanel from './components/TreeControlPanel';
import TreeCodeDisplay from './components/TreeCodeDisplay';
import CommandConsole from '../../components/CommandConsole';
import { getTreeOperationExplanation } from '../../services/treeGemini';
import { parseVoiceCommand, VoiceRecognition, VoiceIntent, speak } from '../../services/voiceControl';
import {
    bstInsert, avlInsert, bstDelete, avlDelete, heapInsert,
    searchTree, treeToFlat, flatToTree, getTreeStats,
    inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal
} from '../../services/treeOperations';

const TreeApp: React.FC = () => {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState<FlatTreeNode[]>([]);
    const [treeType, setTreeType] = useState<TreeType>('BST');
    const [isProcessing, setIsProcessing] = useState(false);
    const [explanation, setExplanation] = useState<string>('');
    const [lastOp, setLastOp] = useState<TreeOperation | null>(null);
    const [history, setHistory] = useState<FlatTreeNode[][]>([]);
    const [traversalPath, setTraversalPath] = useState<string[]>([]);
    const [stats, setStats] = useState<TreeStats>({
        nodeCount: 0, height: 0, isBalanced: true, minValue: null, maxValue: null
    });

    const [showCode, setShowCode] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState<string>('');
    const [lastSpoken, setLastSpoken] = useState<string>('');

    const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);
    const handleUserCommandRef = useRef<((text: string) => void) | null>(null);

    // Helpers
    const clearStatuses = useCallback((updatedNodes: FlatTreeNode[]) => updatedNodes.map(node => ({ ...node, status: 'idle' as const })), []);
    const speakFeedback = useCallback((message: string) => speak(message), []);
    const updateStats = useCallback((nodeList: FlatTreeNode[]) => {
        if (nodeList.length === 0) {
            setStats({ nodeCount: 0, height: 0, isBalanced: true, minValue: null, maxValue: null });
            return;
        }
        const isHeap = treeType === 'MAX_HEAP' || treeType === 'MIN_HEAP';
        if (isHeap) {
            const values = nodeList.map(n => n.value);
            setStats({
                nodeCount: nodeList.length,
                height: Math.floor(Math.log2(nodeList.length)) + 1,
                isBalanced: true,
                minValue: Math.min(...values),
                maxValue: Math.max(...values)
            });
        } else {
            const tree = flatToTree(nodeList);
            if (tree) setStats(getTreeStats(tree));
        }
    }, [treeType]);

    // Ops
    const executeVoiceIntent = useCallback((intent: VoiceIntent) => {
        const { operation, value, treeType: newTreeType } = intent;
        if (!operation || isProcessing) return;

        if (operation === 'change_tree_type' && newTreeType) {
            const map: any = { 'bst': 'BST', 'avl': 'AVL', 'max_heap': 'MAX_HEAP', 'min_heap': 'MIN_HEAP' };
            if (map[newTreeType]) { handleTreeTypeChange(map[newTreeType]); speakFeedback(`Switched to ${newTreeType.replace('_', ' ')}`); }
            return;
        }
        switch (operation) {
            case 'insert': value !== null ? handleOperation('INSERT', Number(value)) : speakFeedback("Specify value"); break;
            case 'delete': case 'delete_value': value !== null ? handleOperation('DELETE', Number(value)) : null; break;
            case 'search': value !== null ? handleOperation('SEARCH', Number(value)) : speakFeedback("Specify value"); break;
            case 'inorder': handleOperation('INORDER'); break;
            case 'preorder': handleOperation('PREORDER'); break;
            case 'postorder': handleOperation('POSTORDER'); break;
            case 'level_order': handleOperation('LEVEL_ORDER'); break;
            case 'find_min': handleOperation('FIND_MIN'); break;
            case 'find_max': handleOperation('FIND_MAX'); break;
            case 'get_height': handleOperation('GET_HEIGHT'); break;
            case 'extract_root': handleOperation('EXTRACT_ROOT'); break;
            case 'clear': handleOperation('CLEAR'); break;
            default: speakFeedback(`Unknown command`);
        }
    }, [treeType, speakFeedback, isProcessing]);

    const handleUserCommand = useCallback(async (text: string) => {
        if (!text.trim() || isProcessing) return;
        setVoiceStatus(`Processing '${text}'...`);
        try {
            const intent = await parseVoiceCommand(text);
            if (!intent?.operation) { setVoiceStatus('?'); setTimeout(() => setVoiceStatus(''), 2000); return; }
            setVoiceStatus(`✓ ${intent.operation}`);
            executeVoiceIntent(intent);
            setTimeout(() => setVoiceStatus(''), 2000);
        } catch { setVoiceStatus('Error'); setTimeout(() => setVoiceStatus(''), 2000); }
    }, [executeVoiceIntent, isProcessing]);

    useEffect(() => { handleUserCommandRef.current = handleUserCommand; }, [handleUserCommand]);

    useEffect(() => {
        voiceRecognitionRef.current = new VoiceRecognition();
        voiceRecognitionRef.current.onResult(async (spokenText) => {
            if (spokenText === lastSpoken) return;
            setLastSpoken(spokenText);
            setVoiceStatus(`Hearing: "${spokenText}"`);
            if (handleUserCommandRef.current) handleUserCommandRef.current(spokenText);
        });
        voiceRecognitionRef.current.onStatus(st => st.includes('hearing') && setVoiceStatus('Listening...'));
        return () => voiceRecognitionRef.current?.stop();
    }, [lastSpoken]);

    const handleOperation = async (op: TreeOperation, value?: number) => {
        setIsProcessing(true);
        setLastOp(op);
        const mutatingOps: TreeOperation[] = ['INSERT', 'DELETE', 'EXTRACT_ROOT', 'CLEAR'];
        if (mutatingOps.includes(op)) setHistory(prev => [...prev, nodes]);

        setExplanation(''); setTraversalPath([]);
        getTreeOperationExplanation(op, value ?? null, nodes, treeType).then(setExplanation);

        const msg = op === 'INSERT' ? `Inserting ${value}` : op === 'DELETE' ? `Deleting ${value}` : op;
        speakFeedback(typeof msg === 'string' ? msg : 'Executing');

        let nextNodes: FlatTreeNode[] = nodes.map(n => ({ ...n, status: 'idle' as FlatTreeNode['status'] }));
        const isHeap = treeType === 'MAX_HEAP' || treeType === 'MIN_HEAP';

        try {
            switch (op) {
                case 'CLEAR': nextNodes = []; break;
                case 'INSERT':
                    if (value !== undefined) {
                        if (isHeap) { nextNodes = heapInsert(nextNodes, value, treeType === 'MAX_HEAP'); nextNodes[nextNodes.length - 1].status = 'new'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 600)); }
                        else {
                            let tree = flatToTree(nextNodes); tree = treeType === 'BST' ? bstInsert(tree, value) : avlInsert(tree, value);
                            nextNodes = treeToFlat(tree); const newNode = nextNodes.find(n => n.value === value);
                            if (newNode) newNode.status = 'new'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 600));
                        }
                    }
                    break;
                case 'DELETE':
                    if (value !== undefined && !isHeap) {
                        let tree = flatToTree(nextNodes);
                        if (tree) {
                            tree = treeType === 'BST' ? bstDelete(tree, value) : avlDelete(tree, value);
                            nextNodes = tree ? treeToFlat(tree) : [];
                        }
                    }
                    break;
                case 'SEARCH':
                    if (value !== undefined && !isHeap) {
                        const tree = flatToTree(nextNodes);
                        let current = tree;
                        while (current) {
                            const n = nextNodes.find(nd => nd.id === current!.id);
                            if (n) n.status = 'searching'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 400));
                            if (current.value === value) { if (n) n.status = 'found'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 1000)); break; }
                            if (n) n.status = 'idle'; current = value < current.value ? current.left : current.right;
                        }
                    }
                    break;
                case 'INORDER': case 'PREORDER': case 'POSTORDER': case 'LEVEL_ORDER':
                    const tree = flatToTree(nextNodes);
                    if (tree) {
                        let order: number[] = [];
                        if (op === 'INORDER') order = inorderTraversal(tree);
                        if (op === 'PREORDER') order = preorderTraversal(tree);
                        if (op === 'POSTORDER') order = postorderTraversal(tree);
                        if (op === 'LEVEL_ORDER') order = levelOrderTraversal(tree);
                        const path: string[] = [];
                        for (const val of order) {
                            const n = nextNodes.find(node => node.value === val);
                            if (n) { n.status = 'visited'; path.push(val.toString()); setTraversalPath([...path]); setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 500)); }
                        }
                    }
                    break;
            }
        } catch (e) { console.error("Op failed", e); }

        const finalNodes = clearStatuses(nextNodes);
        setNodes(finalNodes);
        updateStats(finalNodes);
        setIsProcessing(false);
    };

    const undo = () => {
        if (history.length > 0) {
            const prevNodes = history[history.length - 1];
            setNodes(prevNodes); updateStats(prevNodes); setHistory(prev => prev.slice(0, -1));
        }
    };

    const handleTreeTypeChange = (type: TreeType) => {
        setNodes([]); setTreeType(type); setHistory([]); setLastOp(null);
        setStats({ nodeCount: 0, height: 0, isBalanced: true, minValue: null, maxValue: null });
    };

    const toggleVoice = () => {
        if (isListening) { voiceRecognitionRef.current?.stop(); setIsListening(false); }
        else { voiceRecognitionRef.current?.start(); setIsListening(true); }
    };

    return (
        <Layout title="Tree Data Structures" subtitle="BST • AVL • Heaps" icon="fa-sitemap" themeColor="emerald">
            <div className="flex h-full w-full relative">

                {/* LEFT: Visualization Canvas (Main Playground) */}
                <div className={`transition-all duration-300 h-full flex flex-col ${showControls ? 'w-3/4' : 'w-full'}`}>

                    {/* Dark Toolbar */}
                    <div className="h-14 border-b border-cyan-900/30 flex justify-between items-center px-6 bg-[#020617] shrink-0">
                        {/* Stats Badges (Dark Mode) */}
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 font-mono">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <div className={`w-2 h-2 rounded-full ${nodes.length > 0 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-slate-600'}`}></div>
                                <span>NODES: <strong className="text-cyan-400">{nodes.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <i className="fa-solid fa-arrows-up-down text-purple-400 text-[10px]"></i>
                                <span>HEIGHT: <strong className="text-purple-400">{stats.height}</strong></span>
                            </div>
                            {treeType !== 'MAX_HEAP' && treeType !== 'MIN_HEAP' && (
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${stats.isBalanced ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-amber-950/30 border-amber-900/50 text-amber-400'}`}>
                                    <i className={`fa-solid ${stats.isBalanced ? 'fa-check' : 'fa-triangle-exclamation'} text-[10px]`}></i>
                                    <span>{stats.isBalanced ? 'BALANCED' : 'UNBALANCED'}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={undo} disabled={history.length === 0} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors disabled:opacity-30">
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                            <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-colors ${showCode ? 'bg-cyan-900/30 text-cyan-400' : 'text-slate-500 hover:text-cyan-400 hover:bg-slate-900'}`}>
                                <i className="fa-solid fa-code"></i>
                            </button>
                            <button onClick={() => setShowControls(!showControls)} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg">
                                <i className={`fa-solid ${showControls ? 'fa-sidebar-flip' : 'fa-table-columns'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Dark Canvas */}
                    <div className="flex-1 bg-[#020617] relative overflow-hidden flex items-center justify-center">
                        {/* Neon Dot Grid */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(rgba(34,211,238,0.3) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}></div>

                        {nodes.length === 0 && (
                            <div className="text-center z-10 opacity-30">
                                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <i className="fa-regular fa-folder-open text-3xl text-slate-600"></i>
                                </div>
                                <h3 className="text-slate-500 font-bold mb-1 font-mono tracking-wider">NO DATA</h3>
                            </div>
                        )}

                        <div className="absolute inset-0 z-0">
                            <TreeVisualizer nodes={nodes} treeType={treeType} traversalPath={traversalPath} />
                        </div>

                        {/* Dark Voice Bubble */}
                        {voiceStatus && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)] flex items-center gap-3 animate-fade-in-up font-mono">
                                {voiceStatus.includes('Listening') && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>}
                                {voiceStatus}
                            </div>
                        )}

                        {/* Dark Code Panel */}
                        {showCode && (
                            <div className="absolute top-4 right-4 w-80 max-h-[400px] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden z-20 animate-fade-in">
                                <div className="flex justify-between items-center px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                                    <span className="text-xs font-bold text-cyan-500/80 uppercase font-mono tracking-wider">Algo.Logic</span>
                                    <button onClick={() => setShowCode(false)} className="text-slate-600 hover:text-slate-400"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                                <div className="p-0 overflow-auto max-h-[360px] bg-[#0f172a] text-slate-300">
                                    <TreeCodeDisplay operation={lastOp} treeType={treeType} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Control Sidebar (Dark Mode) */}
                {showControls && (
                    <div className="w-1/4 min-w-[320px] bg-slate-900/50 border-l border-cyan-900/20 h-full flex flex-col z-20 backdrop-blur-sm">

                        {/* Tree Type Selector (Dark) */}
                        <div className="p-5 border-b border-slate-800/50">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3 block font-mono">PROTOCOL SELECT</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['BST', 'AVL', 'MAX_HEAP', 'MIN_HEAP'] as TreeType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleTreeTypeChange(type)}
                                        className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all border uppercase tracking-wider ${treeType === type
                                                ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                                                : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                                            }`}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                            {/* AI Explanation (Dark) */}
                            {explanation && (
                                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                                    <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
                                        <i className="fa-solid fa-microchip"></i> AI_ANALYSIS
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
                                        {explanation}
                                    </p>
                                </div>
                            )}

                            <TreeControlPanel
                                onOperation={handleOperation} isProcessing={isProcessing}
                                treeType={treeType} onTreeTypeChange={() => { }} customUI={true}
                            />
                        </div>

                        {/* Command Console (Bottom) */}
                        <CommandConsole
                            onCommand={handleUserCommand}
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

export default TreeApp;
