import { GoogleGenAI } from "@google/genai";
import type { StaticTestInput, AnalysisResult } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatePrompt = (inputs: StaticTestInput): string => {
  const artifactsToReview = `
**Project Title:** ${inputs.projectTitle}

**User Story:**
${inputs.userStory}

**Acceptance Criteria:**
${inputs.acceptanceCriteria}

**Prerequisites:**
${inputs.prerequisites}

**Additional Information:**
${inputs.additionalInfo}
  `;

  return `
# Comprehensive Static Testing Review Prompt

## Context
You are conducting a static testing review of the provided artifacts. Static testing involves examining work products without executing code to identify defects early in the development lifecycle.

## Artifacts to Review
${artifactsToReview.trim()}

## Review Objectives
Perform a systematic static analysis to identify defects that could impact quality, maintainability, and functionality. Focus on preventing defects from propagating to later development phases.

## Defect Categories & Definitions

### 1. Requirements Defects
- **Ambiguities**: Statements open to multiple interpretations
- **Omissions**: Missing essential information, requirements, or specifications
- **Contradictions**: Conflicting or mutually exclusive statements
- **Inconsistencies**: Variations in terminology, formatting, or approach
- **Non-testable Requirements**: Statements that cannot be objectively verified

### 2. Design Defects
- **Architectural Issues**: Problems with system structure or component relationships
- **Interface Mismatches**: Inconsistent data flows or communication protocols
- **Performance Concerns**: Potential bottlenecks or scalability issues
- **Security Vulnerabilities**: Design weaknesses that could compromise security

### 3. Code Defects (if applicable)
- **Syntax Errors**: Violations of language rules
- **Logic Errors**: Flawed algorithms or incorrect conditional statements
- **Data Handling Issues**: Improper variable usage, type mismatches, or boundary conditions
- **Maintainability Problems**: Poor naming, lack of documentation, or complex structures

### 4. Process & Documentation Defects
- **Incomplete Documentation**: Missing or insufficient explanations
- **Traceability Issues**: Lack of clear connections between requirements and implementation
- **Standard Violations**: Deviations from established coding or documentation standards

## Severity Classification
- **Critical**: Defects that prevent system functionality or pose security risks
- **High**: Significant issues that impact major features or user experience
- **Medium**: Moderate issues that affect specific functionality or maintainability
- **Low**: Minor issues that don't significantly impact functionality

## Analysis Depth Requirements
For each identified defect:
1. **Location**: Specify exact section, line number, or component
2. **Category**: Classify according to the definitions above
3. **Severity**: Assign appropriate severity level
4. **Description**: Explain the defect clearly and objectively
5. **Impact**: Describe potential consequences if not addressed
6. **Recommendation**: Provide specific, actionable improvement suggestions

## Output Format
Your response must be a valid JSON object with this exact structure. Do not include any text, comments, or markdown formatting like \`\`\`json before or after the JSON block. Your entire response must be ONLY the JSON object, starting with { and ending with }.

{
  "executiveSummary": {
    "totalDefects": 0,
    "severityBreakdown": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "primaryConcerns": ["List of 3-5 most significant issues"],
    "overallQualityAssessment": "Brief assessment of artifact quality"
  },
  "defectsByCategory": {
    "requirements": [
      {
        "id": "REQ-001",
        "location": "Section 2.1, paragraph 3",
        "severity": "high",
        "type": "ambiguity",
        "description": "Detailed description of the defect",
        "impact": "Potential consequences if not addressed",
        "recommendation": "Specific improvement suggestion"
      }
    ],
    "design": [],
    "code": [],
    "documentation": []
  },
  "positiveFindings": [
    "List of well-implemented aspects or strengths identified"
  ],
  "improvementRecommendations": [
    {
      "priority": "high",
      "area": "Requirements Management",
      "recommendation": "Specific actionable improvement",
      "rationale": "Why this improvement is important"
    }
  ],
  "reviewMetrics": {
    "artifactsReviewed": 1,
    "reviewCoverage": "Percentage or description of coverage",
    "reviewDuration": "Estimated time spent on review",
    "reviewerConfidence": "High/Medium/Low confidence in findings"
  }
}

## Quality Criteria
- **Completeness**: Address all provided artifacts systematically
- **Objectivity**: Base findings on observable facts, not subjective opinions
- **Actionability**: Provide specific, implementable recommendations
- **Traceability**: Clearly link defects to their sources
- **Consistency**: Apply evaluation criteria uniformly across all artifacts

## Review Guidelines
1. **Systematic Approach**: Review artifacts in logical order (requirements → design → code)
2. **Cross-Reference**: Check for consistency between related artifacts
3. **Standards Compliance**: Verify adherence to applicable standards and best practices
4. **Risk Assessment**: Consider potential impact of identified issues
5. **Continuous Improvement**: Suggest process improvements to prevent similar defects

## Special Considerations
- If artifacts reference external dependencies, note any assumptions made
- Highlight any areas requiring domain expertise beyond the reviewer's knowledge
- Identify artifacts that may benefit from additional review types (dynamic testing, peer review, etc.)
- Consider the target audience and usage context when evaluating clarity and completeness

Begin your analysis now, following this structured approach to ensure comprehensive static testing coverage.
  `;
};

export async function* analyzeArtifactsStream(inputs: StaticTestInput): AsyncGenerator<string> {
  try {
    const prompt = generatePrompt(inputs);
    
    const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
    });

    for await (const chunk of responseStream) {
        yield chunk.text ?? '';
    }

  } catch (error) {
    console.error("Error analyzing artifacts with Gemini:", error);
    throw new Error("Failed to get analysis from AI. Please check the console for more details.");
  }
};

const generateEnhancedStoryPrompt = (inputs: StaticTestInput, analysis: AnalysisResult): string => {
    return `
# User Story Enhancement Prompt

## Context
You are an expert Senior Product Owner and Business Analyst. You have been provided with an original set of project artifacts (user story, acceptance criteria, etc.) and a detailed static analysis report that identifies defects and areas for improvement.

Your task is to rewrite the user story and its associated acceptance criteria into a well-structured HTML format that is clear, concise, unambiguous, and, most importantly, **testable**.

## Input Artifacts

### Original User Story & Criteria:
---
**Project Title:** ${inputs.projectTitle}
**User Story:**
${inputs.userStory}
**Acceptance Criteria:**
${inputs.acceptanceCriteria}
**Prerequisites:**
${inputs.prerequisites}
**Additional Information:**
${inputs.additionalInfo}
---

### Static Analysis Report:
---
${JSON.stringify(analysis, null, 2)}
---

## Your Task & Instructions

1.  **Analyze the Inputs**: Thoroughly review the original artifacts and the static analysis report. Pay close attention to the identified defects (ambiguities, omissions, non-testable requirements) and the improvement recommendations.

2.  **Rewrite into HTML**: Generate an HTML response that refines the original user story and acceptance criteria.
    *   The user story should follow the "As a [user], I want [action], so that [benefit]" structure.
    *   Acceptance Criteria must be atomic, unambiguous, and testable. Use Given-When-Then format where appropriate.
    *   Include a rationale for changes, referencing defects from the analysis.

## Output Format
Your response MUST be a single block of valid HTML. Do not include any text, comments, or markdown like \`\`\`html before or after the HTML block. Use the following structure and tags exactly.

<article>
    <h3>Enhanced User Story</h3>
    <p><strong>As a</strong> [refined user type], <strong>I want</strong> [refined action] <strong>so that</strong> [refined benefit].</p>

    <h4>Rationale for Story Change</h4>
    <p>[Briefly explain why the user story was updated, if at all. Reference defects if applicable.]</p>

    <h3>Enhanced Acceptance Criteria</h3>
    <p><em>(Using Given-When-Then where appropriate)</em></p>
    <ol>
        <li>
            <p><strong>AC-01: [Brief, descriptive title]</strong></p>
            <ul>
                <li><strong>Given</strong> [the context or precondition].</li>
                <li><strong>When</strong> [the action is performed].</li>
                <li><strong>Then</strong> [the expected outcome occurs].</li>
            </ul>
        </li>
        <li>
            <p><strong>AC-02: [Brief, descriptive title]</strong></p>
            <p>[Criterion written in a clear, declarative statement].</p>
        </li>
    </ol>

    <h4>Rationale for Criteria Changes</h4>
    <p>[Summarize the key improvements made to the acceptance criteria, referencing specific defects like "REQ-001" from the analysis to justify the changes.]</p>
</article>
`;
};


export async function* generateEnhancedStoryStream(inputs: StaticTestInput, analysis: AnalysisResult): AsyncGenerator<string> {
    try {
        const prompt = generateEnhancedStoryPrompt(inputs, analysis);
        
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
              temperature: 0.3,
            },
        });

        for await (const chunk of responseStream) {
            yield chunk.text ?? '';
        }

    } catch (error) {
        console.error("Error generating enhanced story with Gemini:", error);
        throw new Error("Failed to generate enhanced story from AI. Please check the console for more details.");
    }
}
