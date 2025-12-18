
export type Dimension = 'I_E' | 'C_B' | 'O_X' | 'G_F';

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  isActive: boolean;
  // +1 weight means choosing 4 (Strongly Agree) supports the first letter (I, C, O, G)
  // -1 weight means choosing 4 (Strongly Agree) supports the second letter (E, B, X, F)
  weight: number; 
}

export interface Answer {
  questionId: string;
  value: number | null; // 1-4
  skipped: boolean;
  durationMs: number;
}

export interface TestResult {
  id: string;
  type: string; // e.g. "ICXG"
  vector: Record<Dimension, number>;
  confidence: 'high' | 'low';
  timestamp: string;
}

export interface PostSurvey {
  testId: string;
  role: string;
  engagementLevel: string;
  answerBasis: string;
}

export interface TypeDetail {
  code: string;
  name: string;
  description: string;
  promptSuffix: string;
}
