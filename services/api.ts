
import { supabase } from '../lib/supabase';
import { Question, Answer, TestResult, PostSurvey } from '../types';
import { SCORING_MAP } from '../constants';

export const fetchQuestions = async (): Promise<Question[]> => {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }

    // Merge with local SCORING_MAP to get weights
    return data.map((q: any) => {
        const scoreInfo = SCORING_MAP[q.id];
        if (!scoreInfo) {
            console.warn(`Missing scoring info for question ${q.id}`);
        }
        return {
            id: q.id,
            dimension: q.dimension, // DB source of truth for dimension? Or scoring map? Doc says DB.
            text: q.text,
            isActive: q.is_active,
            weight: scoreInfo?.weight || 0, // Fallback, though should not happen if seeded correctly
        };
    });
};

export const submitTest = async (
    result: TestResult,
    answers: Answer[],
    postSurvey?: PostSurvey
): Promise<void> => {

    // 1. Insert Test
    const { error: testError } = await supabase
        .from('tests')
        .insert({
            id: result.id,
            started_at: new Date(new Date(result.timestamp).getTime() - answers.reduce((acc, a) => acc + a.durationMs, 0)).toISOString(), // Approx start time
            completed_at: result.timestamp,
            model_version: 'v1.0', // Could be from constants
            result_type: result.type,
            result_vector: result.vector,
            confidence_flag: result.confidence
        });

    if (testError) throw testError;

    // 2. Insert Answers
    const { error: answerError } = await supabase
        .from('answers')
        .insert(
            answers.map(a => ({
                test_id: result.id,
                question_id: a.questionId,
                answer_value: a.value,
                skipped: a.skipped,
                view_duration_ms: a.durationMs
            }))
        );

    if (answerError) throw answerError;


    // 3. Insert Post Survey (if valid)
    if (postSurvey) {
        const { error: surveyError } = await supabase
            .from('post_surveys')
            .insert({
                test_id: result.id,
                role: postSurvey.role,
                engagement_level: parseInt(postSurvey.engagementLevel, 10),
                answer_basis: postSurvey.answerBasis
            });

        if (surveyError) throw surveyError;
    }
};

export const getTestResult = async (id: string): Promise<TestResult | null> => {
    const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching test result:', error);
        return null;
    }

    // Basic reconstruction - we might not need all fields for display
    return {
        id: data.id,
        type: data.result_type,
        vector: data.result_vector,
        timestamp: data.completed_at,
        confidence: data.confidence_flag || false,
    };
};
