import { useState, useEffect } from 'react';
import { ChevronDown, CloudSun } from 'lucide-react';

export default function TopNav({ user }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Level & XP Logic
  const userLevel = 1;
  const nextLevelXP = 500;
  const currentXP = 320;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  // Mentoring Days Logic
  const totalMentoringDays = 30; // Total program duration
  const mentoringDaysLeft = 14;
  const daysElapsed = totalMentoringDays - mentoringDaysLeft;
  const mentoringProgress = (daysElapsed / totalMentoringDays) * 100;

  // Tier Logic Helper
  const getTier = (level) => {
    if (level >= 1 && level <= 3) return 'PEMULA';
    if (level >= 4 && level <= 6) return 'INTERMEDIATE';
    if (level >= 7 && level <= 10) return 'MEMAHAMI';
    if (level >= 11 && level <= 13) return 'MENGERTI';
    if (level >= 14 && level <= 16) return 'MENGUASAI';
    if (level >= 17 && level <= 20) return 'EXPERTISE';
    return 'CREATOR';
  };

  const tierLabel = getTier(userLevel);

  return (
    <div className="bg-[#22d3ee] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
      {/* User Info */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="shrink-0 w-12 h-12 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] overflow-hidden">
          <img 
            src={user?.photoURL || 'https://picsum.photos/seed/avatar/100/100'} 
            alt="Avatar" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-black text-lg truncate max-w-[150px] md:max-w-none">{user?.displayName || 'KREATOR'}</h2>
            <div className="flex gap-1">
              <span className="bg-[#ff4757] text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000] uppercase tracking-tighter">LVL {userLevel}</span>
              <span className="bg-[#ffda79] text-black text-[9px] font-black px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000] uppercase tracking-tighter">{tierLabel}</span>
            </div>
          </div>
          
          <p className="text-[10px] md:text-xs font-bold mt-1 text-black/80">Mentoring Tersisa <span className="text-[#ff4757]">{mentoringDaysLeft} hari</span></p>

          <div className="mt-2 text-left">
            <div className="w-full max-w-[200px] h-2.5 bg-white rounded-full border-2 border-black overflow-hidden shadow-[1px_1px_0px_#000000]">
              <div 
                className="h-full bg-gradient-to-r from-[#ff4757] to-[#ffda79]" 
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Project Selector */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto justify-start lg:justify-end">
        <div className="bg-[#fffdf5] px-3 md:px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono font-black text-xs md:text-sm leading-none">
              {time.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <div className="text-[8px] md:text-[10px] font-black uppercase opacity-60">
              {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="border-l-2 border-black h-6"></div>
          <div className="flex items-center gap-1">
            <CloudSun size={18} className="text-[#ffda79]" strokeWidth={2.5} />
            <span className="font-black text-xs md:text-sm">31°C</span>
          </div>
        </div>

        <button className="bg-[#fffdf5] px-3 md:px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-2 font-black text-xs md:text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          STATUS SUBSCRIPTION
          <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
