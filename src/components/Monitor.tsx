import { BarChart3, TrendingUp, Award, UserPlus, Zap, Activity, Target, Flame, Calendar as CalendarIcon, BookOpen, Video } from 'lucide-react';

export default function Monitor() {
  const weeklyXP = [
    { week: 'W1', xp: 450 },
    { week: 'W2', xp: 600 },
    { week: 'W3', xp: 850 },
    { week: 'W4', xp: 1200 },
    { week: 'W5', xp: 350 }, // current week
  ];
  const maxWeeklyXP = 1500;

  // Generate some fake consistency data (35 days)
  const consistencyData = Array.from({ length: 35 }, (_, i) => {
    // mostly active, some inactive
    return Math.random() > 0.3;
  });

  const skills = [
    { name: 'Copywriting', value: 85, color: 'bg-[#22d3ee]' },
    { name: 'Video Editing', value: 70, color: 'bg-[#ffda79]' },
    { name: 'Strategy & Pillar', value: 90, color: 'bg-[#ff4757]' },
    { name: 'Data Analytics', value: 65, color: 'bg-[#1e293b]' },
  ];

  const milestones = [
    { title: 'Level 5: Content Creator', date: '12 Mar 2026', icon: Award, color: 'bg-[#ffda79]' },
    { title: 'Menyelesaikan M1: Fundamental', date: '08 Mar 2026', icon: Target, color: 'bg-[#22d3ee]' },
    { title: 'Mendaftar Bootcamp Batch 1', date: '01 Mar 2026', icon: CalendarIcon, color: 'bg-white' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#fffdf5] p-6 md:p-8 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-black text-2xl md:text-3xl  italic flex items-center gap-3 mb-2 text-[#1e293b]">
            <BarChart3 size={32} className="text-[#ff4757] fill-[#ff4757]" style={{ filter: 'drop-shadow(2px 2px 0px black)' }} /> 
            Analisis Belajar
          </h2>
          <p className="font-bold text-sm md:text-base text-[#1e293b]/70">Pantau progres XP, laporan pengerjaan modul, dan perkembangan skill Social Media Specialist.</p>
        </div>
        <div className="bg-[#ffda79] text-[#1e293b] px-4 py-2 rounded-xl border-4 border-[#1e293b] font-black  shadow-[4px_4px_0px_#1e293b] flex items-center gap-2">
          <Award size={20} /> Siswa Aktif
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Main Analytics (Bar Chart, Heatmap, Stats) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#ffda79] p-6 rounded-2xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4 border-b-4 border-[#1e293b] pb-2">
                <h3 className="font-black text-lg  flex items-center gap-2"><Zap fill="currentColor" /> XP Pelajar</h3>
                <Award size={24} className="text-[#1e293b]" />
              </div>
              <div className="text-5xl font-black italic mb-2 tracking-tighter">3,450 <span className="text-xl tracking-normal">XP</span></div>
              <div className="w-full h-4 bg-white border-2 border-[#1e293b] rounded-full overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
                 <div className="h-full bg-[#ff4757] border-r-2 border-[#1e293b]" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] sm:text-xs font-black  mt-2 opacity-60 flex justify-between">
                <span>Lv.5 (Creator)</span>
                <span>550 XP Ke Lv.6</span>
              </p>
            </div>

            <div className="bg-[#22d3ee] p-6 rounded-2xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4 border-b-4 border-[#1e293b] pb-2">
                <h3 className="font-black text-lg  flex items-center gap-2"><BookOpen fill="currentColor" /> Modul Sesi Selesai</h3>
                <Video size={24} className="text-[#1e293b]" />
              </div>
              <div className="text-5xl font-black italic mb-2 tracking-tighter">12 <span className="text-xl text-[#1e293b]/50 tracking-normal">/ 45 <span className="text-xs ">Sesi</span></span></div>
              <div className="flex gap-1 mt-4">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className={`flex-1 h-3 rounded-sm border-2 border-[#1e293b] ${i < 4 ? 'bg-[#ff4757]' : 'bg-white'}`}></div>
                ))}
              </div>
              <p className="text-[10px] sm:text-xs font-black  mt-2 opacity-60">Kurikulum 2 Sedang Dikerjakan</p>
            </div>
          </div>

          {/* Bar Chart: Weekly XP */}
          <div className="bg-white p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b]">
            <h3 className="font-black text-lg  flex items-center gap-2 mb-6 border-b-4 border-[#1e293b] pb-3">
              <TrendingUp size={24} className="text-[#ff4757]" strokeWidth={3} /> XP Mingguan
            </h3>
            
            <div className="h-48 flex items-end justify-between gap-2 md:gap-4 mt-8 px-2 md:px-6 relative">
              
              {/* Grid Lines */}
              <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t-2 border-dashed border-[#1e293b] w-full"></div>
                <div className="border-t-2 border-dashed border-[#1e293b] w-full"></div>
                <div className="border-t-2 border-dashed border-[#1e293b] w-full"></div>
                <div className="border-t-2 border-[#1e293b] w-full"></div>
              </div>

              {weeklyXP.map((data, index) => {
                const heightPercent = (data.xp / maxWeeklyXP) * 100;
                const colors = ['bg-[#ffda79]', 'bg-[#22d3ee]', 'bg-[#ff4757]', 'bg-gray-300', 'bg-white'];
                const bgColor = index === weeklyXP.length - 1 ? 'bg-[#ffda79]' : colors[index % colors.length];

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group z-10">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#1e293b] text-[10px] font-black px-2 py-1 rounded mb-2 absolute -translate-y-8 border-2 border-[#1e293b] whitespace-nowrap shadow-[2px_2px_0px_#1e293b]">
                      {data.xp} XP
                    </div>
                    <div className="w-full relative flex items-end justify-center h-full">
                       <div 
                         className={`w-full max-w-[40px] md:max-w-[60px] rounded-t-xl border-4 border-b-0 border-[#1e293b] transition-all duration-500 hover:brightness-110 cursor-pointer ${bgColor} relative`}
                         style={{ height: `${heightPercent}%` }}
                       >
                         {index === weeklyXP.length - 1 && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff4757] border-2 border-[#1e293b] rounded-full shadow-[1px_1px_0px_#1e293b] animate-bounce"></div>
                         )}
                       </div>
                    </div>
                    <span className={`font-black text-xs  tracking-tight px-2 py-1 border-2 border-[#1e293b] rounded-lg ${index === weeklyXP.length - 1 ? 'bg-[#1e293b] text-white' : 'bg-white text-[#1e293b]'}`}>{data.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consistency Heatmap */}
          <div className="bg-[#fffdf5] p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b]">
            <div className="flex justify-between items-center mb-6 border-b-4 border-[#1e293b] pb-3">
              <h3 className="font-black text-lg  flex items-center gap-2">
                <Flame size={24} className="text-[#ff4757] fill-[#ff4757]" /> Konsistensi & Streak
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black  text-[#1e293b]/40 hidden md:block">Kurang</span>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white border-2 border-[#1e293b]/20 rounded-sm"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#22d3ee]/50 border-2 border-[#1e293b] rounded-sm"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#22d3ee] border-2 border-[#1e293b] rounded-sm shadow-[1px_1px_0px_#1e293b]"></div>
                <span className="text-[10px] font-black  text-[#1e293b]/40 hidden md:block">Aktif</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black  text-[#1e293b]/40 mb-2">{day}</div>
              ))}
              {consistencyData.map((isActive, index) => (
                <div 
                  key={index}
                  title={`Aktif pada hari ke-${index + 1}`}
                  className={`aspect-square rounded-md border-2 transition-transform hover:scale-110 cursor-pointer ${
                    isActive 
                      ? 'bg-[#22d3ee] border-[#1e293b] shadow-[2px_2px_0px_#1e293b]' 
                      : 'bg-white border-[#1e293b]/10'
                  }`}
                ></div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-4 border-[#1e293b] flex justify-between items-center">
              <div>
                <span className="text-xs font-black  opacity-60 block">Current Streak</span>
                <span className="text-2xl font-black italic text-[#ff4757] bg-[#ffda79] px-3 py-1 rounded-xl border-2 border-[#1e293b] inline-block mt-1 shadow-[2px_2px_0px_#1e293b]">12 Hari 🔥</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black  opacity-60 block">Longest Streak</span>
                <span className="text-xl font-black italic mt-1 block">18 Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Skills, Leaderboard, Timeline) */}
        <div className="space-y-6">
          
          {/* Rival / Leaderboard Card */}
          <div className="bg-[#ff4757] text-white p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b] relative overflow-hidden group">
            <h3 className="font-black text-lg  flex items-center gap-2 mb-4 relative z-10 border-b-4 border-[#1e293b] pb-2">
              <Zap size={20} className="fill-current text-[#ffda79]" /> Papan Peringkat
            </h3>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                 <div className="text-6xl font-black italic drop-shadow-[4px_4px_0px_#1e293b]">#5</div>
                 <p className="text-[10px] font-black  bg-[#1e293b] text-[#ffda79] px-3 py-1.5 border-2 border-[#1e293b] rounded-lg shadow-[2px_2px_0px_#1e293b] tracking-widest leading-none">Global<br/>Rank</p>
              </div>
              <p className="text-[10px] font-black  bg-white text-[#1e293b] px-3 py-1.5 inline-block border-2 border-[#1e293b] rounded-lg shadow-[2px_2px_0px_#1e293b] mb-5 tracking-widest">
                 📍 Bootcamp Batch 1
              </p>
              
              <div className="bg-white text-[#1e293b] p-4 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex items-center justify-between group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform relative z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ffda79] border-2 border-[#1e293b] font-black flex items-center justify-center rounded-xl shadow-[2px_2px_0px_#1e293b]">#4</div>
                  <div>
                    <h5 className="font-black text-sm  leading-tight">Doni K.</h5>
                    <span className="text-[10px] font-black text-[#1e293b]/50">3,570 XP</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black  text-[#ff4757] block">Selisih</span>
                  <span className="font-black text-sm border-b-2 border-[#ff4757]">-120 XP</span>
                </div>
              </div>
              
              <p className="text-[10px] font-black mt-4 italic opacity-100 leading-tight bg-[#1e293b]/30 p-3 rounded-xl border-2 border-[#1e293b]/40 shadow-inner relative z-20">"Selesaikan 1 modul praktik lagi hari ini untuk merebut tahta peringkat 4!"</p>
            </div>
            
            {/* Background pattern */}
            <div className="absolute right-[-20%] top-[-10%] opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500 z-0">
               <Award size={200} />
            </div>
          </div>

          {/* Skill Radar / Grid */}
          <div className="bg-white text-[#1e293b] p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#22d3ee]">
             <h3 className="font-black text-lg  border-b-4 border-[#1e293b] pb-2 mb-5">Penguasaan Skill</h3>
             <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-3 bg-[#fffdf5] rounded-xl border-4 border-[#1e293b] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1e293b] transition-all cursor-crosshair group relative overflow-hidden">
                    <div className="relative w-16 h-16 flex items-center justify-center z-10">
                      <svg className="w-full h-full transform -rotate-90 group-hover:scale-110 transition-transform" viewBox="0 0 36 36">
                         <path
                           className="text-[#1e293b]/10"
                           strokeWidth="4"
                           stroke="currentColor"
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                         <path
                           strokeLinecap="square"
                           strokeWidth="5"
                           stroke={skill.color === 'bg-[#22d3ee]' ? '#22d3ee' : skill.color === 'bg-[#ffda79]' ? '#ffda79' : skill.color === 'bg-[#ff4757]' ? '#ff4757' : '#1e293b'}
                           strokeDasharray={`${skill.value}, 100`}
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="font-black text-[11px] text-[#1e293b] bg-white border-2 border-[#1e293b] rounded shadow-[2px_2px_0px_#1e293b] px-1 py-0.5 z-20">{skill.value}%</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black  text-center leading-tight tracking-tighter text-[#1e293b] z-10 mt-1">{skill.name}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Milestones / Timeline */}
          <div className="bg-white border-4 border-[#1e293b] p-6 rounded-2xl shadow-[6px_6px_0px_#1e293b]">
            <h3 className="font-black text-lg  flex items-center gap-2 mb-6 border-b-4 border-[#1e293b] pb-2">
              <Activity size={24} className="text-[#22d3ee] fill-[#22d3ee]" /> Riwayat Pencapaian
            </h3>
            <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-5 before:w-1 before:bg-[#1e293b]/20">
              {milestones.map((ms, index) => (
                <div key={index} className="flex items-start gap-4 relative group cursor-pointer hover:-translate-y-0.5 transition-transform">
                   <div className={`w-10 h-10 rounded-xl border-2 border-[#1e293b] flex items-center justify-center shrink-0 z-10 shadow-[2px_2px_0px_#1e293b] group-hover:shadow-[4px_4px_0px_#1e293b] ${ms.color}`}>
                      <ms.icon size={18} strokeWidth={3} className="text-[#1e293b]" />
                   </div>
                   <div className="pt-1 w-full border-b-2 border-[#1e293b]/5 pb-2">
                     <h5 className="font-black text-xs  leading-tight bg-white pl-2">{ms.title}</h5>
                     <span className="text-[10px] font-black  text-[#1e293b]/50 block mt-1 pl-2">{ms.date}</span>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-[#ffda79] border-4 border-[#1e293b] rounded-xl py-3 font-black text-[10px]  hover:bg-[#1e293b] hover:text-white hover:border-[#1e293b] transition-colors shadow-[4px_4px_0px_#1e293b] hover:shadow-none hover:translate-x-1 hover:translate-y-1">Lihat Seluruh Riwayat</button>
          </div>

        </div>
      </div>
    </div>
  );
}
