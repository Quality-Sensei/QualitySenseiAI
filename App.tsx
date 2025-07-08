import React, { lazy } from 'react';
import { useTheme } from './hooks/useTheme';
import LazyWrapper from './components/LazyWrapper';
import Layout from './components/Layout';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

// Lazy load components for better performance
const StaticTestAnalystApp = lazy(() => import('./components/apps/StaticTestAnalystApp'));
const TestCaseGeneratorApp = lazy(() => import('./components/apps/TestCaseGeneratorApp'));
const ChatbotApp = lazy(() => import('./components/apps/ChatbotApp'));

const App: React.FC = () => {
  const [activeApp, setActiveApp] = React.useState<string>('static');
  
  return (
    <Layout activeApp={activeApp} setActiveApp={setActiveApp}>
      <LazyWrapper>
    <ApiKeyProvider>
      <Layout activeApp={activeApp} setActiveApp={setActiveApp}>
        {activeApp === 'static' && <StaticTestAnalystApp />}
        {activeApp === 'app2' && <TestCaseGeneratorApp />}
        {activeApp === 'chatbot' && <ChatbotApp />}
      </Layout>
    </ApiKeyProvider>
  );
};

export default App;

  )
}