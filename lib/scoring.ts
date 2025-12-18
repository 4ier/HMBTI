
import { Answer, Dimension, TestResult } from '../types';
import { SCORING_MAP, MAX_SKIP_PER_DIMENSION } from '../constants';

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
    const scoreInfo = SCORING_MAP[ans.questionId];
    if (!scoreInfo) return; // Should not happen if data is consistent

    // Use dimension from map
    const dimension = scoreInfo.dimension as Dimension;

    if (ans.skipped) {
      skips[dimension]++;
    } else if (ans.value !== null) {
      // Scale 1-4: Map to -1.5, -0.5, 0.5, 1.5
      // value 1 -> -1.5
      // value 2 -> -0.5
      // value 4 -> 1.5
      const normalized = (ans.value - 2.5);
      scores[dimension] += normalized * scoreInfo.weight;
      counts[dimension]++;
    }
  });

  // Calculate code
  // I_E: > 0 ? I : E
  // C_B: > 0 ? B : C
  // O_X: > 0 ? O : X
  // G_F: > 0 ? G : F

  const typeCode = [
    scores.I_E > 0 ? 'I' : 'E',
    scores.C_B > 0 ? 'B' : 'C',
    scores.O_X > 0 ? 'O' : 'X',
    scores.G_F > 0 ? 'G' : 'F'
  ].join('');

  // Confidence flag
  // Valid if answers >= 4 for each dimension (total 6 - 1 skip = 5, but let's stick to logic)
  const isConfidenceLow = Object.keys(counts).some(dim => counts[dim as Dimension] < 4);

  return {
    id: crypto.randomUUID(),
    type: typeCode,
    vector: scores,
    confidence: isConfidenceLow ? 'low' : 'high',
    timestamp: new Date().toISOString()
  };
};
