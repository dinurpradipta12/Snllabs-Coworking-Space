import { useState, useEffect } from 'react';
import { ChevronDown, CloudSun, CloudOff, WifiOff, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function TopNav({ user, isAdmin = false }) {
  const { dashboardData, isOffline } = useData();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Level & XP Logic from Context
  const userLevel = dashboardData?.level || 1;
  const currentXP = dashboardData?.currentXP || 0;
  const nextLevelXP = 2000; // Formula could be dynamic, for now static target per level
  const xpProgress = Math.min((currentXP / nextLevelXP) * 100, 100);

  // Mentoring Days Logic from Context
  const totalMentoringDays = 30; 
  const mentoringDaysLeft = dashboardData?.mentoringDays || 0;
  const daysElapsed = Math.max(0, totalMentoringDays - mentoringDaysLeft);
  const mentoringProgress = (daysElapsed / totalMentoringDays) * 100;

  // Tier Logic Helper
  const getTier = (level: number) => {
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
    <div className="bg-[#22d3ee] p-4 rounded-2xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
      {/* User Info */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="shrink-0 w-12 h-12 bg-white rounded-xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] overflow-hidden relative">
          <img 
            src={user?.photoURL || 'https://picsum.photos/seed/avatar/100/100'} 
            alt="Avatar" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {isAdmin && (
            <div className="absolute top-0 right-0 bg-yellow-400 p-0.5 border-b-2 border-l-2 border-[#1e293b] rounded-bl-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-black text-lg truncate max-w-[150px] md:max-w-none text-[#1e293b]">{user?.displayName || 'KREATOR'}</h2>
            <div className="flex gap-1">
              <span className="bg-[#1e293b] text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-[#1e293b] shadow-[1px_1px_0px_#1e293b]  tracking-tighter">LVL {userLevel}</span>
              <span className="bg-[#ffda79] text-[#1e293b] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#1e293b] shadow-[1px_1px_0px_#1e293b]  tracking-tighter">{tierLabel}</span>
            </div>
          </div>
          
          <p className="text-[10px] md:text-xs font-bold mt-1 text-[#1e293b]/80">Mentoring Tersisa <span className="text-[#1e293b] bg-[#ffda79] px-1 rounded"> {mentoringDaysLeft} hari</span></p>

          <div className="mt-2 text-left">
            <div className="w-full max-w-[200px] h-2.5 bg-white rounded-full border-2 border-[#1e293b] overflow-hidden shadow-[1px_1px_0px_#1e293b]">
              <div 
                className="h-full bg-gradient-to-r from-[#22d3ee] to-[#ffda79]" 
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Project Selector */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto justify-start lg:justify-end text-[#1e293b]">
        <div className="bg-[#fffdf5] px-3 md:px-4 py-2 rounded-xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] flex items-center gap-3 relative">
          {isOffline && (
            <div className="absolute -top-3 -left-3 bg-[#ff4757] text-white px-2 py-0.5 rounded-lg border-2 border-[#1e293b] font-black text-[9px] flex items-center gap-1 animate-bounce shadow-[2px_2px_0px_#1e293b]">
               <CloudOff size={10} /> OFFLINE MODE (CACHE)
            </div>
          )}
          <div className="text-right">
            <div className="font-mono font-black text-xs md:text-sm leading-none">
              {time.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <div className="text-[8px] md:text-[10px] font-black  opacity-60">
              {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="border-l-2 border-[#1e293b] h-6"></div>
          <div className="flex items-center gap-1">
            <CloudSun size={18} className="text-[#ffda79]" strokeWidth={2.5} />
            <span className="font-black text-xs md:text-sm">31°C</span>
          </div>
        </div>

        <button className="bg-[#fffdf5] px-3 md:px-4 py-2 rounded-xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] flex items-center gap-2 font-black text-xs md:text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          STATUS SUBSCRIPTION
          <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
