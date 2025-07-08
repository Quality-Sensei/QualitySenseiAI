import React from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  activeApp: string;
  setActiveApp: (key: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeApp, setActiveApp, children }) => (
  <div className="min-h-screen font-sans transition-colors duration-500 flex bg-slate-900">
    <Sidebar activeKey={activeApp} onSelect={setActiveApp} />
    <ThemeToggle />
    <main className="flex-1 ml-0 sm:ml-64 max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-12 transition-all duration-300">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-sky-400 tracking-tight drop-shadow-lg">Quality Sensei</h1>
        <p className="mt-2 text-lg text-slate-400">Your AI-powered QA and test case assistant</p>
      </header>
      {children}
    </main>
  </div>
);

export default Layout;
