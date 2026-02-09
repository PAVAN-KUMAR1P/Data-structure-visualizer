
import React, { useRef, useEffect, useState } from 'react';
import { ListNode, ListKind } from '../../../types';
import { parseVoiceCommand, VoiceIntent } from '../../../services/voiceControl';

interface Props {
  nodes: ListNode[];
  explanation: string;
  listKind: ListKind;
  isProcessing: boolean;
  onCommand?: (text: string) => void;
}

const InfoPanel: React.FC<Props> = ({ nodes, explanation, listKind, isProcessing, onCommand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState('');
  const [isCommandLoading, setIsCommandLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [explanation]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing || isCommandLoading || !onCommand) return;

    setIsCommandLoading(true);
    try {
      // Delegate to parent handler
      await onCommand(command);
      setCommand('');
    } catch (error) {
      console.error('Command error:', error);
    } finally {
      setIsCommandLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-soft-lg border-r border-mint-200 w-full max-w-sm z-30 rounded-r-2xl">
      {/* 🌿 Header - Soft Mint Theme */}
      <div className="px-6 py-5 border-b border-mint-200 bg-mint-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-mint-400 flex items-center justify-center text-white shadow-soft">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div>
            <h3 className="text-sm font-black text-deep-green tracking-tight">Theory & Stats</h3>
            <span className="text-[10px] text-mint-600 font-bold uppercase tracking-widest">{listKind} Architecture</span>
          </div>
        </div>
      </div>

      {/* Command Input Section */}
      {onCommand && (
        <div className="px-4 py-4 border-b border-mint-200 bg-gradient-to-r from-mint-50/50 to-sky-50/50">
          <form onSubmit={handleCommandSubmit} className="relative">
            <div className="flex items-center bg-white rounded-xl border border-mint-200 shadow-soft overflow-hidden focus-within:ring-2 focus-within:ring-mint-300 focus-within:border-mint-400 transition-all">
              <div className="pl-3 text-slate-400">
                {isCommandLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-mint-500 text-sm"></i>
                ) : (
                  <i className="fa-solid fa-terminal text-sm"></i>
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type command..."
                className="flex-1 px-3 py-2.5 bg-transparent text-sm text-deep-green placeholder-slate-400 outline-none"
                disabled={isProcessing || isCommandLoading}
              />
              <button
                type="submit"
                disabled={!command.trim() || isProcessing || isCommandLoading}
                className="p-2.5 text-slate-400 hover:text-mint-600 disabled:opacity-40 transition-colors"
              >
                <i className="fa-solid fa-paper-plane text-sm"></i>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5 ml-1 font-medium">
              e.g., "insert 5", "delete head", "reverse"
            </p>
          </form>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Real-time Stats */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-mint-500"></i> List Properties
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-mint-50 p-3 rounded-2xl border border-mint-200 shadow-soft">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Length</p>
              <p className="text-xl font-black text-deep-green code-font">{nodes.length}</p>
            </div>
            <div className="bg-mint-50 p-3 rounded-2xl border border-mint-200 shadow-soft">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Circular</p>
              <p className="text-xl font-black text-deep-green code-font">{(listKind.startsWith('C')) ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </section>

        {/* AI Explanation */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-mint-500"></i> Step-by-Step Logic
          </h4>

          {isProcessing && !explanation ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyzing Pointers...</p>
            </div>
          ) : explanation ? (
            <div className="bg-white p-5 rounded-3xl border border-mint-200 shadow-soft animate-fade-in">
              <div className="text-xs text-slate-600 leading-relaxed space-y-3 font-medium">
                {explanation.split('\n').filter(l => l.trim()).map((line, i) => (
                  <p key={i} className="relative pl-4">
                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-mint-400 rounded-full"></span>
                    {line.replace(/^\*|\-|\d\./, '').trim()}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-mint-50/50 p-10 rounded-3xl border border-dashed border-mint-300 text-center">
              <i className="fa-solid fa-terminal text-mint-200 text-3xl mb-4"></i>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">Perform an operation to see logical breakdown</p>
            </div>
          )}
        </section>
      </div>

      <div className="p-6 bg-mint-50/40 border-t border-mint-200">
        <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-2xl border border-sky-200">
          <i className="fa-solid fa-lightbulb text-sky-active"></i>
          <p className="text-[10px] font-bold text-sky-700 leading-snug">
            Tip: Use the "Middle" analysis to see the Tortoise and Hare algorithm in action!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
