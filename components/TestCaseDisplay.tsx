import React, { useState, useEffect } from 'react';
import type { TestCase } from '../types/testcase';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon.tsx';
import DownloadButton from './DownloadButton.tsx';
import TestCaseCard from './TestCaseCard.tsx';

interface TestCaseDisplayProps {
  testCases: TestCase[];
  onUpdate: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
  projectTitle: string;
}

const TestCaseDisplay: React.FC<TestCaseDisplayProps> = ({ testCases, onUpdate, onDelete, projectTitle }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const copyToClipboard = () => {
    const textToCopy = JSON.stringify(testCases, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      padding: '2.5rem',
      borderRadius: '2rem',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      position: 'relative',
      marginBottom: 40,
      marginTop: 24,
    }} className="legendary-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-teal)', letterSpacing: '-0.03em', textShadow: '0 0 12px var(--accent-teal)' }}>Generated Test Cases</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DownloadButton testCases={testCases} projectTitle={projectTitle} />
                <button
                    onClick={copyToClipboard}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--accent-teal)',
                      color: 'var(--primary-base)',
                      fontWeight: 700,
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      boxShadow: '0 2px 8px 0 var(--accent-teal)',
                      transition: 'background 0.2s, color 0.2s',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                    }}
                    title={isCopied ? "Copied!" : "Copy as JSON"}
                >
                    {isCopied ? <CheckIcon className="w-5 h-5" style={{ color: '#20bfa9' }} /> : <ClipboardIcon className="w-5 h-5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
            </div>
        </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {testCases.map((tc) => (
          <TestCaseCard 
            key={tc.id} 
            testCase={tc}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TestCaseDisplay;
