import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/learningStore';
import { reactHandbookData } from '../data/reactHandbookData';
import { CodeBlock } from '../components/CodeBlock';
import { 
  BookOpen, Search, Moon, Sun, Bookmark, CheckCircle, 
  ChevronDown, ChevronRight, AlertTriangle, 
  HelpCircle, Sparkles, Code, 
  Layers, FileText, Terminal, Star, Trash2
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const {
    activeTopicId,
    searchQuery,
    completedTopics,
    bookmarkedTopics,
    theme,
    expandedCategories,
    setActiveTopicId,
    setSearchQuery,
    toggleCompletedTopic,
    toggleBookmarkedTopic,
    setTheme,
    toggleCategory,
    resetProgress
  } = useLearningStore();

  // Selected Example Tab: 'beginner' | 'intermediate' | 'realWorld'
  const [activeExampleTab, setActiveExampleTab] = useState<'beginner' | 'intermediate' | 'realWorld'>('beginner');
  
  // Expanded Interview Question IDs
  const [expandedInterviewQuestions, setExpandedInterviewQuestions] = useState<Record<string, boolean>>({});

  // Sync theme class with HTML document on mount and changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Collapsible Categories grouping the 22 topics
  const categories = [
    {
      name: 'React Core Foundations',
      topics: reactHandbookData.filter(t => t.category === 'React Core Foundations')
    },
    {
      name: 'State & Events',
      topics: reactHandbookData.filter(t => t.category === 'State & Events')
    },
    {
      name: 'Hooks Deep Dive',
      topics: reactHandbookData.filter(t => t.category === 'Hooks Deep Dive')
    },
    {
      name: 'Dynamic UI & Networking',
      topics: reactHandbookData.filter(t => t.category === 'Dynamic UI & Networking')
    },
    {
      name: 'Advanced React & State',
      topics: reactHandbookData.filter(t => t.category === 'Advanced React & State')
    },
    {
      name: 'Production Engineering',
      topics: reactHandbookData.filter(t => t.category === 'Production Engineering')
    }
  ];

  // Handle Search Filtering
  const filteredTopics = reactHandbookData.filter((topic) => {
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      topic.description.toLowerCase().includes(query) ||
      topic.category.toLowerCase().includes(query) ||
      topic.definition.what.toLowerCase().includes(query)
    );
  });

  const activeTopic = reactHandbookData.find(t => t.id === activeTopicId) || reactHandbookData[0];

  // Calculate stats
  const totalTopicsCount = reactHandbookData.length;
  const completedCount = completedTopics.length;
  const progressPercentage = Math.round((completedCount / totalTopicsCount) * 100) || 0;
  const bookmarksCount = bookmarkedTopics.length;

  const toggleInterviewQuestion = (key: string) => {
    setExpandedInterviewQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 1. SIDEBAR */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col shrink-0 overflow-hidden">
        
        {/* Header Branding */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between px-6 bg-zinc-50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/10">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-zinc-900 dark:text-white block">React Handbook</span>
              <span className="text-[10px] font-medium text-zinc-500 font-mono tracking-wider">v19.0.0 // THEORY</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-600" size={16} />
            <input
              type="text"
              placeholder="Search concepts, types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Categories & Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {searchQuery ? (
            // Search Results Mode
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest px-2 block mb-2">
                Search Results ({filteredTopics.length})
              </span>
              {filteredTopics.map((topic) => {
                const isActive = activeTopic.id === topic.id;
                const isCompleted = completedTopics.includes(topic.id);
                const isBookmarked = bookmarkedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setActiveExampleTab('beginner');
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/30'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isCompleted ? (
                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                      )}
                      <span className="truncate">{topic.title}</span>
                    </span>
                    {isBookmarked && <Star size={11} className="text-amber-500 fill-amber-500 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          ) : (
            // Structured Collapsible Modules
            categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.name);
              const completedInCategory = category.topics.filter(t => completedTopics.includes(t.id)).length;
              const totalInCategory = category.topics.length;

              return (
                <div key={category.name} className="space-y-1">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-left text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      {category.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                      {completedInCategory}/{totalInCategory}
                    </span>
                  </button>

                  {/* Category Topics List */}
                  {isExpanded && (
                    <div className="pl-3.5 border-l border-zinc-200 dark:border-zinc-850 ml-3 space-y-0.5 mt-1">
                      {category.topics.map((topic) => {
                        const isActive = activeTopic.id === topic.id;
                        const isCompleted = completedTopics.includes(topic.id);
                        const isBookmarked = bookmarkedTopics.includes(topic.id);
                        return (
                          <button
                            key={topic.id}
                            onClick={() => {
                              setActiveTopicId(topic.id);
                              setActiveExampleTab('beginner');
                            }}
                            className={`w-full py-1.5 px-2.5 rounded-md text-left text-xs font-medium flex items-center justify-between transition-colors ${
                              isActive 
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/20'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              {isCompleted ? (
                                <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-800 shrink-0" />
                              )}
                              <span className="truncate">{topic.title}</span>
                            </span>
                            {isBookmarked && <Star size={10} className="text-amber-500 fill-amber-500 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* Sidebar Footer Progress */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-zinc-500">Overall Progress</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Completed: {completedCount}/{totalTopicsCount}</span>
            <span>Bookmarks: {bookmarksCount}</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all progress & bookmarks? This cannot be undone.')) {
                resetProgress();
              }
            }}
            className="mt-1 flex items-center justify-center gap-1.5 py-1 px-3 border border-zinc-200 dark:border-zinc-850 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 hover:border-rose-200 rounded text-[10px] font-semibold text-zinc-500 transition-colors"
          >
            <Trash2 size={11} />
            Reset Progress
          </button>
        </div>

      </aside>

      {/* 2. MAIN READING HUB */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950">
        
        {/* Navigation / Actions Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between px-8 bg-zinc-50/50 dark:bg-zinc-900/10 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 font-mono tracking-widest uppercase">
              {activeTopic.category}
            </span>
            <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {activeTopic.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmarkedTopic(activeTopic.id)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
                bookmarkedTopics.includes(activeTopic.id)
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title="Bookmark Topic"
            >
              <Bookmark size={14} className={bookmarkedTopics.includes(activeTopic.id) ? 'fill-amber-500 text-amber-500' : ''} />
              <span>{bookmarkedTopics.includes(activeTopic.id) ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* Complete button */}
            <button
              onClick={() => toggleCompletedTopic(activeTopic.id)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
                completedTopics.includes(activeTopic.id)
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-sm'
              }`}
            >
              <CheckCircle size={14} />
              <span>{completedTopics.includes(activeTopic.id) ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-850 mx-1" />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              title="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Content Viewer Panel */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 select-text custom-scrollbar">
          
          {/* A. Title & Header */}
          <div className="space-y-3 pb-6 border-b border-zinc-150 dark:border-zinc-900">
            <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles size={11} />
              <span>Category: {activeTopic.category}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {activeTopic.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-3xl leading-relaxed">
              {activeTopic.description}
            </p>
          </div>

          {/* B. Definition Tabs (What, Why, When) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
              <span className="text-[10px] font-bold font-mono tracking-wider text-indigo-500 uppercase block">What it is</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-355 leading-relaxed">{activeTopic.definition.what}</p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
              <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-500 uppercase block">Why it exists</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-355 leading-relaxed">{activeTopic.definition.why}</p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
              <span className="text-[10px] font-bold font-mono tracking-wider text-amber-500 uppercase block">When to use it</span>
              <p className="text-xs text-zinc-600 dark:text-zinc-355 leading-relaxed">{activeTopic.definition.when}</p>
            </div>
          </div>

          {/* C. Detailed Theory & Internals */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <Layers className="text-indigo-500" size={18} />
              Detailed Theory & Architecture
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Internal Mechanics</h3>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
                  {activeTopic.theory.internalBehavior}
                </p>
              </div>
              <div className="lg:col-span-5 p-5 bg-zinc-50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-150 dark:border-zinc-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Core Concepts</h3>
                <div className="text-xs text-zinc-600 dark:text-zinc-355 leading-relaxed whitespace-pre-line space-y-2 font-medium">
                  {activeTopic.theory.coreConcepts}
                </div>
              </div>
            </div>
          </div>

          {/* D. Syntax Explanation */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <Terminal className="text-indigo-500" size={18} />
              Syntax Guide
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-355">
              {activeTopic.syntax.explanation}
            </p>
            <CodeBlock code={activeTopic.syntax.code} language="tsx" />
          </div>

          {/* E. Code Examples (Tabs) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code className="text-indigo-500" size={18} />
                Production Examples
              </h2>
              {/* Tabs selector */}
              <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start">
                {(['beginner', 'intermediate', 'realWorld'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveExampleTab(tab)}
                    className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeExampleTab === tab
                        ? 'bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-850 shadow-sm font-extrabold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    {tab === 'realWorld' ? 'Real World' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Example tab contents */}
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/10 dark:bg-indigo-950/5 border border-indigo-100/30 dark:border-indigo-950/20 rounded-xl">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                  {activeTopic.examples[activeExampleTab].title}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {activeTopic.examples[activeExampleTab].explanation}
                </p>
              </div>
              <CodeBlock code={activeTopic.examples[activeExampleTab].code} language="tsx" />
            </div>
          </div>

          {/* F. Important Notes */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <FileText className="text-indigo-500" size={18} />
              Important Notes & Best Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Best Practices */}
              <div className="space-y-3 p-5 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 rounded-2xl">
                <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-emerald-100 dark:bg-emerald-900/30 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 rounded uppercase">
                  Best Practices
                </span>
                <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-355 space-y-2">
                  {activeTopic.notes.bestPractices.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>

              {/* Performance Tips */}
              <div className="space-y-3 p-5 bg-blue-50/10 dark:bg-blue-950/5 border border-blue-100 dark:border-blue-950/20 rounded-2xl">
                <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-blue-100 dark:bg-blue-900/30 text-[9px] font-bold text-blue-700 dark:text-blue-400 rounded uppercase">
                  Performance Tips
                </span>
                <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-355 space-y-2">
                  {activeTopic.notes.performanceTips.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Interview Points */}
              <div className="space-y-3 p-5 bg-amber-50/10 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-950/20 rounded-2xl">
                <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-amber-100 dark:bg-amber-900/30 text-[9px] font-bold text-amber-700 dark:text-amber-400 rounded uppercase">
                  Interview Points
                </span>
                <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-355 space-y-2">
                  {activeTopic.notes.interviewPoints.map((ip, i) => (
                    <li key={i}>{ip}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* G. Common Mistakes (Wrong vs Corrected) */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <AlertTriangle className="text-indigo-500" size={18} />
              Common Pitfalls & Mistakes
            </h2>
            {activeTopic.commonMistakes.map((mistake, idx) => (
              <div key={idx} className="space-y-4 p-6 bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900 rounded-2xl">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
                  {idx + 1}. {mistake.title}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Wrong code card */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 py-0.5 px-2 rounded self-start w-fit">
                      ❌ Wrong Code
                    </span>
                    <CodeBlock code={mistake.wrongCode} language="tsx" />
                  </div>

                  {/* Corrected code card */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20 py-0.5 px-2 rounded self-start w-fit">
                      ✅ Corrected Code
                    </span>
                    <CodeBlock code={mistake.correctedCode} language="tsx" />
                  </div>
                </div>

                <div className="text-xs text-zinc-500 dark:text-zinc-400 pl-2 border-l-2 border-indigo-500 leading-relaxed">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">Explanation:</span> {mistake.explanation}
                </div>
              </div>
            ))}
          </div>

          {/* H. Interview Prep Q&A */}
          <div className="space-y-6 pb-12">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <HelpCircle className="text-indigo-500" size={18} />
              Interview Q&A Readiness
            </h2>
            <div className="space-y-3">
              {activeTopic.interviewQuestions.map((q, idx) => {
                const questionKey = `${activeTopic.id}_q_${idx}`;
                const isExpanded = expandedInterviewQuestions[questionKey];
                const levelColor = 
                  q.level === 'beginner' 
                    ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950/20' 
                    : q.level === 'intermediate'
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950/20'
                    : 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-950/20';

                return (
                  <div 
                    key={idx}
                    className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Collapsible Trigger */}
                    <button
                      onClick={() => toggleInterviewQuestion(questionKey)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/35 transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded shrink-0 ${levelColor}`}>
                          {q.level}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 leading-normal">
                          {q.question}
                        </span>
                      </div>
                      <div className="text-zinc-400 dark:text-zinc-650 shrink-0">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-zinc-150 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-900/10 text-xs text-zinc-600 dark:text-zinc-355 leading-relaxed whitespace-pre-line">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1.5">Model Answer:</span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
