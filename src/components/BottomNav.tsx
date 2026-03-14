import { LayoutDashboard, Calendar, BookOpen, BarChart3, User, Settings, Plus } from 'lucide-react';

export default function BottomNav({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Meeting', icon: Calendar },
    { id: 'tasks', label: 'Learning Page', icon: BookOpen },
    { id: 'monitor', label: 'Analytic', icon: BarChart3 }, // Label shortened for layout, full: Personal Performance Analytic
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const leftItems = menuItems.slice(0, 3);
  const rightItems = menuItems.slice(3);

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center">
      <div className="w-full max-w-2xl flex items-center justify-between bg-[#fffdf5] px-3 md:px-6 py-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000]">
        {leftItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 p-1.5 md:px-3 rounded-xl transition-all ${
              activePage === item.id 
                ? 'bg-[#22d3ee] border-2 border-black shadow-[2px_2px_0px_#000000] text-black scale-105' 
                : 'text-black/60 hover:text-black hover:bg-black/5'
            }`}
          >
            <item.icon size={18} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
        
        {/* Central Plus Button */}
        <div className="px-2">
          <button 
            title="Gunakan untuk Meet Request ke mentor"
            className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#ff4757] text-white border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Plus size={24} strokeWidth={4} />
          </button>
        </div>

        {rightItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 p-1.5 md:px-3 rounded-xl transition-all ${
              activePage === item.id 
                ? 'bg-[#22d3ee] border-2 border-black shadow-[2px_2px_0px_#000000] text-black scale-105' 
                : 'text-black/60 hover:text-black hover:bg-black/5'
            }`}
          >
            <item.icon size={18} strokeWidth={2.5} />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
