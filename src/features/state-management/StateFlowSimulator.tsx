import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { Radio, Database, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const StateFlowSimulator: React.FC = () => {
  const { addLog } = useLearningStore();
  const [pattern, setPattern] = useState<'drilling' | 'context' | 'zustand'>('drilling');
  
  // Render counters for different nodes
  const [renderCount, setRenderCount] = useState<Record<string, number>>({
    app: 0,
    container: 0,
    sidebar: 0,
    content: 0,
    profile: 0,
    viewer: 0
  });

  const [activePaths, setActivePaths] = useState<string[]>([]);

  const handlePatternChange = (newPattern: 'drilling' | 'context' | 'zustand') => {
    setPattern(newPattern);
    setRenderCount({ app: 0, container: 0, sidebar: 0, content: 0, profile: 0, viewer: 0 });
    setActivePaths([]);
  };

  useEffect(() => {
    addLog(`State Flow Loaded Pattern: ${pattern.toUpperCase()}`, 'system');
  }, [pattern, addLog]);

  const triggerUpdate = (type: 'profile' | 'viewer') => {
    addLog(`State update triggered for value: ${type}`, 'info');

    setRenderCount((prev) => {
      const next = { ...prev };
      
      if (pattern === 'drilling') {
        // Prop drilling: app owns state. App rerenders, cascading downwards to container, sidebar/content, profile/viewer.
        next.app += 1;
        next.container += 1;
        
        if (type === 'profile') {
          next.sidebar += 1;
          next.profile += 1;
          setActivePaths(['app-container', 'container-sidebar', 'sidebar-profile']);
        } else {
          next.content += 1;
          next.viewer += 1;
          setActivePaths(['app-container', 'container-content', 'content-viewer']);
        }
        addLog('Prop Drilling: All intermediate parents forced to re-render to pass down state props.', 'error');
      } 
      
      else if (pattern === 'context') {
        // Context API: Provider at App. Intermediate skipped if memoized, but provider forces render.
        // Wait, standard Context causes App to render, which propagates down unless memoized. If context value changes, ALL consumers render.
        next.app += 1;
        next.profile += 1;
        next.viewer += 1;
        
        // If child components aren't memoized, intermediate nodes render too!
        next.container += 1;
        next.sidebar += 1;
        next.content += 1;
        
        setActivePaths(['app-profile', 'app-viewer']);
        addLog('Context API: All consumer components registered to Provider rerender upon value change.', 'warn');
      } 
      
      else if (pattern === 'zustand') {
        // Zustand: Bypasses react renders for app/containers. Subscribed consumers render directly.
        if (type === 'profile') {
          next.profile += 1;
          setActivePaths(['store-profile']);
        } else {
          next.viewer += 1;
          setActivePaths(['store-viewer']);
        }
        addLog('Zustand Selector: Directly connected store nodes render. Intermediate nodes skipped completely.', 'success');
      }

      return next;
    });

    // Reset active path highlight after animation
    setTimeout(() => {
      setActivePaths([]);
    }, 1000);
  };

  const getBorderColor = (nodeId: string) => {
    if (activePaths.some(p => p.includes(nodeId))) {
      return 'border-primary bg-primary/10 text-zinc-100 glow-indigo scale-105';
    }
    return 'border-zinc-900 bg-zinc-950/20 text-zinc-400';
  };

  const handleReset = () => {
    setRenderCount({ app: 0, container: 0, sidebar: 0, content: 0, profile: 0, viewer: 0 });
    addLog('Reset state counters.', 'warn');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Mode settings (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Architectures Selection">
          <div className="space-y-2 select-none">
            <button
              onClick={() => handlePatternChange('drilling')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold tracking-wide border transition-all ${
                pattern === 'drilling'
                  ? 'bg-danger/20 border-danger text-rose-300 glow-danger'
                  : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-0.5">
                <Radio size={14} className={pattern === 'drilling' ? 'text-danger' : 'text-zinc-500'} />
                Prop Drilling
              </div>
              <span className="block text-[10px] text-zinc-500 font-normal leading-normal">
                State passes level-by-level. Intermediates are forced to evaluate updates.
              </span>
            </button>

            <button
              onClick={() => handlePatternChange('context')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold tracking-wide border transition-all ${
                pattern === 'context'
                  ? 'bg-warning/20 border-warning text-amber-300 glow-warning'
                  : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-0.5">
                <RefreshCw size={14} className={pattern === 'context' ? 'text-warning animate-spin-slow' : 'text-zinc-500'} />
                Context API Provider
              </div>
              <span className="block text-[10px] text-zinc-500 font-normal leading-normal">
                Global broadcasts. Provider forces update check on all subscribers.
              </span>
            </button>

            <button
              onClick={() => handlePatternChange('zustand')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold tracking-wide border transition-all ${
                pattern === 'zustand'
                  ? 'bg-success/20 border-success text-emerald-300 glow-success'
                  : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-0.5">
                <Database size={14} className={pattern === 'zustand' ? 'text-success' : 'text-zinc-500'} />
                Zustand Store (Selectors)
              </div>
              <span className="block text-[10px] text-zinc-500 font-normal leading-normal">
                External store subscribing specific slices. Direct node triggers.
              </span>
            </button>
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4 flex flex-col gap-2">
            <button
              onClick={handleReset}
              className="py-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 font-semibold text-xs rounded-lg transition-colors"
            >
              Clear Render Metrics
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Schematic Layout (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Propagation & Rendertree Path Canvas">
          <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6 py-6 min-h-[340px] select-none relative">
            
            {/* Zustand External Warehouse Representation */}
            {pattern === 'zustand' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 bg-success/15 border border-success/35 text-success rounded-xl p-3 flex flex-col items-center gap-1 font-mono text-[10px]"
              >
                <div className="flex items-center gap-1 font-bold">
                  <Database size={12} />
                  ZUSTAND STORE
                </div>
                <span>state.profile = &quot;Alice&quot;</span>
                <span>state.viewer = 100</span>
              </motion.div>
            )}

            {/* Render Node Tree */}
            <div className="flex flex-col items-center gap-4">
              
              {/* App Node */}
              <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[130px] flex flex-col items-center transition-all duration-300 ${getBorderColor('app')}`}>
                <span className="font-bold">&lt;App /&gt;</span>
                <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.app}</span>
                {pattern !== 'zustand' && (
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => triggerUpdate('profile')} className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-[8px] border border-zinc-800 rounded font-bold">setProfile</button>
                    <button onClick={() => triggerUpdate('viewer')} className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-[8px] border border-zinc-800 rounded font-bold">setViewer</button>
                  </div>
                )}
              </div>

              <div className="h-4 w-0.5 bg-zinc-800" />

              {/* Layout Container */}
              <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[130px] flex flex-col items-center transition-all duration-300 ${getBorderColor('container')}`}>
                <span className="font-bold">&lt;Container /&gt;</span>
                <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.container}</span>
              </div>

              <div className="w-[200px] h-0.5 bg-zinc-800 flex justify-between">
                <div className="w-0.5 h-4 bg-zinc-800" />
                <div className="w-0.5 h-4 bg-zinc-800" />
              </div>

              {/* Sub Columns row */}
              <div className="flex gap-16">
                
                {/* Column 1: Sidebar */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[110px] flex flex-col items-center transition-all duration-300 ${getBorderColor('sidebar')}`}>
                    <span className="font-bold">&lt;Sidebar /&gt;</span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.sidebar}</span>
                  </div>
                  
                  <div className="h-4 w-0.5 bg-zinc-800" />

                  {/* Leaf Node: ProfileViewer */}
                  <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[110px] flex flex-col items-center transition-all duration-300 ${getBorderColor('profile')}`}>
                    <span className="font-bold flex items-center gap-1">
                      &lt;Profile /&gt;
                      {pattern === 'zustand' && <Zap size={10} className="text-success" />}
                    </span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.profile}</span>
                    {pattern === 'zustand' && (
                      <button onClick={() => triggerUpdate('profile')} className="mt-1.5 px-2 py-0.5 bg-success/20 hover:bg-success/30 text-[8px] text-success border border-success/35 rounded font-bold">
                        store.update()
                      </button>
                    )}
                  </div>
                </div>

                {/* Column 2: Content */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[110px] flex flex-col items-center transition-all duration-300 ${getBorderColor('content')}`}>
                    <span className="font-bold">&lt;Content /&gt;</span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.content}</span>
                  </div>

                  <div className="h-4 w-0.5 bg-zinc-800" />

                  {/* Leaf Node: ViewerCounter */}
                  <div className={`p-2.5 border rounded-lg font-mono text-xs min-w-[110px] flex flex-col items-center transition-all duration-300 ${getBorderColor('viewer')}`}>
                    <span className="font-bold flex items-center gap-1">
                      &lt;Viewer /&gt;
                      {pattern === 'zustand' && <Zap size={10} className="text-success" />}
                    </span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {renderCount.viewer}</span>
                    {pattern === 'zustand' && (
                      <button onClick={() => triggerUpdate('viewer')} className="mt-1.5 px-2 py-0.5 bg-success/20 hover:bg-success/30 text-[8px] text-success border border-success/35 rounded font-bold">
                        store.update()
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="border-t border-zinc-800 pt-4 font-mono text-[10px] text-zinc-500 select-none flex justify-between items-center">
            <div className="flex gap-4">
              <span>• Profile consumes state.profile</span>
              <span>• Viewer consumes state.viewer</span>
            </div>
            {pattern === 'drilling' && <span className="text-danger font-bold">PROPS PROPAGATING THROUGH INTERMEDIATES...</span>}
            {pattern === 'context' && <span className="text-warning font-bold">ALL CONTEXT SUBSCRIBERS FORCED TO RE-RENDER!</span>}
            {pattern === 'zustand' && <span className="text-success font-bold">ZUSTAND SLICE SELECTORS DIRECT UPDATES</span>}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
