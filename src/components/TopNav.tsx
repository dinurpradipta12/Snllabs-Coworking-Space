import { useState, useEffect } from 'react';
import { ChevronDown, CloudSun } from 'lucide-react';

export default function TopNav({ user }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mentoringDaysLeft = 14; // Example value
  const progress = 65; // Example percentage

  return (
    <div className="bg-[#22d3ee] p-4 rounded-2xl shadow-[4px_4px_0px_#000000] flex items-center justify-between gap-4 mb-6">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] overflow-hidden">
          <img src={user?.photoURL || 'https://picsum.photos/seed/avatar/100/100'} alt="Avatar" referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">{user?.displayName || 'KREATOR'}</h2>
            <span className="bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">LVL 1</span>
            <span className="bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">PEMULA</span>
          </div>
          <p className="text-xs font-bold">Periode mentoring tersisa {mentoringDaysLeft} hari lagi</p>
          <div className="w-48 h-3 bg-white rounded-full border border-black mt-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff4757] to-[#ffda79]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stats & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="bg-[#fffdf5] px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono font-bold text-sm">
              {time.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <div className="text-[10px] font-bold uppercase">
              {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="border-l border-black h-8"></div>
          <div className="flex items-center gap-1">
            <CloudSun size={20} />
            <span className="font-bold text-sm">31°C</span>
          </div>
        </div>

        <button className="bg-[#fffdf5] px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-2 font-bold text-sm">
          STATUS MENTOR
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
