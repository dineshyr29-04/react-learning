import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const RenderingFlow: React.FC = () => {
  const { addLog } = useLearningStore();
  const [activeStep, setActiveStep] = useState<'idle' | 'trigger' | 'render' | 'commit' | 'paint'>('idle');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    addLog('React Rendering Pipeline Simulator loaded.', 'system');
  }, []);

  const triggerPipeline = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    addLog(`Pipeline Triggered! state.count updated: ${clickCount} ➔ ${nextCount}`, 'info');
    
    // Step-by-step pipeline progression
    setActiveStep('trigger');
    
    setTimeout(() => {
      setActiveStep('render');
      addLog('Render Phase: Component render functions called. React builds Virtual DOM elements.', 'info');
      
      setTimeout(() => {
        setActiveStep('commit');
        addLog('Commit Phase: React mutated physical DOM references (inserted/updated node values).', 'warn');
        
        setTimeout(() => {
          setActiveStep('paint');
          addLog('Browser Paint: OS recalculates styles, coordinates layouts, and renders pixels.', 'success');
          
          setTimeout(() => {
            setActiveStep('idle');
          }, 800);
        }, 1000);
      }, 1000);
    }, 800);
  };

  const getStepStyle = (step: string) => {
    if (activeStep === step) {
      switch (step) {
        case 'trigger': return 'border-primary bg-primary/20 text-indigo-200 glow-indigo font-bold scale-105';
        case 'render': return 'border-accent-purple bg-accent-purple/20 text-purple-200 glow-purple font-bold scale-105';
        case 'commit': return 'border-warning bg-warning/20 text-amber-200 glow-warning font-bold scale-105';
        case 'paint': return 'border-success bg-success/20 text-emerald-200 glow-success font-bold scale-105';
        default: return 'border-zinc-800 text-zinc-500';
      }
    }
    return 'border-zinc-900 bg-zinc-950/20 text-zinc-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Settings & Info (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Interactive Controls">
          <div className="space-y-4 select-none">
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
              <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">PIPELINE TRIGGERS</span>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-300">Component State:</span>
                <span className="text-xs font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded text-primary">
                  count = {clickCount}
                </span>
              </div>

              <button
                onClick={triggerPipeline}
                disabled={activeStep !== 'idle'}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-lg transition-all"
              >
                <RefreshCw size={14} className={activeStep !== 'idle' ? 'animate-spin' : ''} />
                Trigger State Change (count++)
              </button>
            </div>

            <div className="bg-[#09090b] border border-zinc-900 p-4 rounded-xl text-xs text-zinc-400 space-y-2 select-text">
              <span className="font-bold text-zinc-300 block select-none">Phase Explanation:</span>
              <p>• <b>Trigger</b>: Occurs when state hooks mutate or parents re-render.</p>
              <p>• <b>Render</b>: React evaluates JSX and performs VDOM checks. (Interruptible)</p>
              <p>• <b>Commit</b>: DOM insertions are flushed. (Synchronous)</p>
              <p>• <b>Paint</b>: Browser screen updates layout pixels.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visual Pipeline Canvas (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Rendering Pipeline Flowpath Canvas">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8 min-h-[300px] select-none">
            
            {/* Visual Pipeline Loop */}
            <div className="flex flex-col md:flex-row items-center gap-4 font-mono text-xs w-full max-w-[620px]">
              
              {/* Box 1: Trigger */}
              <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[90px] transition-all duration-300 ${getStepStyle('trigger')}`}>
                <span className="font-bold">1. TRIGGER</span>
                <span className="text-[9px] opacity-75 text-center">State Change Scheduled</span>
              </div>

              <ArrowRight className="text-zinc-700 hidden md:block" />

              {/* Box 2: Render */}
              <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[90px] transition-all duration-300 ${getStepStyle('render')}`}>
                <span className="font-bold">2. RENDER</span>
                <span className="text-[9px] opacity-75 text-center">VDOM Diffing Calculations</span>
              </div>

              <ArrowRight className="text-zinc-700 hidden md:block" />

              {/* Box 3: Commit */}
              <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[90px] transition-all duration-300 ${getStepStyle('commit')}`}>
                <span className="font-bold">3. COMMIT</span>
                <span className="text-[9px] opacity-75 text-center">DOM Element Mutation</span>
              </div>

              <ArrowRight className="text-zinc-700 hidden md:block" />

              {/* Box 4: Paint */}
              <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[90px] transition-all duration-300 ${getStepStyle('paint')}`}>
                <span className="font-bold">4. PAINT</span>
                <span className="text-[9px] opacity-75 text-center">OS Screen Repaint Frame</span>
              </div>

            </div>

            {/* Simulated browser screen output */}
            <div className="mt-8 w-full max-w-[400px] border border-zinc-900 bg-black/40 rounded-xl p-4 flex flex-col gap-2 relative shadow-inner">
              <span className="text-[9px] text-zinc-600 font-bold absolute top-2.5 left-4">BROWSER SCREEN PORT</span>
              <div className="flex items-center gap-1.5 absolute top-2.5 right-4">
                <span className="w-2 h-2 rounded-full bg-danger" />
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="w-2 h-2 rounded-full bg-success" />
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                {activeStep === 'paint' ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center font-mono text-success text-xs font-bold flex flex-col items-center gap-1"
                  >
                    <span className="w-2.5 h-2.5 bg-success rounded-full animate-ping" />
                    SCREEN REDRAW COMPLETED!
                  </motion.div>
                ) : (
                  <div className="text-center font-mono text-zinc-600 text-xs">
                    State = {clickCount} (Ready)
                  </div>
                )}
              </div>
            </div>

          </div>
        </GlassCard>
      </div>

    </div>
  );
};
