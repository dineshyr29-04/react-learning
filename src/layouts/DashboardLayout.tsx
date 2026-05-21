import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/learningStore';
import { languages, handbookDataByLanguage, reactHandbookData } from '../data/reactHandbookData';
import { CodeBlock } from '../components/CodeBlock';
import { 
  BookOpen, Search, Moon, Sun, Bookmark, CheckCircle, 
  ChevronDown, ChevronRight, AlertTriangle, 
  HelpCircle, Sparkles, Code, 
  Layers, FileText, Terminal, Star, Trash2,
  GraduationCap, ArrowLeft
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const {
    activeLanguageId,
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

  const [activeSection, setActiveSection] = useState('sec-overview');

  // Helper function to render text with inline code highlights (`code`) and bold bullet lists
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Escape basic HTML elements to prevent any code injection issues
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight backtick markdown strings
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono text-[10.5px] font-semibold select-all my-0.5">$1</code>'
    );

    // Dynamic formatting for list definitions (e.g. • SPA vs MPA: SPA loads...)
    formatted = formatted.replace(
      /•\s+([^:]+):/g,
      '• <strong class="text-zinc-800 dark:text-zinc-200 font-bold">$1:</strong>'
    );

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Scroll content to top whenever the topic is changed
  useEffect(() => {
    const el = document.getElementById('handbook-content-scroll');
    if (el) {
      el.scrollTop = 0;
    }
    setActiveSection('sec-overview');
  }, [activeTopicId]);

  // Intersection Observer to highlight current active section in Table of Contents
  useEffect(() => {
    const scrollContainer = document.getElementById('handbook-content-scroll');
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        root: scrollContainer, 
        rootMargin: '-5% 0px -75% 0px' 
      }
    );

    const sectionIds = ['sec-overview', 'sec-theory', 'sec-syntax', 'sec-examples', 'sec-notes', 'sec-pitfalls', 'sec-interview'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTopicId]);

  // Sync theme class with HTML document on mount and changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Retrieve active language metadata
  const activeLanguage = languages.find(l => l.id === activeLanguageId) || languages[0];
  const accent = activeLanguage.accentClass;
  const activeTopics = handbookDataByLanguage[activeLanguageId] || reactHandbookData;

  // Collapsible Categories grouping the active course topics
  const categories = activeLanguage.categories.map((catName) => ({
    name: catName,
    topics: activeTopics.filter((t) => t.category === catName)
  }));

  // Handle Search Filtering
  const filteredTopics = activeTopics.filter((topic) => {
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      topic.description.toLowerCase().includes(query) ||
      topic.category.toLowerCase().includes(query) ||
      topic.definition.what.toLowerCase().includes(query)
    );
  });

  const activeTopic = activeTopics.find(t => t.id === activeTopicId) || activeTopics[0] || reactHandbookData[0];

  // Calculate progress stats for this specific course
  const totalTopicsCount = activeTopics.length;
  const completedCount = activeTopics.filter(t => completedTopics.includes(t.id)).length;
  const progressPercentage = Math.round((completedCount / totalTopicsCount) * 100) || 0;
  const bookmarksCount = activeTopics.filter(t => bookmarkedTopics.includes(t.id)).length;

  const toggleInterviewQuestion = (key: string) => {
    setExpandedInterviewQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic reading metrics calculation
  const getReadTime = (topic: typeof activeTopic) => {
    const textParts = [
      topic.description,
      topic.definition.what,
      topic.definition.why,
      topic.definition.when,
      topic.theory.internalBehavior,
      topic.theory.coreConcepts,
      topic.syntax.explanation,
      topic.examples.beginner.explanation,
      topic.examples.intermediate.explanation,
      topic.examples.realWorld.explanation,
      ...topic.notes.bestPractices,
      ...topic.notes.performanceTips,
      ...topic.notes.interviewPoints,
      ...topic.commonMistakes.map(m => m.explanation),
      ...topic.interviewQuestions.map(q => q.question + ' ' + q.answer)
    ];
    const totalWords = textParts.join(' ').split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(totalWords / 180));
  };
  const readTime = getReadTime(activeTopic);

  const tocItems = [
    { id: 'sec-overview', label: 'Overview & Definitions' },
    { id: 'sec-theory', label: 'Theory & Internals' },
    { id: 'sec-syntax', label: 'Syntax Guide' },
    { id: 'sec-examples', label: 'Code Examples' },
    { id: 'sec-notes', label: 'Best Practices' },
    ...(activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 ? [{ id: 'sec-pitfalls', label: 'Common Pitfalls' }] : []),
    ...(activeTopic.interviewQuestions && activeTopic.interviewQuestions.length > 0 ? [{ id: 'sec-interview', label: 'Interview Q&A' }] : []),
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 1. SIDEBAR */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col shrink-0 overflow-hidden">
        
        {/* Back to Dashboard bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/20">
          <button
            onClick={() => window.location.hash = '#/dashboard'}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white rounded-xl text-xs font-semibold text-zinc-500 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header Branding */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-900 flex items-center gap-3 px-6 bg-zinc-50 dark:bg-zinc-900/10">
          <div className={`w-8 h-8 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center`}>
            <BookOpen size={16} className={accent.text} />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-zinc-900 dark:text-white block">
              {activeLanguage.name}
            </span>
            <span className="text-[10px] font-medium text-zinc-500 font-mono tracking-wider">v1.0.0 // SYLLABUS</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-600" size={16} />
            <input
              type="text"
              placeholder="Search concepts, definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 ${accent.ring}`}
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
                      window.location.hash = `#/docs/${activeLanguageId}/${topic.id}`;
                      setActiveExampleTab('beginner');
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive 
                        ? `${accent.bg} ${accent.text} font-semibold` 
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
                    <div className="pl-3.5 border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-0.5 mt-1">
                      {category.topics.map((topic) => {
                        const isActive = activeTopic.id === topic.id;
                        const isCompleted = completedTopics.includes(topic.id);
                        const isBookmarked = bookmarkedTopics.includes(topic.id);
                        return (
                          <button
                            key={topic.id}
                            onClick={() => {
                              window.location.hash = `#/docs/${activeLanguageId}/${topic.id}`;
                              setActiveExampleTab('beginner');
                            }}
                            className={`w-full py-1.5 px-2.5 rounded-md text-left text-xs font-medium flex items-center justify-between transition-colors ${
                              isActive 
                                ? `${accent.bg} ${accent.text} font-semibold` 
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
            className="mt-1 flex items-center justify-center gap-1.5 py-1 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 hover:border-rose-200 rounded text-[10px] font-semibold text-zinc-500 transition-colors"
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
            <button 
              onClick={() => window.location.hash = '#/dashboard'}
              className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase hover:underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Dashboard
            </button>
            <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700" />
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase">
              {activeLanguage.name}
            </span>
            <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700" />
            <span className={`text-xs font-bold ${accent.text}`}>
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
                  : `${accent.primary} border-transparent shadow-sm`
              }`}
            >
              <CheckCircle size={14} />
              <span>{completedTopics.includes(activeTopic.id) ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />

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

        {/* Dual-Pane Layout Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* A. Content Viewer Panel (Left) */}
          <div 
            id="handbook-content-scroll"
            className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-12 select-text custom-scrollbar scroll-smooth"
          >
            
            {/* overview section */}
            <section id="sec-overview" className="space-y-6 scroll-mt-6">
              {/* Title & Header */}
              <div className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-900">
                <div className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full ${accent.bg} border ${accent.border} text-[10px] font-semibold ${accent.text}`}>
                  <Sparkles size={11} />
                  <span>Category: {activeTopic.category}</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {activeTopic.title}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-3xl leading-relaxed">
                  {renderFormattedText(activeTopic.description)}
                </p>
              </div>

              {/* Definition Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-indigo-500 uppercase block">What it is</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {renderFormattedText(activeTopic.definition.what)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-500 uppercase block">Why it exists</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {renderFormattedText(activeTopic.definition.why)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 space-y-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-amber-500 uppercase block">When to use it</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {renderFormattedText(activeTopic.definition.when)}
                  </p>
                </div>
              </div>
            </section>

            {/* theory section */}
            <section id="sec-theory" className="space-y-6 scroll-mt-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <Layers className={accent.text} size={18} />
                Detailed Theory & Architecture
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Internal Mechanics</h3>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
                    {renderFormattedText(activeTopic.theory.internalBehavior)}
                  </p>
                </div>
                <div className="lg:col-span-5 p-5 bg-zinc-50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-900 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Core Concepts</h3>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line space-y-2 font-medium">
                    {renderFormattedText(activeTopic.theory.coreConcepts)}
                  </div>
                </div>
              </div>
            </section>

            {/* syntax section */}
            <section id="sec-syntax" className="space-y-4 scroll-mt-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <Terminal className={accent.text} size={18} />
                Syntax Guide
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {renderFormattedText(activeTopic.syntax.explanation)}
              </p>
              <CodeBlock code={activeTopic.syntax.code} language="tsx" />
            </section>

            {/* code examples section */}
            <section id="sec-examples" className="space-y-4 scroll-mt-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Code className={accent.text} size={18} />
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
                          ? `bg-white dark:bg-zinc-950 ${accent.text} border border-zinc-200 dark:border-zinc-800 shadow-sm font-extrabold`
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
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900/80 rounded-xl">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                    {activeTopic.examples[activeExampleTab].title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {renderFormattedText(activeTopic.examples[activeExampleTab].explanation)}
                  </p>
                </div>
                <CodeBlock code={activeTopic.examples[activeExampleTab].code} language="tsx" />
              </div>
            </section>

            {/* notes section */}
            <section id="sec-notes" className="space-y-6 scroll-mt-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <FileText className={accent.text} size={18} />
                Important Notes & Best Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Best Practices */}
                <div className="space-y-3 p-5 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 rounded-2xl">
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-emerald-100 dark:bg-emerald-900/30 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 rounded uppercase">
                    Best Practices
                  </span>
                  <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                    {activeTopic.notes.bestPractices.map((bp, i) => (
                      <li key={i} className="leading-relaxed">
                        {renderFormattedText(bp)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Performance Tips */}
                <div className="space-y-3 p-5 bg-blue-50/10 dark:bg-blue-950/5 border border-blue-100 dark:border-blue-950/20 rounded-2xl">
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-blue-100 dark:bg-blue-900/30 text-[9px] font-bold text-blue-700 dark:text-blue-400 rounded uppercase">
                    Performance Tips
                  </span>
                  <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                    {activeTopic.notes.performanceTips.map((pt, i) => (
                      <li key={i} className="leading-relaxed">
                        {renderFormattedText(pt)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interview Points */}
                <div className="space-y-3 p-5 bg-amber-50/10 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-950/20 rounded-2xl">
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-amber-100 dark:bg-amber-900/30 text-[9px] font-bold text-amber-700 dark:text-amber-400 rounded uppercase">
                    Interview Points
                  </span>
                  <ul className="list-disc pl-4 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                    {activeTopic.notes.interviewPoints.map((ip, i) => (
                      <li key={i} className="leading-relaxed">
                        {renderFormattedText(ip)}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>

            {/* mistakes / pitfalls section */}
            {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
              <section id="sec-pitfalls" className="space-y-6 scroll-mt-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <AlertTriangle className={accent.text} size={18} />
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

                    <div className="text-xs text-zinc-500 dark:text-zinc-400 pl-2 border-l-2 border-rose-500 leading-relaxed">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Explanation:</span> {renderFormattedText(mistake.explanation)}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* interview questions section */}
            {activeTopic.interviewQuestions && activeTopic.interviewQuestions.length > 0 && (
              <section id="sec-interview" className="space-y-6 pb-12 scroll-mt-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  <HelpCircle className={accent.text} size={18} />
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
                          <div className="text-zinc-400 dark:text-zinc-500 shrink-0">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                        </button>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-900/10 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1.5">Model Answer:</span>
                            {renderFormattedText(q.answer)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>

          {/* B. Table of Contents panel (Right) */}
          <aside className="w-60 shrink-0 border-l border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 hidden xl:flex flex-col p-6 overflow-y-auto custom-scrollbar select-none">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">
              On This Page
            </span>
            
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 space-y-3.5 pl-4 py-1">
              {tocItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group flex items-center text-left text-xs transition-all duration-150 relative w-full ${
                      isActive 
                        ? `${accent.text} font-bold` 
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium'
                    }`}
                  >
                    {isActive && (
                      <span className={`absolute -left-[20px] w-2 h-2 rounded-full ${accent.text.replace('text-', 'bg-')} ring-4 ring-indigo-100/50 dark:ring-indigo-950/50`} />
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Statistics box */}
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-900 space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                Reading Info
              </span>
              
              <div className="grid grid-cols-1 gap-2.5">
                {/* Read Time */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900/50 text-[11px]">
                  <span className="text-zinc-500 font-medium">Est. Read Time</span>
                  <span className={`font-mono font-bold ${accent.text}`}>{readTime} min</span>
                </div>
                
                {/* Pitfalls */}
                {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900/50 text-[11px]">
                    <span className="text-zinc-500 font-medium">Common Pitfalls</span>
                    <span className="font-mono font-bold text-rose-500 dark:text-rose-400">
                      {activeTopic.commonMistakes.length}
                    </span>
                  </div>
                )}

                {/* Interview Qs */}
                {activeTopic.interviewQuestions && activeTopic.interviewQuestions.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900/50 text-[11px]">
                    <span className="text-zinc-500 font-medium">Interview Prep Qs</span>
                    <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">
                      {activeTopic.interviewQuestions.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>

        </div>

      </main>

    </div>
  );
};
