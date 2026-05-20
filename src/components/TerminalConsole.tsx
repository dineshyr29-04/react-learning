import React, { useRef, useEffect } from 'react';
import { useLearningStore } from '../store/learningStore';
import { Terminal, Trash2 } from 'lucide-react';

export const TerminalConsole: React.FC = () => {
  const { logs, clearLogs } = useLearningStore();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warn': return 'text-warning';
      case 'error': return 'text-danger font-semibold';
      case 'system': return 'text-accent-cyan';
      default: return 'text-zinc-300';
    }
  };

  const getLogPrefix = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warn': return '⚠';
      case 'error': return '✖';
      case 'system': return '⚙';
      default: return '❯';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] border border-border rounded-xl font-mono text-xs overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/40 text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-zinc-500" />
          <span className="font-semibold text-zinc-300 tracking-wider">SYSTEM CONSOLE</span>
        </div>
        <button 
          onClick={clearLogs}
          className="p-1 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-800"
          title="Clear console log"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Console Logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-zinc-600 flex items-center justify-center h-full italic">
            Console cleared. Listening for visualizer events...
          </div>
        ) : (
          [...logs].reverse().map((log) => (
            <div key={log.id} className="flex gap-2 leading-relaxed hover:bg-zinc-900/30 px-1 py-0.5 rounded">
              <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
              <span className={`select-none ${getLogStyle(log.type)}`}>
                {getLogPrefix(log.type)}
              </span>
              <span className={`flex-1 break-all ${getLogStyle(log.type)}`}>
                {log.text}
              </span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};
