
import { Answer, Dimension, Question, TestResult } from '../types';
import { QUESTION_BANK, MAX_SKIP_PER_DIMENSION } from '../constants';

export const calculateResult = (answers: Answer[]): TestResult => {
  const scores: Record<Dimension, number> = {
    I_E: 0,
    C_B: 0,
    O_X: 0,
    G_F: 0
  };

  const counts: Record<Dimension, number> = {
    I_E: 0,
    C_B: 0,
    O_X: 0,
    G_F: 0
  };

  const skips: Record<Dimension, number> = {
    I_E: 0,
    C_B: 0,
    O_X: 0,
    G_F: 0
  };

  answers.forEach(ans => {
    const q = QUESTION_BANK.find(question => question.id === ans.questionId);
    if (!q) return;

    if (ans.skipped) {
      skips[q.dimension]++;
    } else if (ans.value !== null) {
      // Scale 1-4: Map to -1.5, -0.5, 0.5, 1.5
      const normalized = (ans.value - 2.5);
      scores[q.dimension] += normalized * q.weight;
      counts[q.dimension]++;
    }
  });

  // Calculate code
  // I_E: > 0 ? I : E
  // C_B: > 0 ? B : C (Note: Based on prompt types, C/B maps to C or B)
  // O_X: > 0 ? O : X
  // G_F: > 0 ? G : F
  
  const typeCode = [
    scores.I_E > 0 ? 'I' : 'E',
    scores.C_B > 0 ? 'B' : 'C',
    scores.O_X > 0 ? 'O' : 'X',
    scores.G_F > 0 ? 'G' : 'F'
  ].join('');

  // Confidence flag
  // Valid if answers >= 4 for each dimension (total 6)
  const isConfidenceLow = Object.keys(counts).some(dim => counts[dim as Dimension] < 4);

  return {
    id: crypto.randomUUID(),
    type: typeCode,
    vector: scores,
    confidence: isConfidenceLow ? 'low' : 'high',
    timestamp: new Date().toISOString()
  };
};
