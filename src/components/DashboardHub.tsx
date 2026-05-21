import React, { useState } from 'react';
import { useLearningStore } from '../store/learningStore';
import { languages, handbookDataByLanguage } from '../data/reactHandbookData';
import { 
  BookOpen, Star, CheckCircle, Lock, ArrowRight, 
  Sun, Moon, GraduationCap, Search, Sparkles
} from 'lucide-react';

export const DashboardHub: React.FC = () => {
  const { 
    completedTopics, 
    bookmarkedTopics, 
    theme, 
    setTheme 
  } = useLearningStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Course completion calculations
  const getCourseStats = (langId: string) => {
    const topics = handbookDataByLanguage[langId] || [];
    const total = topics.length;
    const completed = topics.filter(t => completedTopics.includes(t.id)).length;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, progress };
  };

  // Navigate to course
  const startCourse = (langId: string) => {
    const topics = handbookDataByLanguage[langId] || [];
    if (topics.length > 0) {
      // Navigate to the first topic in the course
      window.location.hash = `#/docs/${langId}/${topics[0].id}`;
    }
  };

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total stats across all courses
  const totalCompleted = completedTopics.length;
  const totalBookmarks = bookmarkedTopics.length;

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      
      {/* 1. HEADER */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-zinc-900 dark:text-white block">Developer Handbooks</span>
            <span className="text-[10px] font-medium text-zinc-500 font-mono tracking-wider">THEORY & INTERVIEWS</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mr-2">
            <span className="flex items-center gap-1">
              <CheckCircle size={13} className="text-emerald-500" />
              <span>{totalCompleted} Completed</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex items-center gap-1">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>{totalBookmarks} Bookmarked</span>
            </span>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="px-6 md:px-12 py-12 md:py-16 max-w-7xl mx-auto w-full space-y-6">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-fit">
            <Sparkles size={13} />
            <span>Interactive Documentation & Concept Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Learn core programming theory and prepare for engineering interviews.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
            Beautifully structured handbooks detailing internal behaviors, syntax conventions, production-ready code examples, and actual interview questions with model answers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md shadow-sm">
          <Search className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-600" size={16} />
          <input
            type="text"
            placeholder="Search language handbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </section>

      {/* 3. COURSES GRID */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {filteredLanguages.map((lang) => {
            const isLocked = handbookDataByLanguage[lang.id]?.length === 0;
            const stats = getCourseStats(lang.id);
            
            // Customize badges and accents based on locks
            const accent = lang.accentClass;

            if (isLocked) {
              return (
                <div 
                  key={lang.id}
                  className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col justify-between h-[360px] opacity-75 overflow-hidden select-none"
                >
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                        <span className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-500">
                          {lang.name.charAt(0)}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-1 px-2.5 rounded-full">
                        <Lock size={10} />
                        Coming Soon
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-zinc-400 dark:text-zinc-500">
                        {lang.name}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                        Comprehensive curriculum in active development. Master key parameters, compilers, compilation lifecycles, and architecture pipelines.
                      </p>
                    </div>

                    {/* Preview syllabus items */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Expected Syllabus:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {lang.categories.map((cat, idx) => (
                          <span 
                            key={idx} 
                            className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/50 px-2 py-0.5 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 select-none bg-zinc-50 dark:bg-zinc-900/50 mt-4 relative z-10">
                    Syllabus Locked
                  </div>
                </div>
              );
            }

            // Active Handbooks
            return (
              <div 
                key={lang.id}
                className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col justify-between h-[360px] hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    {/* Logo/Icon */}
                    <div className={`w-12 h-12 rounded-2xl ${accent.bg} border ${accent.border} flex items-center justify-center`}>
                      <BookOpen size={20} className={accent.text} />
                    </div>
                    {stats.progress > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 py-1 px-2.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lang.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {lang.id === 'react' 
                        ? 'Master component nesting, props dataflows, hooks lifecycles, states updates batching, custom hooks design, SSR hydration mismatch, error boundaries, and performance memoization.'
                        : 'Master execution contexts scope scopes, block scopes closures, asynchronous callback macro-queues event loops, promises chaining, async awaits syntax, and ES6 parameters destructuring.'}
                    </p>
                  </div>

                  {/* Modules summary */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Course Outline:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lang.categories.map((cat, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 px-2 py-0.5 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span>{stats.completed}/{stats.total} Lessons Completed</span>
                      <span className="font-bold font-mono">{stats.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${stats.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'}`} 
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => startCourse(lang.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${accent.primary}`}
                  >
                    <span>{stats.progress > 0 ? 'Resume Learning' : 'Start Learning'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </section>

    </div>
  );
};
