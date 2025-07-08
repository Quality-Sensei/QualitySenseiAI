import React, { useState, useCallback, useEffect } from 'react';
import { useApiKeyContext } from '../../contexts/ApiKeyContext';
import InputGroup from '../InputGroup';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';
import { exportToMarkdown } from '../../utils/export';
import { analyzeArtifactsStream, generateEnhancedStoryStream } from '../../services/geminiService';
import type { StaticTestInput, AnalysisResult } from '../../types/static';

const LOCAL_STORAGE_KEY = 'staticTestAnalyst.formData';
const initialFormData: StaticTestInput = {
    projectTitle: '',
    userStory: '',
    acceptanceCriteria: '',
    prerequisites: '',
    additionalInfo: '',
};

const StaticTestAnalystApp: React.FC = () => {
  const { apiKey, hasApiKey } = useApiKeyContext();
  const [formData, setFormData] = useState<StaticTestInput>(() => {
    try {
      const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : initialFormData;
    } catch (error) {
      return initialFormData;
    }
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingResponseText, setStreamingResponseText] = useState<string>('');
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [enhancedStory, setEnhancedStory] = useState<string>('');
  const [storyError, setStoryError] = useState<string | null>(null);

  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {}
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetSecondaryStates = () => {
      setAnalysisResult(null);
      setError(null);
      setEnhancedStory('');
      setStoryError(null);
  };

  const handleClearForm = useCallback(() => {
    setFormData(initialFormData);
    resetSecondaryStates();
  }, []);

  const isFormValid = formData.projectTitle.trim() !== '' && formData.userStory.trim() !== '' && formData.acceptanceCriteria.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        setError("Please fill in Project Title, User Story, and Acceptance Criteria.");
        return;
    }
    setIsLoading(true);
    resetSecondaryStates();
    setStreamingResponseText('');
    try {
      let fullResponse = '';
      const stream = analyzeArtifactsStream(apiKey, formData);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setStreamingResponseText(fullResponse);
      }
      let cleanedResponse = fullResponse.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = cleanedResponse.match(fenceRegex);
      if (match && match[2]) {
        cleanedResponse = match[2].trim();
      }
      const parsedData: AnalysisResult = JSON.parse(cleanedResponse);
      setAnalysisResult(parsedData);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
          setError("The AI returned an invalid response format. The raw response from the AI has been logged to the console. Please try again.");
      } else {
        setError(err.message || 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    if (analysisResult) {
      exportToMarkdown(analysisResult, formData);
    }
  }, [analysisResult, formData]);

  const handleGenerateEnhancedStory = useCallback(async () => {
    if (!analysisResult) return;
    setIsGeneratingStory(true);
    setEnhancedStory('');
    setStoryError(null);
    try {
        let fullStoryResponse = '';
        const stream = generateEnhancedStoryStream(apiKey, formData, analysisResult);
        for await (const chunk of stream) {
            fullStoryResponse += chunk;
            setEnhancedStory(fullStoryResponse);
        }
    } catch (err: any) {
        setStoryError(err.message || 'An unknown error occurred while generating the story.');
    } finally {
        setIsGeneratingStory(false);
    }
  }, [formData, analysisResult]);

  return (
    <div>
      <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 tracking-tight">
          Static Test Analyst AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
          Leverage Gemini to perform ISTQB-aligned static analysis and refine your project artifacts.
          </p>
      </div>
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl shadow-sky-900/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            label="Project Title"
            id="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            placeholder="e.g., E-commerce Platform Checkout"
            rows={1}
          />
          <InputGroup
            label="User Story"
            id="userStory"
            value={formData.userStory}
            onChange={handleInputChange}
            placeholder="As a customer, I want to be able to pay for my items so that I can complete my purchase."
            rows={4}
          />
          <InputGroup
            label="Acceptance Criteria"
            id="acceptanceCriteria"
            value={formData.acceptanceCriteria}
            onChange={handleInputChange}
            placeholder="- User can enter credit card details.\n- User can apply a discount code.\n- Order confirmation is shown after successful payment."
            rows={5}
          />
          <InputGroup
            label="Prerequisites (Optional)"
            id="prerequisites"
            value={formData.prerequisites}
            onChange={handleInputChange}
            placeholder="e.g., User must be logged in. Shopping cart must contain at least one item."
          />
          <InputGroup
            label="Additional Information (Optional)"
            id="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="e.g., The payment gateway is Stripe. The system must support Visa and Mastercard."
          />
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleClearForm}
              className="w-full sm:w-auto py-3 px-4 border border-slate-600 text-slate-300 rounded-md shadow-sm text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-200"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading || isGeneratingStory || !hasApiKey}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {!hasApiKey ? 'API Key Required' : isLoading ? 'Analyzing...' : 'Analyze Artifacts'}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-12">
          {isLoading && (
              <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8 animate-fade-in">
                  <Loader />
                  {streamingResponseText && (
                      <div className="mt-6">
                          <h3 className="text-lg font-semibold text-sky-300 mb-2">AI Response Stream:</h3>
                          <pre className="bg-slate-900/70 p-4 rounded-lg text-xs text-slate-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                              {streamingResponseText}
                          </pre>
                      </div>
                  )}
              </div>
          )}
          {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
              </div>
          )}
          {analysisResult && !isLoading && (
              <ResultDisplay 
                  result={analysisResult} 
                  onExport={handleExport}
                  onGenerateEnhancedStory={handleGenerateEnhancedStory}
                  isGeneratingStory={isGeneratingStory}
              />
          )}
          {(isGeneratingStory || enhancedStory || storyError) && (
               <div className="mt-12 bg-slate-800/50 rounded-xl p-6 sm:p-8 animate-fade-in">
                  <h2 className="text-3xl font-bold text-sky-400 mb-6">Enhanced User Story</h2>
                  {isGeneratingStory && !enhancedStory && <Loader />}
                  {storyError && (
                      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
                          <strong className="font-bold">Error: </strong>
                          <span className="block sm:inline">{storyError}</span>
                      </div>
                  )}
                  {enhancedStory && (
                      <div 
                          className="prose prose-sm sm:prose-base prose-invert max-w-none prose-h3:text-sky-300 prose-h4:text-sky-400/80 prose-strong:text-slate-100 prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-ol:my-3 prose-ul:my-2"
                          dangerouslySetInnerHTML={{__html: enhancedStory }} 
                       />
                  )}
               </div>
          )}
          {!isLoading && !analysisResult && !error && (
              <div className="text-center py-10 px-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-medium text-slate-300">Ready for Analysis</h3>
                  <p className="mt-2 text-sm text-slate-400">Fill out the form above to have the AI review your project requirements for potential issues.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default StaticTestAnalystApp;
