import React from 'react';

const navLinks = [
  { name: 'Static Test Analyst', key: 'static', icon: '🧪' },
  { name: 'Test Case Generator', key: 'app2', icon: '📦' },
  { name: 'TestPro AI Chatbot', key: 'chatbot', icon: '🤖' },
  // Add more apps here as you unify them
];

interface SidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeKey, onSelect }) => {
  return (
    <nav style={{
      position: 'fixed',
      zIndex: 30,
      top: 0,
      left: 0,
      height: '100%',
      width: 256,
      background: 'rgba(255,255,255,0.15)',
      borderRight: '1px solid var(--secondary-blue)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderRadius: '0 2rem 2rem 0',
      transition: 'box-shadow 0.3s',
    }} className="legendary-glass">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.5rem 1rem 1.5rem', borderBottom: '1px solid var(--secondary-blue)' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-teal)', letterSpacing: '-0.03em', textShadow: '0 0 8px var(--accent-teal)' }}>Quality Sensei</span>
      </div>
      <ul style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16, padding: '0 1.5rem' }}>
        {navLinks.map(link => (
          <li key={link.key}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: activeKey === link.key ? 'var(--accent-teal)' : 'rgba(255,255,255,0.10)',
                color: activeKey === link.key ? 'var(--primary-base)' : 'var(--text-secondary)',
                boxShadow: activeKey === link.key ? '0 0 12px 0 var(--accent-teal)' : 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 4,
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              }}
              onClick={() => onSelect(link.key)}
            >
              <span style={{ marginRight: 16, fontSize: '1.5rem', filter: activeKey === link.key ? 'drop-shadow(0 0 8px var(--accent-teal))' : 'none' }}>{link.icon}</span> {link.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
