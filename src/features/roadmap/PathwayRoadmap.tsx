import React from 'react';
import { useLearningStore } from '../../store/learningStore';
import type { SectionType } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { 
  Trophy, BookOpen, Layers, Cpu, Database, Activity, 
  Terminal, Globe, CheckCircle2, Lock, 
  Sparkles, Flame, Play, RefreshCw, Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  sectionId: SectionType;
  description: string;
  xpReward: number;
}

const ROADMAP_NODES: RoadmapNode[] = [
  {
    id: 'rendering-flow',
    title: 'React Rendering Pipeline',
    subtitle: 'Mount, Rerender & Commits',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    sectionId: 'fundamentals',
    description: 'Learn the core 3-step rendering flow of React: Trigger, Render, and Commit.',
    xpReward: 100
  },
  {
    id: 'vdom-diff',
    title: 'Virtual DOM Diffing',
    subtitle: 'Heuristic O(n) Diffing',
    difficulty: 'Intermediate',
    category: 'Internals',
    sectionId: 'internals',
    description: 'Understand reconciliation heuristics, node replacements, and list keys.',
    xpReward: 100
  },
  {
    id: 'fiber-explorer',
    title: 'React Fiber Architecture',
    subtitle: 'Double Buffering work loop',
    difficulty: 'Advanced',
    category: 'Internals',
    sectionId: 'internals',
    description: 'Deconstruct the work loop, child-sibling traversal, priority scheduling, and fiber pools.',
    xpReward: 100
  },
  {
    id: 'effect-timeline',
    title: 'useEffect & Closures',
    subtitle: 'Dependency array snapshots',
    difficulty: 'Intermediate',
    category: 'Hooks',
    sectionId: 'hooks',
    description: 'Explore the effect timeline, cleanups, Object.is comparisons, and stale closures.',
    xpReward: 100
  },
  {
    id: 'state-flow',
    title: 'State Architecture',
    subtitle: 'Context vs Prop Drilling vs Zustand',
    difficulty: 'Intermediate',
    category: 'State Management',
    sectionId: 'state',
    description: 'Compare prop drilling, Context provider updates, and external store selector mechanisms.',
    xpReward: 100
  },
  {
    id: 'rerender-heatmap',
    title: 'Rerender heatmaps',
    subtitle: 'Memoization & prop equalities',
    difficulty: 'Advanced',
    category: 'Performance',
    sectionId: 'performance',
    description: 'Measure rendering cascades, toggle React.memo, and audit callback references.',
    xpReward: 100
  },
  {
    id: 'event-loop',
    title: 'JS Event Loop & Starvation',
    subtitle: 'Microtasks vs Macrotasks vs Paint',
    difficulty: 'Intermediate',
    category: 'Browser Internals',
    sectionId: 'browser',
    description: 'Simulate call stack execution, timers, Promise loops, and browser paint schedules.',
    xpReward: 100
  },
  {
    id: 'http-lifecycle',
    title: 'API Pipeline optimization',
    subtitle: 'Debounce & Throttle network lines',
    difficulty: 'Intermediate',
    category: 'Networking',
    sectionId: 'networking',
    description: 'Implement debounces and throttles, analyze network lines, and learn CORS basics.',
    xpReward: 100
  },
  {
    id: 'challenges',
    title: 'Debugging Playground',
    subtitle: 'Interactive sandbox missions',
    difficulty: 'Expert',
    category: 'Troubleshooting',
    sectionId: 'challenges',
    description: 'De-bug real broken code snippets to prove your React engine engineering skills.',
    xpReward: 1000 // Big final reward for completing the playground
  }
];

interface BadgeInfo {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}

export const PathwayRoadmap: React.FC = () => {
  const { 
    completedModules, 
    solvedChallenges, 
    xp, 
    setSection, 
    resetXPAndCompletion,
    resetChallenges
  } = useLearningStore();

  // Calculations for rank level
  // Level 1: 0-200 XP (React Novice)
  // Level 2: 201-500 XP (Hook Apprentice)
  // Level 3: 501-900 XP (Fiber Explorer)
  // Level 4: 901-1400 XP (Render Engineer)
  // Level 5: 1401+ XP (React Architect)
  const getRankInfo = (userXp: number) => {
    if (userXp <= 200) {
      const nextLevelXp = 200;
      const progress = (userXp / nextLevelXp) * 100;
      return { level: 1, title: 'React Novice', nextLevelXp, progress };
    } else if (userXp <= 500) {
      const currentLevelBase = 200;
      const nextLevelXp = 500;
      const progress = ((userXp - currentLevelBase) / (nextLevelXp - currentLevelBase)) * 100;
      return { level: 2, title: 'Hook Apprentice', nextLevelXp, progress };
    } else if (userXp <= 900) {
      const currentLevelBase = 500;
      const nextLevelXp = 900;
      const progress = ((userXp - currentLevelBase) / (nextLevelXp - currentLevelBase)) * 100;
      return { level: 3, title: 'Fiber Explorer', nextLevelXp, progress };
    } else if (userXp <= 1400) {
      const currentLevelBase = 900;
      const nextLevelXp = 1400;
      const progress = ((userXp - currentLevelBase) / (nextLevelXp - currentLevelBase)) * 100;
      return { level: 4, title: 'Render Engineer', nextLevelXp, progress };
    } else {
      return { level: 5, title: 'React Architect', nextLevelXp: 1400, progress: 100 };
    }
  };

  const rank = getRankInfo(xp);
  const totalModules = ROADMAP_NODES.length;
  const completedCount = completedModules.length + (solvedChallenges.length === 5 ? 1 : 0);
  const percentComplete = Math.round((completedCount / totalModules) * 100);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-success/15 border border-success/30 text-success';
      case 'Intermediate': return 'bg-warning/15 border border-warning/30 text-warning';
      case 'Advanced': return 'bg-accent-purple/15 border border-accent-purple/30 text-accent-purple';
      case 'Expert': return 'bg-danger/15 border border-danger/30 text-danger animate-pulse';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  };

  const badges: BadgeInfo[] = [
    {
      id: 'rendering-flow',
      name: 'Rendering Pioneer',
      desc: 'Completed Rendering Flow',
      icon: <BookOpen size={18} />,
      color: 'from-indigo-600 to-blue-500 text-indigo-100',
      glow: 'glow-indigo'
    },
    {
      id: 'vdom-diff',
      name: 'VDOM Inspector',
      desc: 'Completed VDOM Diffing',
      icon: <Layers size={18} />,
      color: 'from-amber-600 to-orange-500 text-amber-100',
      glow: 'glow-warning'
    },
    {
      id: 'fiber-explorer',
      name: 'Fiber Loop Walker',
      desc: 'Completed Fiber Explorer',
      icon: <Cpu size={18} />,
      color: 'from-purple-600 to-indigo-500 text-purple-100',
      glow: 'glow-purple'
    },
    {
      id: 'effect-timeline',
      name: 'Timeline Sync Master',
      desc: 'Completed useEffect Timeline',
      icon: <Activity size={18} />,
      color: 'from-emerald-600 to-teal-500 text-emerald-100',
      glow: 'glow-success'
    },
    {
      id: 'state-flow',
      name: 'Stateflow Architect',
      desc: 'Completed State Flow',
      icon: <Database size={18} />,
      color: 'from-sky-600 to-blue-500 text-sky-100',
      glow: 'glow-blue'
    },
    {
      id: 'rerender-heatmap',
      name: 'Heatmap Optimizer',
      desc: 'Completed Heatmap Audit',
      icon: <Flame size={18} />,
      color: 'from-rose-600 to-red-500 text-rose-100',
      glow: 'glow-danger'
    },
    {
      id: 'event-loop',
      name: 'Loop Threadmaster',
      desc: 'Completed Event Loop',
      icon: <Terminal size={18} />,
      color: 'from-cyan-600 to-teal-500 text-cyan-100',
      glow: 'glow-blue'
    },
    {
      id: 'http-lifecycle',
      name: 'Throttle Commander',
      desc: 'Completed Debounce/Throttle',
      icon: <Globe size={18} />,
      color: 'from-teal-600 to-emerald-500 text-teal-100',
      glow: 'glow-success'
    },
    {
      id: 'all-challenges',
      name: 'Bug Exterminator',
      desc: 'Solved All Playground Snags',
      icon: <Trophy size={18} />,
      color: 'from-amber-500 to-yellow-400 text-amber-950 font-bold',
      glow: 'glow-warning'
    }
  ];

  const isBadgeUnlocked = (badgeId: string) => {
    if (badgeId === 'all-challenges') {
      return solvedChallenges.length === 5;
    }
    return completedModules.includes(badgeId);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all learning pathway achievements, completed labs, and XP? This cannot be undone.')) {
      resetXPAndCompletion();
      resetChallenges();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none custom-scrollbar">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-indigo-950/40 via-zinc-900/50 to-zinc-950/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 flex-1 text-center md:text-left select-text">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold font-mono tracking-wider">
            <Sparkles size={12} className="animate-spin-slow" />
            REACT MASTERY LEARNING PATHWAY
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight leading-none">
            Your Interactive Engineering Journey
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
            Welcome to the ultimate learning track. Learn React internal workings, reconciler loops, hooks timelines, browser loops, and debugging side-by-side using real-time simulation engines.
          </p>
        </div>

        <button
          onClick={handleResetProgress}
          className="px-3.5 py-2 border border-zinc-850 hover:border-danger/30 hover:bg-danger/5 hover:text-danger text-zinc-500 font-mono text-[10px] rounded-lg transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
        >
          <RefreshCw size={12} />
          Reset Pathway
        </button>
      </div>

      {/* 2. Stats Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Card */}
        <GlassCard title="Learning Pathway Progress">
          <div className="flex items-center gap-5 py-2 select-text">
            {/* SVG Circular Meter */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-zinc-900 fill-none" strokeWidth="6" />
                <motion.circle 
                  cx="40" cy="40" r="34" 
                  className="stroke-primary fill-none" 
                  strokeWidth="6" 
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - percentComplete / 100)}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - percentComplete / 100) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute text-sm font-bold font-mono text-zinc-100">
                {percentComplete}%
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-zinc-500 text-[10px] font-mono font-bold tracking-wider">COMPLETED RATIO</div>
              <div className="text-lg font-bold text-zinc-200">
                {completedCount} / {totalModules} Modules
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Study labs, complete visualizers, and resolve playground bugs to achieve 100% completion.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Level / Rank Card */}
        <GlassCard title="Engine Experience & Level">
          <div className="flex flex-col justify-center gap-3 py-1 select-text">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <div className="text-zinc-500 text-[10px] font-mono font-bold tracking-wider">CURRENT RANK</div>
                <div className="text-lg font-bold text-zinc-200 flex items-center gap-1.5">
                  <Flame size={16} className="text-amber-500 animate-pulse" />
                  {rank.title}
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-zinc-400">
                Level <span className="font-extrabold text-sm text-zinc-100">{rank.level}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-zinc-900 border border-zinc-850 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-accent-purple h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${rank.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>{xp} Total XP</span>
                <span>Next Level at {rank.nextLevelXp} XP</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Challenges solved Card */}
        <GlassCard title="Playground Mission Stats">
          <div className="flex items-center gap-5 py-2 select-text">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/50 border border-zinc-850 flex flex-col items-center justify-center text-zinc-300 shadow-inner select-none">
              <Trophy size={24} className={solvedChallenges.length === 5 ? 'text-amber-400 animate-bounce' : 'text-zinc-600'} />
              <span className="text-[9px] font-mono mt-0.5">BADGES</span>
            </div>

            <div className="space-y-1">
              <div className="text-zinc-500 text-[10px] font-mono font-bold tracking-wider">MISSIONS COMPLETED</div>
              <div className="text-lg font-bold text-zinc-200">
                {solvedChallenges.length} / 5 Challenges
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                {solvedChallenges.length === 5 
                  ? 'All debug challenges resolved! Master title unlocked.' 
                  : 'Find and fix standard react memory leaks, stale states, and race issues.'}
              </p>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* 3. Connected Pathway Map (Subway / Connected timeline nodes) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 select-none">
          <Compass size={18} className="text-zinc-400" />
          <h2 className="text-base font-bold text-zinc-200 tracking-wide uppercase">Pathway Learning Roadmap Route</h2>
        </div>

        <div className="relative border border-zinc-900 bg-black/30 rounded-2xl p-6 md:p-8 flex flex-col gap-8 overflow-hidden shadow-xl">
          {/* Vertical Connecting Line (dashed) */}
          <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-accent-purple to-zinc-800 border-l border-dashed border-zinc-700/40 hidden md:block" />
          
          {ROADMAP_NODES.map((node, index) => {
            const isCompleted = node.id === 'challenges' 
              ? solvedChallenges.length === 5 
              : completedModules.includes(node.id);
            const isPrevCompleted = index === 0 || (
              ROADMAP_NODES[index - 1].id === 'challenges'
                ? solvedChallenges.length === 5
                : completedModules.includes(ROADMAP_NODES[index - 1].id)
            );
            const isLocked = !isPrevCompleted;
            const isActive = !isCompleted && !isLocked;

            return (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pl-0 md:pl-4 transition-all duration-300 ${
                  isLocked ? 'opacity-40' : 'opacity-100'
                }`}
              >
                
                {/* Node Status Circle (Timeline Indicator) */}
                <div className="relative z-10 w-12 h-12 rounded-full border flex items-center justify-center shrink-0 shadow-lg select-none transition-all duration-300 bg-zinc-950">
                  {isCompleted ? (
                    <div className="w-10 h-10 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-success glow-success">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : isLocked ? (
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                      <Lock size={16} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary glow-indigo animate-pulse-glow">
                      <div className="w-3.5 h-3.5 rounded-full bg-primary animate-ping absolute" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>

                {/* Node Detail Card */}
                <div className={`flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 p-4 border rounded-xl bg-zinc-900/30 backdrop-blur-md transition-all duration-300 relative ${
                  isCompleted 
                    ? 'border-success/25 bg-success/5 hover:border-success/40' 
                    : isActive 
                    ? 'border-primary/40 bg-primary/5 hover:border-primary/60 scale-[1.005]' 
                    : 'border-zinc-850/60 hover:border-zinc-700'
                }`}>
                  
                  {/* Category, Title, Difficulty (8 cols) */}
                  <div className="lg:col-span-8 space-y-1.5 select-text">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-wider">
                        {node.category}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getDifficultyBadge(node.difficulty)}`}>
                        {node.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                          Completed (+{node.xpReward} XP)
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full animate-pulse">
                          UP NEXT (+{node.xpReward} XP)
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-zinc-200 leading-snug">
                      {node.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 leading-normal font-sans">
                      {node.description}
                    </p>
                  </div>

                  {/* Navigation Button / Action (4 cols) */}
                  <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 select-none">
                    <button
                      onClick={() => setSection(node.sectionId, node.id)}
                      disabled={isLocked}
                      className={`w-full lg:w-auto px-4 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        isCompleted
                          ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : isLocked
                          ? 'bg-zinc-900/50 border border-zinc-850 text-zinc-600 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-hover text-white'
                      }`}
                    >
                      <Play size={12} className={isActive ? 'fill-white' : ''} />
                      {isCompleted ? 'Review Lab' : isLocked ? 'Locked' : 'Start Visual Lab'}
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>
      </div>

      {/* 4. Achievements / Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 select-none">
          <Trophy size={18} className="text-zinc-400" />
          <h2 className="text-base font-bold text-zinc-200 tracking-wide uppercase">Unlocked Badge Cabinet</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
          {badges.map((badge) => {
            const unlocked = isBadgeUnlocked(badge.id);
            return (
              <div 
                key={badge.id}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl text-center select-text transition-all duration-500 relative min-h-[110px] ${
                  unlocked 
                    ? `bg-zinc-900 border-zinc-850 shadow-lg ${badge.glow}` 
                    : 'bg-zinc-950/20 border-zinc-900/60 opacity-30'
                }`}
              >
                
                {/* Badge Icon circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-inner ${
                  unlocked 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                }`}>
                  {unlocked ? badge.icon : <Lock size={14} />}
                </div>

                <div className="space-y-0.5">
                  <span className={`text-[10px] font-bold tracking-tight truncate max-w-[80px] block ${
                    unlocked ? 'text-zinc-200' : 'text-zinc-500'
                  }`}>
                    {badge.name}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-sans block max-w-[80px] leading-tight truncate">
                    {badge.desc}
                  </span>
                </div>

                {!unlocked && (
                  <span className="absolute top-2 right-2 text-zinc-700 select-none">
                    <Lock size={10} />
                  </span>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
