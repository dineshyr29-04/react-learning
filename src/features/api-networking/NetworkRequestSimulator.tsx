import React, { useState, useEffect, useRef } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { Network, Wifi, Send, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventMark {
  id: string;
  time: number; // millisecond timestamp relative to start
  type: 'keypress' | 'request';
  val?: string;
}

export const NetworkRequestSimulator: React.FC = () => {
  const { addLog } = useLearningStore();
  const [mode, setMode] = useState<'raw' | 'debounce' | 'throttle'>('raw');
  const [inputValue, setInputValue] = useState('');
  const [keypressEvents, setKeypressEvents] = useState<EventMark[]>([]);
  const [requestEvents, setRequestEvents] = useState<EventMark[]>([]);
  
  const [requestCount, setRequestCount] = useState(0);
  const [serverStatus, setServerStatus] = useState<'idle' | 'processing'>('idle');
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  
  const startRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleTimerRef = useRef<number | null>(null);

  const handleModeChange = (newMode: 'raw' | 'debounce' | 'throttle') => {
    setMode(newMode);
    startRef.current = Date.now();
    setKeypressEvents([]);
    setRequestEvents([]);
    setRequestCount(0);
    setServerLogs([]);
    setInputValue('');
  };

  useEffect(() => {
    addLog(`Network Simulator loaded in mode: ${mode.toUpperCase()}`, 'system');
  }, [mode, addLog]);

  const fireApiRequest = (val: string) => {
    const elapsed = Date.now() - startRef.current;
    
    // Animate Server receiving request
    setServerStatus('processing');
    setRequestCount(prev => prev + 1);
    
    // Add mark to Request timeline
    setRequestEvents(prev => [{ id: Math.random().toString(), time: elapsed, type: 'request', val }, ...prev]);
    
    // Log to simulated server
    const logStr = `GET /api/search?q=${encodeURIComponent(val)} [200 OK]`;
    setServerLogs(prev => [logStr, ...prev].slice(0, 8));
    addLog(`API Network Call fired: "${val}"`, 'success');

    setTimeout(() => {
      setServerStatus('idle');
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    const elapsed = Date.now() - startRef.current;
    
    // Track Keypress event
    setKeypressEvents(prev => [{ id: Math.random().toString(), time: elapsed, type: 'keypress' }, ...prev]);

    // Handle networking pipelines based on mode
    if (mode === 'raw') {
      fireApiRequest(val);
    } 
    else if (mode === 'debounce') {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = setTimeout(() => {
        fireApiRequest(val);
      }, 700); // 700ms debounce
    } 
    else if (mode === 'throttle') {
      if (!throttleTimerRef.current) {
        fireApiRequest(val);
        throttleTimerRef.current = window.setTimeout(() => {
          throttleTimerRef.current = null;
        }, 1000); // 1s throttle window
      } else {
        addLog(`Event throttled (within 1s lockout window)`, 'warn');
      }
    }
  };

  const handleClear = () => {
    setKeypressEvents([]);
    setRequestEvents([]);
    setRequestCount(0);
    setServerLogs([]);
    setInputValue('');
    startRef.current = Date.now();
    addLog('Cleared request graphs and timers.', 'warn');
  };

  const getMaxTime = () => {
    const events = [...keypressEvents, ...requestEvents];
    if (events.length === 0) return 10000;
    const maxVal = Math.max(...events.map(e => e.time));
    return Math.max(maxVal + 2000, 10000); // keep at least 10s width
  };

  const maxTime = getMaxTime();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Mode settings & Input trigger (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Network Controls">
          <div className="space-y-4 select-none">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleModeChange('raw')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all text-left ${
                  mode === 'raw'
                    ? 'bg-danger/20 border-danger text-rose-300 glow-danger'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                No Optimization (Raw Fetch)
                <span className="block text-[10px] opacity-75 font-normal mt-0.5">Sends query on every single keypress.</span>
              </button>
              <button
                onClick={() => handleModeChange('debounce')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all text-left ${
                  mode === 'debounce'
                    ? 'bg-success/20 border-success text-emerald-300 glow-success'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
              >
                Debounce (700ms Delay)
                <span className="block text-[10px] opacity-75 font-normal mt-0.5">Waits for user to pause typing before fetching.</span>
              </button>
              <button
                onClick={() => handleModeChange('throttle')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all text-left ${
                  mode === 'throttle'
                    ? 'bg-primary/20 border-primary text-indigo-300 glow-indigo'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Throttle (1000ms Lockout)
                <span className="block text-[10px] opacity-75 font-normal mt-0.5">Sends at most 1 query per second while typing.</span>
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
              <label className="text-xs text-zinc-400 font-bold block">TYPE RAPIDLY HERE TO TEST</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Start typing queries..."
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-primary text-zinc-200 text-xs px-3 py-2 rounded-lg font-mono outline-none shadow-inner"
              />
              <button
                onClick={handleClear}
                className="w-full py-1.5 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 font-semibold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 size={12} /> Clear Timelines
              </button>
            </div>
          </div>

          {/* Theoretical Summary */}
          <div className="mt-4 border-t border-zinc-800 pt-4 text-xs leading-relaxed text-zinc-400 select-text font-sans">
            {mode === 'raw' && (
              <span>⚠️ <b>Raw fetching</b> is highly inefficient. If a user types a 10-character query, you trigger 10 active HTTP queries, causing API server overload.</span>
            )}
            {mode === 'debounce' && (
              <span>✓ <b>Debounce</b> is excellent for autocompletion inputs. It holds queries until the user has stopped typing for a defined timeout window.</span>
            )}
            {mode === 'throttle' && (
              <span>✓ <b>Throttle</b> limits continuous updates (like track scrolling or typing). It executes at set intervals to guarantee periodic syncing.</span>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Ticker Graphs & Server Telemetry (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Real-Time Network Pipeline Timeline">
          <div className="flex-1 flex flex-col gap-6 py-2 min-h-[300px] select-none">
            
            {/* Timeline graphs (Keypress events track & API request track) */}
            <div className="space-y-4 bg-zinc-950 border border-zinc-900 p-4 rounded-xl relative shadow-inner">
              
              {/* Event track: Keypresses */}
              <div className="space-y-1 relative">
                <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider block">
                  KEYBOARD EVENT TICKS
                </span>
                <div className="h-10 w-full bg-black/45 border border-zinc-850 rounded-lg relative overflow-hidden flex items-center">
                  <div className="absolute right-2 font-mono text-[9px] text-zinc-600">INPUT</div>
                  {keypressEvents.map((evt) => {
                    const leftPct = (evt.time / maxTime) * 100;
                    return (
                      <motion.div
                        key={evt.id}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className="absolute w-0.5 h-6 bg-secondary"
                        style={{ left: `${leftPct}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Event track: API Requests */}
              <div className="space-y-1 relative">
                <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider block">
                  HTTP API CALLS FIRED
                </span>
                <div className="h-10 w-full bg-black/45 border border-zinc-850 rounded-lg relative overflow-hidden flex items-center">
                  <div className="absolute right-2 font-mono text-[9px] text-zinc-600">NETWORK</div>
                  {requestEvents.map((evt) => {
                    const leftPct = (evt.time / maxTime) * 100;
                    return (
                      <motion.div
                        key={evt.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute w-2 h-2 rounded-full bg-success glow-success flex items-center justify-center"
                        style={{ left: `${leftPct}%` }}
                        title={`GET "${evt.val}"`}
                      />
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Simulated Server Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Server HUD Node */}
              <div className="bg-[#09090b] border border-zinc-900 rounded-xl p-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden min-h-[140px]">
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <Wifi size={12} className={serverStatus === 'processing' ? 'text-success animate-pulse' : 'text-zinc-600'} />
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider">SIMULATED BACKEND SERVER</span>
                </div>
                
                <div className={`p-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                  serverStatus === 'processing' 
                    ? 'border-success/60 bg-success/10 text-success' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                }`}>
                  <Network size={28} className={serverStatus === 'processing' ? 'animate-bounce' : ''} />
                </div>
                
                <div className="text-center font-mono">
                  <div className="text-[11px] text-zinc-400">Total Requests Received</div>
                  <div className="text-lg font-bold text-zinc-100">{requestCount}</div>
                </div>
              </div>

              {/* Server Access Logs */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col min-h-[140px]">
                <div className="text-[10px] text-zinc-500 font-bold tracking-wider mb-2 flex items-center gap-1 font-mono">
                  <Send size={12} /> BACKEND NGINX REQUEST LOGS
                </div>
                <div className="flex-1 overflow-y-auto font-mono text-[10px] text-zinc-500 space-y-1 select-text">
                  {serverLogs.length === 0 ? (
                    <div className="italic text-zinc-700 py-6 text-center select-none">(Listening for connections...)</div>
                  ) : (
                    serverLogs.map((log, i) => (
                      <div key={i} className="py-0.5 px-2 bg-zinc-950 border border-zinc-900 rounded text-success">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </GlassCard>
      </div>

    </div>
  );
};
