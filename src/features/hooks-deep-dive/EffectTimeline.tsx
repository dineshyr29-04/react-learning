import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { RotateCcw, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EffectTimeline: React.FC = () => {
  const { addLog } = useLearningStore();
  const [count, setCount] = useState(0);
  const [hasDependency, setHasDependency] = useState(false); // empty vs [count]
  const [timelineStep, setTimelineStep] = useState<'idle' | 'render' | 'commit' | 'cleanup' | 'effect'>('idle');
  const [effectLogs, setEffectLogs] = useState<{ id: string; val: number; stale: boolean }[]>([]);
  const [capturedClosureVal, setCapturedClosureVal] = useState<number | null>(null);

  useEffect(() => {
    // Clear logs on mounts
    setEffectLogs([]);
    setCapturedClosureVal(null);
    setTimelineStep('idle');
    addLog(`Effect Timeline Loaded. Dependencies: ${hasDependency ? '[count]' : '[] (Empty)'}`, 'system');
  }, [hasDependency]);

  // Simulate Stale closure execution interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    // Set captured closure when effect runs
    setCapturedClosureVal(count);
    
    interval = setInterval(() => {
      // Check if closure value is stale compared to real state count
      const currentRealCount = count;
      const capturedVal = hasDependency ? currentRealCount : 0; // if empty array, captures initial value 0
      
      const isStale = capturedVal !== currentRealCount;
      
      setEffectLogs((prev) => [
        { id: Math.random().toString(), val: capturedVal, stale: isStale },
        ...prev
      ].slice(0, 10));

      if (isStale) {
        addLog(`Effect Tick: Read count as ${capturedVal} (STALE CLOSURE detected!)`, 'error');
      } else {
        addLog(`Effect Tick: Read count as ${capturedVal} (Healthy closure)`, 'success');
      }
    }, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasDependency ? count : null]); // Re-register interval ONLY if hasDependency is true and count changes

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    addLog(`Incremented state: count ➔ ${nextCount}. Starting Render/Commit.`, 'info');

    // Run Timeline sequence: Render ➔ Commit ➔ Cleanup ➔ Effect
    setTimelineStep('render');
    
    setTimeout(() => {
      setTimelineStep('commit');
      
      setTimeout(() => {
        // If dependency triggers update, run cleanup then effect
        if (hasDependency || count === 0) {
          setTimelineStep('cleanup');
          addLog('Running useEffect cleanup (previous effect dismantled).', 'warn');
          
          setTimeout(() => {
            setTimelineStep('effect');
            setCapturedClosureVal(nextCount);
            addLog('Executing useEffect callback (new closure registered).', 'success');
            
            setTimeout(() => {
              setTimelineStep('idle');
            }, 600);
          }, 800);
        } else {
          // No dependency, skip cleanup and effect
          addLog('Skip cleanup/effect: Dependency array has no changes.', 'info');
          setTimelineStep('idle');
        }
      }, 800);
    }, 800);
  };

  const getTimelineClass = (step: string) => {
    if (timelineStep === step) {
      switch (step) {
        case 'render': return 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]';
        case 'commit': return 'bg-accent-cyan border-accent-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]';
        case 'cleanup': return 'bg-danger border-danger text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]';
        case 'effect': return 'bg-success border-success text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
        default: return '';
      }
    }
    return 'border-zinc-800 bg-zinc-950/40 text-zinc-500';
  };

  const handleReset = () => {
    setCount(0);
    setEffectLogs([]);
    setCapturedClosureVal(0);
    setTimelineStep('idle');
    addLog('Reset count and timeline.', 'warn');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Dependency Controls & Timeline Step Panel (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Dependency Sandbox">
          <div className="space-y-4 select-none">
            <div className="flex gap-2">
              <button
                onClick={() => setHasDependency(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  !hasDependency
                    ? 'bg-danger/20 border-danger text-rose-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Missing Dependency: []
              </button>
              <button
                onClick={() => setHasDependency(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  hasDependency
                    ? 'bg-success/20 border-success text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Correct Dependency: [count]
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">React State (Live):</span>
                <span className="text-zinc-200 font-bold text-sm bg-zinc-900 px-2 py-0.5 rounded">
                  count = {count}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleIncrement}
                  disabled={timelineStep !== 'idle'}
                  className="flex-1 py-2 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary text-white text-xs font-bold rounded-lg transition-all"
                >
                  Increment State (Rerender)
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 rounded-lg"
                  title="Reset count"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Process Flow */}
          <div className="mt-6 border-t border-zinc-800 pt-4 space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider select-none">LIFECYCLE PIPELINE FLOW</h4>
            
            <div className="flex flex-col gap-2.5 font-mono text-xs select-none">
              <div className={`border p-2.5 rounded-lg flex items-center justify-between transition-all duration-350 ${getTimelineClass('render')}`}>
                <span>1. Render Phase (Call Component)</span>
                {timelineStep === 'render' && <Activity size={14} className="animate-pulse" />}
              </div>
              <div className={`border p-2.5 rounded-lg flex items-center justify-between transition-all duration-350 ${getTimelineClass('commit')}`}>
                <span>2. Commit Phase (DOM Update)</span>
                {timelineStep === 'commit' && <Activity size={14} className="animate-pulse" />}
              </div>
              <div className={`border p-2.5 rounded-lg flex items-center justify-between transition-all duration-350 ${getTimelineClass('cleanup')}`}>
                <span>3. Run Cleanups (Object.is check)</span>
                {timelineStep === 'cleanup' && <Activity size={14} className="animate-pulse" />}
              </div>
              <div className={`border p-2.5 rounded-lg flex items-center justify-between transition-all duration-350 ${getTimelineClass('effect')}`}>
                <span>4. Run Effect Callback</span>
                {timelineStep === 'effect' && <Activity size={14} className="animate-pulse" />}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visual Telemetry Closure & Timeline (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Closure Telemetry & Intervals">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 py-2 min-h-[300px]">
            
            {/* Closure Inspection Scope Box */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col relative overflow-hidden">
              <span className="text-[10px] text-zinc-500 font-bold tracking-wider select-none flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-purple" />
                CLOSURE ENVELOPE SNAPSHOT
              </span>
              
              <div className="flex-1 flex flex-col justify-center items-center gap-4 mt-4">
                <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center bg-black/40">
                  
                  {/* Inside closure */}
                  <span className="text-[10px] text-zinc-500 font-mono select-none">EFFECT CLOSURE</span>
                  <span className="font-mono text-xl font-bold text-accent-purple">
                    count: {capturedClosureVal ?? 0}
                  </span>
                  
                  {!hasDependency && count > 0 && (
                    <div className="absolute -bottom-2 bg-danger/10 border border-danger/30 text-danger text-[8px] font-bold px-2 py-0.5 rounded-full select-none flex items-center gap-0.5 animate-bounce">
                      <ShieldAlert size={10} /> STALE CLOSURE
                    </div>
                  )}
                </div>

                <div className="text-center font-sans text-[11px] text-zinc-400 select-text max-w-[240px]">
                  {!hasDependency ? (
                    <span>
                      Since the dependency is <code className="bg-zinc-900 px-1 rounded text-danger">[]</code>, the effect interval closure was defined once on mount and captured <b>count: 0</b>. It will never read count updates.
                    </span>
                  ) : (
                    <span>
                      The dependency is <code className="bg-zinc-900 px-1 rounded text-success">[count]</code>, so the interval is dismantled and re-registered on state change, capturing the current value: <b>{count}</b>.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interval execution tick timeline */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col relative overflow-hidden">
              <span className="text-[10px] text-zinc-500 font-bold tracking-wider select-none flex items-center gap-1.5">
                <Activity size={13} className="text-success" />
                INTERVAL EXECUTION TICKS (2000MS)
              </span>

              <div className="flex-1 overflow-y-auto mt-4 space-y-2 select-text pr-1 custom-scrollbar">
                <AnimatePresence>
                  {effectLogs.length === 0 ? (
                    <div className="text-zinc-700 italic font-mono text-[10px] text-center py-16 select-none">
                      (Awaiting interval ticks...)
                    </div>
                  ) : (
                    effectLogs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono ${
                          log.stale 
                            ? 'bg-danger/10 border-danger/20 text-rose-300' 
                            : 'bg-zinc-900/40 border-zinc-850 text-zinc-300'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {log.stale ? '❌ Stale Tick' : '✓ Active Tick'}
                        </span>
                        <span className="font-bold">
                          Read Value: {log.val}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>

    </div>
  );
};
