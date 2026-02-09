
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { ListNode, ListOperation, DatasetType, ListKind } from '../../types';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import ControlPanel from './components/ControlPanel';
import CodeDisplay from './components/CodeDisplay';
import CommandConsole from '../../components/CommandConsole';
import { getOperationExplanation } from '../../services/gemini';
import { parseVoiceCommand, VoiceRecognition, VoiceIntent, speak, speakAsync } from '../../services/voiceControl';

const LinkedListApp: React.FC = () => {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState<ListNode[]>([]);
    const [datasetType, setDatasetType] = useState<DatasetType>('numbers');
    const [listKind, setListKind] = useState<ListKind>('SLL');
    const [isProcessing, setIsProcessing] = useState(false);
    const [explanation, setExplanation] = useState<string>('');
    const [lastOp, setLastOp] = useState<ListOperation | null>(null);
    const [history, setHistory] = useState<ListNode[][]>([]);

    // UI States
    const [showCode, setShowCode] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState<string>('');
    const [lastSpoken, setLastSpoken] = useState<string>('');

    const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);
    const nodesRef = useRef<ListNode[]>(nodes);
    useEffect(() => { nodesRef.current = nodes; }, [nodes]);

    const handleUserCommandRef = useRef<((text: string) => void) | null>(null);

    // --- Helpers ---
    // Sync speech - waits for completion
    const speakFeedback = useCallback((message: string) => speak(message), []);
    // Async speech - fire and forget (for quick feedback)
    const speakQuick = useCallback((message: string) => speakAsync(message), []);
    const clearStatuses = useCallback((updatedNodes: ListNode[]) => updatedNodes.map(node => ({ ...node, status: 'idle' as const })), []);

    // --- Logic ---
    const executeVoiceIntent = useCallback((intent: VoiceIntent) => {
        const { operation, value, listType, position } = intent;
        if (!operation || isProcessing) return;

        if (operation === 'change_list_type' && listType) {
            const map: any = { 'singly': 'SLL', 'doubly': 'DLL', 'circular_singly': 'CSLL', 'circular_doubly': 'CDLL' };
            if (map[listType]) { handleListKindChange(map[listType]); speakFeedback(`Switched to ${listType}`); }
            return;
        }

        switch (operation) {
            case 'insert': case 'insert_tail': handleOperation('INSERT_TAIL', value ?? '0'); break;
            case 'insert_head': handleOperation('INSERT_HEAD', value ?? '0'); break;
            case 'insert_at': handleOperation('INSERT_AT', value ?? '0', typeof position === 'number' ? position : 0); break;
            case 'search': handleOperation('SEARCH', value ?? '0'); break;
            case 'delete': case 'delete_value': handleOperation('DELETE_VALUE', value ?? '0'); break;
            case 'delete_head': handleOperation('DELETE_HEAD', ''); break;
            case 'delete_tail': handleOperation('DELETE_TAIL', ''); break;
            case 'delete_at': handleOperation('DELETE_AT', '', typeof position === 'number' ? position : 0); break;
            case 'reverse': handleOperation('REVERSE', ''); break;
            case 'sort': handleOperation('SORT', ''); break;
            case 'traverse': handleOperation('TRAVERSE', ''); break;
            case 'clear': handleOperation('CLEAR', ''); break;
            case 'find_middle': handleOperation('FIND_MIDDLE', ''); break;
            case 'undo': undo(); break;
            default: speakFeedback('Command not understood');
        }
    }, [listKind, speakFeedback, isProcessing]);

    const handleUserCommand = useCallback(async (text: string) => {
        if (!text.trim() || isProcessing) return;
        setVoiceStatus('🤔 Understanding command...');
        try {
            const intent = await parseVoiceCommand(text);
            if (!intent?.operation) { 
                setVoiceStatus('❓ Command not recognized'); 
                speakFeedback('Sorry, I did not understand that command');
                setTimeout(() => setVoiceStatus(''), 2000);
                return; 
            }
            
            // Create friendly operation names
            const opNames: Record<string, string> = {
                'insert': 'inserting', 'insert_tail': 'inserting at tail', 
                'insert_head': 'inserting at head', 'insert_at': 'inserting at position',
                'search': 'searching',
                'delete': 'deleting', 'delete_value': 'deleting value',
                'delete_head': 'deleting head', 'delete_tail': 'deleting tail',
                'delete_at': 'deleting at position',
                'reverse': 'reversing list', 'sort': 'sorting list',
                'traverse': 'traversing list', 'find_middle': 'finding middle',
                'clear': 'clearing list', 'undo': 'undoing'
            };
            
            const friendlyName = opNames[intent.operation] || intent.operation;
            setVoiceStatus(`✓ ${friendlyName}`);
            executeVoiceIntent(intent);
            setTimeout(() => setVoiceStatus(''), 3000);
        } catch { 
            setVoiceStatus('⚠️ Error processing command'); 
            speakFeedback('An error occurred processing your command');
            setTimeout(() => setVoiceStatus(''), 2000);
        }
    }, [executeVoiceIntent, isProcessing]);

    useEffect(() => { handleUserCommandRef.current = handleUserCommand; }, [handleUserCommand]);

    useEffect(() => {
        voiceRecognitionRef.current = new VoiceRecognition();
        voiceRecognitionRef.current.onResult(async (spokenText) => {
            if (spokenText === lastSpoken) return;
            setLastSpoken(spokenText);
            setVoiceStatus(`🎤 "${spokenText}"`);
            if (handleUserCommandRef.current) handleUserCommandRef.current(spokenText);
        });
        voiceRecognitionRef.current.onStatus(st => {
            console.log('Voice status:', st);
            if (st.includes('hearing')) {
                setVoiceStatus(`👂 ${st.replace('hearing: ', '')}`);
            } else if (st.includes('Listening')) {
                setVoiceStatus('🎤 Listening...');
            } else if (st.includes('denied')) {
                setVoiceStatus('❌ Mic permission denied');
                setIsListening(false);
            } else if (st.includes('Error')) {
                setVoiceStatus(st);
            } else if (st.includes('stopped') || st.includes('Click')) {
                setVoiceStatus('');
            }
        });
        voiceRecognitionRef.current.onError((err) => {
            console.error('Voice recognition error:', err);
            setVoiceStatus(`⚠️ ${err}`);
            setTimeout(() => setVoiceStatus(''), 3000);
        });
        return () => voiceRecognitionRef.current?.stop();
    }, [lastSpoken]);

    const handleOperation = async (op: ListOperation, value: string | number, index?: number) => {
        const currentNodes = nodesRef.current;
        setIsProcessing(true);
        setLastOp(op);
        const mutatingOps: ListOperation[] = ['INSERT_HEAD', 'INSERT_TAIL', 'INSERT_AT', 'DELETE_HEAD', 'DELETE_TAIL', 'DELETE_VALUE', 'DELETE_AT', 'CLEAR', 'REVERSE', 'SORT'];
        if (mutatingOps.includes(op)) setHistory(prev => [...prev, currentNodes]);

        setExplanation('');
        getOperationExplanation(op, value, currentNodes, listKind).then(setExplanation);

        let nextNodes: ListNode[] = currentNodes.map(n => ({ ...n, status: 'idle' as ListNode['status'] }));

        switch (op) {
            case 'CLEAR': 
                const clearedCount = nextNodes.length;
                await speakFeedback(`Clearing ${clearedCount} node${clearedCount !== 1 ? 's' : ''}`);
                nextNodes = []; 
                break;
            case 'INSERT_HEAD':
                await speakFeedback(`Inserting ${value} at head`);
                nextNodes = [{ id: Math.random().toString(), value, nextId: nextNodes[0]?.id || null, status: 'new' }, ...nextNodes];
                setNodes([...nextNodes]);
                await speakFeedback(`${value} is now the head node`);
                break;
            case 'INSERT_TAIL': {
                await speakFeedback(`Inserting ${value} at tail`);
                const t: ListNode = { id: Math.random().toString(), value, nextId: null, status: 'new' };
                if (nextNodes.length > 0) nextNodes[nextNodes.length - 1].nextId = t.id;
                nextNodes = [...nextNodes, t];
                setNodes([...nextNodes]);
                await speakFeedback(`${value} added. List now has ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''}`);
                break;
            }
            case 'INSERT_AT': {
                const idx = index ?? 0;
                if (idx < 0 || idx > nextNodes.length) {
                    await speakFeedback(`Invalid index ${idx}. Please choose between 0 and ${nextNodes.length}`);
                    break;
                }
                
                await speakFeedback(`Navigating to position ${idx}`);
                // Traverse to the index
                for (let i = 0; i < idx && i < nextNodes.length; i++) {
                    nextNodes[i].status = 'searching';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 300));
                    nextNodes[i].status = 'idle';
                }
                
                const newNode: ListNode = { 
                    id: Math.random().toString(), 
                    value, 
                    nextId: nextNodes[idx]?.id || null, 
                    status: 'new' 
                };
                
                if (idx > 0 && nextNodes[idx - 1]) {
                    nextNodes[idx - 1].nextId = newNode.id;
                }
                
                nextNodes.splice(idx, 0, newNode);
                setNodes([...nextNodes]);
                await speakFeedback(`Inserted ${value} at position ${idx}`);
                break;
            }
            case 'DELETE_HEAD':
                if (nextNodes.length > 0) { 
                    const deletedValue = nextNodes[0].value;
                    await speakFeedback(`Deleting head node with value ${deletedValue}`);
                    nextNodes[0].status = 'processing'; 
                    setNodes([...nextNodes]); 
                    await new Promise(r => setTimeout(r, 500)); 
                    nextNodes = nextNodes.slice(1); 
                    await speakFeedback(`Deleted. ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''} remaining`);
                } else {
                    await speakFeedback('List is empty. Cannot delete head');
                }
                break;
            case 'DELETE_TAIL':
                if (nextNodes.length > 0) { 
                    const deletedValue = nextNodes[nextNodes.length - 1].value;
                    await speakFeedback(`Deleting tail node with value ${deletedValue}`);
                    nextNodes[nextNodes.length - 1].status = 'processing'; 
                    setNodes([...nextNodes]); 
                    await new Promise(r => setTimeout(r, 500)); 
                    nextNodes = nextNodes.slice(0, -1); 
                    await speakFeedback(`Deleted. ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''} remaining`);
                } else {
                    await speakFeedback('List is empty. Cannot delete tail');
                }
                break;
            case 'DELETE_AT': {
                const idx = index ?? 0;
                if (nextNodes.length === 0) {
                    await speakFeedback('List is empty. Cannot delete');
                    break;
                }
                if (idx < 0 || idx >= nextNodes.length) {
                    await speakFeedback(`Invalid index ${idx}. Please choose between 0 and ${nextNodes.length - 1}`);
                    break;
                }
                
                await speakFeedback(`Navigating to position ${idx}`);
                // Traverse to the index
                for (let i = 0; i <= idx && i < nextNodes.length; i++) {
                    nextNodes[i].status = 'searching';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 300));
                    if (i < idx) nextNodes[i].status = 'idle';
                }
                
                const deletedValue = nextNodes[idx].value;
                nextNodes[idx].status = 'processing';
                setNodes([...nextNodes]);
                await new Promise(r => setTimeout(r, 500));
                
                // Update the previous node's nextId
                if (idx > 0 && nextNodes[idx - 1]) {
                    nextNodes[idx - 1].nextId = nextNodes[idx + 1]?.id || null;
                }
                
                nextNodes.splice(idx, 1);
                setNodes([...nextNodes]);
                await speakFeedback(`Deleted ${deletedValue} at position ${idx}. ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''} remaining`);
                break;
            }
            case 'SEARCH':
                await speakFeedback(`Searching for ${value}`);
                let searchFound = false;
                for (let i = 0; i < nextNodes.length; i++) {
                    nextNodes[i].status = 'searching'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 400));
                    if (nextNodes[i].value == value) { 
                        nextNodes[i].status = 'found'; 
                        setNodes([...nextNodes]); 
                        await speakFeedback(`Found ${value} at position ${i}`);
                        searchFound = true;
                        break; 
                    }
                    nextNodes[i].status = 'idle';
                }
                if (!searchFound) await speakFeedback(`${value} not found in the list`);
                break;
            case 'TRAVERSE': {
                // Traverse through all nodes one by one
                for (let i = 0; i < nextNodes.length; i++) {
                    if (i > 0) nextNodes[i - 1].status = 'idle';
                    nextNodes[i].status = 'searching';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 500));
                }
                // Mark all as visited at the end
                for (let i = 0; i < nextNodes.length; i++) {
                    nextNodes[i].status = 'found';
                }
                setNodes([...nextNodes]);
                await speakFeedback(`Traversed ${nextNodes.length} nodes`);
                break;
            }
            case 'DELETE_VALUE': {
                await speakFeedback(`Searching for ${value} to delete`);
                let found = false;
                for (let i = 0; i < nextNodes.length; i++) {
                    nextNodes[i].status = 'searching'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 400));
                    if (nextNodes[i].value == value) {
                        await speakFeedback(`Found ${value} at position ${i}. Deleting now`);
                        nextNodes[i].status = 'processing'; setNodes([...nextNodes]); await new Promise(r => setTimeout(r, 600));
                        nextNodes.splice(i, 1);
                        // Update nextId of previous node if exists
                        if (i > 0 && nextNodes[i]) {
                            nextNodes[i - 1].nextId = nextNodes[i]?.id || null;
                        }
                        found = true;
                        await speakFeedback(`Deleted ${value}. ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''} remaining`);
                        break;
                    }
                    nextNodes[i].status = 'idle';
                }
                if (!found) await speakFeedback(`Value ${value} not found in the list`);
                break;
            }
            case 'REVERSE': {
                if (nextNodes.length === 0) {
                    await speakFeedback('List is empty. Nothing to reverse');
                    break;
                }
                await speakFeedback(`Reversing list with ${nextNodes.length} node${nextNodes.length !== 1 ? 's' : ''}`);
                // Animate each node being processed
                for (let i = 0; i < nextNodes.length; i++) {
                    nextNodes[i].status = 'processing';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 300));
                }
                await new Promise(r => setTimeout(r, 400));
                
                // Reverse the array
                const rev = [...nextNodes].reverse();
                nextNodes = rev.map((n, i, arr) => ({ ...n, nextId: arr[i + 1]?.id || null, status: 'idle' }));
                
                // Show the reversed result briefly
                setNodes([...nextNodes]);
                await speakFeedback('List reversed successfully');
                break;
            }
            case 'SORT': {
                if (nextNodes.length === 0) {
                    await speakFeedback('List is empty. Nothing to sort');
                    break;
                }
                if (nextNodes.length === 1) {
                    await speakFeedback('List has only one node. Already sorted');
                    break;
                }
                await speakFeedback(`Sorting ${nextNodes.length} nodes using bubble sort`);
                // Bubble sort with animation
                const n = nextNodes.length;
                let swapCount = 0;
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - i - 1; j++) {
                        // Highlight comparing nodes
                        nextNodes[j].status = 'searching';
                        nextNodes[j + 1].status = 'runner';
                        setNodes([...nextNodes]);
                        await new Promise(r => setTimeout(r, 500));
                        
                        // Compare and swap if needed
                        if (nextNodes[j].value > nextNodes[j + 1].value) {
                            swapCount++;
                            const temp = nextNodes[j];
                            nextNodes[j] = nextNodes[j + 1];
                            nextNodes[j + 1] = temp;
                            nextNodes[j].status = 'processing';
                            nextNodes[j + 1].status = 'processing';
                            setNodes([...nextNodes]);
                            await new Promise(r => setTimeout(r, 500));
                        }
                        
                        nextNodes[j].status = 'idle';
                        nextNodes[j + 1].status = 'idle';
                    }
                    // Mark sorted element
                    nextNodes[n - i - 1].status = 'found';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 300));
                }
                if (n > 0) nextNodes[0].status = 'found';
                setNodes([...nextNodes]);
                await new Promise(r => setTimeout(r, 500));
                
                // Update nextId links after sorting
                nextNodes = nextNodes.map((n, i, arr) => ({ ...n, nextId: arr[i + 1]?.id || null, status: 'idle' }));
                await speakFeedback(`Sort complete. Made ${swapCount} swap${swapCount !== 1 ? 's' : ''}`);
                break;
            }
            case 'FIND_MIDDLE': {
                if (nextNodes.length === 0) {
                    await speakFeedback('List is empty');
                    break;
                }
                
                // Two pointer approach: slow and fast
                let slow = 0;
                let fast = 0;
                
                while (fast < nextNodes.length - 1 && fast + 1 < nextNodes.length) {
                    // Mark fast pointer
                    if (fast > 0) nextNodes[fast - 1].status = 'idle';
                    if (fast + 1 > 0) nextNodes[fast].status = 'idle';
                    
                    nextNodes[fast].status = 'runner';
                    nextNodes[fast + 1].status = 'runner';
                    nextNodes[slow].status = 'searching';
                    setNodes([...nextNodes]);
                    await new Promise(r => setTimeout(r, 600));
                    
                    fast += 2;
                    slow += 1;
                }
                
                // Clear all and mark middle
                nextNodes.forEach(n => n.status = 'idle');
                nextNodes[slow].status = 'found';
                setNodes([...nextNodes]);
                await speakFeedback(`Middle element is ${nextNodes[slow].value}`);
                break;
            }
        }

        const final = clearStatuses(nextNodes);
        setNodes(final);
        setIsProcessing(false);
    };

    const undo = async () => {
        if (history.length > 0) {
            await speakFeedback('Undoing last operation');
            setNodes(history[history.length - 1]);
            setHistory(prev => prev.slice(0, -1));
        } else {
            await speakFeedback('Nothing to undo');
        }
    };

    const handleListKindChange = async (kind: ListKind) => { 
        const names: Record<ListKind, string> = {
            'SLL': 'singly linked list',
            'DLL': 'doubly linked list',
            'CSLL': 'circular singly linked list',
            'CDLL': 'circular doubly linked list'
        };
        await speakFeedback(`Switched to ${names[kind]}`);
        setNodes([]); 
        setListKind(kind); 
        setHistory([]); 
    };
    const handleDatasetTypeChange = async (type: DatasetType) => { 
        await speakFeedback(`Data type changed to ${type}`);
        setNodes([]); 
        setDatasetType(type); 
        setHistory([]); 
    };

    const toggleVoice = async () => {
        if (isListening) { 
            voiceRecognitionRef.current?.stop(); 
            setIsListening(false); 
            setVoiceStatus('🔇 Voice control off');
            setTimeout(() => setVoiceStatus(''), 2000);
        }
        else { 
            setVoiceStatus('🎤 Requesting mic access...');
            await voiceRecognitionRef.current?.start(); 
            setIsListening(true); 
            setVoiceStatus('🎤 Listening...');
        }
    };

    return (
        <Layout title="Linked List Visualizer" subtitle="Singly • Doubly • Circular" icon="fa-link" themeColor="indigo">
            <div className="flex h-full w-full relative">
                {/* LEFT: Canvas */}
                <div className={`transition-all duration-300 h-full flex flex-col ${showControls ? 'w-3/4' : 'w-full'}`}>

                    {/* Dark Toolbar */}
                    <div className="h-14 border-b border-cyan-900/30 flex justify-between items-center px-6 bg-[#020617] shrink-0">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 font-mono">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <div className={`w-2 h-2 rounded-full ${nodes.length > 0 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-slate-600'}`}></div>
                                <span>NODES: <strong className="text-cyan-400">{nodes.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                                <span>TYPE: <strong className="text-purple-400">{listKind}</strong></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={undo} disabled={history.length === 0} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors">
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
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(rgba(34,211,238,0.3) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}></div>

                        {nodes.length === 0 && (
                            <div className="text-center z-10 opacity-30">
                                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow shadow-cyan-900">
                                    <i className="fa-solid fa-link text-3xl text-slate-600"></i>
                                </div>
                                <h3 className="text-slate-500 font-bold mb-1 font-mono tracking-wider">EMPTY LIST</h3>
                            </div>
                        )}

                        <div className="w-full h-full absolute inset-0 overflow-auto z-0">
                            <LinkedListVisualizer nodes={nodes} datasetType={datasetType} listKind={listKind} />
                        </div>

                        {/* Voice Bubble (Dark) */}
                        {voiceStatus && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)] flex items-center gap-3 animate-fade-in-up font-mono">
                                {voiceStatus.includes('Listening') && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>}
                                {voiceStatus}
                            </div>
                        )}

                        {showCode && (
                            <div className="absolute top-4 right-4 w-80 max-h-[400px] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden z-20 animate-fade-in">
                                <div className="flex justify-between items-center px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                                    <span className="text-xs font-bold text-cyan-500/80 uppercase font-mono tracking-wider">Algo.Logic</span>
                                    <button onClick={() => setShowCode(false)} className="text-slate-600 hover:text-slate-400"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                                <div className="p-0 overflow-auto max-h-[360px] bg-[#0f172a] text-slate-300">
                                    <CodeDisplay operation={lastOp} listKind={listKind} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sidebar (Dark) */}
                {showControls && (
                    <div className="w-1/4 min-w-[320px] bg-slate-900/50 border-l border-cyan-900/20 h-full flex flex-col z-20 backdrop-blur-sm">
                        <div className="p-5 border-b border-slate-800/50">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3 block font-mono">STRUCTURE CONFIG</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['SLL', 'DLL', 'CSLL', 'CDLL'] as ListKind[]).map(k => (
                                    <button key={k} onClick={() => handleListKindChange(k)} className={`px-2 py-1.5 text-xs font-bold rounded-lg border transition-all ${listKind === k ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'}`}>
                                        {k}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
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

                            <ControlPanel
                                onOperation={handleOperation} isProcessing={isProcessing}
                                datasetType={datasetType} onDatasetTypeChange={handleDatasetTypeChange}
                                listKind={listKind} onListKindChange={handleListKindChange}
                                customUI={true}
                            />
                        </div>

                        {/* Command Console */}
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

export default LinkedListApp;
