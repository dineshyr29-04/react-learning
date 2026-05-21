import { create } from 'zustand';

export interface LearningState {
  activeTopicId: string;
  searchQuery: string;
  completedTopics: string[];
  bookmarkedTopics: string[];
  theme: 'light' | 'dark';
  expandedCategories: string[];
  
  // Actions
  setActiveTopicId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleCompletedTopic: (id: string) => void;
  toggleBookmarkedTopic: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleCategory: (categoryName: string) => void;
  setExpandedCategories: (categories: string[]) => void;
  resetProgress: () => void;
}

// Helper to load state from localStorage if available
const getSafeLocalStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveSafeLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write failed', e);
  }
};

export const useLearningStore = create<LearningState>((set) => ({
  activeTopicId: getSafeLocalStorage('react_handbook_active_topic', 'react-intro'),
  searchQuery: '',
  completedTopics: getSafeLocalStorage('react_handbook_completed', []),
  bookmarkedTopics: getSafeLocalStorage('react_handbook_bookmarks', []),
  theme: getSafeLocalStorage('react_handbook_theme', 'dark'),
  expandedCategories: getSafeLocalStorage('react_handbook_expanded_categories', [
    'React Core Foundations',
  ]),

  setActiveTopicId: (id) => set(() => {
    saveSafeLocalStorage('react_handbook_active_topic', id);
    return { activeTopicId: id };
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCompletedTopic: (id) => set((state) => {
    const completed = state.completedTopics.includes(id)
      ? state.completedTopics.filter((tId) => tId !== id)
      : [...state.completedTopics, id];
    saveSafeLocalStorage('react_handbook_completed', completed);
    return { completedTopics: completed };
  }),

  toggleBookmarkedTopic: (id) => set((state) => {
    const bookmarked = state.bookmarkedTopics.includes(id)
      ? state.bookmarkedTopics.filter((tId) => tId !== id)
      : [...state.bookmarkedTopics, id];
    saveSafeLocalStorage('react_handbook_bookmarks', bookmarked);
    return { bookmarkedTopics: bookmarked };
  }),

  setTheme: (theme) => set(() => {
    saveSafeLocalStorage('react_handbook_theme', theme);
    // Apply class to documentElement
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    return { theme };
  }),

  toggleCategory: (categoryName) => set((state) => {
    const expanded = state.expandedCategories.includes(categoryName)
      ? state.expandedCategories.filter((c) => c !== categoryName)
      : [...state.expandedCategories, categoryName];
    saveSafeLocalStorage('react_handbook_expanded_categories', expanded);
    return { expandedCategories: expanded };
  }),

  setExpandedCategories: (categories) => set(() => {
    saveSafeLocalStorage('react_handbook_expanded_categories', categories);
    return { expandedCategories: categories };
  }),

  resetProgress: () => set(() => {
    saveSafeLocalStorage('react_handbook_completed', []);
    saveSafeLocalStorage('react_handbook_bookmarks', []);
    return { completedTopics: [], bookmarkedTopics: [] };
  }),
}));
