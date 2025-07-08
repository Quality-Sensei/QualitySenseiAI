import React, { useState, useCallback } from 'react';
import type { TestCaseFormData, TestCase } from '../../types-testcase';
import { generateTestCases } from '../../services/testcaseGeminiService';
import InputField from '../InputField';
import TextAreaField from '../TextAreaField';
import TestCaseDisplay from '../TestCaseDisplay';
import SparklesIcon from '../icons/SparklesIcon';

const TestCaseGeneratorApp: React.FC = () => {
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
      const result = await generateTestCases(formData);
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
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Test Case Generator AI
            </h1>
          </div>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Provide your project details, let Gemini craft detailed test cases, then edit and export them in your desired format.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Form Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Project Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Project Title / Feature Name"
                id="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                placeholder="e.g., E-commerce Checkout Flow"
                required
              />
              <TextAreaField
                label="User Story"
                id="userStory"
                value={formData.userStory}
                onChange={handleInputChange}
                placeholder="As a user, I want to be able to add items to my cart so that I can purchase them later."
                required
                rows={5}
              />
              <TextAreaField
                label="Acceptance Criteria"
                id="acceptanceCriteria"
                value={formData.acceptanceCriteria}
                onChange={handleInputChange}
                placeholder="- User can add an item to the cart from the product page.\n- The cart icon updates with the correct item count."
                required
                rows={5}
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
                  disabled={isSubmitDisabled}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="flex flex-col space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
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
              <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 p-8 rounded-lg text-center shadow-lg">
                <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <h3 className="text-xl font-semibold text-white">Your test cases will appear here</h3>
                <p className="text-slate-400 mt-2">Fill out the form on the left to get started.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default TestCaseGeneratorApp;
