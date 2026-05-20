import { create } from 'zustand';

export type SectionType = 
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
  setSimulationSpeed: (speed: number) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setSimulationStep: (step: number) => void;
  addLog: (text: string, type?: ConsoleLog['type']) => void;
  clearLogs: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  selectedSection: 'fundamentals',
  selectedLab: 'rendering-flow',
  learningMode: 'intermediate',
  solvedChallenges: [],
  simulationSpeed: 1,
  simulationPlaying: false,
  simulationStep: 0,
  logs: [
    {
      id: 'init',
      text: 'EngineLab Simulator v1.0.0 initialized. Ready for simulation execution.',
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    }
  ],

  setSection: (section, firstLab) => set((state) => {
    let lab = firstLab;
    if (!lab) {
      switch (section) {
        case 'fundamentals': lab = 'rendering-flow'; break;
        case 'internals': lab = 'vdom-diff'; break;
        case 'hooks': lab = 'effect-timeline'; break;
        case 'browser': lab = 'event-loop'; break;
        case 'networking': lab = 'http-lifecycle'; break;
        case 'performance': lab = 'rerender-heatmap'; break;
        case 'state': lab = 'state-flow'; break;
        case 'challenges': lab = 'challenges'; break;
        default: lab = 'rendering-flow';
      }
    }
    
    // Auto-log section navigation
    const sectionNames: Record<SectionType, string> = {
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
    
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(7),
      text: isSolved 
        ? `Challenge reset: ${challengeId}` 
        : `Challenge solved successfully: ${challengeId} (+100 XP)`,
      type: isSolved ? 'warn' : 'success',
      timestamp: new Date().toLocaleTimeString(),
    };

    return { 
      solvedChallenges: updated,
      logs: [newLog, ...state.logs].slice(0, 100)
    };
  }),

  resetChallenges: () => set((state) => ({
    solvedChallenges: [],
    logs: [
      {
        id: Math.random().toString(36).substring(7),
        text: 'All playground challenge progress reset.',
        type: 'warn' as const,
        timestamp: new Date().toLocaleTimeString()
      },
      ...state.logs
    ].slice(0, 100)
  })),

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
