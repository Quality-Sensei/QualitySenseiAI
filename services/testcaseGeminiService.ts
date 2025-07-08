import { GoogleGenAI } from "@google/genai";
import type { TestCaseFormData, TestCase } from '../types/testcase';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generatePrompt = (data: TestCaseFormData): string => {
  return (
`# Test Case Generation Prompt

## Context
You are a senior QA engineer tasked with creating comprehensive test cases for the following system:

**System Type:** Web Application
**Feature/Module:** ${data.projectTitle}

**Functional Requirements:**
- User Story: ${data.userStory}
- Acceptance Criteria:
${data.acceptanceCriteria}

**Business Rules:**
${data.additionalInfo || 'None specified.'}

**User Personas/Roles:**
- The primary user persona described in the user story.

**Technical Constraints:**
- General web browser compatibility is assumed unless otherwise specified in additional information.
- Prerequisites for testing: ${data.prerequisites || 'None'}


## Test Case Requirements

Generate **15-25 comprehensive test cases** that cover:

### Coverage Areas (ensure all are addressed):
1. **Positive Path Testing** (40% of test cases)
   - Happy path scenarios
   - Valid input combinations
   - Successful user workflows

2. **Negative Path Testing** (35% of test cases)
   - Invalid inputs
   - Error conditions
   - Boundary violations
   - Permission/authorization failures

3. **Edge Case Testing** (25% of test cases)
   - Boundary values (min/max)
   - Empty/null inputs
   - Special characters
   - Performance limits
   - Cross-browser/device compatibility

### Test Case Priorities:
- **High Priority**: Core functionality, critical user paths
- **Medium Priority**: Important but not critical features
- **Low Priority**: Nice-to-have features, edge cases

## Output Format

Return the test cases as a single JSON array string. Do not wrap it in markdown code blocks or add any explanatory text.

Each test case object must include:

{
  "id": "string",
  "title": "string",
  "priority": "string",
  "category": "string",
  "prerequisite": "string or null",
  "testData": "string or null",
  "steps": ["array of strings"],
  "expectedResult": "string",
  "tags": ["array of strings"]
}

## Guidelines for Quality Test Cases:
**Title Guidelines:** Use action-oriented language ("Verify", "Validate").
**Prerequisites:** Be specific about required system state.
**Test Data:** Specify exact values when important.
**Steps:** Write clear, numbered, atomic actions.
**Expected Results:** Be specific and measurable.
**Tags:** Use consistent naming conventions.

## Example Test Case
{
  "id": "TC-001",
  "title": "Verify successful user login with valid credentials",
  "priority": "High",
  "category": "Positive",
  "prerequisite": "User account exists in the system with username 'testuser' and password 'Test123!'",
  "testData": "Username: testuser, Password: Test123!",
  "steps": [
    "Navigate to the login page",
    "Enter 'testuser' in the username field",
    "Enter 'Test123!' in the password field",
    "Click the 'Login' button"
  ],
  "expectedResult": "User is successfully logged in and redirected to the dashboard page. Welcome message displays user's name.",
  "tags": ["login", "authentication", "positive", "high-priority"]
}

## Quality Checklist
Before submitting, ensure:
- JSON syntax is valid.
- Each test case has a unique ID.
- Steps are clear and actionable.
- Expected results are specific and measurable.
- All required coverage areas are addressed.

**Generate comprehensive test cases following this specification exactly. Output only the JSON array with no additional text.**
`);
};

export const generateTestCases = async (data: TestCaseFormData): Promise<TestCase[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  const prompt = generatePrompt(data);
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        },
    });
    let jsonStr = response.text ? response.text.trim() : '';
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      const parsedData: TestCase[] = JSON.parse(jsonStr);
      if (Array.isArray(parsedData) && (parsedData.length === 0 || ('id' in parsedData[0] && 'priority' in parsedData[0]))) {
        return parsedData;
      }
      throw new Error("Parsed data is not in the expected format.");
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonStr);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }
  } catch (error) {
    console.error("Error generating test cases:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating test cases.");
  }
};
