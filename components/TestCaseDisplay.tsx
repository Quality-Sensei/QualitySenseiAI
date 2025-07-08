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
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Generated Test Cases</h2>
            <div className="flex items-center gap-2">
                <DownloadButton testCases={testCases} projectTitle={projectTitle} />
                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition duration-200"
                    title={isCopied ? "Copied!" : "Copy as JSON"}
                >
                    {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
            </div>
        </div>
      
      <div className="space-y-6">
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
