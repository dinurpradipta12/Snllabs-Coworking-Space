import { useState } from 'react';
import { PlayCircle, CheckSquare, Clock, ArrowLeft, Lock, BookOpen, Award, FileText, Upload, Link as LinkIcon, Activity, Zap, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function Tasks() {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const curriculums = [
    {
      id: 1,
      title: 'M1: Fundamental Social Media',
      desc: 'Pahami lanskap media sosial, peran spesialis, dan mindset dasar yang dibutuhkan industri.',
      xpReward: 500,
      status: 'Done',
      totalModules: 3,
      coverColor: 'bg-[#ffda79]',
      modules: [
        { id: '1a', title: 'Peran Social Media Specialist', status: 'Done', xp: 100, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', desc: 'Pemahaman mendasar hari demi hari, tanggung jawab, dan mindset seorang Social Media Specialist yang sukses.', submissionType: 'url', submissionHint: 'Paste Link Dokumen Jawaban (Drive)' },
        { id: '1b', title: 'Anatomi Platform Platform Utama', status: 'Done', xp: 200, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', desc: 'Bagaimana membedakan target pasar yang ada di TikTok vs Instagram vs LinkedIn.', submissionType: 'url', submissionHint: 'Paste Link Dokumen Jawaban (Drive)' },
      ]
    },
    {
      id: 2,
      title: 'M2: Platform Algorithm Mastery',
      desc: 'Kenali cara kerja algoritma Instagram, TikTok, LinkedIn, dan X secara mendalam.',
      xpReward: 800,
      status: 'In Progress',
      totalModules: 4,
      coverColor: 'bg-[#22d3ee]',
      modules: [
        { id: '2a', title: 'Algoritma Instagram & Reels', status: 'Done', xp: 200, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', desc: 'Prioritas metrik utama di Instagram adalah Saves dan Shares. Pelajari cara agar konten Anda sering di-Save oleh kompetitor.', submissionType: 'url', submissionHint: 'Paste Link Analisa IG (Google Docs)' },
        { id: '2b', title: 'Algoritma FYP TikTok', status: 'In Progress', xp: 300, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', desc: 'Retention Rate dan Hook di 3 detik pertama menentukan apakah konten masuk FYP atau tertahan di level audience rendah.', submissionType: 'url', submissionHint: 'Paste Link Video TikTok Draft' },
        { id: '2c', title: 'Algoritma LinkedIn B2B', status: 'Locked', xp: 300, videoUrl: '', desc: 'Membangun personal branding profesional.', submissionType: 'url', submissionHint: 'Terkunci' }
      ]
    },
    {
      id: 3,
      title: 'M3: Target Audience & Persona',
      desc: 'Cara menentukan dan membedah profil buyer persona agar konten tepat sasaran.',
      xpReward: 600,
      status: 'Pending',
      totalModules: 2,
      coverColor: 'bg-[#ff4757]',
      modules: [
        { id: '3a', title: 'Riset Demografi & Psikografi', status: 'Pending', xp: 300, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', desc: 'Gunakan tools analisis audience untuk menentukan audiens brand yang tepat.', submissionType: 'url', submissionHint: 'Paste Link Screenshot Riset (Drive)' },
        { id: '3b', title: 'Membuat Buyer Persona Asli', status: 'Locked', xp: 300, videoUrl: '', desc: 'Praktek membuat 3 persona brand.', submissionType: 'url', submissionHint: 'Paste Link PDF Persona (Drive)' }
      ]
    },
    { id: 4, title: 'M4: Content Strategy & Pillar', desc: 'Menyusun pilar konten (Edukasi, Hiburan, Soft-selling) untuk 30 hari.', xpReward: 750, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
    { id: 5, title: 'M5: Copywriting for Social Media', desc: 'Formula AIDA, PAS, dan storytelling khusus caption dan hook.', xpReward: 600, status: 'Locked', totalModules: 4, coverColor: 'bg-gray-300', modules: [] },
    { id: 6, title: 'M6: Visual Creation (Canva)', desc: 'Dasar desain grafis, tipografi, dan komposisi warna untuk feed.', xpReward: 500, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
    { id: 7, title: 'M7: Short-Form Video (CapCut)', desc: 'Teknik editing Reels/TikTok, transisi, dan pemilihan audio trending.', xpReward: 900, status: 'Locked', totalModules: 5, coverColor: 'bg-gray-300', modules: [] },
    { id: 8, title: 'M8: Content Calendar & Tools', desc: 'Menggunakan spreadsheet, Trello, atau Notion untuk manajemen jadwal post.', xpReward: 400, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
    { id: 9, title: 'M9: Community Management', desc: 'Teknik membalas komentar, interaksi DM, dan gamifikasi audiens.', xpReward: 500, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
    { id: 10, title: 'M10: Social Media Analytics', desc: 'Membaca data insight, engagement rate, dan membuat pelaporan bulanan.', xpReward: 800, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
    { id: 11, title: 'M11: Influencer Marketing', desc: 'Cara mencari KOL, negosiasi rate card, dan penyusunan brief.', xpReward: 600, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
    { id: 12, title: 'M12: Social Media Advertising', desc: 'Dasar Meta Ads (Facebook/IG) & TikTok Ads Manager untuk pemula.', xpReward: 1000, status: 'Locked', totalModules: 4, coverColor: 'bg-gray-300', modules: [] },
    { id: 13, title: 'M13: Audit & Optimization', desc: 'Melakukan audit kesehatan akun sendiri vs kompetitor (Benchmarking).', xpReward: 700, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
    { id: 14, title: 'M14: Crisis Management & PR', desc: 'Menangani bad review, blunder konten, dan PR response standar.', xpReward: 600, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
    { id: 15, title: 'M15: Capstone Project', desc: 'Membangun kampanye utuh dari nol untuk brand nyata.', xpReward: 2000, status: 'Locked', totalModules: 1, coverColor: 'bg-gray-300', modules: [] },
  ];

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
    const totalXP = curriculums.filter(c => c.status === 'Done').reduce((sum, c) => sum + c.xpReward, 0);
    const completedVal = curriculums.filter(c => c.status === 'Done').length;
    const progressPerc = Math.round((completedVal / curriculums.length) * 100);

    return (
      <div className="space-y-6 pb-24 border-black">
        <div className="bg-black text-white p-6 rounded-2xl border-4 border-[#22d3ee] shadow-[6px_6px_0px_#22d3ee] flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-black text-2xl md:text-3xl uppercase italic flex items-center gap-3">
              <BookOpen size={36} className="text-[#ffda79]" /> Peta Kurikulum
            </h2>
            <p className="font-bold text-sm mt-2 text-[#22d3ee]">15 Modul Perjalanan Menjadi Social Media Specialist Expert.</p>
          </div>
          <div className="text-right z-10 hidden md:block">
            <div className="bg-white text-black p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000]">
               <div className="text-[10px] font-black uppercase text-black/50 mb-1">Kurikulum Selesai</div>
               <div className="text-2xl font-black italic">{progressPerc}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {curriculums.map((curr) => {
            const isLocked = curr.status === 'Locked';
            return (
              <div 
                key={curr.id}
                onClick={() => handleCurriculumClick(curr)}
                className={`bg-white border-4 border-black rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${isLocked ? 'opacity-60 cursor-not-allowed filter grayscale' : 'cursor-pointer hover:-translate-y-2 hover:shadow-[6px_6px_0px_#000000] shadow-[3px_3px_0px_#000000]'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] ${curr.coverColor} ${curr.status === 'Done' ? 'text-black' : 'text-white'}`}>
                       {isLocked ? <Lock size={20} className="text-black" /> : curr.status === 'Done' ? <CheckSquare size={20} /> : <PlayCircle size={20} className="text-black" />}
                     </div>
                     <span className={`text-[9px] uppercase font-black px-2 py-1 rounded border-2 border-black ${isLocked ? 'bg-gray-400 text-white' : curr.status === 'Done' ? 'bg-[#ffda79] text-black' : curr.status === 'In Progress' ? 'bg-[#ff4757] text-white' : 'bg-[#22d3ee] text-black'}`}>
                       {curr.status}
                     </span>
                  </div>
                  <h3 className="font-black text-lg uppercase leading-tight mb-2 line-clamp-2">{curr.title}</h3>
                  <p className="text-xs font-bold text-black/60 line-clamp-2">{curr.desc}</p>
                </div>
                
                <div className="mt-6 flex justify-between items-end border-t-2 border-dashed border-black pt-4">
                  <div>
                    <span className="text-[10px] font-black uppercase opacity-50 block mb-1">Bounty</span>
                    <span className="bg-black text-white px-2 py-1 rounded border-2 border-black text-xs font-black">+{curr.xpReward} XP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase opacity-50 block mb-1">Materi</span>
                    <span className="font-black text-sm">{curr.totalModules} Sesi</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  // VIEW: CURRICULUM DETAIL (MODULES) LAYAOUT = KIRI VIDEO, KANAN MATERI
  const curriculum = curriculums.find(c => c.id === selectedCurriculumId);
  if (!curriculum) return null;

  const activeModule = curriculum.modules.find(m => m.id === activeModuleId) || curriculum.modules[0];

  return (
    <div className="space-y-6 pb-24 border-black">
      {/* Header Back Button & Info */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <button 
          onClick={handleBackToCurriculums}
          className="bg-white px-4 py-2 w-fit rounded-xl border-4 border-black font-black uppercase tracking-tight text-xs flex items-center gap-2 shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Kembali
        </button>
        <div className="flex gap-2">
           <span className="bg-[#ffda79] px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000]">Total: {curriculum.totalModules} Sesi</span>
           <span className="bg-black text-white px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-[2px_2px_0px_#22d3ee] focus:outline-none">+{curriculum.xpReward} XP</span>
        </div>
      </div>

      {/* Curriculum Title Card */}
      <div className={`${curriculum.coverColor === 'bg-gray-300' ? 'bg-[#ff4757]' : curriculum.coverColor} p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]`}>
        <h2 className={`font-black text-xl md:text-2xl uppercase italic mb-2 ${curriculum.status === 'Done' ? 'text-black' : curriculum.status === 'In Progress' ? 'text-white' : 'text-white'}`}>
          {curriculum.title}
        </h2>
        <p className="font-bold text-xs bg-white inline-block px-3 py-1 rounded-lg border-2 border-black text-black">
          {curriculum.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {activeModule ? (
            <>
              {/* Video Player Box */}
              <div className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000000]">
                {activeModule.videoUrl ? (
                  <div className="w-full aspect-video bg-black relative border-b-4 border-black">
                    <iframe className="w-full h-full" src={activeModule.videoUrl} title="Video Player" frameBorder="0" allowFullScreen></iframe>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-200 border-b-4 border-black flex flex-col items-center justify-center p-6 text-center">
                    <Lock size={48} className="mb-4 opacity-50" />
                    <h3 className="font-black text-xl uppercase mb-2">Video Tidak Tersedia / Terkunci</h3>
                    <p className="font-bold opacity-60">Selesaikan modul sebelumnya untuk membuka video ini.</p>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border-2 border-black ${activeModule.status === 'Locked' ? 'bg-gray-400 text-white' : activeModule.status === 'Done' ? 'bg-green-400' : 'bg-[#ffda79]'}`}>
                      {activeModule.status}
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded border-2 border-black text-[9px] font-black">
                      +{activeModule.xp} XP
                    </span>
                  </div>
                  <h3 className="font-black text-xl md:text-2xl uppercase leading-tight mb-3">{activeModule.title}</h3>
                  <p className="text-xs md:text-sm font-bold text-black/80 leading-relaxed">{activeModule.desc}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border-4 border-black p-8 rounded-2xl text-center shadow-[4px_4px_0px_#000000]">
              <Lock size={48} className="mx-auto mb-4 opacity-20" />
              <h4 className="font-black text-lg uppercase mb-2">Materi Kosong</h4>
              <p className="text-sm font-bold opacity-60">Belum ada video pada modul di kurikulum ini.</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Playlist Materi & Insight Mentor */}
        <div className="space-y-6">
          {/* Menu Playlist Materi */}
          <div className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000000]">
             <div className="bg-[#ffda79] p-4 border-b-4 border-black flex justify-between items-center">
               <h3 className="font-black text-lg uppercase italic flex items-center gap-2">
                  <FileText size={20} /> Daftar Materi
               </h3>
               <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded border-2 border-transparent">{curriculum.modules.length} Item</span>
             </div>
             <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto bg-gray-50">
                {curriculum.modules.map((mod, i) => {
                  const isActive = activeModuleId === mod.id;
                  const isLocked = mod.status === 'Locked';
                  
                  return (
                    <div 
                      key={mod.id} 
                      onClick={() => {
                        if (!isLocked) setActiveModuleId(mod.id);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        isLocked 
                          ? 'bg-gray-200 border-black/10 opacity-60 cursor-not-allowed' 
                          : isActive 
                            ? 'bg-[#22d3ee] border-black shadow-[3px_3px_0px_#000000] cursor-pointer scale-[1.02]' 
                            : 'bg-white border-black shadow-[1px_1px_0px_#000000] hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000000] cursor-pointer'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 flex items-center justify-center bg-white ${isLocked ? 'border-gray-400 text-gray-500' : 'border-black text-black'}`}>
                         {isLocked ? <Lock size={14} /> : mod.status === 'Done' ? <CheckSquare size={14} className="text-green-500" /> : <PlayCircle size={14} />}
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-[11px] font-black uppercase leading-tight line-clamp-2 mb-1">{i + 1}. {mod.title}</h4>
                        <span className="text-[9px] font-bold block opacity-70 tracking-tighter">{mod.status} • {mod.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Asset Upload & Submission Area (Dipindah ke Kanan) */}
          {activeModule && (
            <div className="bg-[#fffdf5] border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_#000000]">
              <h4 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                <Upload size={18} className="text-[#ff4757]" /> Pengumpulan Praktik
              </h4>
              
              {activeModule.status === 'Done' ? (
                <div className="bg-[#22d3ee] border-4 border-black p-4 rounded-xl text-center shadow-[4px_4px_0px_#000000]">
                  <span className="font-black text-black uppercase text-xs italic">✓ Modul Selesai!</span>
                </div>
              ) : activeModule.status === 'Locked' ? (
                 <div className="bg-gray-200 border-4 border-black p-4 rounded-xl text-center flex flex-col items-center opacity-70">
                  <Lock size={20} className="mb-2" />
                  <span className="font-black text-black uppercase text-[10px]">Upload Terkunci</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex group">
                    <span className="bg-black text-white px-3 flex items-center rounded-l-xl border-2 border-r-0 border-black font-black">
                      <LinkIcon size={16} />
                    </span>
                    <input type="url" placeholder={activeModule.submissionHint || "Paste URL tugas di sini..."} className="flex-1 w-full min-w-0 p-3 border-2 border-black rounded-r-xl bg-white font-bold text-xs focus:outline-none focus:bg-[#ffda79]/20" />
                  </div>
                  <button className="w-full bg-[#ff4757] text-white py-3 flex items-center justify-center gap-2 rounded-xl border-4 border-black font-black uppercase tracking-tight text-xs shadow-[4px_4px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <CheckSquare size={16} /> Selesai (+{activeModule.xp})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Expert Notes Box (Tidak warna hitam lagi) */}
          <div className="bg-[#22d3ee] text-black border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000000] relative overflow-hidden">
             <div className="absolute -bottom-4 -right-4 text-black/5"><Zap size={100} fill="currentColor" /></div>
             <h3 className="font-black text-sm uppercase italic flex items-center gap-2 border-b-4 border-black pb-3 mb-4 relative z-10 text-black">
                <Zap size={20} className="text-[#ffda79]" fill="currentColor" style={{ filter: 'drop-shadow(1px 1px 0px black)' }} /> Insight Terkait Sesi
             </h3>
             <div className="relative z-10">
                <p className="text-xs font-black italic leading-relaxed text-black/80">"Tonton video sampai tuntas. Perhatikan template yang dibagikan karena berguna untuk praktek submission aset di modul ini!"</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-black/20">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center text-black"><MessageSquare size={12} /></div>
                  <span className="text-[10px] font-black uppercase">Coach Ryan</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
