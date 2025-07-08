export interface TestCase {
  id: string;
  title: string;
  priority: string;
  category: string;
  prerequisite: string | null;
  testData: string | null;
  steps: string[];
  expectedResult: string;
  tags: string[];
}

export interface TestCaseFormData {
  projectTitle: string;
  userStory: string;
  acceptanceCriteria: string;
  prerequisites: string;
  additionalInfo: string;
}
