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
        case 'high': return { background: 'rgba(255, 87, 87, 0.15)', color: '#FFB703', border: '1px solid #FFB703' };
        case 'medium': return { background: 'rgba(255, 183, 3, 0.15)', color: '#FFB703', border: '1px solid #FFB703' };
        case 'low': return { background: 'rgba(32, 191, 169, 0.15)', color: '#20bfa9', border: '1px solid #20bfa9' };
        default: return { background: 'var(--primary-navy)', color: 'var(--text-secondary)', border: '1px solid var(--secondary-blue)' };
    }
};

const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
        case 'positive': return { background: 'rgba(32, 191, 169, 0.15)', color: '#20bfa9', border: '1px solid #20bfa9' };
        case 'negative': return { background: 'rgba(255, 183, 3, 0.15)', color: '#FFB703', border: '1px solid #FFB703' };
        case 'edge case': return { background: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed', border: '1px solid #7c3aed' };
        default: return { background: 'var(--primary-navy)', color: 'var(--text-secondary)', border: '1px solid var(--secondary-blue)' };
    }
};

const EditField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, value, onChange }) => (
    <div style={{ marginBottom: 8 }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>{label}</label>
        <input type="text" value={value} onChange={onChange} style={{ width: '100%', background: 'var(--primary-navy)', border: '1px solid var(--secondary-blue)', borderRadius: '0.5rem', boxShadow: 'var(--ui-shadow)', padding: '0.5rem 0.75rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s' }} className="focus-ring" />
    </div>
);

const EditArea: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number}> = ({ label, value, onChange, rows=3 }) => (
    <div style={{ marginBottom: 8 }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} style={{ width: '100%', background: 'var(--primary-navy)', border: '1px solid var(--secondary-blue)', borderRadius: '0.5rem', boxShadow: 'var(--ui-shadow)', padding: '0.5rem 0.75rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s' }} className="focus-ring" />
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
            <div style={{
                background: 'rgba(255,255,255,0.85)',
                padding: '2rem',
                borderRadius: '1.5rem',
                border: '1.5px solid var(--accent-lavender)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                marginBottom: 24,
                position: 'relative',
            }} className="legendary-glass">
                <EditField label="ID" value={editedTC.id} onChange={(e) => setEditedTC({...editedTC, id: e.target.value})} />
                <EditField label="Title" value={editedTC.title} onChange={(e) => setEditedTC({...editedTC, title: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <EditField label="Priority" value={editedTC.priority} onChange={(e) => setEditedTC({...editedTC, priority: e.target.value})} />
                    <EditField label="Category" value={editedTC.category} onChange={(e) => setEditedTC({...editedTC, category: e.target.value})} />
                </div>
                <EditArea label="Prerequisite" value={editedTC.prerequisite || ''} onChange={(e) => setEditedTC({...editedTC, prerequisite: e.target.value})} />
                <EditArea label="Test Data" value={editedTC.testData || ''} onChange={(e) => setEditedTC({...editedTC, testData: e.target.value})} />
                <EditArea label="Steps (one per line)" value={editedTC.steps.join('\n')} onChange={(e) => setEditedTC({...editedTC, steps: e.target.value.split('\n')})} rows={5} />
                <EditArea label="Expected Result" value={editedTC.expectedResult} onChange={(e) => setEditedTC({...editedTC, expectedResult: e.target.value})} />
                <EditArea label="Tags (comma separated)" value={editedTC.tags.join(',')} onChange={(e) => setEditedTC({...editedTC, tags: e.target.value.split(',').map(t=>t.trim())})} />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={handleCancel} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--secondary-blue)', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}>Cancel</button>
                    <button onClick={handleSave} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--primary-base)', background: 'var(--accent-lavender)', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px 0 var(--accent-lavender)' }}>Save</button>
                </div>
            </div>
        )
    }

    // Display mode
    return (
        <div style={{
            background: 'rgba(255,255,255,0.85)',
            padding: '2rem',
            borderRadius: '1.5rem',
            border: '1.5px solid var(--secondary-blue)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            marginBottom: 24,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        }} className="legendary-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-teal)', letterSpacing: '-0.02em', textShadow: '0 0 8px var(--accent-teal)' }}>{testCase.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setIsEditing(true)} style={{ background: 'var(--accent-teal)', color: 'var(--primary-base)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px 0 var(--accent-teal)' }} title="Edit">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(testCase.id)} style={{ background: '#FFB703', color: 'var(--primary-base)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px 0 #FFB703' }} title="Delete">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: 8 }}>
                <span style={{ ...getPriorityColor(testCase.priority), padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.95rem', marginRight: 8 }}>Priority: {testCase.priority}</span>
                <span style={{ ...getCategoryColor(testCase.category), padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Category: {testCase.category}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 4 }}><b>Prerequisite:</b> {testCase.prerequisite}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 4 }}><b>Test Data:</b> {testCase.testData}</div>
            <div style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: 4 }}><b>Steps:</b>
                <ol style={{ marginLeft: 24 }}>
                    {testCase.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>
            <div style={{ color: 'var(--accent-lavender)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}><b>Expected Result:</b> {testCase.expectedResult}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}><b>Tags:</b> {testCase.tags.join(', ')}</div>
        </div>
    );
};

export default TestCaseCard;
