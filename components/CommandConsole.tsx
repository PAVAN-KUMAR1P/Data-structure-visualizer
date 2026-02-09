
import React, { useState, useRef, useEffect } from 'react';

interface Props {
    onCommand: (command: string) => void;
    isListening: boolean;
    onToggleVoice: () => void;
    status: string;
    lastCommand?: string;
}

const CommandConsole: React.FC<Props> = ({ onCommand, isListening, onToggleVoice, status, lastCommand }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onCommand(input);
            setInput('');
        }
    };

    // Auto-focus logic or keeping focus can be annoying if user is clicking buttons, so we skip auto-focus on mount.

    return (
        <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur-sm border-t border-mint-200 font-mono text-xs">

            {/* Status / History Log */}
            <div className="h-20 bg-mint-50 rounded-lg p-3 border border-mint-200 overflow-y-auto custom-scrollbar flex flex-col justify-end shadow-soft">
                {lastCommand && (
                    <div className="text-slate-500 mb-1">
                        <span className="text-mint-600 mr-2">$</span>
                        {lastCommand}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-mint-500">➜</span>
                    <span className={status.includes('Error') ? 'text-soft-red' : 'text-deep-green'}>
                        {status || 'Ready_'}
                    </span>
                </div>
            </div>

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a command..."
                        className="w-full bg-white text-deep-green pl-3 pr-10 py-3 rounded-xl border border-mint-200 focus:border-mint-400 focus:ring-1 focus:ring-mint-300 outline-none text-xs shadow-soft"
                    />
                    {/* Keyboard Enter Hint */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-bold border border-mint-200 px-1.5 rounded bg-mint-50">
                        ↵
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onToggleVoice}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isListening
                            ? 'bg-sky-100 text-sky-active border-sky-300 animate-pulse'
                            : 'bg-mint-50 text-mint-500 border-mint-300 hover:bg-mint-100 hover:text-mint-600'
                        }`}
                    title="Toggle Voice Control"
                >
                    <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </button>
            </form>
        </div>
    );
};

export default CommandConsole;
