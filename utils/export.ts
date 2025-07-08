import type { AnalysisResult, StaticTestInput, Defect, PriorityType } from '../types/static';

const formatDefects = (defects: Defect[] | undefined, category: string): string => {
  if (!defects || defects.length === 0) return '';
  let markdown = `### ${category.charAt(0).toUpperCase() + category.slice(1)} Defects\n\n`;
  defects.forEach(defect => {
    markdown += `**ID:** \`${defect.id}\` | **Severity:** ${defect.severity.toUpperCase()} | **Type:** ${defect.type}\n`;
    markdown += `- **Location:** ${defect.location}\n`;
    markdown += `- **Description:** ${defect.description}\n`;
    markdown += `- **Impact:** ${defect.impact}\n`;
    markdown += `- **Recommendation:** ${defect.recommendation}\n\n`;
  });
  return markdown;
};

const formatPriority = (priority: PriorityType) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export const exportToMarkdown = (result: AnalysisResult, inputs: StaticTestInput) => {
    const { executiveSummary, defectsByCategory, positiveFindings, improvementRecommendations, reviewMetrics } = result;

    const allDefects = Object.values(defectsByCategory).flat();

    const markdownContent = `
# Static Test Analysis Report for: ${inputs.projectTitle}

*Report generated on: ${new Date().toUTCString()}*

---

## 1. Executive Summary

**Overall Quality Assessment:** ${executiveSummary.overallQualityAssessment}

**Total Defects Identified:** ${executiveSummary.totalDefects || allDefects.length}

### Severity Breakdown
| Severity      | Count |
|---------------|-------|
| Critical      | ${executiveSummary.severityBreakdown.critical}      |
| High          | ${executiveSummary.severityBreakdown.high}         |
| Medium        | ${executiveSummary.severityBreakdown.medium}       |
| Low           | ${executiveSummary.severityBreakdown.low}          |

### Primary Concerns
${executiveSummary.primaryConcerns.map(c => `- ${c}`).join('\n')}

---

## 2. Identified Defects

${formatDefects(defectsByCategory.requirements, 'Requirements')}
${formatDefects(defectsByCategory.design, 'Design')}
${formatDefects(defectsByCategory.code, 'Code')}
${formatDefects(defectsByCategory.documentation, 'Documentation')}

---

## 3. Positive Findings

${positiveFindings.map(f => `- ${f}`).join('\n')}

---

## 4. Improvement Recommendations

${improvementRecommendations.map(rec => `
### ${rec.area} (${formatPriority(rec.priority)} Priority)
- **Recommendation:** ${rec.recommendation}
- **Rationale:** ${rec.rationale}
`).join('\n')}

---

## 5. Review Metrics

| Metric                | Value                  |
|-----------------------|------------------------|
| Artifacts Reviewed    | ${reviewMetrics.artifactsReviewed} |
| Review Coverage       | ${reviewMetrics.reviewCoverage} |
| Estimated Duration    | ${reviewMetrics.reviewDuration} |
| Reviewer Confidence   | ${reviewMetrics.reviewerConfidence} |

---

## 6. Original Artifacts Reviewed

### Project Title
${inputs.projectTitle}

### User Story
\`\`\`
${inputs.userStory}
\`\`\`

### Acceptance Criteria
\`\`\`
${inputs.acceptanceCriteria}
\`\`\`

### Prerequisites
\`\`\`
${inputs.prerequisites || 'None provided.'}
\`\`\`

### Additional Information
\`\`\`
${inputs.additionalInfo || 'None provided.'}
\`\`\`
`;

    const blob = new Blob([markdownContent.trim()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = inputs.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `static_analysis_report_${safeTitle}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export function exportToBdd(testCases: any[], projectTitle: string): string {
  return `Feature: ${projectTitle}\n\n` + testCases.map(tc => `  Scenario: ${tc.title}\n    Given ${tc.prerequisite || 'preconditions are met'}\n    When ${tc.steps.join(' and ')}\n    Then ${tc.expectedResult}\n`).join('\n');
}

export function exportToCsv(testCases: any[]): string {
  const header = ['ID', 'Title', 'Priority', 'Category', 'Prerequisite', 'Test Data', 'Steps', 'Expected Result', 'Tags'];
  const rows = testCases.map(tc => [
    tc.id,
    tc.title,
    tc.priority,
    tc.category,
    tc.prerequisite || '',
    tc.testData || '',
    tc.steps.join(' | '),
    tc.expectedResult,
    tc.tags.join(', ')
  ]);
  return [header, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}` ).join(',')).join('\n');
}

export function exportTestCasesToMarkdown(testCases: any[], projectTitle: string): string {
  let md = `# Test Cases for ${projectTitle}\n\n`;
  testCases.forEach(tc => {
    md += `## ${tc.id}: ${tc.title}\n`;
    md += `- **Priority:** ${tc.priority}\n`;
    md += `- **Category:** ${tc.category}\n`;
    if (tc.prerequisite) md += `- **Prerequisite:** ${tc.prerequisite}\n`;
    if (tc.testData) md += `- **Test Data:** ${tc.testData}\n`;
    md += `- **Steps:**\n`;
    tc.steps.forEach((step: string, idx: number) => {
      md += `  ${idx + 1}. ${step}\n`;
    });
    md += `- **Expected Result:** ${tc.expectedResult}\n`;
    md += `- **Tags:** ${tc.tags.join(', ')}\n\n`;
  });
  return md;
}
