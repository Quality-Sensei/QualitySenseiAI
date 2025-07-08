import React, { useState } from 'react';
import type { TestCase } from '../types/testcase';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface TestCaseCardProps {
  testCase: TestCase;
  onUpdate: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
        case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'low': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
        default: return 'bg-slate-600 text-slate-300 border-slate-500/30';
    }
};

const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
        case 'positive': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'negative': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        case 'edge case': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        default: return 'bg-slate-600 text-slate-300 border-slate-500/30';
    }
};

const EditField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, value, onChange }) => (
    <div className="mb-2">
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="block w-full bg-slate-700 border border-slate-500 rounded-md shadow-sm py-1 px-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
    </div>
);

const EditArea: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number}> = ({ label, value, onChange, rows=3 }) => (
    <div className="mb-2">
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} className="block w-full bg-slate-700 border border-slate-500 rounded-md shadow-sm py-1 px-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
    </div>
);

const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCase, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTC, setEditedTC] = useState<TestCase>(testCase);

    const handleSave = () => {
        onUpdate(editedTC);
        setIsEditing(false);
    }
    
    const handleCancel = () => {
        setEditedTC(testCase);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="bg-slate-900 p-5 rounded-lg border border-indigo-500/50 shadow-lg">
                <EditField label="ID" value={editedTC.id} onChange={(e) => setEditedTC({...editedTC, id: e.target.value})} />
                <EditField label="Title" value={editedTC.title} onChange={(e) => setEditedTC({...editedTC, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <EditField label="Priority" value={editedTC.priority} onChange={(e) => setEditedTC({...editedTC, priority: e.target.value})} />
                    <EditField label="Category" value={editedTC.category} onChange={(e) => setEditedTC({...editedTC, category: e.target.value})} />
                </div>
                <EditArea label="Prerequisite" value={editedTC.prerequisite || ''} onChange={(e) => setEditedTC({...editedTC, prerequisite: e.target.value})} />
                <EditArea label="Test Data" value={editedTC.testData || ''} onChange={(e) => setEditedTC({...editedTC, testData: e.target.value})} />
                <EditArea label="Steps (one per line)" value={editedTC.steps.join('\n')} onChange={(e) => setEditedTC({...editedTC, steps: e.target.value.split('\n')})} rows={5} />
                <EditArea label="Expected Result" value={editedTC.expectedResult} onChange={(e) => setEditedTC({...editedTC, expectedResult: e.target.value})} />
                <EditArea label="Tags (comma separated)" value={editedTC.tags.join(',')} onChange={(e) => setEditedTC({...editedTC, tags: e.target.value.split(',').map(t=>t.trim())})} />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={handleCancel} className="px-4 py-1 text-sm font-semibold text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-1 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Save</button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 transition-shadow hover:shadow-indigo-500/20 hover:shadow-lg group relative">
             <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="p-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-md" title="Edit">
                    <PencilIcon className="w-4 h-4 text-slate-300" />
                </button>
                <button onClick={() => onDelete(testCase.id)} className="p-1.5 bg-slate-700/50 hover:bg-red-500/50 rounded-md" title="Delete">
                    <TrashIcon className="w-4 h-4 text-slate-300" />
                </button>
            </div>

            <h3 className="text-lg font-semibold text-indigo-400 mb-3 pr-16">{testCase.id}: {testCase.title}</h3>

            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(testCase.priority)}`}>
                    {testCase.priority}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getCategoryColor(testCase.category)}`}>
                    {testCase.category}
                </span>
            </div>
            
             {testCase.prerequisite && (
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-400">Prerequisite:</p>
                <p className="text-sm text-slate-300">{testCase.prerequisite}</p>
              </div>
            )}
            {testCase.testData && (
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-400">Test Data:</p>
                <p className="text-sm text-slate-300 bg-slate-800 p-2 rounded font-mono">{testCase.testData}</p>
              </div>
            )}
            <div className="mb-3">
              <p className="text-sm font-medium text-slate-400 mb-1">Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-sm">
                {testCase.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-400">Expected Result:</p>
              <p className="text-sm text-slate-300">{testCase.expectedResult}</p>
            </div>
            {testCase.tags && testCase.tags.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <div className="flex flex-wrap gap-2">
                      {testCase.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-md">
                              #{tag}
                          </span>
                      ))}
                  </div>
              </div>
            )}
        </div>
    );
};

export default TestCaseCard;
