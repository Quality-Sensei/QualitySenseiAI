
import React from 'react';
import { AnalysisResult, Defect, SeverityType, PriorityType } from '../types.ts';

const Section: React.FC<{ title: string, children: React.ReactNode, show?: boolean }> = ({ title, children, show = true }) => {
  if (!show) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold text-sky-400 mb-4 border-b-2 border-sky-400/30 pb-2">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

const getSeverityClasses = (severity: SeverityType) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    case 'low': return 'bg-sky-500/20 text-sky-300 border-sky-500/50';
    default: return 'bg-slate-600/20 text-slate-300 border-slate-500/50';
  }
};

const getPriorityClasses = (priority: PriorityType) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-sky-500/20 text-sky-300 border-sky-500/50';
      default: return 'bg-slate-600/20 text-slate-300 border-slate-500/50';
    }
  };


const DefectCard: React.FC<{ defect: Defect }> = ({ defect }) => (
  <div className={`border-l-4 p-4 rounded-r-lg ${getSeverityClasses(defect.severity)} bg-slate-900/50`}>
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-lg text-slate-100 capitalize">{defect.type} <span className="text-sm font-mono text-slate-400">({defect.id})</span></h4>
      <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full border ${getSeverityClasses(defect.severity)}`}>
        {defect.severity}
      </span>
    </div>
    <div className="space-y-3 text-sm">
      <p><strong className="font-semibold text-slate-300">Description:</strong> <span className="text-slate-200">{defect.description}</span></p>
      <p><strong className="font-semibold text-slate-300">Impact:</strong> <span className="text-slate-200">{defect.impact}</span></p>
      <p><strong className="font-semibold text-slate-300">Recommendation:</strong> <span className="text-slate-200">{defect.recommendation}</span></p>
      <p className="text-xs text-slate-400 pt-1"><strong className="font-semibold">Location:</strong> {defect.location}</p>
    </div>
  </div>
);

interface ResultDisplayProps {
    result: AnalysisResult;
    onExport: () => void;
    onGenerateEnhancedStory: () => void;
    isGeneratingStory: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onExport, onGenerateEnhancedStory, isGeneratingStory }) => {
  const { executiveSummary, defectsByCategory, positiveFindings, improvementRecommendations, reviewMetrics } = result;
  
  const totalDefectsFound = Object.values(defectsByCategory).reduce((acc, defects) => acc + (defects?.length || 0), 0);

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8 animate-fade-in space-y-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-sky-400">Analysis Report</h2>
        <div className="flex gap-2 flex-wrap">
           <button
            onClick={onGenerateEnhancedStory}
            disabled={isGeneratingStory}
            className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isGeneratingStory ? 'Generating Story...' : 'Generate Enhanced User Story'}
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 border border-sky-500 text-sky-300 text-sm font-medium rounded-md hover:bg-sky-500/20 transition-colors duration-200"
          >
            Export to Markdown
          </button>
        </div>
      </div>

      <Section title="Executive Summary">
        <p className="italic text-slate-300 mb-6">{executiveSummary.overallQualityAssessment}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold text-sky-300 mb-2">Severity Breakdown</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                    {Object.entries(executiveSummary.severityBreakdown).map(([severity, count]) => (
                        <div key={severity} className={`p-3 rounded-lg border ${getSeverityClasses(severity as SeverityType)}`}>
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm capitalize">{severity}</div>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold text-sky-300 mb-2">Primary Concerns</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {executiveSummary.primaryConcerns.map((concern, i) => <li key={i}>{concern}</li>)}
                </ul>
             </div>
        </div>
      </Section>
      
      <Section title="Identified Defects" show={totalDefectsFound > 0}>
        {Object.entries(defectsByCategory).map(([category, defects]) => (
          defects && defects.length > 0 && (
            <div key={category}>
              <h3 className="text-xl font-semibold text-sky-300 capitalize mb-3">{category}</h3>
              <div className="space-y-4">
                {defects.map((defect, i) => <DefectCard key={`${defect.id}-${i}`} defect={defect} />)}
              </div>
            </div>
          )
        ))}
      </Section>

      <Section title="Positive Findings" show={positiveFindings && positiveFindings.length > 0}>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
            {positiveFindings.map((finding, i) => <li key={i}>{finding}</li>)}
        </ul>
      </Section>
      
      <Section title="Improvement Recommendations" show={improvementRecommendations && improvementRecommendations.length > 0}>
          {improvementRecommendations.map((rec, i) => (
             <div key={i} className={`border-l-4 p-4 rounded-r-lg ${getPriorityClasses(rec.priority)} bg-slate-900/50`}>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-slate-100">{rec.area}</h4>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full border ${getPriorityClasses(rec.priority)}`}>
                        {rec.priority} Priority
                    </span>
                </div>
                 <p><strong className="font-semibold text-slate-300">Recommendation:</strong> <span className="text-slate-200">{rec.recommendation}</span></p>
                 <p className="mt-1"><strong className="font-semibold text-slate-300">Rationale:</strong> <span className="text-slate-200">{rec.rationale}</span></p>
             </div>
          ))}
      </Section>

      <Section title="Review Metrics">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                <div className="font-bold text-lg text-sky-400">{reviewMetrics.artifactsReviewed}</div>
                <div className="text-slate-400">Artifacts Reviewed</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                <div className="font-bold text-lg text-sky-400">{reviewMetrics.reviewCoverage}</div>
                <div className="text-slate-400">Review Coverage</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                <div className="font-bold text-lg text-sky-400">{reviewMetrics.reviewDuration}</div>
                <div className="text-slate-400">Est. Duration</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                <div className="font-bold text-lg text-sky-400">{reviewMetrics.reviewerConfidence}</div>
                <div className="text-slate-400">Confidence</div>
            </div>
          </div>
      </Section>

    </div>
  );
};

export default ResultDisplay;
