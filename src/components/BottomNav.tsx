import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, BookOpen, BarChart3, User, Settings, Plus, Zap, Users, Menu } from 'lucide-react';

export default function BottomNav({ activePage, setActivePage, isAdmin = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 20000); // 20 seconds
    };

    const handleActivity = () => {
      startTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    startTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isCollapsed]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Meeting', icon: Calendar },
    { id: 'tasks', label: 'Learning Page', icon: BookOpen },
    { id: 'field_area', label: 'Field Area', icon: Zap, devOnly: true },
    { id: 'monitor', label: 'Analytic', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'user_stats', label: 'User Stat', icon: Users, devOnly: true },
  ];

  const visibleItems = menuItems.filter(item => !item.devOnly || isAdmin);
  const middleIndex = Math.ceil(visibleItems.length / 2);
  const leftItems = visibleItems.slice(0, middleIndex);
  const rightItems = visibleItems.slice(middleIndex);

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <div 
        onMouseEnter={() => setIsCollapsed(false)}
        className={`pointer-events-auto flex items-center bg-[#fffdf5] rounded-3xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${
          isCollapsed 
            ? 'w-16 h-16 px-0 justify-center' 
            : `w-full ${isAdmin ? 'max-w-4xl' : 'max-w-2xl'} px-3 md:px-6 py-2`
        }`}
      >
        <div className={`flex items-center justify-between w-full transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 w-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 md:px-3 rounded-xl transition-all ${
                activePage === item.id 
                  ? 'bg-[#22d3ee] border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] text-[#1e293b] scale-105' 
                  : 'text-[#1e293b]/60 hover:text-[#1e293b] hover:bg-[#1e293b]/5'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} className={item.devOnly ? 'text-[#ff4757]' : ''} />
              <span className="text-[7px] md:text-[9px] font-black tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* Central Plus/Menu Button */}
        <div className={`px-2 shrink-0 transition-all duration-700 ${isCollapsed ? 'scale-110' : ''}`}>
          <button 
            onClick={() => isCollapsed && setIsCollapsed(false)}
            title={isCollapsed ? "Buka Menu" : "Gunakan untuk Meet Request ke mentor"}
            className={`rounded-2xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] flex items-center justify-center transition-all duration-500 ${
              isCollapsed 
                ? 'w-12 h-12 bg-[#ffda79] text-[#1e293b]' 
                : 'w-10 h-10 md:w-12 md:h-12 bg-[#ff4757] text-white hover:scale-110 active:scale-95'
            }`}
          >
            {isCollapsed ? (
              <Menu size={20} strokeWidth={3} className="animate-in fade-in zoom-in" />
            ) : (
              <Plus size={24} strokeWidth={4} />
            )}
          </button>
        </div>

        <div className={`flex items-center justify-between w-full transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 w-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 md:px-3 rounded-xl transition-all ${
                activePage === item.id 
                  ? 'bg-[#22d3ee] border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] text-[#1e293b] scale-105' 
                  : 'text-[#1e293b]/60 hover:text-[#1e293b] hover:bg-[#1e293b]/5'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} className={item.devOnly ? 'text-[#ff4757]' : ''} />
              <span className="text-[7px] md:text-[9px] font-black tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
