import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { Play, Pause, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventLoopStep {
  desc: string;
  callStack: string[];
  webApis: { id: string; name: string; duration?: string }[];
  microtasks: string[];
  macrotasks: string[];
  consoleOut: string[];
  highlightLine: number;
  isRendering: boolean;
  loopPosition: number; // degrees for loop pointer
}

const PRESETS = {
  standard: {
    name: 'setTimeout vs Promise (Standard)',
    code: [
      `console.log("1. Start");`,
      `setTimeout(() => {`,
      `  console.log("2. Timeout");`,
      `}, 0);`,
      `Promise.resolve().then(() => {`,
      `  console.log("3. Promise");`,
      `});`,
      `console.log("4. End");`
    ],
    steps: [
      {
        desc: 'Initial State: Script is ready to run.',
        callStack: [], webApis: [], microtasks: [], macrotasks: [], consoleOut: [],
        highlightLine: -1, isRendering: false, loopPosition: 0
      },
      {
        desc: 'Line 1: console.log("1. Start") enters Call Stack.',
        callStack: ['console.log("1. Start")'], webApis: [], microtasks: [], macrotasks: [], consoleOut: [],
        highlightLine: 0, isRendering: false, loopPosition: 0
      },
      {
        desc: 'Line 1 executes: "1. Start" is printed to console. Stack is popped.',
        callStack: [], webApis: [], microtasks: [], macrotasks: [], consoleOut: ['1. Start'],
        highlightLine: 0, isRendering: false, loopPosition: 30
      },
      {
        desc: 'Line 2: setTimeout enters Call Stack.',
        callStack: ['setTimeout(fn, 0)'], webApis: [], microtasks: [], macrotasks: [], consoleOut: ['1. Start'],
        highlightLine: 1, isRendering: false, loopPosition: 30
      },
      {
        desc: 'Line 2 executes: Timer registered in Web API. Stack is popped.',
        callStack: [], webApis: [{ id: 't1', name: 'Timer (0ms)' }], microtasks: [], macrotasks: [], consoleOut: ['1. Start'],
        highlightLine: 3, isRendering: false, loopPosition: 60
      },
      {
        desc: 'Web API Timer resolves instantly, pushing callback to Callback (Macrotask) Queue.',
        callStack: [], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start'],
        highlightLine: 3, isRendering: false, loopPosition: 90
      },
      {
        desc: 'Line 5: Promise.resolve().then() enters Call Stack.',
        callStack: ['Promise.then()'], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start'],
        highlightLine: 4, isRendering: false, loopPosition: 90
      },
      {
        desc: 'Line 5 executes: Microtask callback pushed to Microtask Queue. Stack is popped.',
        callStack: [], webApis: [], microtasks: ['cb: Promise'], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start'],
        highlightLine: 6, isRendering: false, loopPosition: 120
      },
      {
        desc: 'Line 8: console.log("4. End") enters Call Stack.',
        callStack: ['console.log("4. End")'], webApis: [], microtasks: ['cb: Promise'], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start'],
        highlightLine: 7, isRendering: false, loopPosition: 120
      },
      {
        desc: 'Line 8 executes: "4. End" is printed to console. Stack is popped.',
        callStack: [], webApis: [], microtasks: ['cb: Promise'], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End'],
        highlightLine: 7, isRendering: false, loopPosition: 150
      },
      {
        desc: 'Call Stack is empty. Event Loop ticks. Checks and prioritizes Microtask Queue.',
        callStack: [], webApis: [], microtasks: ['cb: Promise'], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End'],
        highlightLine: -1, isRendering: false, loopPosition: 180
      },
      {
        desc: 'Pops "cb: Promise" from Microtask Queue, pushes callback code to Call Stack.',
        callStack: ['console.log("3. Promise")'], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End'],
        highlightLine: 5, isRendering: false, loopPosition: 200
      },
      {
        desc: 'Executes promise callback: "3. Promise" printed to console. Stack popped.',
        callStack: [], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End', '3. Promise'],
        highlightLine: 5, isRendering: false, loopPosition: 220
      },
      {
        desc: 'Microtask Queue is empty. Event Loop ticks. Checks if browser frame needs update.',
        callStack: [], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End', '3. Promise'],
        highlightLine: -1, isRendering: true, loopPosition: 270
      },
      {
        desc: 'Browser Paint completed. Event Loop ticks to Callback (Macrotask) Queue.',
        callStack: [], webApis: [], microtasks: [], macrotasks: ['cb: Timeout'], consoleOut: ['1. Start', '4. End', '3. Promise'],
        highlightLine: -1, isRendering: false, loopPosition: 300
      },
      {
        desc: 'Pops "cb: Timeout" from Macrotask Queue, pushes callback code to Call Stack.',
        callStack: ['console.log("2. Timeout")'], webApis: [], microtasks: [], macrotasks: [], consoleOut: ['1. Start', '4. End', '3. Promise'],
        highlightLine: 2, isRendering: false, loopPosition: 330
      },
      {
        desc: 'Executes timeout callback: "2. Timeout" printed. Stack popped. Execution finishes.',
        callStack: [], webApis: [], microtasks: [], macrotasks: [], consoleOut: ['1. Start', '4. End', '3. Promise', '2. Timeout'],
        highlightLine: 2, isRendering: false, loopPosition: 360
      }
    ]
  },
  starvation: {
    name: 'Microtask Starvation (UI Freeze)',
    code: [
      `function block() {`,
      `  Promise.resolve().then(block);`,
      `}`,
      `block();`,
      `setTimeout(() => {`,
      `  console.log("Will not run!");`,
      `}, 0);`
    ],
    steps: [
      {
        desc: 'Initial State: Starvation script loaded.',
        callStack: [], webApis: [], microtasks: [], macrotasks: [], consoleOut: [],
        highlightLine: -1, isRendering: false, loopPosition: 0
      },
      {
        desc: 'Line 4: block() is called, enters Call Stack.',
        callStack: ['block()'], webApis: [], microtasks: [], macrotasks: [], consoleOut: [],
        highlightLine: 3, isRendering: false, loopPosition: 30
      },
      {
        desc: 'Inside block(): Promise.resolve().then(block) queues microtask.',
        callStack: ['block()'], webApis: [], microtasks: ['block()'], macrotasks: [], consoleOut: [],
        highlightLine: 1, isRendering: false, loopPosition: 60
      },
      {
        desc: 'block() finishes, pops Call Stack. Call stack is briefly empty.',
        callStack: [], webApis: [], microtasks: ['block()'], macrotasks: [], consoleOut: [],
        highlightLine: 2, isRendering: false, loopPosition: 90
      },
      {
        desc: 'Line 5: setTimeout is called, registers timer.',
        callStack: ['setTimeout()'], webApis: [], microtasks: ['block()'], macrotasks: [], consoleOut: [],
        highlightLine: 4, isRendering: false, loopPosition: 120
      },
      {
        desc: 'Timer resolves, pushes callback to Macrotask Queue.',
        callStack: [], webApis: [], microtasks: ['block()'], macrotasks: ['cb: Will not run'], consoleOut: [],
        highlightLine: 6, isRendering: false, loopPosition: 150
      },
      {
        desc: 'Call stack is empty. Event Loop drains Microtask Queue. Pops block() into stack.',
        callStack: ['block()'], webApis: [], microtasks: [], macrotasks: ['cb: Will not run'], consoleOut: [],
        highlightLine: 0, isRendering: false, loopPosition: 180
      },
      {
        desc: 'Executing block() again: queues another block() microtask.',
        callStack: ['block()'], webApis: [], microtasks: ['block()'], macrotasks: ['cb: Will not run'], consoleOut: [],
        highlightLine: 1, isRendering: false, loopPosition: 210
      },
      {
        desc: 'Pops finished block(). Microtask Queue still contains block().',
        callStack: [], webApis: [], microtasks: ['block()'], macrotasks: ['cb: Will not run'], consoleOut: [],
        highlightLine: 2, isRendering: false, loopPosition: 240
      },
      {
        desc: 'Event Loop must drain all microtasks. Pops new block() back into stack. LOOP INFINITELY STUCK!',
        callStack: ['block()'], webApis: [], microtasks: [], macrotasks: ['cb: Will not run'], consoleOut: [],
        highlightLine: 0, isRendering: false, loopPosition: 270
      },
      {
        desc: 'Warning: Event Loop is stuck in microtask queue. Browser rendering is blocked, causing UI freeze.',
        callStack: ['block()'], webApis: [], microtasks: ['block()'], macrotasks: ['cb: Will not run'], consoleOut: ['⚠️ ENGINE WARNING: UI Frozen!'],
        highlightLine: 1, isRendering: false, loopPosition: 270
      }
    ]
  }
};

export const EventLoopSimulator: React.FC = () => {
  const { addLog } = useLearningStore();
  const [activePreset, setActivePreset] = useState<'standard' | 'starvation'>('standard');
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // ms multiplier

  const preset = PRESETS[activePreset];
  const currentStep: EventLoopStep = preset.steps[stepIdx] || preset.steps[0];

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
    addLog(`Event Loop Loaded script: ${PRESETS[activePreset].name}`, 'system');
  }, [activePreset]);

  // Handle auto playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= preset.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, preset.steps.length]);

  const handleNext = () => {
    if (stepIdx < preset.steps.length - 1) {
      setStepIdx(stepIdx + 1);
      const nextStep = preset.steps[stepIdx + 1];
      addLog(nextStep.desc, nextStep.desc.includes('WARNING') ? 'error' : 'info');
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setIsPlaying(false);
    addLog('Reset event loop simulation.', 'warn');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Script Selection & Code View (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Source Code Preset">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActivePreset('standard')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                activePreset === 'standard'
                  ? 'bg-primary/20 border-primary text-zinc-100'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              setTimeout vs Promise
            </button>
            <button
              onClick={() => setActivePreset('starvation')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                activePreset === 'starvation'
                  ? 'bg-danger/20 border-danger text-zinc-100'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              Microtask Starvation
            </button>
          </div>

          {/* Code Viewer Panel */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 font-mono text-xs overflow-x-auto relative shadow-inner">
            {preset.code.map((line, i) => (
              <div 
                key={i} 
                className={`py-1.5 px-2 rounded flex transition-colors duration-150 ${
                  currentStep.highlightLine === i 
                    ? 'bg-primary/25 border-l-2 border-primary text-zinc-100 font-bold' 
                    : 'text-zinc-400'
                }`}
              >
                <span className="w-5 text-zinc-600 select-none mr-2 text-right">{i + 1}</span>
                <code>{line}</code>
              </div>
            ))}
          </div>

          {/* Controller Panel */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3 select-none">
              <span className="text-zinc-500 text-xs">Playback Controls</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlaybackSpeed(prev => prev === 0.5 ? 1 : prev === 1 ? 2 : 0.5)}
                  className="px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:bg-zinc-800 font-semibold"
                >
                  Speed: {playbackSpeed}x
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-lg transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setStepIdx(prev => Math.max(0, prev - 1))}
                disabled={stepIdx === 0}
                className="flex-1 py-2 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg flex items-center justify-center text-xs gap-1 font-semibold"
              >
                Prev Step
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg text-white font-semibold transition-all ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={handleNext}
                disabled={stepIdx === preset.steps.length - 1}
                className="flex-1 py-2 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg flex items-center justify-center text-xs gap-1 font-semibold"
              >
                Next Step <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="text-[11px] leading-relaxed text-zinc-400 border-l border-zinc-700 pl-3 italic select-text">
              <span className="font-semibold text-zinc-300 text-xs block not-italic">Step {stepIdx + 1} of {preset.steps.length}:</span>
              {currentStep.desc}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Interactive Telemetry Canvas (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Event Loop Engine Simulation Canvas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full relative">
            
            {/* Call Stack */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col min-h-[160px]">
              <div className="text-zinc-400 text-xs font-semibold mb-2 flex justify-between select-none">
                <span>Call Stack</span>
                <span className="text-[10px] text-zinc-500 font-mono">Last-In-First-Out</span>
              </div>
              <div className="flex-1 flex flex-col-reverse justify-start gap-1">
                <AnimatePresence>
                  {currentStep.callStack.length === 0 ? (
                    <span className="text-[10px] text-zinc-700 text-center py-8 font-mono select-none">
                      (Stack Empty)
                    </span>
                  ) : (
                    currentStep.callStack.map((frame, i) => (
                      <motion.div
                        key={frame + i}
                        initial={{ scale: 0.9, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: -10, opacity: 0 }}
                        className="bg-primary/20 border border-primary/50 text-indigo-300 px-3 py-2 rounded text-xs font-mono font-semibold"
                      >
                        {frame}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Web APIs */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col min-h-[160px]">
              <div className="text-zinc-400 text-xs font-semibold mb-2 flex justify-between select-none">
                <span>Web APIs</span>
                <span className="text-[10px] text-zinc-500 font-mono">Async Engines</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <AnimatePresence>
                  {currentStep.webApis.length === 0 ? (
                    <span className="text-[10px] text-zinc-700 text-center py-8 font-mono select-none">
                      (No Active APIs)
                    </span>
                  ) : (
                    currentStep.webApis.map((api) => (
                      <motion.div
                        key={api.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-accent-teal/20 border border-accent-teal/50 text-teal-300 px-3 py-2 rounded text-xs font-mono"
                      >
                        {api.name}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Event Loop Ring Spinner */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col items-center justify-center min-h-[160px] relative select-none">
              <div className="text-zinc-400 text-xs font-semibold absolute top-3 left-3">
                Event Loop Motor
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Visual Spinning Arrow Ring */}
                <motion.div 
                  className="w-full h-full rounded-full border-4 border-dashed border-zinc-800 absolute"
                  animate={{ rotate: isPlaying ? 360 : currentStep.loopPosition }}
                  transition={{ 
                    ease: isPlaying ? 'linear' : 'easeOut', 
                    duration: isPlaying ? 3 / playbackSpeed : 0.5 
                  }}
                />
                <span className="font-mono text-[10px] text-zinc-500 font-bold z-10">TICKING</span>
              </div>
            </div>

            {/* Microtask Queue */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col min-h-[160px]">
              <div className="text-zinc-400 text-xs font-semibold mb-2 flex justify-between select-none">
                <span className="flex items-center gap-1">
                  Microtask Queue
                  <span className="px-1.5 py-0.5 rounded bg-accent-purple/20 text-accent-purple text-[9px] font-bold">
                    PRIORITY
                  </span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Promises</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <AnimatePresence>
                  {currentStep.microtasks.length === 0 ? (
                    <span className="text-[10px] text-zinc-700 text-center py-8 font-mono select-none">
                      (Queue Empty)
                    </span>
                  ) : (
                    currentStep.microtasks.map((task, i) => (
                      <motion.div
                        key={task + i}
                        initial={{ scale: 0.9, x: -10, opacity: 0 }}
                        animate={{ scale: 1, x: 0, opacity: 1 }}
                        exit={{ scale: 0.9, x: 10, opacity: 0 }}
                        className="bg-accent-purple/20 border border-accent-purple/50 text-purple-300 px-3 py-2 rounded text-xs font-mono"
                      >
                        {task}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Macrotask Queue */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col min-h-[160px]">
              <div className="text-zinc-400 text-xs font-semibold mb-2 flex justify-between select-none">
                <span>Callback Queue</span>
                <span className="text-[10px] text-zinc-500 font-mono">setTimeout / Event</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <AnimatePresence>
                  {currentStep.macrotasks.length === 0 ? (
                    <span className="text-[10px] text-zinc-700 text-center py-8 font-mono select-none">
                      (Queue Empty)
                    </span>
                  ) : (
                    currentStep.macrotasks.map((task, i) => (
                      <motion.div
                        key={task + i}
                        initial={{ scale: 0.9, x: -10, opacity: 0 }}
                        animate={{ scale: 1, x: 0, opacity: 1 }}
                        exit={{ scale: 0.9, x: 10, opacity: 0 }}
                        className="bg-warning/20 border border-warning/50 text-amber-300 px-3 py-2 rounded text-xs font-mono"
                      >
                        {task}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Browser Render Pipeline Loop */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col min-h-[160px] relative">
              <div className="text-zinc-400 text-xs font-semibold mb-2 flex justify-between select-none">
                <span>Browser Render Loop</span>
                <span className="text-[10px] text-zinc-500 font-mono">Paint Tick</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center gap-3">
                <div className="flex gap-1 bg-black/40 border border-zinc-800 p-1 rounded-lg select-none">
                  {['Style', 'Layout', 'Paint'].map((phase) => (
                    <div 
                      key={phase} 
                      className={`px-2 py-1 text-[9px] rounded font-mono tracking-wider font-semibold ${
                        currentStep.isRendering 
                          ? 'bg-success/20 border border-success/40 text-success animate-pulse'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                      }`}
                    >
                      {phase}
                    </div>
                  ))}
                </div>
                <div className="text-center font-mono text-[10px]">
                  {currentStep.isRendering ? (
                    <span className="text-success font-bold">REPAINTING FRAME...</span>
                  ) : (
                    <span className="text-zinc-600">Idle (Next frame pending)</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Console Output (Internal) */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-400 font-bold mb-2 select-none">MOCK SCREEN CONSOLE</div>
            <div className="bg-black/60 border border-zinc-900 rounded-lg p-3 font-mono text-xs min-h-[80px] text-zinc-300 select-text max-h-[140px] overflow-y-auto">
              {currentStep.consoleOut.length === 0 ? (
                <span className="text-zinc-700 italic select-none">(Console Clean)</span>
              ) : (
                currentStep.consoleOut.map((line, i) => (
                  <div 
                    key={i} 
                    className={`py-0.5 border-l-2 pl-2 ${
                      line.includes('WARNING') 
                        ? 'border-danger text-danger bg-danger/5 font-semibold' 
                        : 'border-zinc-800 text-zinc-200'
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
            {activePreset === 'starvation' && stepIdx === preset.steps.length - 1 && (
              <div className="mt-2 text-danger text-[11px] font-semibold flex items-center gap-1.5 select-none bg-danger/5 border border-danger/20 p-2 rounded-lg">
                <AlertTriangle size={14} />
                The microtask queue never empties, so the event loop never exits phase 1. Macrotasks and Repaints are blocked, causing browser freeze.
              </div>
            )}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
