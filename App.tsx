import { getInitialTheme } from './utils/theme.js';
import StaticTestAnalystApp from './components/apps/StaticTestAnalystApp';
import TestCaseGeneratorApp from './components/apps/TestCaseGeneratorApp';
import ChatbotApp from './components/apps/ChatbotApp';
import Layout from './components/Layout';
import React from 'react';

const App: React.FC = () => {
  const [activeApp, setActiveApp] = React.useState<string>('static');
  const [theme] = React.useState<string>(getInitialTheme());
  React.useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);
  return (
    <Layout activeApp={activeApp} setActiveApp={setActiveApp}>
      {activeApp === 'static' && <StaticTestAnalystApp />}
      {activeApp === 'app2' && <TestCaseGeneratorApp />}
      {activeApp === 'chatbot' && <ChatbotApp />}
    </Layout>
  );
};

export default App;
