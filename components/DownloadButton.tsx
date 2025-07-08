import React, { useState, useRef, useEffect } from 'react';
import type { TestCase } from '../types/testcase';
import { exportTestCasesToMarkdown, exportToBdd, exportToCsv } from '../utils/export';
import DownloadIcon from './icons/DownloadIcon.tsx';

interface DownloadButtonProps {
  testCases: TestCase[];
  projectTitle: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ testCases, projectTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDownload = (format: 'md' | 'bdd' | 'csv') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    const sanitizedTitle = projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    switch (format) {
      case 'md':
        content = exportTestCasesToMarkdown(testCases, projectTitle);
        filename = `${sanitizedTitle}_test_cases.md`;
        mimeType = 'text/markdown';
        break;
      case 'bdd':
        content = exportToBdd(testCases, projectTitle);
        filename = `${sanitizedTitle}.feature`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = exportToCsv(testCases);
        filename = `${sanitizedTitle}_test_cases.csv`;
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        <DownloadIcon className="w-5 h-5" />
        <span>Download</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleDownload('md'); }}
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
              >
                as Markdown (.md)
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleDownload('bdd'); }}
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
              >
                as BDD (.feature)
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleDownload('csv'); }}
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
              >
                as CSV (.csv)
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
