import React, { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <nav className={`fixed z-30 inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-64'} transition-transform duration-300 ease-in-out sm:translate-x-0`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <span className="text-xl font-bold text-sky-400">Unified Apps</span>
        <button className="sm:hidden text-sky-400" onClick={() => setOpen(false)} aria-label="Close sidebar">✖️</button>
      </div>
      <ul className="mt-6 space-y-2 px-4">
        {navLinks.map(link => (
          <li key={link.key}>
            <button
              className={`flex items-center w-full px-3 py-2 rounded-lg text-left text-base font-medium transition-colors duration-200 ${activeKey === link.key ? 'bg-sky-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-sky-300'}`}
              onClick={() => onSelect(link.key)}
            >
              <span className="mr-3 text-lg">{link.icon}</span> {link.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
