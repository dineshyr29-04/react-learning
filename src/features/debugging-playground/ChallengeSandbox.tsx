import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { challengesData } from './challengesData';
import { GlassCard } from '../../components/GlassCard';
import Editor from '@monaco-editor/react';
import { ShieldCheck, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChallengeSandbox: React.FC = () => {
  const { solvedChallenges, toggleChallengeSolved, addLog } = useLearningStore();
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [editorCode, setEditorCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock states to simulate the bug inside the sandbox HUD
  const [mockClickCount, setMockClickCount] = useState(0);
  const [mockList, setMockList] = useState(['Apple', 'Banana']);
  const [infiniteRenderCount, setInfiniteRenderCount] = useState(0);
  const [isInfiniteLooping, setIsInfiniteLooping] = useState(false);
  
  const challenge = challengesData[activeChallengeIdx] || challengesData[0];

  useEffect(() => {
    setEditorCode(challenge.brokenCode);
    setIsSuccess(solvedChallenges.includes(challenge.id));
    setErrorMsg(null);
    setMockClickCount(0);
    setMockList(['Apple', 'Banana']);
    setInfiniteRenderCount(0);
    setIsInfiniteLooping(false);
    
    addLog(`Challenge loaded: "${challenge.title}"`, 'info');
  }, [activeChallengeIdx, challenge]);

  // Handle rendering simulation for the infinite render bug
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (challenge.id === 'infinite-loop' && isInfiniteLooping) {
      timer = setInterval(() => {
        setInfiniteRenderCount(prev => {
          if (prev > 150) {
            setIsInfiniteLooping(false);
            addLog('⚠️ Sandbox tab alert: Infinite loop protection throttled rendering!', 'error');
            return prev;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isInfiniteLooping, challenge.id]);

  const handleTestSolve = () => {
    // Run validation checks
    setErrorMsg(null);
    let passes = true;

    for (const regex of challenge.verificationRegex) {
      if (!regex.test(editorCode)) {
        passes = false;
        break;
      }
    }

    if (passes) {
      setIsSuccess(true);
      if (!solvedChallenges.includes(challenge.id)) {
        toggleChallengeSolved(challenge.id);
      }
      addLog(`Challenge Solved: ${challenge.title}!`, 'success');
    } else {
      setErrorMsg('Code analysis: Bug patterns still detected. Check structural dependencies or variable definitions.');
      addLog('Validation failed. Review the code structure.', 'error');
    }
  };

  const triggerMockBug = () => {
    if (challenge.id === 'state-mutation') {
      // Simulate direct state mutation bug: array elements are pushed, but UI ref does not update
      const listRef = mockList;
      listRef.push('Cherry');
      // setMockList(listRef) -> normally this skips rendering. We simulate it by doing nothing to the screen list.
      addLog('Trigger: Pushed "Cherry" to list pointer. Screen renders: 0 updates (State reference unchanged).', 'error');
    } 
    else if (challenge.id === 'infinite-loop') {
      setIsInfiniteLooping(true);
      addLog('Trigger: Render cycle starts. useEffect calls setCount continuously.', 'warn');
    }
    else {
      setMockClickCount(prev => prev + 1);
      addLog('Simulating interaction on buggy component...', 'info');
    }
  };

  const handleResetChallenge = () => {
    setEditorCode(challenge.brokenCode);
    setIsSuccess(false);
    setErrorMsg(null);
    setMockClickCount(0);
    setMockList(['Apple', 'Banana']);
    setInfiniteRenderCount(0);
    setIsInfiniteLooping(false);
    addLog(`Reset challenge: "${challenge.title}"`, 'warn');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Challenges list & Description (LHS) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <GlassCard title="Challenge Catalog">
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto mb-4 custom-scrollbar pr-1">
            {challengesData.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveChallengeIdx(idx)}
                className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold tracking-wide border transition-all flex items-center justify-between ${
                  activeChallengeIdx === idx
                    ? 'bg-primary/20 border-primary text-zinc-100'
                    : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:border-zinc-800'
                }`}
              >
                <span>{item.title}</span>
                {solvedChallenges.includes(item.id) && (
                  <span className="text-success font-bold flex items-center gap-0.5">
                    <ShieldCheck size={12} /> Solved
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="border-t border-zinc-800 pt-3 space-y-3 select-text">
            <div className="flex justify-between items-center select-none">
              <span className="text-[10px] bg-primary/20 text-indigo-300 font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                {challenge.category}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-0.5">
                <Star size={10} className="text-amber-500" />
                {challenge.difficulty}
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-200 leading-tight">
              {challenge.description}
            </h4>

            <div className="text-xs text-zinc-400 leading-relaxed font-sans space-y-1">
              <p className="font-semibold text-zinc-300 select-none">Bug Diagnostics:</p>
              <p className="pl-2 border-l border-zinc-800">{challenge.bugBehavior}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-[11px] text-zinc-400 leading-relaxed font-sans">
              <span className="font-bold text-zinc-300 block select-none mb-1">Target Mission:</span>
              {challenge.instructions}
            </div>
          </div>
        </GlassCard>

        {/* Live Playground Bug Simulation HUD */}
        <GlassCard title="Interactive Bug Inspector HUD">
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden min-h-[140px]">
            <span className="text-[10px] text-zinc-500 font-bold absolute top-3 left-4 tracking-wider select-none">
              DIAGNOSTIC VISUAL DEMO
            </span>

            <div className="flex flex-col items-center gap-3 w-full mt-4 select-none">
              {challenge.id === 'infinite-loop' && (
                <div className="text-center font-mono w-full">
                  <div className="text-[10px] text-zinc-500">Renders Triggered</div>
                  <div className={`text-xl font-bold ${infiniteRenderCount > 100 ? 'text-danger animate-pulse' : 'text-zinc-300'}`}>
                    {infiniteRenderCount} renders
                  </div>
                  {isInfiniteLooping && (
                    <span className="text-[9px] text-danger animate-pulse font-bold block mt-1">
                      ⚠️ WARNING: INFINITE LOOP RUNNING!
                    </span>
                  )}
                </div>
              )}

              {challenge.id === 'state-mutation' && (
                <div className="text-center font-mono">
                  <div className="text-[10px] text-zinc-500 mb-1">List Nodes Rendering:</div>
                  <div className="flex gap-2 justify-center py-2">
                    {mockList.map((item, i) => (
                      <span key={i} className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {challenge.id !== 'infinite-loop' && challenge.id !== 'state-mutation' && (
                <div className="text-center font-mono">
                  <div className="text-[10px] text-zinc-500">Interaction Counts</div>
                  <div className="text-lg font-bold text-zinc-300">{mockClickCount} ticks</div>
                </div>
              )}

              <button
                onClick={triggerMockBug}
                className="py-1 px-4 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Trigger Interaction Bug
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Editor & Console Verification (RHS) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <GlassCard title="Monaco Code Sandbox Workspace">
          <div className="border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
            <Editor
              height="350px"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={editorCode}
              onChange={(val) => setEditorCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: 'JetBrains Mono',
                lineHeight: 18,
                padding: { top: 12 },
                scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
              }}
            />
          </div>

          {/* Success / Error messaging */}
          <div className="mt-4 flex flex-col gap-3 border-t border-zinc-800 pt-4 select-none">
            <AnimatePresence mode="wait">
              {isSuccess && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-success/15 border border-success/35 text-success rounded-xl p-3 text-xs leading-normal flex items-start gap-2"
                >
                  <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                  <span>
                    <b>MISSION RESOLVED:</b> {challenge.successMessage}
                  </span>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-danger/15 border border-danger/35 text-danger rounded-xl p-3 text-xs leading-normal flex items-start gap-2"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              <button
                onClick={handleResetChallenge}
                className="py-2.5 px-4 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                Reset Code
              </button>
              
              <button
                onClick={handleTestSolve}
                className="flex-1 py-2.5 bg-success hover:bg-success-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                Verify My Solution <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
