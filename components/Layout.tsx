import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import SettingsPanel from './shared/SettingsPanel';
import SettingsIcon from './shared/icons/SettingsIcon';

interface LayoutProps {
  activeApp: string;
  setActiveApp: (key: string) => void;
  children: React.ReactNode;
}

const defaultConfig = {
  temperature: 0.5,
  maxOutputTokens: 2048,
  isThinkingEnabled: true,
};

const Layout: React.FC<LayoutProps> = ({ activeApp, setActiveApp, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [config, setConfig] = useState(defaultConfig);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #f8fafc 0%, #e6e6fa 50%, #b6d0e2 100%)', display: 'flex', flexDirection: 'row', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
      <Sidebar activeKey={activeApp} onSelect={setActiveApp} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '2rem 2.5rem 0 0', gap: 24 }}>
          <ThemeToggle />
          <button
            style={{
              padding: 16,
              borderRadius: '50%',
              background: 'var(--primary-navy)',
              boxShadow: '0 0 0 2px var(--accent-teal)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            aria-label="Open settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="w-7 h-7" style={{ color: 'var(--accent-teal)' }} />
          </button>
        </div>
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem 2rem 2rem',
        }}>
          <section style={{
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            borderRadius: '2.5rem',
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            padding: '3rem 2.5rem 2.5rem 2.5rem',
            marginBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }} className="legendary-glass">
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent-teal)', textShadow: '0 0 24px var(--accent-teal), 0 0 2px var(--accent-yellow)', marginBottom: 12, textAlign: 'center' }}>Quality Sensei</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: 32, textAlign: 'center', maxWidth: 600 }}>
              Legendary AI-powered QA & Test Case Assistant. <span style={{ color: 'var(--accent-yellow)', fontWeight: 700 }}>Generate, analyze, and automate</span> your software quality with style.
            </p>
            {/* You can add a call-to-action or quick links here if desired */}
          </section>
          {children}
        </main>
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={config}
          setConfig={setConfig}
        />
      </div>
    </div>
  );
};

export default Layout;
