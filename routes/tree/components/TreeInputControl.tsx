import React, { useState, useRef } from 'react';

interface TreeInputControlProps {
    onCommand: (text: string) => void;
    isProcessing: boolean;
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    voiceStatus: string;
}

const TreeInputControl: React.FC<TreeInputControlProps> = ({
    onCommand,
    isProcessing,
    isListening,
    onStartListening,
    onStopListening,
    voiceStatus
}) => {
    const [command, setCommand] = useState('');
    const [isCommandLoading, setIsCommandLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isProcessing || isCommandLoading) return;

        setIsCommandLoading(true);
        try {
            await onCommand(command);
            setCommand('');
        } catch (error) {
            console.error('Command error:', error);
        } finally {
            setIsCommandLoading(false);
        }
    };

    const handleMicClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        if (isListening) {
            onStopListening();
        } else {
            onStartListening();
        }
    };

    return (
        <div className="px-4 py-4 border-b border-mint-200 bg-gradient-to-r from-mint-50/50 to-sky-50/50">
            <form onSubmit={handleCommandSubmit} className="relative">
                <div className={`flex items-center bg-white rounded-xl border shadow-soft overflow-hidden focus-within:ring-2 focus-within:ring-mint-300 transition-all ${isListening ? 'ring-2 ring-mint-300 border-mint-400' : 'border-mint-200'}`}>

                    {/* Icon / Spinner */}
                    <div className="pl-3 text-slate-400">
                        {isCommandLoading ? (
                            <i className="fa-solid fa-circle-notch fa-spin text-mint-500 text-sm"></i>
                        ) : (
                            <i className="fa-solid fa-terminal text-sm"></i>
                        )}
                    </div>

                    {/* Text Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type command..."}
                        className="flex-1 px-3 py-2.5 bg-transparent text-sm text-deep-green placeholder-slate-400 outline-none min-w-0"
                        disabled={isProcessing || isCommandLoading}
                    />

                    {/* Mic Button */}
                    <button
                        type="button"
                        onClick={handleMicClick}
                        className={`p-2.5 mx-1 rounded-lg transition-all duration-300 ${isListening
                                ? 'bg-sky-active text-white shadow-active animate-pulse'
                                : 'text-slate-400 hover:text-mint-600 hover:bg-mint-50'
                            }`}
                        title={isListening ? "Stop Listening" : "Start Voice Command"}
                    >
                        <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-sm`}></i>
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!command.trim() || isProcessing || isCommandLoading}
                        className="p-2.5 pr-3 text-slate-400 hover:text-mint-600 disabled:opacity-40 transition-colors border-l border-mint-100"
                    >
                        <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                </div>

                {/* Status / Instructions */}
                <div className="flex justify-between items-center mt-1.5 ml-1">
                    <p className="text-[9px] text-slate-400 font-medium">
                        {voiceStatus ? (
                            <span className="text-mint-600 font-bold animate-pulse">{voiceStatus}</span>
                        ) : (
                            'e.g., "insert 50", "delete 10", "find max"'
                        )}
                    </p>
                </div>
            </form>
        </div>
    );
};

export default TreeInputControl;
