
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout';
import { ResultView } from './ResultView';
import { getTestResult } from '../services/api';
import { TestResult } from '../types';
import { GET_RANDOM_IMAGE } from '../constants';

export const SharedResultPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [result, setResult] = useState<TestResult | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResult = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getTestResult(id);
                if (data) {
                    setResult(data);
                    // Deterministic image based on type or random? 
                    // For consistency in sharing, we ideally want the same image. 
                    // But our DB doesn't store the image seeded. 
                    // For now, random from pool based on type is fine, or we could hash the ID to pick index.
                    // Let's us random for now as per "random display" requirement, even on reload it might change (feature not bug?)
                    // Actually, if I share a link, I might expect the same visual.
                    // TO-DO: maybe hash ID to pick index. For now simple random.
                    setResultImage(GET_RANDOM_IMAGE(data.type));
                } else {
                    setError("Result not found in the matrix.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to retrieve signal.");
            } finally {
                setLoading(false);
            }
        };

        loadResult();
    }, [id]);

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest">Signal Lost</h2>
                    <p className="text-neutral-500 mb-8">{error}</p>
                    <a href="/" className="px-6 py-3 border border-neutral-800 text-white uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors">Return to Home</a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <ResultView
                result={result!}
                resultImage={resultImage}
                loading={loading}
                loadingText="Retrieving Archived Signal..."
            />
        </Layout>
    );
};
