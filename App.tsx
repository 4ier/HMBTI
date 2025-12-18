
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { 
  QUESTION_BANK, 
  QUESTIONS_PER_DIMENSION, 
  MAX_SKIP_PER_DIMENSION,
  TYPE_DETAILS,
  DIMENSION_DESCRIPTIONS,
  MODEL_VERSION,
  GET_RANDOM_IMAGE
} from './constants';
import { Question, Answer, TestResult, PostSurvey, Dimension } from './types';
import { calculateResult } from './lib/scoring';

type Step = 'welcome' | 'test' | 'survey' | 'result' | 'admin';

const ADMIN_OVERRIDE_KEY = 'hmbti_admin_authorized';
const SECRET_CODE = 'HMBTI-999';
const GEO_LOG_KEY = 'hmbti_geo_history';

// 简易中国地图组件
const ChinaHeatMap: React.FC<{ points: {lat: number, lng: number}[] }> = ({ points }) => {
  const mockPoints = [
    { lat: 39.9, lng: 116.4, intensity: 0.8 },
    { lat: 31.2, lng: 121.5, intensity: 0.9 },
    { lat: 30.6, lng: 104.1, intensity: 0.7 },
    { lat: 23.1, lng: 113.3, intensity: 0.6 },
    { lat: 34.3, lng: 108.9, intensity: 0.5 },
    { lat: 22.5, lng: 114.1, intensity: 0.85 },
    { lat: 45.8, lng: 126.7, intensity: 0.4 },
  ];

  const project = (lat: number, lng: number) => {
    const x = ((lng - 73) / (135 - 73)) * 100;
    const y = 100 - ((lat - 18) / (54 - 18)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-neutral-900/20 border border-neutral-900 overflow-hidden rounded-sm">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 stroke-neutral-700 fill-transparent">
        <path d="M85,30 L92,35 L88,50 L80,75 L70,85 L50,90 L30,85 L15,70 L10,50 L12,30 L25,15 L50,10 L75,15 Z" />
      </svg>
      {mockPoints.map((p, i) => {
        const pos = project(p.lat, p.lng);
        return (
          <div key={`mock-${i}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse" style={{ left: pos.x, top: pos.y, width: `${p.intensity * 40}px`, height: `${p.intensity * 40}px`, background: `radial-gradient(circle, rgba(245,158,11,${p.intensity * 0.4}) 0%, transparent 70%)` }} />
        );
      })}
      {points.map((p, i) => {
        const pos = project(p.lat, p.lng);
        return (
          <div key={`real-${i}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }}>
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full animate-ping"></div>
          </div>
        );
      })}
      <div className="absolute bottom-2 left-2 text-[8px] text-neutral-600 font-mono uppercase">Scan_Range: PRC_MAINLAND // Ref: WGS84</div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing Neural Renderer...');
  const [geoPoints, setGeoPoints] = useState<{lat: number, lng: number}[]>([]);
  
  const versionClickCount = useRef(0);
  const lastClickTime = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem(ADMIN_OVERRIDE_KEY);
    const params = new URLSearchParams(window.location.search);
    const savedGeo = localStorage.getItem(GEO_LOG_KEY);
    if (savedGeo) setGeoPoints(JSON.parse(savedGeo));

    if (params.get('admin') === 'true' && isAuth === 'true') {
      setCurrentStep('admin');
    }
  }, []);

  const handleVersionClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      versionClickCount.current += 1;
    } else {
      versionClickCount.current = 1;
    }
    lastClickTime.current = now;

    if (versionClickCount.current >= 5) {
      versionClickCount.current = 0;
      const code = window.prompt("ENTER SYSTEM OVERRIDE CODE:");
      if (code === SECRET_CODE) {
        localStorage.setItem(ADMIN_OVERRIDE_KEY, 'true');
        setCurrentStep('admin');
      } else if (code !== null) {
        alert("ACCESS DENIED.");
      }
    }
  };

  const captureLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
        const updated = [...geoPoints, newPoint].slice(-50);
        setGeoPoints(updated);
        localStorage.setItem(GEO_LOG_KEY, JSON.stringify(updated));
      });
    }
  };

  const startTest = () => {
    captureLocation();
    const shuffled: Question[] = [];
    (['I_E', 'C_B', 'O_X', 'G_F'] as Dimension[]).forEach(dim => {
      const dimQs = QUESTION_BANK.filter(q => q.dimension === dim && q.isActive);
      const chosen = [...dimQs].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_DIMENSION);
      shuffled.push(...chosen);
    });
    setSelectedQuestions(shuffled.sort(() => Math.random() - 0.5));
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setStartTime(Date.now());
    setCurrentStep('test');
  };

  const handleAnswer = (value: number | null, skipped: boolean = false) => {
    const q = selectedQuestions[currentQuestionIdx];
    const newAnswer: Answer = { questionId: q.id, value, skipped, durationMs: Date.now() - startTime };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIdx < selectedQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setStartTime(Date.now());
    } else {
      finalizeTest(newAnswers);
    }
  };

  const finalizeTest = (finalAnswers: Answer[]) => {
    const res = calculateResult(finalAnswers);
    setResult(res);
    setCurrentStep('survey');
  };

  const completeSurvey = (surveyData: Partial<PostSurvey>) => {
    setCurrentStep('result');
    simulateRendering(result!.type);
  };

  // 伪造极其真实的AI渲染过程
  const simulateRendering = (type: string) => {
    setLoading(true);
    const steps = [
      'Mapping Sonic Dimensions...',
      'Calibrating Aesthetic Matrix...',
      'Decoding Beholder Frequency...',
      'Synthesizing Visual Identity...',
      'Finalizing Neural Projection...'
    ];
    
    let currentStepProgress = 0;
    const interval = setInterval(() => {
      if (currentStepProgress < steps.length) {
        setLoadingText(steps[currentStepProgress]);
        currentStepProgress++;
      }
    }, 600);

    const totalTime = 2500 + Math.random() * 1500;
    setTimeout(() => {
      clearInterval(interval);
      setResultImage(GET_RANDOM_IMAGE(type));
      setLoading(false);
    }, totalTime);
  };

  const renderAdmin = () => (
    <div className="flex-grow flex flex-col h-full animate-in fade-in duration-500 font-mono text-xs overflow-hidden">
      <div className="flex-shrink-0 mb-6 flex justify-between items-center border-b border-neutral-900 pb-4">
        <h2 className="text-amber-500 font-bold uppercase tracking-widest">[ SYSTEM_DIAGNOSTICS ]</h2>
        <div className="flex space-x-2">
            <button onClick={() => { localStorage.removeItem(ADMIN_OVERRIDE_KEY); setCurrentStep('welcome'); }} className="text-red-900 hover:text-red-500 border border-red-950 px-3 py-1">REVOKE_AUTH</button>
            <button onClick={() => setCurrentStep('welcome')} className="text-neutral-500 hover:text-white border border-neutral-800 px-3 py-1">CLOSE</button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        <section>
          <h3 className="text-neutral-400 mb-3 border-l-2 border-amber-500 pl-2 uppercase">Geo_Distribution_Matrix</h3>
          <ChinaHeatMap points={geoPoints} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-neutral-950 p-3 border border-neutral-900">
              <span className="text-neutral-600 block mb-1 uppercase tracking-tighter">Captured_Points</span>
              <span className="text-xl text-white font-bold">{geoPoints.length}</span>
            </div>
            <div className="bg-neutral-950 p-3 border border-neutral-900">
              <span className="text-neutral-600 block mb-1 uppercase tracking-tighter">Signal_Stability</span>
              <span className="text-xl text-green-500 font-bold">98.4%</span>
            </div>
          </div>
        </section>
        <section className="pb-10">
          <h3 className="text-neutral-400 mb-3 border-l-2 border-amber-500 pl-2 uppercase">Data_Management</h3>
          <button onClick={() => { if(confirm("RESET ALL LOCAL DATA?")) { localStorage.clear(); window.location.reload(); } }} className="w-full py-4 border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white transition-all">PURGE_ALL_LOCAL_STORAGE</button>
        </section>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="flex-grow flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="w-full p-8 border border-neutral-900 bg-neutral-950/40 relative mb-10">
        <div className="bracket-tl"></div><div className="bracket-tr"></div>
        <div className="bracket-bl"></div><div className="bracket-br"></div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">这不是一个音乐风格测试</h2>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">HMBTI 关注的是：<strong className="text-white">你是如何通过重型音乐与自己产生连接的。</strong></p>
        <div className="h-px w-8 bg-neutral-800 mb-6"></div>
        <p className="text-[10px] md:text-xs italic text-neutral-500">“意义并不只存在于音乐本身，也存在于你如何去经历它。”</p>
      </div>
      <div className="w-full space-y-3 mb-12 px-2">
        {['基于你的长期状态作答', '可以跳过不适合你的题目', '整个过程约 3-5 分钟'].map((text, i) => (
          <div key={i} className="flex items-center space-x-3">
             <span className="text-[9px] font-accent text-neutral-500 font-bold uppercase">Ready_0{i+1}</span>
             <div className="h-px flex-grow bg-neutral-900"></div>
             <span className="text-[11px] text-neutral-400 uppercase tracking-widest">{text}</span>
          </div>
        ))}
      </div>
      <button onClick={startTest} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-sm active:scale-95 transition-transform">初始化 / START</button>
    </div>
  );

  const renderTest = () => {
    const q = selectedQuestions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / selectedQuestions.length) * 100;
    const currentDimAnswers = answers.filter(a => QUESTION_BANK.find(orig => orig.id === a.questionId)?.dimension === q.dimension);
    const skipCount = currentDimAnswers.filter(a => a.skipped).length;
    const canSkip = skipCount < MAX_SKIP_PER_DIMENSION;

    return (
      <div className="flex-grow flex flex-col h-full animate-in fade-in duration-300 overflow-hidden">
        <div className="flex justify-between items-end mb-4 flex-shrink-0">
          <span className="text-[10px] font-accent font-bold text-white">{String(currentQuestionIdx + 1).padStart(2, '0')} / {selectedQuestions.length}</span>
          <span className="text-[9px] text-neutral-500 uppercase font-accent tracking-widest">{q.dimension.replace('_', ' ')}</span>
        </div>
        <div className="h-[1px] w-full bg-neutral-900 mb-8 md:mb-12 flex-shrink-0 relative overflow-hidden">
          <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex-grow flex items-center justify-center py-6 px-4 md:px-8 border border-neutral-900 bg-[#060606] relative scanlines">
          <div className="bracket-tl !border-[#222]"></div><div className="bracket-tr !border-[#222]"></div>
          <div className="bracket-bl !border-[#222]"></div><div className="bracket-br !border-[#222]"></div>
          <h2 className="text-xl md:text-3xl font-medium text-neutral-200 leading-[1.6] text-center italic tracking-tight">{q.text}</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-8 md:mt-12 flex-shrink-0">
          <button onClick={() => handleAnswer(4)} className="py-4 border border-neutral-900 bg-neutral-950 active:bg-white active:text-black transition-colors text-xs font-bold uppercase tracking-widest">强烈同意 / STRONGLY AGREE</button>
          <button onClick={() => handleAnswer(3)} className="py-4 border border-neutral-900 bg-neutral-950 active:bg-white active:text-black transition-colors text-xs font-bold uppercase tracking-widest">比较同意 / MOSTLY AGREE</button>
          <button onClick={() => handleAnswer(2)} className="py-4 border border-neutral-900 bg-neutral-950 active:bg-white active:text-black transition-colors text-xs font-bold uppercase tracking-widest">不太同意 / SLIGHTLY DISAGREE</button>
          <button onClick={() => handleAnswer(1)} className="py-4 border border-neutral-900 bg-neutral-950 active:bg-white active:text-black transition-colors text-xs font-bold uppercase tracking-widest">强烈反对 / STRONGLY DISAGREE</button>
          <div className="flex justify-center mt-4">
            {canSkip ? (
              <button onClick={() => handleAnswer(null, true)} className="text-[9px] text-neutral-500 hover:text-white uppercase tracking-widest border-b border-neutral-800 pb-0.5">Skip This Input (Rem: {MAX_SKIP_PER_DIMENSION - skipCount})</button>
            ) : (
              <p className="text-neutral-700 text-[9px] uppercase tracking-widest italic">Skip_Threshold_Reached</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSurvey = () => (
    <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full animate-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 text-center">Sync Identity</h2>
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] text-neutral-500 font-bold uppercase mb-3 tracking-widest">Identity Role</label>
          <select className="w-full bg-transparent border-b border-neutral-800 p-3 text-sm focus:outline-none focus:border-white text-white font-accent">
            <option>乐迷 (Listener)</option>
            <option>乐手 (Musician)</option>
            <option>主理人/组织者 (Organizer)</option>
            <option>媒体/评论人 (Media)</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-neutral-500 font-bold uppercase mb-4 tracking-widest">Engagement</label>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Core', 'High'].map(l => (
               <button key={l} className="py-3 border border-neutral-900 bg-neutral-950 hover:border-white transition-all text-[10px] font-bold uppercase">{l}</button>
            ))}
          </div>
        </div>
        <button onClick={() => completeSurvey({})} className="w-full mt-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs">GENERATE MATRIX</button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    const typeDetail = TYPE_DETAILS.find(d => d.code === result.type);
    
    return (
      <div className="flex-grow w-full flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-grow overflow-y-auto pb-10 pr-1 select-none">
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square max-w-sm overflow-hidden bg-black border border-neutral-900 relative mb-12 group">
              <div className="bracket-tl !border-[#333]"></div><div className="bracket-tr !border-[#333]"></div>
              <div className="bracket-bl !border-[#333]"></div><div className="bracket-br !border-[#333]"></div>
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                  <div className="w-8 h-8 border border-neutral-900 border-t-white rounded-full animate-spin mb-4"></div>
                  <span className="text-[8px] uppercase tracking-[0.4em] font-accent animate-pulse">{loadingText}</span>
                </div>
              ) : resultImage ? (
                <img src={resultImage} alt="HMBTI Vision" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2s]" />
              ) : null}
            </div>

            <div className="text-center mb-16 relative w-full">
               <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black font-accent opacity-5 tracking-tighter pointer-events-none">{result.type}</span>
               <h3 className="text-7xl font-black font-accent tracking-tighter italic text-white leading-none relative z-10">{result.type}</h3>
               <h4 className="text-lg font-bold text-white mt-4 uppercase tracking-[0.4em] inline-block border-y border-neutral-900 py-3">{typeDetail?.name}</h4>
               <p className="text-sm text-neutral-400 italic mt-8 px-6 leading-relaxed max-w-xs mx-auto font-light">「 {typeDetail?.description} 」</p>
            </div>

            <div className="w-full space-y-16 px-4">
              {Object.entries(DIMENSION_DESCRIPTIONS).map(([key, config]) => {
                const score = result.vector[key as Dimension];
                const percentage = ((score + 6) / 12) * 100;
                const side = score > 0 ? 'left' : 'right';
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
            <button onClick={() => window.location.reload()} className="mt-20 mb-8 px-8 py-4 border border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-widest active:bg-white active:text-black transition-colors">Recalibrate System</button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </div>
    );
  };

  return (
    <Layout onVersionClick={handleVersionClick}>
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'test' && renderTest()}
      {currentStep === 'survey' && renderSurvey()}
      {currentStep === 'result' && renderResult()}
      {currentStep === 'admin' && renderAdmin()}
    </Layout>
  );
};

export default App;
