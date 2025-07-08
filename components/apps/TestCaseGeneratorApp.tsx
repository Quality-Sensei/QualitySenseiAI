import React, { useState, useCallback } from 'react';
import type { TestCaseFormData, TestCase } from '../../types/testcase';
import { useApiKeyContext } from '../../contexts/ApiKeyContext';
import { generateTestCases } from '../../services/testcaseGeminiService';
import InputField from '../InputField';
import TextAreaField from '../TextAreaField';
import TestCaseDisplay from '../TestCaseDisplay';
import SparklesIcon from '../icons/SparklesIcon';

/**
 * TestCaseGeneratorApp - AI-powered test case generator with accessibility and UX improvements.
 */
const TestCaseGeneratorApp: React.FC = () => {
  const { apiKey, hasApiKey } = useApiKeyContext();
  const [formData, setFormData] = useState<TestCaseFormData>({
    projectTitle: '',
    userStory: '',
    acceptanceCriteria: '',
    prerequisites: '',
    additionalInfo: '',
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.projectTitle || !formData.userStory || !formData.acceptanceCriteria) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestCases([]);

    try {
      const result = await generateTestCases(apiKey, formData);
      setTestCases(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTestCase = useCallback((updatedTestCase: TestCase) => {
    setTestCases(prevTestCases => 
      prevTestCases.map(tc => tc.id === updatedTestCase.id ? updatedTestCase : tc)
    );
  }, []);

  const handleDeleteTestCase = useCallback((testCaseId: string) => {
    setTestCases(prevTestCases => 
      prevTestCases.filter(tc => tc.id !== testCaseId)
    );
  }, []);

  const isSubmitDisabled = !formData.projectTitle || !formData.userStory || !formData.acceptanceCriteria || isLoading;

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem 2rem 2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <SparklesIcon className="w-12 h-12" style={{ color: 'var(--accent-lavender)', filter: 'drop-shadow(0 0 12px var(--accent-lavender))' }} />
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--accent-teal)', textShadow: '0 0 16px var(--accent-teal), 0 0 2px var(--accent-yellow)' }}>
              Test Case Generator AI
            </h1>
          </div>
          <p style={{ marginTop: 24, fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Provide your project details, let Gemini craft detailed test cases, then edit and export them in your desired format.
          </p>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'flex-start' }}>
          {/* Input Form Section */}
          <div style={{
            background: 'rgba(255,255,255,0.92)',
            padding: '2.5rem 2rem',
            borderRadius: '2rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            border: '1.5px solid var(--accent-lavender)',
            marginBottom: 24,
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }} className="legendary-glass">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-lavender)', marginBottom: 24, letterSpacing: '-0.01em', textShadow: '0 0 8px var(--accent-lavender)' }}>Project Information</h2>
            <form onSubmit={handleSubmit} aria-label="Test Case Generation Form" role="form" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <InputField
                label="Project Title / Feature Name"
                id="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                placeholder="e.g., E-commerce Checkout Flow"
                required
                aria-required="true"
              />
              <TextAreaField
                label="User Story"
                id="userStory"
                value={formData.userStory}
                onChange={handleInputChange}
                placeholder="As a user, I want to be able to add items to my cart so that I can purchase them later."
                required
                rows={5}
                aria-required="true"
              />
              <TextAreaField
                label="Acceptance Criteria"
                id="acceptanceCriteria"
                value={formData.acceptanceCriteria}
                onChange={handleInputChange}
                placeholder="- User can add an item to the cart from the product page.\n- The cart icon updates with the correct item count."
                required
                rows={5}
                aria-required="true"
              />
              <InputField
                label="Prerequisites"
                id="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                placeholder="e.g., User must be logged in."
              />
              <TextAreaField
                label="Additional Information"
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="e.g., The application supports Chrome and Firefox. Test on both."
                rows={3}
              />
              <div>
                <button
                  type="submit"
                  disabled={isSubmitDisabled || !hasApiKey}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: '1rem 0',
                    border: 'none',
                    borderRadius: '1rem',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--primary-base)',
                    background: 'linear-gradient(90deg, var(--accent-lavender) 0%, var(--accent-teal) 100%)',
                    boxShadow: '0 2px 8px 0 var(--accent-teal)',
                    cursor: isSubmitDisabled || !hasApiKey ? 'not-allowed' : 'pointer',
                    opacity: isSubmitDisabled || !hasApiKey ? 0.6 : 1,
                    transition: 'background 0.2s, color 0.2s, opacity 0.2s',
                  }}
                  aria-label="Generate Test Cases"
                >
                  {!hasApiKey ? (
                    'API Key Required'
                  ) : isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: 'var(--primary-base)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Test Cases'
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* Output Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && (
              <div style={{ background: 'linear-gradient(90deg, #b91c1c 0%, #f59e42 100%)', border: '1.5px solid #b91c1c', color: '#fff', padding: '1.25rem 1.5rem', borderRadius: '1rem', boxShadow: '0 2px 8px 0 #b91c1c', fontWeight: 700, marginBottom: 8 }} role="alert" aria-live="assertive">
                <strong style={{ fontWeight: 900 }}>Error: </strong>
                <span>{error}</span>
              </div>
            )}
            {testCases.length > 0 && (
                <TestCaseDisplay 
                    testCases={testCases}
                    onUpdate={handleUpdateTestCase}
                    onDelete={handleDeleteTestCase}
                    projectTitle={formData.projectTitle}
                />
            )}
            {!isLoading && !error && testCases.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, background: 'rgba(255,255,255,0.7)', padding: '2.5rem 2rem', borderRadius: '2rem', textAlign: 'center', boxShadow: '0 2px 8px 0 var(--secondary-blue)', border: '1.5px solid var(--secondary-blue)' }}>
                <svg className="w-16 h-16" style={{ color: 'var(--secondary-blue)', marginBottom: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal)' }}>Your test cases will appear here</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Fill out the form on the left to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestCaseGeneratorApp;
