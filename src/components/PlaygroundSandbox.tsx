import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Sparkles, Terminal, Eye
} from 'lucide-react';
import { useLearningStore } from '../store/learningStore';
import { theoryData } from '../data/theoryData';

interface PlaygroundSandboxProps {
  labId: string;
}

export const PlaygroundSandbox: React.FC<PlaygroundSandboxProps> = ({ labId }) => {
  const { learningMode, addLog } = useLearningStore();
  const theory = theoryData[labId];

  // Editor and simulation state
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  // Custom states for each interactive widget
  // 1. Intro states
  const [introMode, setIntroMode] = useState<'react' | 'javascript'>('react');
  const [introName, setIntroName] = useState('World');
  const [introFlashes, setIntroFlashes] = useState<{ react: boolean; javascript: boolean }>({ react: false, javascript: false });

  // 2. JSX states
  const [jsxName, setJsxName] = useState('John Doe');
  const [jsxStatus, setJsxStatus] = useState(true);

  // 3. Props states
  const [propName, setPropName] = useState('Alice');
  const [propRole, setPropRole] = useState('Senior Developer');
  const [propColor, setPropColor] = useState('purple');

  // 4. State/useState states
  const [count, setCount] = useState(0);
  const [stateMode, setStateMode] = useState<'direct' | 'functional'>('direct');
  const [updateQueue, setUpdateQueue] = useState<string[]>([]);
  const [stateFlashes, setStateFlashes] = useState(false);

  // 5. Effect states
  const [effectMounted, setEffectMounted] = useState(true);
  const [effectId, setEffectId] = useState('1');
  const [effectLogs, setEffectLogs] = useState<string[]>([]);
  const effectLogsEndRef = useRef<HTMLDivElement>(null);

  // 6. Custom hook states
  const [hookAOpen, setHookAOpen] = useState(false);
  const [hookBOpen, setHookBOpen] = useState(false);

  // 7. Context states
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [contextDrillMode, setContextDrillMode] = useState<'drilling' | 'context'>('context');
  const [drillLogs, setDrillLogs] = useState<{ provider: boolean; parent: boolean; child: boolean }>({
    provider: false,
    parent: false,
    child: false
  });

  // Load the initial code preset when labId or learningMode changes
  useEffect(() => {
    if (theory) {
      const modeData = learningMode === 'interview' ? theory.interview : theory[learningMode];
      setCode(modeData.codeExample);
      setConsoleOutput([]);
    }
  }, [labId, learningMode, theory]);

  // Handle run code trigger simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(['[System]: Compiling module...', '[System]: Checking syntax rules...', '[System]: Initializing Virtual DOM hooks...']);
    
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(prev => [
        ...prev,
        `[Success]: Compiled successfully!`,
        `[Render]: Component mounted successfully.`
      ]);
      addLog(`Ran sandbox compilation for: ${labId}`, 'success');
    }, 800);
  };

  // Reset to original preset
  const handleResetCode = () => {
    if (theory) {
      const modeData = learningMode === 'interview' ? theory.interview : theory[learningMode];
      setCode(modeData.codeExample);
      setConsoleOutput(['[System]: Reset code to preset values.']);
      addLog(`Reset sandbox code for: ${labId}`, 'info');
    }
  };

  // Log auto scrolling
  useEffect(() => {
    if (effectLogsEndRef.current) {
      effectLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [effectLogs]);

  // Custom simulation handlers
  // Intro trigger flash
  const triggerIntroFlash = (type: 'react' | 'javascript') => {
    setIntroFlashes(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setIntroFlashes(prev => ({ ...prev, [type]: false }));
    }, 450);
  };

  // useEffect triggers
  const addEffectLog = (msg: string) => {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    setEffectLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    if (labId === 'effect' && effectMounted) {
      addEffectLog(`🚀 Mount: useEffect() callback fired!`);
      addEffectLog(`🟢 Effect active for userId: ${effectId}`);
      return () => {
        addEffectLog(`🧹 Cleanup: running return callback (destroying listeners)`);
      };
    }
  }, [effectId, effectMounted, labId]);

  // Context simulation logger
  const triggerContextUpdate = () => {
    const isLight = themeMode === 'light';
    setThemeMode(isLight ? 'dark' : 'light');

    if (contextDrillMode === 'drilling') {
      // Highlights all elements in order
      setDrillLogs({ provider: true, parent: true, child: true });
      addLog('Prop Drilling: All components in path forced to re-render', 'warn');
      setTimeout(() => setDrillLogs({ provider: false, parent: false, child: false }), 600);
    } else {
      // Context: bypasses parent Layout component
      setDrillLogs({ provider: true, parent: false, child: true });
      addLog('Context API: Bypassed layout re-render, only Provider & Consumer updated!', 'success');
      setTimeout(() => setDrillLogs({ provider: false, parent: false, child: false }), 600);
    }
  };

  // State Batching count increments
  const handleStateIncrement = () => {
    setStateFlashes(true);
    setTimeout(() => setStateFlashes(false), 300);

    if (stateMode === 'direct') {
      setUpdateQueue(['count + 1', 'count + 1', 'count + 1']);
      // All three reference same count (snapshot values)
      setCount(prev => prev + 1);
      addLog('Direct Update: Scheduled count setter 3 times. State batches into a single render update.', 'warn');
    } else {
      setUpdateQueue(['prev => prev + 1', 'prev => prev + 1', 'prev => prev + 1']);
      // Queues callbacks sequentially
      setCount(prev => prev + 3);
      addLog('Functional Update: Scheduled 3 setter callbacks. Updates executed sequentially inside a single render frame.', 'success');
    }
  };

  // Render the interactive component preview depending on which lab is selected
  const renderPreviewWidget = () => {
    switch (labId) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="flex bg-black/40 border border-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setIntroMode('react')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  introMode === 'react'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Declarative (React VDOM)
              </button>
              <button
                onClick={() => setIntroMode('javascript')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  introMode === 'javascript'
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Imperative (Vanilla JS)
              </button>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <label className="text-[10px] text-zinc-500 font-bold block uppercase">Try mutating component State:</label>
              <input
                type="text"
                value={introName}
                onChange={(e) => {
                  setIntroName(e.target.value);
                  triggerIntroFlash(introMode);
                }}
                placeholder="Type name..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* React update visualizer */}
                <div 
                  className={`border p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                    introMode === 'react' ? 'bg-purple-950/10 border-purple-500/30' : 'opacity-40 border-zinc-800'
                  } ${introFlashes.react ? 'ring-1 ring-purple-500 scale-[1.02]' : ''}`}
                >
                  <span className="text-[9px] text-purple-400 font-mono font-bold mb-1">React VDOM Update</span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-300 animate-spin-slow">
                    ⚛️
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-100 mt-2">Hello, {introName}!</h3>
                  <span className="text-[8px] text-green-400 font-mono mt-2 bg-green-500/10 px-1.5 py-0.5 rounded">
                    Only text node updated
                  </span>
                </div>

                {/* Imperative update visualizer */}
                <div 
                  className={`border p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                    introMode === 'javascript' ? 'bg-amber-950/10 border-amber-500/30' : 'opacity-40 border-zinc-800'
                  } ${introFlashes.js ? 'ring-1 ring-amber-500 bg-amber-500/10 scale-[1.02]' : ''}`}
                >
                  <span className="text-[9px] text-amber-400 font-mono font-bold mb-1">Vanilla DOM Reset</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs text-amber-300">
                    📄
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-100 mt-2">Hello, {introName}!</h3>
                  <span className="text-[8px] text-amber-400 font-mono mt-2 bg-amber-500/10 px-1.5 py-0.5 rounded text-center">
                    Full component destroyed & remade
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'jsx':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <label className="text-[10px] text-zinc-500 font-bold block uppercase">Interactive Controls:</label>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  value={jsxName}
                  onChange={(e) => setJsxName(e.target.value)}
                  placeholder="Username"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                />
                
                <button
                  onClick={() => setJsxStatus(!jsxStatus)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    jsxStatus 
                      ? 'bg-green-600/15 border-green-500/30 text-green-400' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {jsxStatus ? 'Active: Online' : 'Inactive: Offline'}
                </button>
              </div>

              {/* Renders dynamic output */}
              <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/50 flex flex-col items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-mono font-semibold self-start">RENDERED VIEW</span>
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg">
                  👤
                </div>
                <h3 className="text-base font-bold text-zinc-100">{jsxName}</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  jsxStatus ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {jsxStatus ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Dynamic Compiler display */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-mono font-bold block mb-1">TRANSPILLED React.createElement() OUTPUT:</span>
                <pre className="text-[10px] font-mono text-purple-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {`_jsx("div", {
  className: "${jsxStatus ? 'active-user' : 'inactive'}",
  children: [
    _jsx("h2", { children: "${jsxName}" }),
    _jsx("p", { children: "${jsxStatus ? 'Online' : 'Offline'}" })
  ]
})`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'props':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <label className="text-[10px] text-zinc-500 font-bold block uppercase">Configure Props to Pass Down:</label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] text-zinc-500 block mb-1">name</span>
                  <input
                    type="text"
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block mb-1">role</span>
                  <select
                    value={propRole}
                    onChange={(e) => setPropRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Product Designer">Product Designer</option>
                    <option value="CTO / Architect">CTO / Architect</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-zinc-500 block mb-1">theme color class</span>
                <div className="flex gap-2">
                  {['purple', 'teal', 'rose'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPropColor(c)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border capitalize transition-all ${
                        propColor === c
                          ? `bg-${c}-500/20 text-${c}-300 border-${c}-500/50`
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Props rendering target */}
              <div className="border border-zinc-850 p-4 rounded-xl bg-zinc-950/20">
                <span className="text-[9px] text-zinc-500 font-mono block mb-3">CHILD CONTAINER RENDER OUT:</span>
                
                {/* Dynamically styled child component card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  propColor === 'purple' 
                    ? 'bg-purple-950/15 border-purple-500/30 shadow-purple-500/5 shadow-md' 
                    : propColor === 'teal'
                    ? 'bg-teal-950/15 border-teal-500/30 shadow-teal-500/5 shadow-md'
                    : 'bg-rose-950/15 border-rose-500/30 shadow-rose-500/5 shadow-md'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-200 border ${
                      propColor === 'purple' ? 'bg-purple-500/20 border-purple-500/40' : propColor === 'teal' ? 'bg-teal-500/20 border-teal-500/40' : 'bg-rose-500/20 border-rose-500/40'
                    }`}>
                      {propName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-zinc-100">{propName}</h4>
                      <p className="text-[10px] text-zinc-400">{propRole}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prop tag element output */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-mono font-bold block mb-1">JSX CALL:</span>
                <code className="text-[10px] font-mono text-amber-300">
                  {`<UserCard name="${propName}" role="${propRole}" theme="${propColor}" />`}
                </code>
              </div>
            </div>
          </div>
        );

      case 'state':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 font-bold block uppercase">Select State Setter Mode:</label>
                <div className="flex bg-black/40 border border-zinc-800 p-0.5 rounded-lg text-[9px] font-bold">
                  <button
                    onClick={() => setStateMode('direct')}
                    className={`px-2 py-1 rounded ${stateMode === 'direct' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`}
                  >
                    Direct
                  </button>
                  <button
                    onClick={() => setStateMode('functional')}
                    className={`px-2 py-1 rounded ${stateMode === 'functional' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`}
                  >
                    Functional
                  </button>
                </div>
              </div>

              <div className="border border-zinc-850 p-4 rounded-xl bg-zinc-950 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                {/* State flash animation indicator */}
                {stateFlashes && (
                  <div className="absolute inset-0 bg-purple-500/5 animate-pulse pointer-events-none" />
                )}
                
                <span className="text-[9px] text-zinc-500 font-mono self-start uppercase">State Simulator Output</span>
                
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono block">Current count state value:</span>
                  <div className="text-4xl font-extrabold text-zinc-100 tracking-tight font-mono">
                    {count}
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      setCount(c => c + 1);
                      setStateFlashes(true);
                      setTimeout(() => setStateFlashes(false), 200);
                      addLog('Single count updated (+1)', 'info');
                    }}
                    className="flex-1 py-2 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-750 rounded-xl"
                  >
                    +1 Increment
                  </button>
                  
                  <button
                    onClick={handleStateIncrement}
                    className="flex-1 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-500/10"
                  >
                    +3 Batch (Run 3x)
                  </button>
                </div>
              </div>

              {/* State updates trace logs */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between text-zinc-500 font-bold border-b border-zinc-900 pb-1">
                  <span>STATE TRANSACTION QUEUE</span>
                  <span className={stateMode === 'functional' ? 'text-green-400' : 'text-amber-400'}>
                    {stateMode === 'functional' ? 'Sequential Callbacks' : 'Merged Snapshots'}
                  </span>
                </div>
                {updateQueue.length > 0 ? (
                  <div className="space-y-1">
                    {updateQueue.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-purple-400">setCount({item})</span>
                        <span className="text-zinc-600">Pending Update {idx + 1}</span>
                      </div>
                    ))}
                    <div className="text-green-400 pt-1 border-t border-zinc-900 flex justify-between font-bold">
                      <span>Render Triggered:</span>
                      <span>Batch Flush</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-600 italic">Queue empty. Click a button to trigger transaction batches.</span>
                )}
              </div>
            </div>
          </div>
        );

      case 'effect':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={() => setEffectMounted(!effectMounted)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    effectMounted 
                      ? 'bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20' 
                      : 'bg-green-600/10 border-green-500/30 text-green-400 hover:bg-green-600/20'
                  }`}
                >
                  {effectMounted ? '❌ Unmount Component' : '🔌 Mount Component'}
                </button>
                
                <select
                  disabled={!effectMounted}
                  value={effectId}
                  onChange={(e) => setEffectId(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:outline-none disabled:opacity-40"
                >
                  <option value="1">Fetch User A (ID: 1)</option>
                  <option value="2">Fetch User B (ID: 2)</option>
                  <option value="3">Fetch User C (ID: 3)</option>
                </select>
              </div>

              {/* Renders active effect element visualizer */}
              <div className="border border-zinc-850 p-4 rounded-xl bg-zinc-950/30 flex flex-col items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-mono block self-start">MOUNTED COMPONENT TARGET</span>
                {effectMounted ? (
                  <div className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg animate-pulse-glow">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-mono text-zinc-300 font-semibold">UserSyncWidget (ID: {effectId})</span>
                    </div>
                    <span className="text-[10px] text-purple-400 font-mono font-bold">Synchronized</span>
                  </div>
                ) : (
                  <div className="text-zinc-600 text-xs italic py-4">Component is unmounted. Code is inactive.</div>
                )}
              </div>

              {/* Effect lifecycle visual timeline log */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-mono font-bold block mb-1.5 uppercase">Effect Lifecycle Timeline Logs:</span>
                <div className="max-h-28 overflow-y-auto font-mono text-[10px] space-y-1 text-zinc-400 custom-scrollbar">
                  {effectLogs.map((log, index) => (
                    <div key={index} className={`whitespace-pre-wrap ${
                      log.includes('Cleanup') ? 'text-amber-400' : log.includes('Mount') ? 'text-green-400' : 'text-purple-300'
                    }`}>
                      {log}
                    </div>
                  ))}
                  <div ref={effectLogsEndRef} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'custom-hooks':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <label className="text-[10px] text-zinc-500 font-bold block uppercase">Hook State Isolation Tester:</label>

              <div className="grid grid-cols-2 gap-3">
                {/* Component A */}
                <div className="border border-zinc-800 p-3 rounded-lg bg-zinc-950/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-zinc-500 font-bold">Component instance A</span>
                    <span className={`text-[8px] font-mono px-1.5 rounded ${hookAOpen ? 'bg-purple-500/10 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {hookAOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <button
                    onClick={() => setHookAOpen(!hookAOpen)}
                    className="w-full py-1.5 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-750 rounded-lg"
                  >
                    Toggle A
                  </button>
                </div>

                {/* Component B */}
                <div className="border border-zinc-800 p-3 rounded-lg bg-zinc-950/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-zinc-500 font-bold">Component instance B</span>
                    <span className={`text-[8px] font-mono px-1.5 rounded ${hookBOpen ? 'bg-purple-500/10 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {hookBOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <button
                    onClick={() => setHookBOpen(!hookBOpen)}
                    className="w-full py-1.5 text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-750 rounded-lg"
                  >
                    Toggle B
                  </button>
                </div>
              </div>

              {/* State isolated visualizer */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono text-[10px] space-y-2">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase border-b border-zinc-900 pb-1">
                  REACT HOOKS MEMORY SLOTS (SNAPSHOT):
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">useToggle (Slot A):</span>
                    <span className="text-purple-400">isOpen = {hookAOpen.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">useToggle (Slot B):</span>
                    <span className="text-purple-400">isOpen = {hookBOpen.toString()}</span>
                  </div>
                </div>
                <div className="text-[8px] text-zinc-600 leading-normal border-t border-zinc-900 pt-1.5 italic">
                  💡 Even though both call the same function, React allocates independent memory pointers to each instance. State variables are not shared.
                </div>
              </div>
            </div>
          </div>
        );

      case 'context':
        return (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 font-bold block uppercase">Select Architecture Mode:</label>
                
                <div className="flex bg-black/40 border border-zinc-800 p-0.5 rounded-lg text-[9px] font-bold">
                  <button
                    onClick={() => setContextDrillMode('drilling')}
                    className={`px-2 py-1 rounded ${contextDrillMode === 'drilling' ? 'bg-amber-600/15 text-amber-300' : 'text-zinc-500'}`}
                  >
                    Prop Drilling
                  </button>
                  <button
                    onClick={() => setContextDrillMode('context')}
                    className={`px-2 py-1 rounded ${contextDrillMode === 'context' ? 'bg-green-600/15 text-green-300' : 'text-zinc-500'}`}
                  >
                    Context API
                  </button>
                </div>
              </div>

              {/* Tree visualizer container */}
              <div className="border border-zinc-850 rounded-xl bg-zinc-950 p-4 flex flex-col items-center relative gap-2 select-none">
                <span className="text-[9px] text-zinc-500 font-mono self-start uppercase">COMPONENT RENDER HEATMAP</span>
                
                {/* Root Provider */}
                <div className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  drillLogs.provider ? 'bg-green-500/15 border-green-500 text-green-300 scale-105 shadow-md shadow-green-500/5' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}>
                  ThemeProvider (Provider)
                </div>

                <div className="w-0.5 h-4 bg-zinc-800" />

                {/* Intermediate Component */}
                <div className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  drillLogs.parent 
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 scale-105 shadow-md shadow-amber-500/5' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 opacity-60'
                }`}>
                  DashboardLayout (Intermediate)
                </div>

                <div className="w-0.5 h-4 bg-zinc-800" />

                {/* Leaf Consumer Component */}
                <div className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  drillLogs.child 
                    ? 'bg-green-500/15 border-green-500 text-green-300 scale-105 shadow-md shadow-green-500/5' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}>
                  ProfileCard (Consumer)
                </div>

                {/* Click action inside consumer */}
                <button
                  onClick={triggerContextUpdate}
                  className={`mt-4 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md border ${
                    themeMode === 'dark' 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800' 
                      : 'bg-zinc-100 border-zinc-300 text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  👤 Toggle Theme ({themeMode.toUpperCase()})
                </button>
              </div>

              {/* Rendering logic details */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono text-[9px] space-y-1.5">
                <div className="flex justify-between border-b border-zinc-900 pb-1 text-zinc-500 font-bold">
                  <span>RENDER PROFILER FLOW:</span>
                  <span>{contextDrillMode === 'context' ? 'OPTIMIZED' : 'WARN: CASCADE'}</span>
                </div>
                {contextDrillMode === 'context' ? (
                  <div className="text-green-400 space-y-1">
                    <div>✓ ThemeProvider state changed. Provider triggers update queue.</div>
                    <div>✓ ProfileCard runs useContext hook, triggers re-render.</div>
                    <div>✓ DashboardLayout (Intermediate) has NO prop changes. Skips rendering!</div>
                  </div>
                ) : (
                  <div className="text-amber-400 space-y-1">
                    <div>⚠️ ThemeProvider state changed. Passes prop to DashboardLayout.</div>
                    <div>⚠️ DashboardLayout receives new props, re-renders itself and its children.</div>
                    <div>⚠️ ProfileCard receives props, re-renders. (Unnecessary intermediate re-renders).</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-zinc-500 text-xs italic">Select a topic from the sidebar.</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full overflow-hidden">
      {/* Code Editor Column */}
      <div className="lg:col-span-7 flex flex-col h-full bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        {/* Editor tab bar */}
        <div className="h-10 border-b border-zinc-850 bg-black/40 px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="w-[1px] h-3 bg-zinc-800 mx-2" />
            <span className="text-[10px] text-zinc-400 font-bold font-mono flex items-center gap-1.5">
              <Sparkles size={11} className="text-purple-400" />
              App.jsx
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetCode}
              className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-all"
              title="Reset Code Preset"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-2.5 py-0.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/40 text-white font-extrabold text-[10px] rounded-md flex items-center gap-1 shadow-sm transition-all"
            >
              <Play size={10} />
              {isRunning ? 'Compiling...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Textarea code block input */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mock code editor margins */}
          <div className="w-10 bg-black/10 border-r border-zinc-900/60 font-mono text-[10px] text-zinc-700 py-4 flex flex-col items-center select-none space-y-0.5 text-right pr-2">
            {code.split('\n').map((_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-[11px] text-zinc-300 leading-relaxed custom-scrollbar selection:bg-purple-500/30 selection:text-white"
          />
        </div>

        {/* Sandbox Console logs outputs */}
        <div className="h-32 border-t border-zinc-850 bg-black/40 flex flex-col overflow-hidden">
          <div className="h-8 border-b border-zinc-850/50 bg-[#09090b] flex items-center px-4 gap-1.5 select-none shrink-0">
            <Terminal size={11} className="text-zinc-500" />
            <span className="text-[9px] text-zinc-500 font-bold font-mono tracking-wider">SANDBOX COMPILER CONSOLE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1 text-zinc-400 custom-scrollbar select-text">
            {consoleOutput.length > 0 ? (
              consoleOutput.map((log, i) => (
                <div key={i} className={
                  log.includes('[Success]') ? 'text-green-400 font-bold' : log.includes('[System]') ? 'text-zinc-500' : 'text-zinc-300'
                }>
                  {log}
                </div>
              ))
            ) : (
              <div className="text-zinc-600 italic">Console is inactive. Click "Run Code" above to check compile status.</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 flex flex-col h-full bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="h-10 border-b border-zinc-850 bg-black/40 px-4 flex items-center justify-between select-none">
          <span className="text-[10px] text-zinc-400 font-bold font-mono flex items-center gap-1.5">
            <Eye size={12} className="text-purple-400" />
            LIVE PREVIEW PRESETS
          </span>
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[8px] font-mono text-zinc-500 font-bold">READY</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-center">
          {renderPreviewWidget()}
        </div>
      </div>
    </div>
  );
};
