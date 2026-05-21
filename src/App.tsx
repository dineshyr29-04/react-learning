import { useState, useEffect } from 'react';
import { useLearningStore } from './store/learningStore';
import { DashboardHub } from './components/DashboardHub';
import { DashboardLayout } from './layouts/DashboardLayout';
import { handbookDataByLanguage } from './data/reactHandbookData';

function App() {
  const { setActiveLanguageId, setActiveTopicId } = useLearningStore();
  const [currentRoute, setCurrentRoute] = useState<'dashboard' | 'docs'>('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash.startsWith('#/docs/')) {
        const parts = hash.split('/'); // ['', 'docs', 'languageId', 'topicId']
        if (parts.length >= 4) {
          const langId = parts[2];
          const topicId = parts[3];
          
          // Verify if language exists in our handbook data
          if (handbookDataByLanguage[langId]) {
            setActiveLanguageId(langId);
            
            // Check if topicId is valid for this language
            const topics = handbookDataByLanguage[langId];
            const topicExists = topics.some(t => t.id === topicId);
            if (topicExists) {
              setActiveTopicId(topicId);
            } else if (topics.length > 0) {
              // Fallback to first topic if invalid topic ID
              setActiveTopicId(topics[0].id);
              window.location.hash = `#/docs/${langId}/${topics[0].id}`;
              return;
            }
            setCurrentRoute('docs');
            return;
          }
        }
      }
      
      // Default to dashboard
      setCurrentRoute('dashboard');
      if (hash !== '#/dashboard' && hash !== '') {
        window.location.hash = '#/dashboard';
      }
    };

    // Run on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveLanguageId, setActiveTopicId]);

  return currentRoute === 'docs' ? <DashboardLayout /> : <DashboardHub />;
}

export default App;
