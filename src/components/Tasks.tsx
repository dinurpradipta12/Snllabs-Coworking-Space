import { useState, useEffect, useCallback } from 'react';
import { PlayCircle, CheckSquare, Clock, ArrowLeft, Lock, BookOpen, Award, FileText, Upload, Link as LinkIcon, Activity, Zap, MessageSquare, ChevronDown, ChevronUp, X, Timer, AlertCircle, Download } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Tasks() {
  const { curriculums, loading } = useData();
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  // Quiz States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimer, setQuizTimer] = useState(5);
  const [quizResult, setQuizResult] = useState<'pass' | 'fail' | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuizCurriculumId, setActiveQuizCurriculumId] = useState<number | null>(null);
  const [passedQuizzes, setPassedQuizzes] = useState<number[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  // Quiz Logic Functions
  const startQuiz = (currId: number) => {
    const curr = curriculums.find(c => c.id === currId);
    // Find the last completed module or first module with questions
    const moduleWithQuiz = curr?.modules.find((m: any) => m.questions && m.questions.length > 0) || curr?.modules[0];
    
    if (!moduleWithQuiz?.questions || moduleWithQuiz.questions.length === 0) {
      alert("Post-test belum tersedia untuk modul ini.");
      return;
    }

    setQuizQuestions(moduleWithQuiz.questions);
    setActiveQuizCurriculumId(currId);
    setIsQuizOpen(true);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setQuizTimer(15); // Increased timer for real thinking
    setQuizResult(null);
    setQuizActive(true);
  };

  const nextQuestion = useCallback((isCorrect: boolean) => {
    if (isCorrect) setQuizScore(s => s + 1);
    
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
      setQuizTimer(15);
    } else {
      setQuizActive(false);
      const finalScore = ((quizScore + (isCorrect ? 1 : 0)) / quizQuestions.length) * 100;
      if (finalScore >= 80 && activeQuizCurriculumId) { // Changed to 80%
        setPassedQuizzes(prev => [...new Set([...prev, activeQuizCurriculumId])]);
        setQuizResult('pass');
      } else {
        setQuizResult('fail');
      }
    }
  }, [currentQuestionIdx, quizQuestions.length, quizScore, activeQuizCurriculumId]);

  useEffect(() => {
    let interval: any;
    if (quizActive && quizTimer > 0) {
      interval = setInterval(() => setQuizTimer(t => t - 1), 1000);
    } else if (quizTimer === 0 && quizActive) {
      nextQuestion(false);
    }
    return () => clearInterval(interval);
  }, [quizTimer, quizActive, nextQuestion]);

  if (loading) return <div className="p-10 font-black italic animate-pulse">Loading Curriculums...</div>;


  const handleCurriculumClick = (curr: any) => {
    if (curr.status === 'Locked') return;
    setSelectedCurriculumId(curr.id);
    if (curr.modules.length > 0) {
      setActiveModuleId(curr.modules[0].id);
    } else {
      setActiveModuleId(null);
    }
  };

  const handleBackToCurriculums = () => {
    setSelectedCurriculumId(null);
    setActiveModuleId(null);
  };

  // VIEW: 15 CURRICULUMS LIST
  if (selectedCurriculumId === null) {
    const completedVal = curriculums.filter(c => c.status === 'Done').length;
    const progressPerc = Math.round((completedVal / curriculums.length) * 100);

    return (
      <div className="space-y-6 pb-24 border-[#1e293b]">
        {/* Header Peta Kurikulum - Thin & No Box */}
        <div className="flex justify-between items-end mb-4 border-b-2 border-dashed border-[#1e293b] pb-4 px-2">
          <div>
            <h2 className="font-black text-2xl  italic flex items-center gap-2">
              <BookOpen size={28} className="text-[#ffda79]" /> Peta Kurikulum
            </h2>
            <p className="font-bold text-[11px] text-[#1e293b]/50 mt-1  tracking-tight">15 Modul Perjalanan Menjadi Social Media Specialist Expert.</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black  text-[#1e293b]/40 mb-1">Kurikulum Selesai</span>
            <div className="bg-[#1e293b] text-white px-3 py-1 rounded-lg border-2 border-[#1e293b] font-black italic text-xl shadow-[3px_3px_0px_#22d3ee]">
               {progressPerc}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {curriculums.map((curr, idx) => {
            // A curriculum is locked if it's not the first one AND the previous one hasn't been passed via quiz
            const isManualLocked = curr.status === 'Locked';
            const isQuizLocked = idx > 0 && !passedQuizzes.includes(curriculums[idx-1].id);
            const isLocked = isManualLocked || isQuizLocked;
            
            const showQuiz = curr.status === 'Done' && idx < curriculums.length - 1;

            return (
              <div key={curr.id} className="flex items-center gap-3 group">
                <div 
                  onClick={() => !isLocked && handleCurriculumClick(curr)}
                  className={`flex-1 bg-white border-4 border-[#1e293b] rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-full ${isLocked ? 'opacity-60 cursor-not-allowed filter grayscale relative overflow-hidden' : 'cursor-pointer hover:-translate-y-2 hover:shadow-[6px_6px_0px_#1e293b] shadow-[3px_3px_0px_#1e293b]'}`}
                >
                  {isLocked && <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center z-10">
                    <div className="bg-[#1e293b] text-white px-3 py-1 rounded-lg border-2 border-white font-black text-[10px]  shadow-[4px_4px_0px_#ff4757]">Terkunci Post-Test</div>
                  </div>}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                       <div className={`w-12 h-12 rounded-xl border-2 border-[#1e293b] flex items-center justify-center shadow-[2px_2px_0px_#1e293b] ${curr.coverColor} ${curr.status === 'Done' ? 'text-[#1e293b]' : 'text-white'}`}>
                         {isLocked ? <Lock size={20} className="text-[#1e293b]" /> : curr.status === 'Done' ? <CheckSquare size={20} /> : <PlayCircle size={20} className="text-[#1e293b]" />}
                       </div>
                       <span className={`text-[9px]  font-black px-2 py-1 rounded border-2 border-[#1e293b] ${isLocked ? 'bg-gray-400 text-white' : curr.status === 'Done' ? 'bg-[#ffda79] text-[#1e293b]' : curr.status === 'In Progress' ? 'bg-[#22d3ee] text-[#1e293b]' : 'bg-[#fffdf5] text-[#1e293b]'}`}>
                       {curr.status}
                     </span>
                    </div>
                    <h3 className="font-black text-lg  leading-tight mb-2 line-clamp-2">{curr.title}</h3>
                    <p className="text-xs font-bold text-[#1e293b]/60 line-clamp-2">{curr.desc}</p>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-end border-t-2 border-dashed border-[#1e293b] pt-4">
                    <div>
                      <span className="text-[10px] font-black  opacity-50 block mb-1">Bounty</span>
                      <span className="bg-[#1e293b] text-white px-2 py-1 rounded border-2 border-[#1e293b] text-xs font-black">+{curr.xpReward} XP</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black  opacity-50 block mb-1">Materi</span>
                      <span className="font-black text-sm">{curr.totalModules} Sesi</span>
                    </div>
                  </div>
                </div>
                
                {/* Post Test Button on the Right Side */}
                {showQuiz && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      startQuiz(curr.id);
                    }}
                    title={`Post-Test ${curr.title}`}
                    className="h-[80%] w-12 bg-[#22d3ee] text-[#1e293b] border-4 border-[#1e293b] rounded-xl font-black flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group/btn"
                  >
                    <Zap size={20} fill="currentColor" className="group-hover/btn:animate-bounce" />
                    <span className="[writing-mode:vertical-lr] rotate-180 text-[10px]  tracking-widest whitespace-nowrap">Post Test</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  // VIEW: CURRICULUM DETAIL (MODULES) LAYAOUT = KIRI VIDEO, KANAN MATERI
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) return url;
    
    // YouTube transformation
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    
    return url;
  };

  const curriculum = curriculums.find(c => c.id === selectedCurriculumId);
  if (!curriculum) return null;

  const activeModule = curriculum.modules.find(m => m.id === activeModuleId) || curriculum.modules[0];

  return (
    <div className="space-y-6 pb-24 border-[#1e293b] relative">
      {/* Quiz Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e293b]/80 backdrop-blur-sm">
          <div className="bg-white border-8 border-[#1e293b] w-full max-w-2xl rounded-3xl overflow-hidden shadow-[12px_12px_0px_#22d3ee] relative">
             {quizActive ? (
               <>
                 <div className="bg-[#1e293b] p-6 border-b-8 border-[#1e293b] flex justify-between items-center text-white">
                     <h3 className="font-black text-xl  italic">🚀 Post Test: Sesi {currentQuestionIdx + 1}/{quizQuestions.length}</h3>
                    <div className="bg-[#22d3ee] text-[#1e293b] px-4 py-2 rounded-xl flex items-center gap-2 border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b]">
                       <Timer size={20} className="animate-pulse" />
                       <span className="font-black text-xl">{quizTimer}s</span>
                    </div>
                 </div>
                 <div className="p-8">
                    <h4 className="font-black text-2xl mb-8 leading-tight ">{quizQuestions[currentQuestionIdx].q}</h4>
                    <div className="grid grid-cols-1 gap-4">
                       {quizQuestions[currentQuestionIdx].options.map((opt, i) => (
                         <button 
                           key={i}
                           onClick={() => nextQuestion(i === quizQuestions[currentQuestionIdx].correct)}
                           className="bg-white border-4 border-[#1e293b] p-4 rounded-2xl font-black text-left hover:bg-[#22d3ee] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1e293b] transition-all flex items-center gap-4 group"
                         >
                           <span className="w-10 h-10 rounded-lg border-2 border-[#1e293b] flex items-center justify-center bg-[#1e293b] text-white group-hover:bg-white group-hover:text-[#1e293b]">{String.fromCharCode(65 + i)}</span>
                           {opt}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="h-4 bg-gray-200 border-t-4 border-[#1e293b]">
                    <div className="h-full bg-[#1e293b] transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}></div>
                 </div>
               </>
             ) : (
               <div className="p-12 text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 border-[#1e293b] flex items-center justify-center mb-6 shadow-[6px_6px_0px_#1e293b] ${quizResult === 'pass' ? 'bg-[#22d3ee]' : 'bg-[#ffda79]'}`}>
                    {quizResult === 'pass' ? <CheckSquare size={48} /> : <AlertCircle size={48} />}
                  </div>
                  <h3 className="font-black text-4xl  mb-2 italic">{quizResult === 'pass' ? 'Lulus Cemerlang!' : 'Coba Lagi!'}</h3>
                  <p className="font-bold text-lg mb-8 opacity-70">Skor Anda: {Math.round((quizScore / quizQuestions.length) * 100)}% (Kriteria: 80%)</p>
                  
                  {quizResult === 'pass' ? (
                    <button 
                      onClick={() => {
                        setIsQuizOpen(false);
                        // Optional: trigger navigation to next curriculum if we want
                      }}
                      className="bg-[#22d3ee] text-[#1e293b] px-12 py-4 rounded-2xl font-black  text-xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#1e293b] hover:shadow-none transition-all"
                    >
                      Buka Tahapan Selanjutnya!
                    </button>
                  ) : (
                    <button 
                      onClick={() => activeQuizCurriculumId && startQuiz(activeQuizCurriculumId)}
                      className="bg-[#22d3ee] text-[#1e293b] px-12 py-4 rounded-2xl font-black  text-xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#1e293b] hover:shadow-none transition-all"
                    >
                      Ulangi Tes
                    </button>
                  )}
                  <button onClick={() => setIsQuizOpen(false)} className="block mx-auto mt-6 font-black  text-xs underline">Mungkin Nanti</button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Header Back Button & Info */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <button 
          onClick={handleBackToCurriculums}
          className="bg-white px-4 py-2 w-fit rounded-xl border-4 border-[#1e293b] font-black  tracking-tight text-xs flex items-center gap-2 shadow-[2px_2px_0px_#1e293b] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Kembali
        </button>
        <div className="flex gap-2">
           <span className="bg-[#ffda79] px-3 py-1.5 rounded-xl border-2 border-[#1e293b] font-black text-xs shadow-[2px_2px_0px_#1e293b]">Total: {curriculum.totalModules} Sesi</span>
           <span className="bg-[#1e293b] text-white px-3 py-1.5 rounded-xl border-2 border-[#1e293b] font-black text-xs shadow-[2px_2px_0px_#22d3ee] focus:outline-none">+{curriculum.xpReward} XP</span>
        </div>
      </div>

      <div className="border-b-4 border-[#1e293b] pb-6 mb-2">
        <h2 className="font-black text-2xl md:text-4xl  italic text-[#1e293b] leading-none mb-3">
          {curriculum.title}
        </h2>
        <p className="font-bold text-sm text-[#1e293b]/50  tracking-tight">
          {curriculum.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-4 border-[#1e293b] rounded-2xl overflow-hidden shadow-[6px_6px_0px_#1e293b]">
            {activeModule.videoUrl ? (
              <div className="w-full aspect-video bg-[#1e293b] relative border-b-4 border-[#1e293b]">
                <iframe className="w-full h-full" src={getEmbedUrl(activeModule.videoUrl)} title="Video Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-200 border-b-4 border-[#1e293b] flex flex-col items-center justify-center p-6 text-center">
                <Lock size={48} className="mb-4 opacity-50" />
                <h3 className="font-black text-xl  mb-2">Video Tidak Tersedia / Terkunci</h3>
                <p className="font-bold opacity-60">Selesaikan modul sebelumnya untuk membuka video ini.</p>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[9px]  font-black px-2 py-0.5 rounded border-2 border-[#1e293b] ${activeModule.status === 'Locked' ? 'bg-gray-400 text-white' : activeModule.status === 'Done' ? 'bg-green-400' : 'bg-[#ffda79]'}`}>
                  {activeModule.status}
                </span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded border-2 border-[#1e293b] text-[9px] font-black">
                  +{activeModule.xp} XP
                </span>
              </div>
              <h3 className="font-black text-xl md:text-2xl  leading-tight mb-3">{activeModule.title}</h3>
              <p className="text-xs md:text-sm font-bold text-[#1e293b]/80 leading-relaxed">{activeModule.desc}</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Playlist Materi & Insight Mentor */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-[#1e293b] rounded-2xl overflow-hidden shadow-[6px_6px_0px_#1e293b]">
             <div className="bg-white p-4 border-b-4 border-[#1e293b] flex justify-between items-center">
               <h3 className="font-black text-lg  italic flex items-center gap-2">
                  <FileText size={20} /> Daftar Materi
               </h3>
               <span className="text-[10px] font-black  px-2 py-0.5 bg-[#1e293b] text-white rounded border-2 border-transparent">{curriculum.modules.length} Item</span>
             </div>
             <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto bg-gray-50">
                {curriculum.modules.map((mod, i) => {
                  const isActive = activeModuleId === mod.id;
                  const isLocked = mod.status === 'Locked';
                  return (
                    <div 
                      key={mod.id} 
                      onClick={() => !isLocked && setActiveModuleId(mod.id)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        isLocked 
                          ? 'bg-gray-200 border-[#1e293b]/10 opacity-60 cursor-not-allowed' 
                          : isActive 
                            ? 'bg-[#22d3ee] border-[#1e293b] shadow-[3px_3px_0px_#1e293b] cursor-pointer scale-[1.02]' 
                            : 'bg-white border-[#1e293b] shadow-[1px_1px_0px_#1e293b] hover:-translate-y-1 hover:shadow-[3px_3px_0px_#1e293b] cursor-pointer'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 flex items-center justify-center bg-white ${isLocked ? 'border-gray-400 text-gray-500' : 'border-[#1e293b] text-[#1e293b]'}`}>
                         {isLocked ? <Lock size={14} /> : mod.status === 'Done' ? <CheckSquare size={14} className="text-green-500" /> : <PlayCircle size={14} />}
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-[11px] font-black  leading-tight line-clamp-2 mb-1">{mod.title}</h4>
                        <span className="text-[9px] font-bold block opacity-70 tracking-tighter">{mod.status} • {mod.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-white border-4 border-[#1e293b] p-5 rounded-2xl shadow-[6px_6px_0px_#1e293b]">
            <h4 className="font-black text-base  mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#22d3ee]" /> Asset Kelas
            </h4>
            <div className="space-y-3">
              {Array.isArray(activeModule.assets) && activeModule.assets.length > 0 ? (
                activeModule.assets.map((asset: any, idx: number) => (
                  <a 
                    key={idx}
                    href={asset.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#fffdf5] border-2 border-[#1e293b] p-3 rounded-xl flex items-center justify-between group hover:bg-[#ffda79] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg border-2 border-[#1e293b]"><FileText size={16} /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black ">{asset.name || `Asset_${idx + 1}.pdf`}</span>
                        <span className="text-[8px] font-bold opacity-50">Sesi Asset • Link External</span>
                      </div>
                    </div>
                    <div className="bg-[#1e293b] text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                      <Download size={14} />
                    </div>
                  </a>
                ))
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-[#1e293b]/20 p-4 rounded-xl text-center">
                   <p className="text-[9px] font-black  opacity-40 mb-2 italic">Belum ada asset tambahan untuk sesi ini.</p>
                   <button className="text-[9px] font-black  text-[#22d3ee] underline">Request Asset Ke Mentor</button>
                </div>
              )}
            </div>
          </div>

          {activeModule && (
            <div className="bg-[#fffdf5] border-4 border-[#1e293b] p-5 rounded-2xl shadow-[6px_6px_0px_#1e293b]">
              <h4 className="font-black text-base  mb-4 flex items-center gap-2">
                <Upload size={18} className="text-[#ff4757]" /> Pengumpulan Praktik
              </h4>
              
              {activeModule.status === 'Done' ? (
                <div className="bg-[#22d3ee] border-4 border-[#1e293b] p-4 rounded-xl text-center shadow-[4px_4px_0px_#1e293b]">
                  <span className="font-black text-[#1e293b]  text-xs italic">✓ Modul Selesai!</span>
                </div>
              ) : activeModule.status === 'Locked' ? (
                 <div className="bg-gray-200 border-4 border-[#1e293b] p-4 rounded-xl text-center flex flex-col items-center opacity-70">
                  <Lock size={20} className="mb-2" />
                  <span className="font-black text-[#1e293b]  text-[10px]">Upload Terkunci</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex group">
                    <span className="bg-[#1e293b] text-white px-3 flex items-center rounded-l-xl border-2 border-r-0 border-[#1e293b] font-black">
                      <LinkIcon size={16} />
                    </span>
                    <input type="url" placeholder={activeModule.submissionHint || "Paste URL tugas di sini..."} className="flex-1 w-full min-w-0 p-3 border-2 border-[#1e293b] rounded-r-xl bg-white font-bold text-xs focus:outline-none focus:bg-[#ffda79]/20" />
                  </div>
                  <button className="w-full bg-[#22d3ee] text-[#1e293b] py-3 flex items-center justify-center gap-2 rounded-xl border-4 border-[#1e293b] font-black  tracking-tight text-xs shadow-[4px_4px_0px_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <CheckSquare size={16} /> Selesai (+{activeModule.xp})
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-[#22d3ee] text-[#1e293b] border-4 border-[#1e293b] p-6 rounded-2xl shadow-[6px_6px_0px_#1e293b] relative overflow-hidden">
             <div className="absolute -bottom-4 -right-4 text-[#1e293b]/5"><Zap size={100} fill="currentColor" /></div>
             <h3 className="font-black text-sm  italic flex items-center gap-2 border-b-4 border-[#1e293b] pb-3 mb-4 relative z-10 text-[#1e293b]">
                <Zap size={20} className="text-[#ffda79]" fill="currentColor" style={{ filter: 'drop-shadow(1px 1px 0px black)' }} /> Insight Terkait Sesi
             </h3>
             <div className="relative z-10">
                <p className="text-xs font-black italic leading-relaxed text-[#1e293b]/80">
                  "{activeModule.insight || 'Tonton video sampai tuntas. Perhatikan template yang dibagikan karena berguna untuk praktek submission aset di modul ini!'}"
                </p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#1e293b]/20">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1e293b] flex items-center justify-center text-[#1e293b]"><MessageSquare size={12} /></div>
                  <span className="text-[10px] font-black ">{activeModule.coach || 'Coach Ryan'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
