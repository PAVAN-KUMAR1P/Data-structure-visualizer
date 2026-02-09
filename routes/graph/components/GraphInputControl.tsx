
import React, { useRef, useEffect, useState } from 'react';
import { GraphAlgorithm, TraversalStep } from '../graphTypes';

interface Props {
    isProcessing: boolean;
    onCommand: (text: string) => void;
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    voiceStatus: string;
}

const GraphInputControl: React.FC<Props> = ({
    isProcessing,
    onCommand,
    isListening,
    onStartListening,
    onStopListening,
    voiceStatus
}) => {
    const [command, setCommand] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isProcessing) return;
        onCommand(command);
        setCommand('');
    };

    return (
        <div className="px-4 py-4 border-b border-mint-200 bg-gradient-to-r from-mint-50/50 to-sky-50/50">
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-white rounded-xl border border-mint-200 shadow-soft overflow-hidden focus-within:ring-2 focus-within:ring-mint-300 focus-within:border-mint-400 transition-all">

                    {/* Voice Button */}
                    <button
                        type="button"
                        onClick={isListening ? onStopListening : onStartListening}
                        className={`p-3 transition-all ${isListening ? 'bg-sky-50 text-sky-active animate-pulse' : 'text-slate-400 hover:text-mint-500'}`}
                        title={isListening ? 'Stop Listening' : 'Start Voice Control'}
                    >
                        <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Say 'Start BFS' or type command..."
                        className="flex-1 px-2 py-2.5 bg-transparent text-sm text-deep-green placeholder-slate-400 outline-none"
                        disabled={isProcessing || isListening}
                    />

                    <button
                        type="submit"
                        disabled={!command.trim() || isProcessing}
                        className="p-3 text-slate-400 hover:text-mint-600 disabled:opacity-40 transition-colors bg-mint-50/50 border-l border-mint-100"
                    >
                        <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                </div>

                {/* Voice Status Indicator */}
                <div className={`flex items-center gap-2 mt-2 ml-1 transition-all duration-300 ${isListening ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-mint-500 animate-[music-bar_0.5s_ease-in-out_infinite] h-2"></div>
                        <div className="w-0.5 bg-mint-500 animate-[music-bar_0.5s_ease-in-out_infinite_0.1s] h-3"></div>
                        <div className="w-0.5 bg-mint-500 animate-[music-bar_0.5s_ease-in-out_infinite_0.2s] h-1"></div>
                    </div>
                    <span className="text-[10px] font-bold text-mint-600 uppercase tracking-wider">
                        {voiceStatus || 'Listening...'}
                    </span>
                </div>
                {!isListening && (
                    <p className="text-[9px] text-slate-400 mt-1.5 ml-1 font-medium">
                        e.g., "add edge 1 to 5", "start BFS", "explain DFS"
                    </p>
                )}
            </form>
        </div>
    );
};

export default GraphInputControl;
