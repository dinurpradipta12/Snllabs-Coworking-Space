import { BarChart3, TrendingUp, Award, UserPlus, Zap, Activity, Target, Flame, Calendar as CalendarIcon } from 'lucide-react';

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
    { name: 'Problem Solving', value: 85, color: 'bg-[#22d3ee]' },
    { name: 'Coding Standard', value: 70, color: 'bg-[#ffda79]' },
    { name: 'Komunikasi', value: 90, color: 'bg-[#ff4757]' },
    { name: 'Pemahaman Teknis', value: 65, color: 'bg-white' },
  ];

  const milestones = [
    { title: 'Level 5 Tercapai!', date: '12 Mar 2026', icon: Award, color: 'bg-[#ffda79]' },
    { title: 'Menyelesaikan Modul React', date: '08 Mar 2026', icon: Target, color: 'bg-[#22d3ee]' },
    { title: 'Sesi Mentoring Pertama', date: '01 Mar 2026', icon: CalendarIcon, color: 'bg-white' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#fffdf5] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]">
        <h2 className="font-black text-2xl uppercase italic flex items-center gap-2 mb-2">
          <BarChart3 size={28} className="text-[#ff4757]" /> Performance Analytics
        </h2>
        <p className="font-bold text-sm text-black/60">Pantau performa, konsistensi, dan pertumbuhan skill selama sesi mentoring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Main Analytics (Bar Chart, Heatmap, Stats) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#ffda79] p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg uppercase">XP Terkumpul</h3>
                <Award size={24} />
              </div>
              <div className="text-4xl md:text-5xl font-black italic mb-2">3,450 <span className="text-xl">XP</span></div>
              <div className="w-full h-3 bg-white border-2 border-black rounded-full overflow-hidden">
                 <div className="h-full bg-[#ff4757]" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] font-black uppercase mt-2 opacity-60">Level 5 (Memahami) - 550 XP menuju Level 6</p>
            </div>

            <div className="bg-[#22d3ee] p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg uppercase">Total Kehadiran</h3>
                <UserPlus size={24} />
              </div>
              <div className="text-4xl md:text-5xl font-black italic mb-2">12 <span className="text-xl text-black/50">/ 16 <span className="text-xs uppercase">Sesi</span></span></div>
              <div className="flex gap-1.5 mt-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`flex-1 h-3 rounded-sm border border-black ${i < 12 ? 'bg-black' : 'bg-white'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart: Weekly XP */}
          <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]">
            <h3 className="font-black text-lg uppercase flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-[#ff4757]" strokeWidth={3} /> XP Mingguan
            </h3>
            
            <div className="h-48 flex items-end justify-between gap-2 md:gap-4 mt-8 px-2 md:px-6">
              {weeklyXP.map((data, index) => {
                const heightPercent = (data.xp / maxWeeklyXP) * 100;
                const colors = ['bg-[#ffda79]', 'bg-[#22d3ee]', 'bg-[#ff4757]', 'bg-white', 'bg-black'];
                const bgColor = index === weeklyXP.length - 1 ? 'bg-black' : colors[index % colors.length];

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-black px-2 py-1 rounded mb-2 absolute -translate-y-8 border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_#22d3ee]">
                      {data.xp} XP
                    </div>
                    <div className="w-full relative flex items-end justify-center h-full">
                       <div 
                         className={`w-full max-w-[40px] md:max-w-[60px] rounded-t-lg border-4 border-b-0 border-black transition-all duration-500 hover:brightness-110 ${bgColor} relative`}
                         style={{ height: `${heightPercent}%` }}
                       >
                       </div>
                    </div>
                    <span className="font-black text-xs uppercase tracking-tight">{data.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consistency Heatmap */}
          <div className="bg-[#fffdf5] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg uppercase flex items-center gap-2">
                <Flame size={20} className="text-[#ff4757] fill-[#ff4757]" /> Konsistensi Aktivitas
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-black/40 hidden md:block">Kurang</span>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white border-2 border-black/20 rounded-sm"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#22d3ee]/50 border-2 border-black rounded-sm"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#22d3ee] border-2 border-black rounded-sm shadow-[1px_1px_0px_#000000]"></div>
                <span className="text-[10px] font-black uppercase text-black/40 hidden md:block">Aktif</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black uppercase text-black/40 mb-2">{day}</div>
              ))}
              {consistencyData.map((isActive, index) => (
                <div 
                  key={index}
                  title={`Aktif pada hari ke-${index + 1}`}
                  className={`aspect-square rounded-md border-2 transition-transform hover:scale-110 cursor-pointer ${
                    isActive 
                      ? 'bg-[#22d3ee] border-black shadow-[2px_2px_0px_#000000]' 
                      : 'bg-white border-black/10'
                  }`}
                ></div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-black/20 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase opacity-60 block">Current Streak</span>
                <span className="text-lg font-black italic text-[#ff4757]">12 Hari 🔥</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase opacity-60 block">Longest Streak</span>
                <span className="text-lg font-black italic">18 Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Skills, Leaderboard, Timeline) */}
        <div className="space-y-6">
          
          {/* Rival / Leaderboard Card */}
          <div className="bg-[#ff4757] text-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] relative overflow-hidden">
            <h3 className="font-black text-lg uppercase flex items-center gap-2 mb-4 relative z-10 border-b-4 border-black pb-2">
              <Zap size={20} className="fill-current" /> Peringkat Saat Ini
            </h3>
            
            <div className="relative z-10">
              <div className="text-5xl font-black italic mb-1 drop-shadow-[2px_2px_0px_#000000]">#5</div>
              <p className="text-xs font-bold font-sans uppercase bg-black px-2 py-1 inline-block border-2 border-white rounded shadow-[2px_2px_0px_#000000] mb-4">Mentor Group A</p>
              
              <div className="bg-white text-black p-3 rounded-xl border-2 border-black flex items-center justify-between hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black text-[10px]">#4</div>
                  <div>
                    <h5 className="font-black text-xs uppercase leading-tight">Doni K.</h5>
                    <span className="text-[9px] font-black text-black/50">3,570 XP</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-[#ff4757] block">Selisih</span>
                  <span className="font-black text-sm">-120 XP</span>
                </div>
              </div>
              
              <p className="text-[10px] font-bold mt-4 italic opacity-90 leading-tight">"Selesaikan 1 tugas lagi hari ini untuk mengalahkan Doni!"</p>
            </div>
            
            {/* Background pattern */}
            <div className="absolute right-0 top-0 opacity-10">
               <Award size={150} />
            </div>
          </div>

          {/* Skill Radar / Grid */}
          <div className="bg-black text-white p-6 rounded-2xl border-4 border-[#22d3ee] shadow-[6px_6px_0px_#22d3ee]">
             <h3 className="font-black text-lg uppercase border-b-2 border-[#22d3ee] pb-2 mb-4 text-[#22d3ee]">Penguasaan Skill</h3>
             <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-xl border-2 border-white/20 hover:bg-white/20 transition-colors">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                         <path
                           className="text-white/20"
                           strokeWidth="4"
                           stroke="currentColor"
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                         <path
                           className={`drop-shadow-[1px_1px_0px_#000]`}
                           strokeLinecap="round"
                           strokeWidth="4"
                           stroke={skill.color === 'bg-[#22d3ee]' ? '#22d3ee' : skill.color === 'bg-[#ffda79]' ? '#ffda79' : skill.color === 'bg-[#ff4757]' ? '#ff4757' : '#ffffff'}
                           strokeDasharray={`${skill.value}, 100`}
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="font-black text-[10px]">{skill.value}%</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase text-center leading-tight">{skill.name}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Milestones / Timeline */}
          <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000000]">
            <h3 className="font-black text-lg uppercase flex items-center gap-2 mb-6">
              <Activity size={20} className="text-[#22d3ee]" /> Milestones
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-5 before:w-1 before:bg-black/10">
              {milestones.map((ms, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                   <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0 z-10 shadow-[2px_2px_0px_#000000] ${ms.color}`}>
                      <ms.icon size={16} strokeWidth={3} className="text-black" />
                   </div>
                   <div className="pt-2">
                     <h5 className="font-black text-xs uppercase leading-tight">{ms.title}</h5>
                     <span className="text-[9px] font-bold text-black/50 block mt-1">{ms.date}</span>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-[#fffdf5] border-2 border-black border-dashed rounded-xl py-2 font-black text-[10px] uppercase hover:bg-black hover:text-white transition-colors">Lihat Semua Riwayat</button>
          </div>

        </div>
      </div>
    </div>
  );
}
