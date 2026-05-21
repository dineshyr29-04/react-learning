import { create } from 'zustand';

export type SectionType = 
  | 'roadmap'
  | 'fundamentals' 
  | 'internals' 
  | 'hooks' 
  | 'browser' 
  | 'networking' 
  | 'performance' 
  | 'state' 
  | 'challenges';

export type LearningMode = 'beginner' | 'intermediate' | 'advanced' | 'interview';

export interface ConsoleLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
  timestamp: string;
}

interface LearningState {
  selectedSection: SectionType;
  selectedLab: string;
  learningMode: LearningMode;
  solvedChallenges: string[];
  completedModules: string[];
  xp: number;
  simulationSpeed: number; // 0.5, 1, 1.5, 2
  simulationPlaying: boolean;
  simulationStep: number;
  logs: ConsoleLog[];
  
  // Actions
  setSection: (section: SectionType, firstLab?: string) => void;
  setLab: (labId: string) => void;
  setLearningMode: (mode: LearningMode) => void;
  toggleChallengeSolved: (challengeId: string) => void;
  resetChallenges: () => void;
  completeModule: (labId: string) => void;
  addXp: (amount: number) => void;
  resetXPAndCompletion: () => void;
  setSimulationSpeed: (speed: number) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setSimulationStep: (step: number) => void;
  addLog: (text: string, type?: ConsoleLog['type']) => void;
  clearLogs: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  selectedSection: 'roadmap',
  selectedLab: 'roadmap',
  learningMode: 'intermediate',
  solvedChallenges: [],
  completedModules: [],
  xp: 0,
  simulationSpeed: 1,
  simulationPlaying: false,
  simulationStep: 0,
  logs: [
    {
      id: 'init',
      text: 'EngineLab Simulator v1.0.0 initialized. Welcome to the React Learning Pathway!',
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    }
  ],

  setSection: (section, firstLab) => set((state) => {
    let lab = firstLab;
    if (!lab) {
      switch (section) {
        case 'roadmap': lab = 'roadmap'; break;
        case 'fundamentals': lab = 'rendering-flow'; break;
        case 'internals': lab = 'vdom-diff'; break;
        case 'hooks': lab = 'effect-timeline'; break;
        case 'browser': lab = 'event-loop'; break;
        case 'networking': lab = 'http-lifecycle'; break;
        case 'performance': lab = 'rerender-heatmap'; break;
        case 'state': lab = 'state-flow'; break;
        case 'challenges': lab = 'challenges'; break;
        default: lab = 'roadmap';
      }
    }
    
    // Auto-log section navigation
    const sectionNames: Record<SectionType, string> = {
      roadmap: 'Pathway Roadmap Map',
      fundamentals: 'React Fundamentals',
      internals: 'React Internals & Fiber',
      hooks: 'Hooks Deep Dive',
      browser: 'Browser Internals',
      networking: 'API & Networking',
      performance: 'Performance Engineering',
      state: 'State Management',
      challenges: 'Debugging Playground'
    };

    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: `Navigated to module: [${sectionNames[section]}]`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };

    return { 
      selectedSection: section, 
      selectedLab: lab,
      simulationPlaying: false,
      simulationStep: 0,
      logs: [newLog, ...state.logs].slice(0, 100) // Keep last 100 logs
    };
  }),

  setLab: (labId) => set((state) => {
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: `Loaded visual lab: ${labId}`,
      type: 'info',
      timestamp: new Date().toLocaleTimeString(),
    };
    return { 
      selectedLab: labId,
      simulationPlaying: false,
      simulationStep: 0,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  setLearningMode: (mode) => set((state) => {
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: `Switched learning mode to: ${mode.toUpperCase()}`,
      type: 'info',
      timestamp: new Date().toLocaleTimeString(),
    };
    return { 
      learningMode: mode,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  toggleChallengeSolved: (challengeId) => set((state) => {
    const isSolved = state.solvedChallenges.includes(challengeId);
    const updated = isSolved
      ? state.solvedChallenges.filter(id => id !== challengeId)
      : [...state.solvedChallenges, challengeId];
    
    const xpReward = 200;
    const newXp = isSolved ? Math.max(0, state.xp - xpReward) : state.xp + xpReward;

    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: isSolved 
        ? `Challenge reset: ${challengeId} (-${xpReward} XP)` 
        : `Challenge solved successfully: ${challengeId} (+${xpReward} XP)`,
      type: isSolved ? 'warn' : 'success',
      timestamp: new Date().toLocaleTimeString(),
    };

    return { 
      solvedChallenges: updated,
      xp: newXp,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  resetChallenges: () => set((state) => {
    // Deduct XP for all solved challenges being reset
    const xpDeduction = state.solvedChallenges.length * 200;
    const newXp = Math.max(0, state.xp - xpDeduction);
    return {
      solvedChallenges: [],
      xp: newXp,
      logs: [
        {
          id: Math.random().toString(36).substring(7),
          text: `All playground challenge progress reset. (-${xpDeduction} XP)`,
          type: 'warn' as const,
          timestamp: new Date().toLocaleTimeString()
        },
        ...state.logs
      ].slice(0, 100)
    };
  }),

  completeModule: (labId) => set((state) => {
    if (state.completedModules.includes(labId)) return {};
    const completed = [...state.completedModules, labId];
    const rewardXp = 100;
    const newXp = state.xp + rewardXp;
    
    // Auto-log milestones
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: `🎉 Milestone! Completed lab module: ${labId} (+${rewardXp} XP)`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString(),
    };

    return {
      completedModules: completed,
      xp: newXp,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

  resetXPAndCompletion: () => set((state) => {
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: 'Learning pathway progress and XP reset to 0.',
      type: 'warn',
      timestamp: new Date().toLocaleTimeString()
    };
    return {
      completedModules: [],
      xp: 0,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  setSimulationPlaying: (playing) => set({ simulationPlaying: playing }),
  setSimulationStep: (step) => set({ simulationStep: step }),

  addLog: (text, type = 'info') => set((state) => {
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    return { logs: [newLog, ...state.logs].slice(0, 100) };
  }),

  clearLogs: () => set({ logs: [] })
}));
