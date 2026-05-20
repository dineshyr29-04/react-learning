import { useLearningStore } from '../store/learningStore';
import type { SectionType, LearningMode } from '../store/learningStore';
import { theoryData } from '../data/theoryData';
import { TerminalConsole } from '../components/TerminalConsole';

// Icons
import { 
  Cpu, Layers, Globe, Activity, Database, ShieldAlert,
  ChevronRight, Award, GraduationCap, BarChart2, BookOpen, Terminal
} from 'lucide-react';

// Visualizer imports
import { RenderingFlow } from '../features/react-fundamentals/RenderingFlow';
import { VirtualDomDiffing } from '../features/react-internals/VirtualDomDiffing';
import { ReactFiberVisualizer } from '../features/react-internals/ReactFiberVisualizer';
import { EffectTimeline } from '../features/hooks-deep-dive/EffectTimeline';
import { EventLoopSimulator } from '../features/browser-internals/EventLoopSimulator';
import { NetworkRequestSimulator } from '../features/api-networking/NetworkRequestSimulator';
import { RerenderHeatmap } from '../features/performance/RerenderHeatmap';
import { StateFlowSimulator } from '../features/state-management/StateFlowSimulator';
import { ChallengeSandbox } from '../features/debugging-playground/ChallengeSandbox';

interface NavGroup {
  sectionId: SectionType;
  title: string;
  icon: React.ReactNode;
  labs: { id: string; name: string }[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    sectionId: 'fundamentals',
    title: 'React Fundamentals',
    icon: <GraduationCap size={16} />,
    labs: [{ id: 'rendering-flow', name: 'Render Pipeline' }]
  },
  {
    sectionId: 'internals',
    title: 'React Internals',
    icon: <Cpu size={16} />,
    labs: [
      { id: 'vdom-diff', name: 'Virtual DOM Diffing' },
      { id: 'fiber-explorer', name: 'Fiber Work Loop' }
    ]
  },
  {
    sectionId: 'hooks',
    title: 'Hooks Deep Dive',
    icon: <Layers size={16} />,
    labs: [{ id: 'effect-timeline', name: 'useEffect Lifecycle' }]
  },
  {
    sectionId: 'browser',
    title: 'Browser Internals',
    icon: <Terminal size={16} />,
    labs: [{ id: 'event-loop', name: 'Event Loop Simulator' }]
  },
  {
    sectionId: 'networking',
    title: 'API & Networking',
    icon: <Globe size={16} />,
    labs: [{ id: 'http-lifecycle', name: 'Debounce / Throttle' }]
  },
  {
    sectionId: 'performance',
    title: 'Performance Eng',
    icon: <Activity size={16} />,
    labs: [{ id: 'rerender-heatmap', name: 'Rerender Heatmap' }]
  },
  {
    sectionId: 'state',
    title: 'State Management',
    icon: <Database size={16} />,
    labs: [{ id: 'state-flow', name: 'State Flow Explorer' }]
  },
  {
    sectionId: 'challenges',
    title: 'Debugging Playground',
    icon: <ShieldAlert size={16} />,
    labs: [{ id: 'challenges', name: 'Playground Mission' }]
  }
];

export const DashboardLayout: React.FC = () => {
  const { 
    selectedLab, 
    learningMode, 
    solvedChallenges,
    setSection, 
    setLearningMode 
  } = useLearningStore();

  const activeTheory = theoryData[selectedLab];

  const renderActiveLab = () => {
    switch (selectedLab) {
      case 'rendering-flow': return <RenderingFlow />;
      case 'vdom-diff': return <VirtualDomDiffing />;
      case 'fiber-explorer': return <ReactFiberVisualizer />;
      case 'effect-timeline': return <EffectTimeline />;
      case 'event-loop': return <EventLoopSimulator />;
      case 'http-lifecycle': return <NetworkRequestSimulator />;
      case 'rerender-heatmap': return <RerenderHeatmap />;
      case 'state-flow': return <StateFlowSimulator />;
      case 'challenges': return <ChallengeSandbox />;
      default: return <RenderingFlow />;
    }
  };

  const getDifficultyColor = (mode: LearningMode) => {
    switch (mode) {
      case 'beginner': return 'text-success border-success/30 bg-success/5';
      case 'intermediate': return 'text-secondary border-secondary/30 bg-secondary/5';
      case 'advanced': return 'text-accent-purple border-accent-purple/30 bg-accent-purple/5';
      case 'interview': return 'text-warning border-warning/30 bg-warning/5';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside className="w-64 border-r border-border bg-black/40 flex flex-col shrink-0 select-none">
        
        {/* Sidebar Header Brand */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-2 bg-black/20">
          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
            <Cpu size={16} className="text-primary animate-pulse-glow" />
          </div>
          <span className="font-bold text-sm tracking-wider text-zinc-100">ENGINELAB</span>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.sectionId} className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 block mb-1 flex items-center gap-1.5">
                {group.icon}
                {group.title}
              </span>
              
              <div className="space-y-0.5">
                {group.labs.map((lab) => {
                  const isSelected = selectedLab === lab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => {
                        setSection(group.sectionId, lab.id);
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg text-left text-xs font-medium tracking-wide flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-zinc-800/60 border border-zinc-700 text-zinc-100 font-semibold' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 border border-transparent'
                      }`}
                    >
                      <span>{lab.name}</span>
                      <ChevronRight size={12} className={`opacity-40 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer telemetry */}
        <div className="p-3 border-t border-border bg-black/25 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Challenges solved:</span>
            <span className="text-success font-bold">{solvedChallenges.length}/5</span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-850">
            <div 
              className="bg-success h-full transition-all duration-500" 
              style={{ width: `${(solvedChallenges.length / 5) * 100}%` }}
            />
          </div>
        </div>

      </aside>

      {/* 2. MAIN HUB CONTAINER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* A. Upper Telemetry Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-black/10 shrink-0 select-none">
          
          {/* Active Visualizer label */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 font-mono tracking-widest uppercase">LABS //</span>
            <span className="text-sm font-bold text-zinc-200 tracking-wide">
              {activeTheory?.title || 'Telemetry Visualizer'}
            </span>
          </div>

          {/* Mode Selector Option buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider">LEARNING INTENSITY:</span>
            <div className="flex bg-black/40 border border-border p-1 rounded-xl">
              {(['beginner', 'intermediate', 'advanced', 'interview'] as LearningMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLearningMode(mode)}
                  className={`py-1 px-3.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                    learningMode === mode
                      ? getDifficultyColor(mode) + ' border shadow-sm font-extrabold'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

        </header>

        {/* B. Center Workspace Split Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">
          
          {/* Left panel: Theory & Instructions (4 cols) */}
          <div className="xl:col-span-3 border-r border-border bg-[#09090b]/80 overflow-y-auto flex flex-col p-4 space-y-4">
            
            {/* Theory Card */}
            {activeTheory && (
              <div className="space-y-4 select-text">
                <div className="space-y-1 select-none">
                  <h2 className="text-base font-extrabold text-zinc-100 tracking-tight leading-snug">
                    {activeTheory.title}
                  </h2>
                  <p className="text-[11px] text-zinc-500 font-mono font-semibold tracking-wider">
                    {activeTheory.subtitle}
                  </p>
                </div>

                <hr className="border-border select-none" />

                {/* Conditional theory rendering based on learningMode */}
                {learningMode !== 'interview' ? (
                  <div className="space-y-4 font-sans text-xs text-zinc-400 leading-relaxed">
                    <div>
                      <h4 className="font-bold text-zinc-300 select-none flex items-center gap-1.5 mb-1.5">
                        <BookOpen size={14} className="text-primary" />
                        Module Concept:
                      </h4>
                      <p className="pl-3 border-l border-zinc-800">
                        {activeTheory[learningMode].overview}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-zinc-300 select-none flex items-center gap-1.5">
                        <Award size={14} className="text-success" />
                        Core Engineering Takeaways:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeTheory[learningMode].keyPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-[11px] font-mono">
                      <span className="font-bold text-zinc-300 block select-none mb-1">How to Simulate:</span>
                      {activeTheory[learningMode].howToUse}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 font-sans text-xs text-zinc-400 leading-relaxed">
                    <div className="bg-warning/5 border border-warning/20 p-3 rounded-xl space-y-1.5">
                      <h4 className="font-bold text-warning select-none flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        TYPICAL INTERVIEW CHALLENGE:
                      </h4>
                      <p className="text-zinc-200 font-semibold leading-normal">
                        Q: {activeTheory.interview.question}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-zinc-300 select-none flex items-center gap-1.5">
                        <BarChart2 size={14} className="text-primary" />
                        Model Technical Answer:
                      </h4>
                      <p className="pl-3 border-l border-zinc-800">
                        {activeTheory.interview.answer}
                      </p>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-[11px] font-mono">
                      <span className="font-bold text-zinc-300 block select-none mb-1">Engineers Mental Model:</span>
                      {activeTheory.interview.mentalModel}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right panel: Active Visualizer sandbox & console (9 cols) */}
          <div className="xl:col-span-9 flex flex-col overflow-hidden p-4 gap-4 bg-zinc-950/20">
            
            {/* Main simulation workspace */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {renderActiveLab()}
            </div>

            {/* Bottom Console logs output panel */}
            <div className="h-44 shrink-0">
              <TerminalConsole />
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
