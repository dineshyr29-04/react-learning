import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { Shield, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const RerenderHeatmap: React.FC = () => {
  const { addLog } = useLearningStore();
  const [nodes, setNodes] = useState<Record<string, { name: string; memoized: boolean; renderCount: number; lastRerenderTime: number }>>({
    app: { name: 'App (Root)', memoized: false, renderCount: 0, lastRerenderTime: 0 },
    nav: { name: 'Navigation', memoized: false, renderCount: 0, lastRerenderTime: 0 },
    body: { name: 'MainDashboard', memoized: false, renderCount: 0, lastRerenderTime: 0 },
    chart: { name: 'ChartWidget', memoized: false, renderCount: 0, lastRerenderTime: 0 },
    table: { name: 'DataTable', memoized: false, renderCount: 0, lastRerenderTime: 0 }
  });

  const [referentialHookActive, setReferentialHookActive] = useState(false); // useCallback toggle
  const [profilerStats, setProfilerStats] = useState<{ label: string; renders: number }[]>([
    { label: 'App (Root)', renders: 0 },
    { label: 'Navigation', renders: 0 },
    { label: 'MainDashboard', renders: 0 },
    { label: 'ChartWidget', renders: 0 },
    { label: 'DataTable', renders: 0 }
  ]);

  useEffect(() => {
    addLog('Performance Profiler Heatmap loaded.', 'system');
  }, []);

  const triggerRerender = (startNodeId: string) => {
    addLog(`Rerender triggered at component: <${nodes[startNodeId].name}>`, 'info');
    
    const now = Date.now();
    const updatedNodes = { ...nodes };
    const queue = [startNodeId];
    const visited = new Set<string>();

    const componentRenders: string[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = updatedNodes[currentId];
      
      // Determine if this node rerenders
      let shouldRerender = true;

      // If it is not the source of render, check if it can be skipped via memoization
      if (currentId !== startNodeId) {
        // Find parent ID
        const parentId = Object.keys(updatedNodes).find(k => {
          if (k === 'app') return false;
          if (k === 'nav' || k === 'body') return 'app';
          if (k === 'chart' || k === 'table') return 'body';
          return false;
        });
        
        if (node.memoized) {
          // React.memo checks props.
          // If we have referential equality problems, React.memo fails!
          if (currentId === 'table' && !referentialHookActive) {
            shouldRerender = true;
            addLog(`DataTable is React.memo, but prop reference changed (callback recreation). Re-rendered!`, 'error');
          } else {
            shouldRerender = false;
            addLog(`Skipped re-render for: <${node.name}> (React.memo block)`, 'success');
          }
        }
      }

      if (shouldRerender) {
        node.renderCount += 1;
        node.lastRerenderTime = now;
        componentRenders.push(node.name);

        // Add children to queue
        if (currentId === 'app') {
          queue.push('nav', 'body');
        } else if (currentId === 'body') {
          queue.push('chart', 'table');
        }
      }
    }

    setNodes(updatedNodes);
    
    // Update Profiler output
    setProfilerStats(
      Object.keys(updatedNodes).map((k) => ({
        label: updatedNodes[k].name,
        renders: updatedNodes[k].renderCount
      }))
    );

    addLog(`Finished render cycle. Rendered components: [${componentRenders.join(', ')}]`, 'system');
  };

  const toggleMemo = (nodeId: string) => {
    setNodes((prev) => {
      const updated = { ...prev };
      updated[nodeId].memoized = !updated[nodeId].memoized;
      addLog(`Toggled React.memo for <${updated[nodeId].name}>: ${updated[nodeId].memoized ? 'ACTIVE' : 'INACTIVE'}`, 'warn');
      return updated;
    });
  };

  const handleResetProfiler = () => {
    setNodes((prev) => {
      const reset = { ...prev };
      Object.keys(reset).forEach(k => {
        reset[k].renderCount = 0;
        reset[k].lastRerenderTime = 0;
      });
      return reset;
    });
    setProfilerStats(prev => prev.map(p => ({ ...p, renders: 0 })));
    addLog('Profiler stats reset.', 'warn');
  };

  // Get color intensity depending on how recently it re-rendered
  const getHeatmapColor = (nodeId: string) => {
    const node = nodes[nodeId];
    if (!node) return 'bg-zinc-950/20';

    const timeDiff = Date.now() - node.lastRerenderTime;
    if (timeDiff < 600) {
      return 'bg-danger/25 border-danger text-rose-200 animate-pulse-glow'; // hot
    }
    
    if (node.renderCount === 0) return 'bg-zinc-950/25 border-zinc-850 text-zinc-400';
    if (node.renderCount < 3) return 'bg-success/15 border-success/40 text-emerald-300';
    return 'bg-warning/20 border-warning/50 text-amber-300'; // medium
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Settings & Optimization Toggles (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Memoization Dashboard">
          <div className="space-y-4 select-none">
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
              <span className="text-[11px] text-zinc-500 font-mono font-bold tracking-wider">PROP REFERENCE HAZARDS</span>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300">useCallback on table props:</span>
                <button
                  onClick={() => setReferentialHookActive(!referentialHookActive)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    referentialHookActive 
                      ? 'bg-success/20 border-success text-success' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {referentialHookActive ? 'ON (Stable ref)' : 'OFF (Stale ref)'}
                </button>
              </div>

              <div className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                If <b>useCallback</b> is OFF, App recreation of <code>onRowClick</code> callback defeats DataTable's React.memo block.
              </div>
            </div>

            {/* Memoize Nodes list */}
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2">
              <span className="text-[11px] text-zinc-500 font-mono font-bold tracking-wider">TOGGLE REACT.MEMO</span>
              {Object.keys(nodes).map((key) => (
                <div key={key} className="flex justify-between items-center bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded text-xs font-mono">
                  <span className="text-zinc-300">{nodes[key].name}</span>
                  <button
                    onClick={() => toggleMemo(key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      nodes[key].memoized 
                        ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/35' 
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-850'
                    }`}
                  >
                    {nodes[key].memoized ? 'MEMOIZED' : 'STANDARD'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleResetProfiler}
              className="w-full py-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              Reset Profiler Stats
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Component Tree Canvas Heatmap (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Rerender Heatmap Tree Canvas">
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6 min-h-[300px] select-none">
            
            {/* Tree Structure */}
            {/* Root Node: App */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => triggerRerender('app')}
                className={`px-4 py-2.5 border rounded-xl font-mono text-xs flex flex-col items-center cursor-pointer min-w-[130px] transition-all duration-300 shadow-md ${getHeatmapColor('app')}`}
              >
                <span className="font-bold flex items-center gap-1">
                  &lt;App /&gt;
                </span>
                <span className="text-[10px] opacity-75 mt-0.5">Renders: {nodes.app.renderCount}</span>
              </div>

              {/* Connecting lines downward */}
              <div className="h-6 w-0.5 bg-zinc-800" />
              <div className="w-[260px] h-0.5 bg-zinc-800 flex justify-between">
                <div className="w-0.5 h-6 bg-zinc-800" />
                <div className="w-0.5 h-6 bg-zinc-800" />
              </div>

              {/* Sub components row 1 */}
              <div className="flex gap-16">
                
                {/* Node: Navigation */}
                <div className="flex flex-col items-center">
                  <div 
                    onClick={() => triggerRerender('nav')}
                    className={`px-4 py-2.5 border rounded-xl font-mono text-xs flex flex-col items-center cursor-pointer min-w-[120px] transition-all duration-300 shadow-md relative ${getHeatmapColor('nav')}`}
                  >
                    <span className="font-bold">&lt;Navigation /&gt;</span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {nodes.nav.renderCount}</span>
                    {nodes.nav.memoized && (
                      <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-accent-purple text-zinc-100" title="Memoized Component">
                        <Shield size={10} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Node: MainDashboard */}
                <div className="flex flex-col items-center">
                  <div 
                    onClick={() => triggerRerender('body')}
                    className={`px-4 py-2.5 border rounded-xl font-mono text-xs flex flex-col items-center cursor-pointer min-w-[120px] transition-all duration-300 shadow-md relative ${getHeatmapColor('body')}`}
                  >
                    <span className="font-bold">&lt;Dashboard /&gt;</span>
                    <span className="text-[10px] opacity-75 mt-0.5">Renders: {nodes.body.renderCount}</span>
                    {nodes.body.memoized && (
                      <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-accent-purple text-zinc-100" title="Memoized Component">
                        <Shield size={10} />
                      </span>
                    )}
                  </div>

                  {/* Connecting lines downward */}
                  <div className="h-6 w-0.5 bg-zinc-800" />
                  <div className="w-[140px] h-0.5 bg-zinc-800 flex justify-between">
                    <div className="w-0.5 h-6 bg-zinc-800" />
                    <div className="w-0.5 h-6 bg-zinc-800" />
                  </div>

                  {/* Sub components row 2 */}
                  <div className="flex gap-8">
                    
                    {/* Node: ChartWidget */}
                    <div 
                      onClick={() => triggerRerender('chart')}
                      className={`px-3 py-2 border rounded-xl font-mono text-xs flex flex-col items-center cursor-pointer min-w-[100px] transition-all duration-300 shadow-md relative ${getHeatmapColor('chart')}`}
                    >
                      <span className="font-bold">&lt;ChartWidget /&gt;</span>
                      <span className="text-[10px] opacity-75 mt-0.5">Renders: {nodes.chart.renderCount}</span>
                      {nodes.chart.memoized && (
                        <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-accent-purple text-zinc-100">
                          <Shield size={10} />
                        </span>
                      )}
                    </div>

                    {/* Node: DataTable */}
                    <div 
                      onClick={() => triggerRerender('table')}
                      className={`px-3 py-2 border rounded-xl font-mono text-xs flex flex-col items-center cursor-pointer min-w-[100px] transition-all duration-300 shadow-md relative ${getHeatmapColor('table')}`}
                    >
                      <span className="font-bold">&lt;DataTable /&gt;</span>
                      <span className="text-[10px] opacity-75 mt-0.5">Renders: {nodes.table.renderCount}</span>
                      {nodes.table.memoized && (
                        <span className={`absolute -top-1.5 -right-1.5 p-0.5 rounded-full text-zinc-100 ${
                          !referentialHookActive ? 'bg-danger' : 'bg-accent-purple'
                        }`}>
                          {!referentialHookActive ? <ShieldAlert size={10} /> : <Shield size={10} />}
                        </span>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Profiler Stats Bar Grid */}
          <div className="border-t border-zinc-800 pt-4">
            <div className="text-xs text-zinc-400 font-bold mb-3 tracking-wider flex items-center justify-between select-none">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-success" />
                REACT PROFILER STATS LOG
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">Render Count telemetry</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {profilerStats.map((item) => (
                <div key={item.label} className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg text-center flex flex-col gap-1 select-text">
                  <span className="text-[10px] text-zinc-500 font-mono font-semibold truncate block">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold font-mono ${
                    item.renders === 0 
                      ? 'text-zinc-600' 
                      : item.renders > 4 
                      ? 'text-danger animate-pulse' 
                      : 'text-zinc-200'
                  }`}>
                    {item.renders} renders
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
