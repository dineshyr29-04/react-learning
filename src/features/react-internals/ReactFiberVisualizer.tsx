import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { Play, Pause, ChevronRight, RotateCcw, Link2 } from 'lucide-react';

interface FiberNodeInfo {
  id: string;
  tag: 'HostRoot' | 'FunctionComponent' | 'HostComponent';
  name: string;
  alternate?: string; // ID of alternate fiber
  child?: string;     // ID of first child
  sibling?: string;   // ID of sibling
  return?: string;    // ID of parent
  lanes: string;      // priority lanes
  flags: string;      // deletion, placement, update
  state?: string;     // memoized state
}

const FIBER_NODES: Record<string, FiberNodeInfo> = {
  root: { id: 'root', tag: 'HostRoot', name: 'FiberRootNode', child: 'app', lanes: 'NoLanes', flags: 'NoFlags' },
  app: { id: 'app', tag: 'FunctionComponent', name: 'App', return: 'root', child: 'header', sibling: 'footer', lanes: 'NoLanes', flags: 'NoFlags', state: '{ count: 0 }' },
  header: { id: 'header', tag: 'HostComponent', name: 'header', return: 'app', child: 'title', lanes: 'NoLanes', flags: 'NoFlags' },
  title: { id: 'title', tag: 'HostComponent', name: 'h1', return: 'header', lanes: 'NoLanes', flags: 'NoFlags', state: '"EngineLab"' },
  footer: { id: 'footer', tag: 'HostComponent', name: 'footer', return: 'app', child: 'copyright', lanes: 'NoLanes', flags: 'NoFlags' },
  copyright: { id: 'copyright', tag: 'HostComponent', name: 'span', return: 'footer', lanes: 'NoLanes', flags: 'NoFlags', state: '"© 2026"' }
};

interface TraversalStep {
  currentNodeId: string;
  phase: 'beginWork' | 'completeWork' | 'commit' | 'idle';
  desc: string;
  activeLanes: string;
  wipNodes: Record<string, FiberNodeInfo>;
  currentSwapped: boolean;
}

const TRAVERSAL_STEPS: TraversalStep[] = [
  {
    currentNodeId: '', phase: 'idle', desc: 'System Idle. Ready for state updates.', activeLanes: 'NoLanes',
    wipNodes: {}, currentSwapped: false
  },
  {
    currentNodeId: 'root', phase: 'beginWork', desc: 'Trigger State Update: Parent schedules Lane 1 (Sync). Clone FiberRoot to WorkInProgress.', activeLanes: 'SyncLane',
    wipNodes: { root: { ...FIBER_NODES.root, lanes: 'SyncLane' } }, currentSwapped: false
  },
  {
    currentNodeId: 'app', phase: 'beginWork', desc: 'beginWork(App): Re-evaluates App function component. Local state hook changes: count 0 ➔ 1. App alternate spawned. App is dirty.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'header', phase: 'beginWork', desc: 'beginWork(header): Re-renders header container element. Since header props did not change, React reuses children.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'title', phase: 'beginWork', desc: 'beginWork(h1): Leaf node reached. Checks content: "EngineLab".', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'title', phase: 'completeWork', desc: 'completeWork(h1): h1 complete. No pending children. Bubbles up to header.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'header', phase: 'completeWork', desc: 'completeWork(header): header container complete. Bubbles up to App. Checks App siblings next.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'footer', phase: 'beginWork', desc: 'beginWork(footer): Traverses App sibling footer. Props unchanged, sibling optimization kicks in.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'copyright', phase: 'beginWork', desc: 'beginWork(span): copyright leaf node reached.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'copyright', phase: 'completeWork', desc: 'completeWork(span): copyright complete. Bubbles up to footer.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'footer', phase: 'completeWork', desc: 'completeWork(footer): footer complete. Bubbles up to App.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'app', phase: 'completeWork', desc: 'completeWork(App): App finished. Flags are collected: App has Update flag.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'root', phase: 'completeWork', desc: 'completeWork(root): Entire WIP tree constructed. Ready to enter Commit Phase.', activeLanes: 'SyncLane',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'SyncLane' },
      app: { ...FIBER_NODES.app, lanes: 'SyncLane', flags: 'Update', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'SyncLane' },
      title: { ...FIBER_NODES.title, lanes: 'SyncLane' },
      footer: { ...FIBER_NODES.footer, lanes: 'SyncLane' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'SyncLane' }
    }, currentSwapped: false
  },
  {
    currentNodeId: 'root', phase: 'commit', desc: 'Commit Phase (Synchronous): Updates real DOM for components with flags (App state written to DOM). Swap Alternate pointer: WIP tree becomes the Current tree.', activeLanes: 'NoLanes',
    wipNodes: {
      root: { ...FIBER_NODES.root, lanes: 'NoLanes' },
      app: { ...FIBER_NODES.app, lanes: 'NoLanes', state: '{ count: 1 }' },
      header: { ...FIBER_NODES.header, lanes: 'NoLanes' },
      title: { ...FIBER_NODES.title, lanes: 'NoLanes' },
      footer: { ...FIBER_NODES.footer, lanes: 'NoLanes' },
      copyright: { ...FIBER_NODES.copyright, lanes: 'NoLanes' }
    }, currentSwapped: true
  }
];

export const ReactFiberVisualizer: React.FC = () => {
  const { addLog } = useLearningStore();
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const step = TRAVERSAL_STEPS[stepIdx] || TRAVERSAL_STEPS[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= TRAVERSAL_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800 / speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    addLog(`Fiber step loaded: ${step.phase.toUpperCase()} - ${step.currentNodeId || 'Root'}`, 'info');
  }, [stepIdx, addLog, step.phase, step.currentNodeId]);

  const handleTrigger = () => {
    setStepIdx(1);
    addLog('State update triggered in App component. Initializing WorkInProgress Fiber tree.', 'system');
  };

  const getNodeBorder = (nodeId: string, isWip: boolean) => {
    if (step.currentNodeId === nodeId && step.phase !== 'idle' && step.phase !== 'commit') {
      if (isWip) {
        return step.phase === 'beginWork' ? 'border-primary glow-indigo' : 'border-success glow-success';
      }
    }
    
    // Check if item is inside the WIP tree in this step
    if (isWip && step.wipNodes[nodeId]) {
      const wipNode = step.wipNodes[nodeId];
      if (wipNode.flags === 'Update') return 'border-amber-500/50';
      return 'border-zinc-800 bg-zinc-900/40';
    }
    
    return 'border-zinc-900 bg-zinc-950/20';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'beginWork': return 'text-primary bg-primary/10 border-primary/20';
      case 'completeWork': return 'text-success bg-success/10 border-success/20';
      case 'commit': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-zinc-500 bg-zinc-900 border-zinc-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Traversal Logs & Control Details (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Fiber Traversal WorkLoop">
          <div className="flex flex-col gap-3 select-none">
            <button
              onClick={handleTrigger}
              disabled={stepIdx > 0}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-lg disabled:opacity-40 disabled:hover:bg-primary transition-all"
            >
              Trigger count++ State Update
            </button>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setStepIdx(0)}
                className="py-1.5 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={12} /> Reset Loop
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={stepIdx === 0}
                className={`py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-40 ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-success hover:bg-success-hover'
                }`}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? 'Pause' : 'Play Loop'}
              </button>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-zinc-900 pt-3 text-[11px] text-zinc-500">
              <span>Execution Speed</span>
              <button 
                onClick={() => setSpeed(prev => prev === 1 ? 2 : 1)}
                className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-semibold text-zinc-300"
              >
                {speed}x speed
              </button>
            </div>

            {stepIdx > 0 && (
              <button
                onClick={() => setStepIdx(prev => Math.min(TRAVERSAL_STEPS.length - 1, prev + 1))}
                disabled={stepIdx === TRAVERSAL_STEPS.length - 1}
                className="w-full mt-1 py-2 border border-zinc-800 text-zinc-200 hover:bg-zinc-900 disabled:opacity-40 rounded-lg flex items-center justify-center text-xs font-semibold gap-1"
              >
                Step Fiber Work Loop <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4 space-y-4 select-text">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-400 tracking-wider">SCHEDULER STATUS</h4>
              <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold tracking-wider ${getPhaseColor(step.phase)}`}>
                {step.phase.toUpperCase()}
              </span>
            </div>
            
            <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-lg space-y-2">
              <div className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                Scheduler Details:
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="bg-[#09090b] border border-zinc-900 p-3 rounded-lg text-[10px] space-y-1.5 font-mono text-zinc-500">
              <div className="font-bold text-zinc-400 select-none mb-1 flex items-center gap-1">
                <Link2 size={12} /> Traversal Legend:
              </div>
              <div>• child: Ptr to first child component</div>
              <div>• sibling: Ptr to adjacent sibling</div>
              <div>• return: Ptr back to parent element</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visual representation of Double Buffering trees (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Dual-Buffer Fiber Architecture Canvas">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start py-4 h-full relative">
            
            {/* Current Tree (On Screen) */}
            <div className="flex flex-col items-center bg-black/40 border border-zinc-900 p-4 rounded-xl shadow-inner relative h-full min-h-[360px]">
              <span className="text-[10px] text-zinc-500 font-bold absolute top-3 left-4 tracking-wider select-none flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${step.currentSwapped ? 'bg-success' : 'bg-primary'}`} />
                CURRENT TREE (ON SCREEN DOM)
              </span>
              
              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                {/* Node: root */}
                <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[130px] flex flex-col transition-all duration-300 ${getNodeBorder('root', false)}`}>
                  <div className="flex justify-between font-bold text-zinc-200">
                    <span>HostRoot</span>
                    <span className="text-zinc-500">#root</span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 border-t border-zinc-900 pt-1">
                    lanes: NoLanes
                  </div>
                </div>

                {/* Node: app */}
                <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[130px] flex flex-col transition-all duration-300 ${getNodeBorder('app', false)}`}>
                  <div className="flex justify-between font-bold text-zinc-200">
                    <span>App</span>
                    <span className="text-zinc-500">#app</span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 border-t border-zinc-900 pt-1">
                    state: {step.currentSwapped ? '{ count: 1 }' : '{ count: 0 }'}
                  </div>
                </div>

                <div className="flex gap-4 w-full justify-center">
                  {/* Node: header */}
                  <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[100px] flex flex-col transition-all duration-300 ${getNodeBorder('header', false)}`}>
                    <span className="font-bold text-zinc-200">header</span>
                    <span className="text-[9px] text-zinc-500">#header</span>
                  </div>

                  {/* Node: footer */}
                  <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[100px] flex flex-col transition-all duration-300 ${getNodeBorder('footer', false)}`}>
                    <span className="font-bold text-zinc-200">footer</span>
                    <span className="text-[9px] text-zinc-500">#footer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Work In Progress Tree (In Memory) */}
            <div className="flex flex-col items-center bg-black/40 border border-zinc-900 p-4 rounded-xl shadow-inner relative h-full min-h-[360px]">
              <span className="text-[10px] text-zinc-500 font-bold absolute top-3 left-4 tracking-wider select-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                WORK IN PROGRESS TREE (IN MEMORY)
              </span>

              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                {/* Node: root */}
                <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[130px] flex flex-col transition-all duration-300 ${getNodeBorder('root', true)}`}>
                  <div className="flex justify-between font-bold text-zinc-200">
                    <span>HostRoot</span>
                    <span className="text-zinc-500">#root</span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 border-t border-zinc-900 pt-1">
                    lanes: {step.wipNodes.root ? step.wipNodes.root.lanes : 'NoLanes'}
                  </div>
                </div>

                {/* Node: app */}
                <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[130px] flex flex-col transition-all duration-300 ${getNodeBorder('app', true)}`}>
                  <div className="flex justify-between font-bold text-zinc-200">
                    <span>App</span>
                    <span className="text-zinc-500">#app</span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 border-t border-zinc-900 pt-1 flex justify-between">
                    <span>state: {step.wipNodes.app ? step.wipNodes.app.state : '(none)'}</span>
                    {step.wipNodes.app?.flags && (
                      <span className="text-amber-500 font-bold font-sans text-[8px] tracking-wide">
                        {step.wipNodes.app.flags}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 w-full justify-center">
                  {/* Node: header */}
                  <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[100px] flex flex-col transition-all duration-300 ${getNodeBorder('header', true)}`}>
                    <span className="font-bold text-zinc-200">header</span>
                    <span className="text-[9px] text-zinc-500">#header</span>
                  </div>

                  {/* Node: footer */}
                  <div className={`p-2.5 border rounded-lg font-mono text-[10px] min-w-[100px] flex flex-col transition-all duration-300 ${getNodeBorder('footer', true)}`}>
                    <span className="font-bold text-zinc-200">footer</span>
                    <span className="text-[9px] text-zinc-500">#footer</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center select-none text-[10px] text-zinc-500">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-primary" /> Active beginWork
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-success" /> Active completeWork
              </span>
            </div>
            {step.phase === 'commit' && (
              <span className="text-success font-bold animate-pulse">SWAP POINTERS TRIGGERED - SCREEN UPDATED!</span>
            )}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
