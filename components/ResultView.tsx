
import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { TestResult, Dimension } from '../types';
import { TYPE_DETAILS, DIMENSION_DESCRIPTIONS } from '../constants';

interface ResultViewProps {
    result: TestResult;
    resultImage: string | null;
    loading?: boolean;
    loadingText?: string;
    onRetry?: () => void;
    isSharedMode?: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
    result,
    resultImage,
    loading = false,
    loadingText = '',
    onRetry,
    isSharedMode = false
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [generatingShare, setGeneratingShare] = useState(false);

    if (!result) return null;

    const typeDetail = TYPE_DETAILS.find(d => d.code === result.type);
    const shareUrl = `${window.location.origin}${window.location.pathname}#/result/${result.id}`;
    // For the QR code on the shared image, we want it to point to the HOME page so others can test
    // But maybe the user wants to share THEIR result? The requirement says "Right bottom add Home QR code"
    // "(右下角增加首页二维码)" -> implies pointing to Home for others to play.
    // Let's verify: "generate image share (add home page QR code at bottom right)"
    const homeUrl = `${window.location.origin}${window.location.pathname}`;

    const handleExportImage = async () => {
        if (!cardRef.current) return;
        setGeneratingShare(true);
        try {
            // Small delay to ensure render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: '#000000',
                scale: 2 // High res
            });

            const link = document.createElement('a');
            link.download = `HMBTI_RESULT_${result.type}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Export failed", err);
            alert("Image export failed. Please screenshot instead.");
        } finally {
            setGeneratingShare(false);
        }
    };

    return (
        <div className="flex-grow w-full flex flex-col overflow-hidden relative h-full">
            <div ref={scrollRef} className="flex-grow overflow-y-auto pb-10 pr-1 select-none custom-scrollbar">
                <div className="flex flex-col items-center">

                    {/* Action Buttons - Moved to top as requested */}
                    <div className="w-full max-w-md px-8 mb-8 space-y-4">
                        <button
                            onClick={handleExportImage}
                            disabled={generatingShare || loading}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                            {generatingShare ? 'Generating Artifact...' : 'Save & Share Visual'}
                        </button>

                        {onRetry ? (
                            <button onClick={onRetry} className="w-full py-4 border border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-widest active:bg-white active:text-black transition-colors">Recalibrate System</button>
                        ) : (
                            <a href={homeUrl} className="block w-full text-center py-4 border border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-widest active:bg-white active:text-black transition-colors">Initialize Your Own Assessment</a>
                        )}
                    </div>

                    {/* Capture Area Start */}
                    <div ref={cardRef} className="relative flex flex-col items-center w-full max-w-md bg-black p-4 md:p-8">

                        <div className="w-full aspect-square max-w-sm overflow-hidden bg-black border border-neutral-900 relative mb-12 group">
                            <div className="bracket-tl !border-[#333]"></div><div className="bracket-tr !border-[#333]"></div>
                            <div className="bracket-bl !border-[#333]"></div><div className="bracket-br !border-[#333]"></div>
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                                    <div className="w-8 h-8 border border-neutral-900 border-t-white rounded-full animate-spin mb-4"></div>
                                    <span className="text-[8px] uppercase tracking-[0.4em] font-accent animate-pulse">{loadingText}</span>
                                </div>
                            ) : resultImage ? (
                                <img src={resultImage} alt="HMBTI Vision" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2s]" crossOrigin="anonymous" />
                            ) : null}
                        </div>

                        <div className="text-center mb-16 relative w-full">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black font-accent opacity-5 tracking-tighter pointer-events-none">{result.type}</span>
                            <h3 className="text-7xl font-black font-accent tracking-tighter italic text-white leading-none relative z-10">{result.type}</h3>
                            <h4 className="text-lg font-bold text-white mt-4 uppercase tracking-[0.4em] inline-block border-y border-neutral-900 py-3">{typeDetail?.name}</h4>
                            <p className="text-sm text-neutral-400 italic mt-8 px-6 leading-relaxed max-w-xs mx-auto font-light">「 {typeDetail?.description} 」</p>
                        </div>

                        <div className="w-full space-y-16 px-4 mb-20">
                            {Object.entries(DIMENSION_DESCRIPTIONS).map(([key, config]) => {
                                const score = result.vector[key as Dimension];
                                // Max score per dimension: 6 questions * 1.5 = 9.
                                // Range is -9 to 9.
                                // C_B: Positive (+) points to B (Right).
                                // Others (I_E, O_X, G_F): Positive (+) points to Left (I, O, G).

                                const isPositiveRight = key === 'C_B';
                                const percentage = isPositiveRight
                                    ? ((score + 9) / 18) * 100 // -9 is C (0%), +9 is B (100%)
                                    : ((9 - score) / 18) * 100; // +9 is I (0%), -9 is E (100%)

                                const side = percentage > 50 ? 'right' : 'left';
                                const info = (config as any)[side];

                                return (
                                    <div key={key} className="relative">
                                        <div className="flex justify-between items-end mb-4">
                                            <div className={`transition-all duration-700 ${side === 'left' ? 'opacity-100' : 'opacity-25 scale-90'}`}>
                                                <span className="text-4xl font-black font-accent block leading-none text-white">{config.left.char}</span>
                                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{config.left.name}</span>
                                            </div>
                                            <span className="text-[7px] text-neutral-500 uppercase tracking-widest mb-1 font-bold">{config.label.split(' ')[0]}</span>
                                            <div className={`transition-all duration-700 text-right ${side === 'right' ? 'opacity-100' : 'opacity-25 scale-90'}`}>
                                                <span className="text-4xl font-black font-accent block leading-none text-white">{config.right.char}</span>
                                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{config.right.name}</span>
                                            </div>
                                        </div>
                                        <div className="h-px w-full bg-neutral-900 relative">
                                            <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rotate-45 transition-all duration-1000 shadow-[0_0_10px_white]" style={{ left: `calc(${percentage}% - 6px)` }}></div>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-6 leading-relaxed font-light pl-4 border-l border-neutral-900">
                                            <span className="text-white font-bold mr-2">[{info.char}]</span>{info.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* QR Code Section (Visible always, but highlighted in export) */}
                        <div className="w-full flex justify-between items-end border-t border-neutral-900 pt-8 mt-4">
                            <div className="text-left">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">HMBTI SYSTEM</p>
                                <p className="text-[8px] text-neutral-700 font-mono">PROTOCOL V1.05</p>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white/5 border border-white/10 rounded-sm">
                                <QRCodeSVG value={homeUrl} size={64} bgColor="transparent" fgColor="#ffffff" level="L" />
                                <span className="text-[8px] text-neutral-400 mt-2 uppercase tracking-widest">Scan to Analyze</span>
                            </div>
                        </div>

                    </div>
                    {/* Capture Area End */}

                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
    );
};
